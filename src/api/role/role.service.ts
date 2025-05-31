import { SuccessDto } from '@/common/dto/sucess.dto';
import { Uuid } from '@/common/types/common.type';
import { ErrorCode } from '@/constants/error-code.constant';
import { ValidationException } from '@/exceptions/validation.exception';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { assert } from 'console';
import { Repository } from 'typeorm';
import { CreateRoleReqDto } from './dto/create-role.req.dto';
import { RoleResDto } from './dto/role.res.dto';
import { RoleEntity } from './entities/role.entity';

@Injectable()
export class RoleService {
  private readonly logger = new Logger(RoleService.name);

  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async create(dto: CreateRoleReqDto): Promise<SuccessDto<RoleResDto>> {
    const { name, description } = dto;

    const existingRole = await this.roleRepository.findOne({
      where: { name },
    });

    if (existingRole) {
      throw new ValidationException(ErrorCode.E001);
    }

    const newRole = this.roleRepository.create({
      name,
      description,
    });

    const savedRole = await this.roleRepository.save(newRole);
    this.logger.debug(savedRole);

    return new SuccessDto(plainToInstance(RoleResDto, savedRole));
  }

  async findAll(): Promise<SuccessDto<RoleResDto[]>> {
    const roles = await RoleEntity.find();
    return new SuccessDto(plainToInstance(RoleResDto, roles));
  }

  async findOne(id: Uuid): Promise<SuccessDto<RoleResDto>> {
    assert(id, 'id is required');
    const role = await this.roleRepository.findOneByOrFail({ id });

    return new SuccessDto(role.toDto(RoleResDto));
  }

  async remove(id: Uuid): Promise<SuccessDto<{ id: Uuid }>> {
    await this.roleRepository.findOneByOrFail({ id });
    await this.roleRepository.softDelete(id);
    return new SuccessDto({ id });
  }
}
