import { ChapterEntity } from '@/api/chapter/entities/chapter.entity';
import { UserEntity } from '@/api/user/entities/user.entity';
import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { Uuid } from '@/common/types/common.type';
import { ErrorCode } from '@/constants/error-code.constant';
import { ValidationException } from '@/exceptions/validation.exception';
import { paginate } from '@/utils/offset-pagination';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { EntityManager, Repository } from 'typeorm';
import { ListUserReqDto } from '../user/dto';
import { ChapterResDto, CourseResDto, CreateCourseReqDto } from './dto';
import { CourseEntity } from './entities/course.entity';

@Injectable()
export class CourseService {
  private readonly logger = new Logger(CourseService.name);

  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
  ) {}

  async create(reqDto: CreateCourseReqDto, userId: Uuid) {
    const user = await this.entityManager.findOneByOrFail(UserEntity, {
      id: userId,
    });

    const { title, slug, price, oldPrice, description, chapters = [] } = reqDto;

    // Check if course with same slug already exists
    const existingCourse = await CourseEntity.findOne({
      where: { slug },
    });

    if (existingCourse) {
      throw new ValidationException(ErrorCode.C001);
    }

    // Create course with transaction to ensure data consistency
    return this.entityManager.transaction(async (transactionManager) => {
      // Create new course
      const newCourse = new CourseEntity({
        title,
        slug,
        price,
        oldPrice,
        description,
        authorId: userId,
        createdBy: user.username || user.email,
        updatedBy: user.username || user.email,
      });

      const savedCourse = await transactionManager.save(newCourse);

      // Create chapters if provided
      if (chapters && chapters.length > 0) {
        const chapterEntities = chapters.map((chapterDto, index) => {
          return new ChapterEntity({
            title: chapterDto.title,
            description: chapterDto.description,
            order: chapterDto.order ?? index + 1, // Default order if not provided
            courseId: savedCourse.id,
            course: newCourse,
            createdBy: user.username || user.email,
            updatedBy: user.username || user.email,
          });
        });

        await transactionManager.save(ChapterEntity, chapterEntities);

        // Assign chapters to course (optional, can be loaded when needed)
        savedCourse.chapters = chapterEntities;
      }

      this.logger.debug(`Created new course with ID: ${savedCourse.id}`);

      return plainToInstance(CourseResDto, savedCourse);
    });
  }

  async findOne(id: Uuid): Promise<CourseResDto> {
    const course = await CourseEntity.findOne({
      where: { id },
      relations: ['chapters'],
      order: {
        chapters: {
          order: 'ASC', // Sắp xếp chapters theo order
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course.toDto(CourseResDto);
  }

  async findManyWithChapters(
    reqDto: ListUserReqDto,
  ): Promise<OffsetPaginatedDto<CourseResDto>> {
    // Tạo query builder với relation chapters
    const query = CourseEntity.createQueryBuilder('course')
      .leftJoinAndSelect('course.chapters', 'chapters')
      .orderBy('course.createdAt', 'DESC')
      .addOrderBy('chapters.order', 'ASC'); // Sắp xếp chapters theo order

    // Phân trang
    const [courses, metaDto] = await paginate<CourseEntity>(query, reqDto, {
      skipCount: false,
      takeAll: false,
    });

    // Transform và trả về kết quả
    return new OffsetPaginatedDto(
      plainToInstance(CourseResDto, courses),
      metaDto,
    );
  }

  async findManyByCourseId(
    courseId: Uuid,
    reqDto: ListUserReqDto,
  ): Promise<OffsetPaginatedDto<ChapterResDto>> {
    await CourseEntity.findOneByOrFail({ id: courseId });
    // Tạo query builder để lấy chapters
    const query = ChapterEntity.createQueryBuilder('chapter')
      .where('chapter.courseId = :courseId', { courseId })
      .orderBy('chapter.order', 'ASC'); // Sắp xếp theo thứ tự chapter

    // Phân trang
    const [chapters, metaDto] = await paginate<ChapterEntity>(query, reqDto, {
      skipCount: false,
      takeAll: false,
    });

    return new OffsetPaginatedDto(
      plainToInstance(ChapterResDto, chapters),
      metaDto,
    );
  }

  async delete(id: Uuid) {
    await CourseEntity.findOneByOrFail({ id });
    await this.courseRepository.softDelete(id);
    return { message: 'Delete done' };
  }
}
