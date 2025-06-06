// permission.entity.ts
import { RoleEntity } from '@/api/role/entities/role.entity';
import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { ResourceEntity } from './resource.entity';
@Entity('permissions')
export class PermissionEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_permission_id',
  })
  id!: Uuid;

  @ManyToOne(() => RoleEntity, (role) => role.permissions)
  role: Relation<RoleEntity>;

  @ManyToOne(() => ResourceEntity, (resource) => resource.permissions)
  resource: Relation<ResourceEntity>;

  @Column({ type: 'boolean', default: false })
  canCreate: boolean;

  @Column({ type: 'boolean', default: false })
  canRead: boolean;

  @Column({ type: 'boolean', default: false })
  canUpdate: boolean;

  @Column({ type: 'boolean', default: false })
  canDelete: boolean;
}
