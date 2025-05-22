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

  @Column()
  originalName!: string;

  @Column()
  fileName!: string;

  @Column()
  path!: string;

  @Column()
  mimeType!: string;

  @Column({ type: 'enum', enum: MediaType })
  type!: MediaType;

  @Column({ type: 'bigint' })
  size!: number;

  @Column({ nullable: true })
  width?: number;

  @Column({ nullable: true })
  height?: number;

  @Column({ type: 'enum', enum: MediaReferenceType, nullable: true })
  referenceType?: MediaReferenceType;

  @Column({ name: 'reference_id', nullable: true })
  referenceId?: Uuid;

  // Optional relations to specific entities
  // These are nullable since a media file might not be associated with any entity yet

  // @ManyToOne(() => BlogEntity, (blog) => blog.images, {
  //   onDelete: 'SET NULL',
  // })
  // @JoinColumn({
  //   name: 'reference_id',
  //   referencedColumnName: 'id',
  //   foreignKeyConstraintName: 'FK_media_blog_id',
  // })
  // blog?: Relation<BlogEntity>;

  // @OneToOne(() => UserEntity, (user) => user.avatar, {
  //   onDelete: 'SET NULL',
  // })
  // @JoinColumn({
  //   name: 'reference_id',
  //   referencedColumnName: 'id',
  //   foreignKeyConstraintName: 'FK_media_user_id',
  // })
  // user?: Relation<UserEntity>;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    default: null,
  })
  deletedAt: Date;
}
