// permission.entity.ts
import { RoleEntity } from '@/api/role/entities/role.entity';
import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

export enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage',
}

@Entity('permissions')
export class PermissionEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_permission_id',
  })
  id!: Uuid;

  @Column()
  entity: string;

  @Column({
    type: 'enum',
    enum: PermissionAction,
    array: true,
    default: [],
  })
  actions: PermissionAction[];

  @ManyToMany(() => RoleEntity, (role) => role.permissions)
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'permission_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Relation<RoleEntity[]>;
}
