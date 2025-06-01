import { OffsetListDto } from '@/common/dto/offset-pagination/offset-list.dto';
import { OffsetPaginatedListDto } from '@/common/dto/offset-pagination/paginatedList.dto';
import { SuccessDto } from '@/common/dto/sucess.dto';
import { Uuid } from '@/common/types/common.type';
import { ErrorCode } from '@/constants/error-code.constant';
import { ValidationException } from '@/exceptions/validation.exception';
import { paginateList } from '@/utils/offset-list';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { assert } from 'console';
import { Repository } from 'typeorm';
import { CreateRoleReqDto } from './dto/create-role.req.dto';
import { ListRoleReqDto } from './dto/list-role.req.dto';
import { RoleResDto } from './dto/role.res.dto';
import { UpdateRoleReqDto } from './dto/update-role.req.dto';
import { RoleEntity } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async create(dto: CreateRoleReqDto): Promise<SuccessDto<RoleResDto>> {
    const { name, code, remark } = dto;

    const existingRole = await this.roleRepository.findOne({
      where: { code },
    });

    if (existingRole) {
      throw new ValidationException(ErrorCode.E001);
    }

    const newRole = this.roleRepository.create({
      name,
      code,
      remark,
    });

    const savedRole = await this.roleRepository.save(newRole);

    return new SuccessDto(plainToInstance(RoleResDto, savedRole));
  }
  async update(
    id: Uuid,
    dto: UpdateRoleReqDto,
  ): Promise<SuccessDto<RoleResDto>> {
    const existingRole = await RoleEntity.findOne({
      where: { name: dto.name },
    });

    if (existingRole && existingRole.id !== id) {
      throw new ValidationException(ErrorCode.E001);
    }

    await RoleEntity.update(id, dto);

    const updatedRole = await RoleEntity.findOneByOrFail({ id });

    return new SuccessDto(plainToInstance(RoleResDto, updatedRole));
  }

  async findAll(): Promise<SuccessDto<RoleResDto[]>> {
    const roles = await RoleEntity.find();

    return new SuccessDto(plainToInstance(RoleResDto, roles));
  }

  async findList(
    reqDto: ListRoleReqDto,
  ): Promise<OffsetPaginatedListDto<RoleResDto>> {
    const query = this.roleRepository
      .createQueryBuilder('user')
      .orderBy('user.createdAt', 'DESC');
    const [roles, count] = await paginateList<RoleEntity>(query, reqDto, {
      skipCount: false,
      takeAll: false,
    });

    const result = new OffsetListDto(
      plainToInstance(RoleResDto, roles),
      count,
      reqDto,
    );

    return new OffsetPaginatedListDto(result);
  }

  async findOne(id: Uuid): Promise<SuccessDto<RoleResDto>> {
    assert(id, 'id is required');
    const role = await this.roleRepository.findOneByOrFail({ id });

    return new SuccessDto(role.toDto(RoleResDto));
  }

  async remove(id: Uuid): Promise<SuccessDto<string>> {
    const role = await this.roleRepository.findOneByOrFail({ id });
    await this.roleRepository.softDelete(id);
    return new SuccessDto(role.name);
  }
}
