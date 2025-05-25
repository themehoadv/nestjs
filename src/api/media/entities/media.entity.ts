import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  DOCUMENT = 'document',
  AUDIO = 'audio',
  OTHER = 'other',
}

export enum MediaReferenceType {
  BLOG = 'blog',
  USER = 'user',
  // Add other reference types as needed
}

@Entity('media')
export class MediaEntity extends AbstractEntity {
  constructor(data?: Partial<MediaEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_media_id' })
  id!: Uuid;

  @Column({
    name: 'original_name',
  })
  originalName!: string;

  @Column({
    name: 'file_name',
  })
  fileName!: string;

  @Column()
  path!: string;

  @Column({
    name: 'mime_type',
  })
  mimeType!: string;

  @Column({ type: 'enum', enum: MediaType, enumName: 'media_type_enum' })
  type!: MediaType;

  @Column({ type: 'bigint' })
  size!: number;

  @Column({ nullable: true })
  width?: number;

  @Column({ nullable: true })
  height?: number;

  @Column({
    name: 'reference_type',
    type: 'enum',
    enum: MediaReferenceType,
    nullable: true,
    enumName: 'media_reference_type_enum',
  })
  referenceType?: MediaReferenceType;

  @Column({ name: 'reference_id', nullable: true, type: 'uuid' })
  referenceId?: Uuid;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    default: null,
  })
  deletedAt: Date;
}
