import { OffsetListDto } from '@/common/dto/offset-pagination/offset-list.dto';
import { OffsetPaginatedListDto } from '@/common/dto/offset-pagination/paginatedList.dto';
import { Uuid } from '@/common/types/common.type';
import { ErrorCode } from '@/constants/error-code.constant';
import { ValidationException } from '@/exceptions/validation.exception';
import { paginateList } from '@/utils/offset-list';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import assert from 'assert';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { RoleEntity } from '../role/entities/role.entity';
import { CreateUserReqDto } from './dto/create-user.req.dto';
import { ListUserReqDto } from './dto/list-user.req.dto';
import { UpdateUserReqDto } from './dto/update-user.req.dto';
import { UserResDto } from './dto/user.res.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    @InjectRepository(RoleEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(dto: CreateUserReqDto): Promise<UserResDto> {
    const { username, email, password, bio, avatar, phone, roleId } = dto;

    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      throw new ValidationException(ErrorCode.E001);
    }

    const role = await RoleEntity.findOneByOrFail({ id: roleId });

    const newUser = this.userRepository.create({
      username,
      email,
      password,
      bio,
      avatar,
      phone,
      roleId: role.id,
    });

    const savedUser = await this.userRepository.save(newUser);

    return plainToInstance(UserResDto, savedUser);
  }

  async findAll(
    reqDto: ListUserReqDto,
  ): Promise<OffsetPaginatedListDto<UserResDto>> {
    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .orderBy('user.createdAt', 'DESC');
    const [users, count] = await paginateList<UserEntity>(query, reqDto, {
      skipCount: false,
      takeAll: false,
    });

    const result = new OffsetListDto(
      plainToInstance(UserResDto, users),
      count,
      reqDto,
    );

    return new OffsetPaginatedListDto(result);
  }

  async findOne(id: Uuid): Promise<UserResDto> {
    assert(id, 'id is required');
    const user = await this.userRepository.findOneByOrFail({
      id,
    });

    return user.toDto(UserResDto);
  }

  async update(id: Uuid, updateUserDto: UpdateUserReqDto): Promise<UserResDto> {
    await UserEntity.findOneByOrFail({ id });

    const { email, username, bio, avatar, phone, roleId } = updateUserDto;
    const updateData: Partial<UserEntity> = {
      email,
      username,
      bio,
      avatar,
      phone,
    };

    // Remove undefined properties to avoid overwriting with undefined
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key],
    );

    if (roleId) {
      const role = await RoleEntity.findOneByOrFail({ id: roleId });
      updateData.roleId = roleId;
      updateData.role = role;
    }

    await UserEntity.update(id, updateData);
    const updatedUser = await UserEntity.findOneBy({ id });

    return updatedUser.toDto(UserResDto);
  }

  async remove(id: Uuid): Promise<string> {
    const user = await this.userRepository.findOneByOrFail({ id });
    await this.userRepository.softDelete(id);
    return user.username;
  }
}
