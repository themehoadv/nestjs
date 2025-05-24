import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChapterEntity } from './chapter.entity';

@Entity('lesson')
export class LessonEntity extends AbstractEntity {
  constructor(data?: Partial<LessonEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_lesson_id' })
  id!: Uuid;

  @Column()
  title!: string;

  @Column({ default: 0 })
  order!: number;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  content?: string;

  @Column({ name: 'chapter_id', type: 'uuid' })
  chapterId!: Uuid;

  @ManyToOne(() => ChapterEntity, (chapter) => chapter.lessons)
  @JoinColumn({ name: 'chapter_id' })
  chapter: ChapterEntity;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    default: null,
  })
  deletedAt: Date;
}
