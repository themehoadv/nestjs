// permission.entity.ts
import { RoleEntity } from '@/api/role/entities/role.entity';
import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import {
  Column,
  Entity,
  JoinColumn,
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

  @JoinColumn({
    name: 'role_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_permission_role_id',
  })
  @ManyToOne(() => RoleEntity, (role) => role.permissions)
  role: Relation<RoleEntity>;

  @JoinColumn({
    name: 'resource_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_permission_resource_id',
  })
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
