import { CursorPaginationDto } from '@/common/dto/cursor-pagination/cursor-pagination.dto';
import { CursorPaginatedDto } from '@/common/dto/cursor-pagination/paginated.dto';
import { OffsetListDto } from '@/common/dto/offset-pagination/offset-list.dto';
import { OffsetPaginatedListDto } from '@/common/dto/offset-pagination/paginatedList.dto';
import { SuccessDto } from '@/common/dto/sucess.dto';
import { Uuid } from '@/common/types/common.type';
import { ErrorCode } from '@/constants/error-code.constant';
import { ValidationException } from '@/exceptions/validation.exception';
import { buildPaginator } from '@/utils/cursor-pagination';
import { paginateList } from '@/utils/offset-list';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import assert from 'assert';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { RoleEntity } from '../role/entities/role.entity';
import { CreateUserReqDto } from './dto/create-user.req.dto';
import { ListUserReqDto } from './dto/list-user.req.dto';
import { LoadMoreUsersReqDto } from './dto/load-more-users.req.dto';
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

    let role: RoleEntity;

    if (roleId) {
      role = await RoleEntity.findOneBy({ id: roleId });
      if (!role) {
        throw new NotFoundException('Specified role not found');
      }
    } else {
      role = await RoleEntity.findOneBy({ name: 'USER' });
      if (!role) {
        throw new Error('Default USER role not configured');
      }
    }

    // 3. Create and save user
    const newUser = this.userRepository.create({
      username,
      email,
      password, // Ensure password is hashed (use @BeforeInsert hook)
      bio,
      avatar,
      role, // Assign the determined role
    });

    const savedUser = await this.userRepository.save(newUser);
    this.logger.debug(savedUser);

    // 4. Return response (excluding sensitive data)
    return new SuccessDto(plainToInstance(UserResDto, savedUser));
  }

  async findAll(
    reqDto: ListUserReqDto,
  ): Promise<OffsetPaginatedListDto<UserResDto>> {
    const query = this.userRepository
      .createQueryBuilder('user')
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

  async loadMoreUsers(
    reqDto: LoadMoreUsersReqDto,
  ): Promise<CursorPaginatedDto<UserResDto>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    const paginator = buildPaginator({
      entity: UserEntity,
      alias: 'user',
      paginationKeys: ['createdAt'],
      query: {
        limit: reqDto.limit,
        order: 'DESC',
        afterCursor: reqDto.afterCursor,
        beforeCursor: reqDto.beforeCursor,
      },
    });

    const { data, cursor } = await paginator.paginate(queryBuilder);

    const metaDto = new CursorPaginationDto(
      data.length,
      cursor.afterCursor,
      cursor.beforeCursor,
      reqDto,
    );

    return new CursorPaginatedDto(plainToInstance(UserResDto, data), metaDto);
  }

  async findOne(id: Uuid): Promise<SuccessDto<UserResDto>> {
    assert(id, 'id is required');
    const user = await this.userRepository.findOneByOrFail({ id });

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
    user.role = role;

    const updatedUser = await UserEntity.save(user);

    return new SuccessDto(updatedUser.toDto(UserResDto));
  }

  async remove(id: Uuid): Promise<SuccessDto<{ id: Uuid }>> {
    await this.userRepository.findOneByOrFail({ id });
    await this.userRepository.softDelete(id);
    return new SuccessDto({ id });
  }
}
