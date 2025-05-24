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

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  oldPrice?: number;

  @Column({ nullable: true })
  description?: string;

  @Column({ name: 'author_id' })
  authorId!: Uuid;

  @JoinColumn({
    name: 'author_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_course_author_id',
  })
  @ManyToOne(() => UserEntity, (user) => user.courses)
  author: Relation<UserEntity>;

  @OneToMany(() => ChapterEntity, (chapter) => chapter.course)
  chapters: Relation<ChapterEntity[]>;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    default: null,
  })
  deletedAt: Date;
}
