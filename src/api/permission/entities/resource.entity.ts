import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { PermissionEntity } from './permission.entity';

@Entity('resources')
export class ResourceEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_resource_id',
  })
  id!: Uuid;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => PermissionEntity, (permission) => permission.resource)
  permissions: Relation<PermissionEntity[]>;
}
