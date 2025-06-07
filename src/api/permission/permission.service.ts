import { OffsetListDto } from '@/common/dto/offset-pagination/offset-list.dto';
import { Uuid } from '@/common/types/common.type';
import { paginateList } from '@/utils/offset-list';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { RoleEntity } from '../role/entities/role.entity';
import {
  CreatePermissionDto,
  ListPermissionReqDto,
  UpdatePermissionDto,
} from './dto';
import { PermissionResDto } from './dto/permission.res.dto';
import { PermissionEntity } from './entities/permission.entity';
import { ResourceEntity } from './entities/resource.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(PermissionEntity)
    private permissionRepo: Repository<PermissionEntity>,
    @InjectRepository(RoleEntity)
    private roleRepo: Repository<RoleEntity>,
    @InjectRepository(ResourceEntity)
    private resourceRepo: Repository<ResourceEntity>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto) {
    const { roleId, resourceId, ...permissionData } = createPermissionDto;

    const [role, resource] = await Promise.all([
      RoleEntity.findOneByOrFail({ id: roleId }),
      ResourceEntity.findOneByOrFail({ id: resourceId }),
    ]);

    if (!role || !resource) {
      throw new Error('Role or Resource not found');
    }

    const permission = this.permissionRepo.create({
      ...permissionData,
      role,
      resource,
    });

    return this.permissionRepo.save(permission);
  }

  async findAll() {
    return this.permissionRepo.find({ relations: ['role', 'resource'] });
  }

  async findAllResource() {
    return this.resourceRepo.find();
  }

  async findList(
    reqDto: ListPermissionReqDto,
  ): Promise<OffsetListDto<PermissionResDto>> {
    const query = this.permissionRepo
      .createQueryBuilder('permission')
      .leftJoinAndSelect('permission.role', 'role')
      .leftJoinAndSelect('permission.resource', 'resource')
      .orderBy('permission.createdAt', 'DESC');
    const [permissions, count] = await paginateList<PermissionEntity>(
      query,
      reqDto,
      {
        skipCount: false,
        takeAll: false,
      },
    );

    return new OffsetListDto(
      plainToInstance(PermissionResDto, permissions),
      count,
      reqDto,
    );
  }

  async findByRole(roleId: Uuid) {
    return this.permissionRepo.find({
      where: { role: { id: roleId } },
      relations: ['resource'],
    });
  }

  async findByResource(resourceId: Uuid) {
    return this.permissionRepo.find({
      where: { resource: { id: resourceId } },
      relations: ['role'],
    });
  }

  async findOne(id: Uuid) {
    return this.permissionRepo.findOne({
      where: { id },
      relations: ['role', 'resource'],
    });
  }

  async update(id: Uuid, updatePermissionDto: UpdatePermissionDto) {
    const permission = await this.permissionRepo.findOne({ where: { id } });
    if (!permission) {
      throw new Error('Permission not found');
    }

    if (updatePermissionDto.roleId) {
      const role = await this.roleRepo.findOne({
        where: { id: updatePermissionDto.roleId },
      });
      if (!role) throw new Error('Role not found');
      permission.role = role;
    }

    if (updatePermissionDto.resourceId) {
      const resource = await this.resourceRepo.findOne({
        where: { id: updatePermissionDto.resourceId },
      });
      if (!resource) throw new Error('Resource not found');
      permission.resource = resource;
    }

    Object.assign(permission, updatePermissionDto);
    return this.permissionRepo.save(permission);
  }

  async remove(id: Uuid) {
    const permission = await this.permissionRepo.findOne({ where: { id } });
    if (!permission) {
      throw new Error('Permission not found');
    }
    return this.permissionRepo.remove(permission);
  }

  async checkPermission(
    roleId: Uuid,
    resourceName: string,
    action: 'create' | 'read' | 'update' | 'delete',
  ) {
    const permission = await this.permissionRepo.findOne({
      where: {
        role: { id: roleId },
        resource: { name: resourceName },
      },
    });

    if (!permission) return false;

    return permission[`can${action.charAt(0).toUpperCase() + action.slice(1)}`];
  }
}
