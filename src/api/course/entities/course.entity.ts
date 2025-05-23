import { ChapterEntity } from '@/api/chapter/entities/chapter.entity';
import { UserEntity } from '@/api/user/entities/user.entity';
import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity('course')
export class CourseEntity extends AbstractEntity {
  constructor(data?: Partial<CourseEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_course_id' })
  id!: Uuid;

  @Column()
  title!: string;

  @Column({ unique: true })
  slug!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({
    name: 'old_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  oldPrice?: number;

  @Column({ nullable: true })
  description?: string;

  @Column({ name: 'author_id', type: 'uuid' })
  authorId!: Uuid;

  @ManyToOne(() => UserEntity, (user) => user.courses)
  @JoinColumn({ name: 'author_id' })
  author: Relation<UserEntity>;

  @OneToMany(() => ChapterEntity, (chapter) => chapter.course, {
    cascade: true,
  })
  chapters: Relation<ChapterEntity[]>;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    default: null,
  })
  deletedAt: Date;
}
