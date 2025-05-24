import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { Uuid } from '@/common/types/common.type';
import { paginate } from '@/utils/offset-pagination';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { EntityManager, Repository } from 'typeorm';
import { ChapterEntity } from '../chapter/entities/chapter.entity';
import { CourseEntity } from '../course/entities/course.entity';
import { ListUserReqDto } from '../user/dto';
import { UserEntity } from '../user/entities/user.entity';
import { ChapterResDto, CreateChapterReqDto } from './dto';
import { LessonEntity } from './entities/lesson.entity';

@Injectable()
export class ChapterService {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(ChapterEntity)
    private readonly chapterRepository: Repository<ChapterEntity>,
  ) {}

  async findOne(id: Uuid): Promise<ChapterResDto> {
    const chapter = await ChapterEntity.findOne({
      where: { id },
      relations: ['lessons'],
      order: {
        lessons: {
          order: 'ASC', // Sắp xếp lessons theo order
        },
      },
    });

    if (!chapter) {
      throw new NotFoundException('Course not found');
    }
    return chapter.toDto(ChapterResDto);
  }

  async findMany(
    reqDto: ListUserReqDto,
  ): Promise<OffsetPaginatedDto<ChapterResDto>> {
    // Tạo query builder với relation chapters
    const query = ChapterEntity.createQueryBuilder('chapter')
      .leftJoinAndSelect('chapter.lessons', 'lessons')
      .orderBy('chapter.createdAt', 'DESC')
      .addOrderBy('lessons.order', 'ASC'); // Sắp xếp lessons theo order

    // Phân trang
    const [chapters, metaDto] = await paginate<ChapterEntity>(query, reqDto, {
      skipCount: false,
      takeAll: false,
    });

    // Transform và trả về kết quả
    return new OffsetPaginatedDto(
      plainToInstance(ChapterResDto, chapters),
      metaDto,
    );
  }

  async create(
    reqDto: CreateChapterReqDto,
    userId: Uuid,
  ): Promise<ChapterResDto> {
    const user = await this.entityManager.findOneByOrFail(UserEntity, {
      id: userId,
    });

    const { courseId, title, description, order, lessons = [] } = reqDto;

    await this.entityManager.findOneByOrFail(CourseEntity, {
      id: courseId,
    });

    return this.entityManager.transaction(async (transactionManager) => {
      // Create new chapter
      const newChapter = new ChapterEntity({
        title,
        description,
        order,
        courseId,
        createdBy: user.username || user.email,
        updatedBy: user.username || user.email,
      });

      const savedChapter = await transactionManager.save(
        ChapterEntity,
        newChapter,
      );

      // Create lessons if provided
      if (lessons && lessons.length > 0) {
        const lessonEntities = lessons.map((lessonDto, index) => {
          return transactionManager.create(LessonEntity, {
            title: lessonDto.title,
            description: lessonDto.description,
            content: lessonDto.content,
            order: lessonDto.order ?? index + 1,
            chapterId: savedChapter.id,
            createdBy: user.username || user.email,
            updatedBy: user.username || user.email,
          });
        });

        await transactionManager.save(LessonEntity, lessonEntities);
        savedChapter.lessons = lessonEntities;
      }

      return plainToInstance(ChapterResDto, savedChapter);
    });
  }

  async delete(id: Uuid) {
    await CourseEntity.findOneByOrFail({ id });
    await this.chapterRepository.softDelete(id);
    return { message: 'Delete done' };
  }
}
