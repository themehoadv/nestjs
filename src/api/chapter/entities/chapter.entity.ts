import { CourseEntity } from '@/api/course/entities/course.entity';
import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { LessonEntity } from './lesson.entity';

@Entity('chapter')
export class ChapterEntity extends AbstractEntity {
  constructor(data?: Partial<ChapterEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_chapter_id' })
  id!: Uuid;

  @Column()
  title!: string;

  @Column()
  order!: number;

  @Column({ nullable: true })
  description?: string;

  @Column({ name: 'course_id' })
  courseId!: Uuid;

  @ManyToOne(() => CourseEntity, (course) => course.chapters)
  course: Relation<CourseEntity>;

  @OneToMany(() => LessonEntity, (lesson) => lesson.chapter)
  lessons: Relation<LessonEntity>[];

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    default: null,
  })
  deletedAt: Date;
}
