import { OffsetListDto } from '@/common/dto/offset-pagination/offset-list.dto';
import { OffsetPaginatedListDto } from '@/common/dto/offset-pagination/paginatedList.dto';
import { SuccessDto } from '@/common/dto/sucess.dto';
import { Uuid } from '@/common/types/common.type';
import { ErrorCode } from '@/constants/error-code.constant';
import { ValidationException } from '@/exceptions/validation.exception';
import { paginateList } from '@/utils/offset-list';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    @InjectRepository(RoleEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(dto: CreateUserReqDto): Promise<SuccessDto<UserResDto>> {
    const { username, email, password, bio, avatar, roleId } = dto;

    // 1. Check uniqueness of username/email
    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      throw new ValidationException(ErrorCode.E001);
    }

    const role = await RoleEntity.findOneByOrFail({ id: roleId });

    // 3. Create and save user
    const newUser = this.userRepository.create({
      username,
      email,
      password,
      bio,
      avatar,
      roleId: role.id,
    });

    const savedUser = await this.userRepository.save(newUser);

    // 4. Return response (excluding sensitive data)
    return new SuccessDto(plainToInstance(UserResDto, savedUser));
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

  async findOne(id: Uuid): Promise<SuccessDto<UserResDto>> {
    assert(id, 'id is required');
    const user = await this.userRepository.findOneByOrFail({
      id,
      // relations: ['chapters', 'author'],
    });

    return new SuccessDto(user.toDto(UserResDto));
  }

  async update(
    id: Uuid,
    updateUserDto: UpdateUserReqDto,
  ): Promise<SuccessDto<UserResDto>> {
    const user = await this.userRepository.findOneByOrFail({ id });
    const { bio, avatar, roleId } = updateUserDto;

    let role: RoleEntity;

    if (roleId) {
      role = await RoleEntity.findOneBy({ id: roleId });
      if (!role) {
        throw new NotFoundException('Specified role not found');
      }
    }

    user.bio = bio;
    user.avatar = avatar;
    user.roleId = roleId;

    const updatedUser = await UserEntity.save(user);

    return new SuccessDto(updatedUser.toDto(UserResDto));
  }

  async remove(id: Uuid): Promise<SuccessDto<string>> {
    const user = await this.userRepository.findOneByOrFail({ id });
    await this.userRepository.softDelete(id);
    return new SuccessDto(user.username);
  }
}
