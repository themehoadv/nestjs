import { PermissionEntity } from '@/api/permission/entities/permission.entity';
import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity('roles')
export class RoleEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_role_id' })
  id!: Uuid;

  @Column()
  name!: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  code!: string;

  @Column({ type: 'text', nullable: true })
  remark?: string;

  @ManyToMany(() => PermissionEntity, (permission) => permission.role)
  permissions: Relation<PermissionEntity[]>;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    default: null,
  })
  deletedAt: Date;
}
