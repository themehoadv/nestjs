import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { Uuid } from '@/common/types/common.type';
import { ErrorCode } from '@/constants/error-code.constant';
import { ValidationException } from '@/exceptions/validation.exception';
import { paginate } from '@/utils/offset-pagination';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { ListUserReqDto } from '../user/dto/list-user.req.dto';
import { UserEntity } from '../user/entities/user.entity';
import { BlogResDto } from './dto/blog.res.dto';
import { CreateBlogReqDto } from './dto/create-blog.req.dto';
import { UpdateBlogReqDto } from './dto/update-blog.req.dto';
import { BlogEntity } from './entities/blog.entity';

@Injectable()
export class BlogService {
  private readonly logger = new Logger(BlogService.name);

  constructor(
    @InjectRepository(BlogEntity)
    private readonly blogRepository: Repository<BlogEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findMany(
    reqDto: ListUserReqDto,
  ): Promise<OffsetPaginatedDto<BlogResDto>> {
    const query = BlogEntity.createQueryBuilder('blog').orderBy(
      'blog.createdAt',
      'DESC',
    );
    const [blogs, metaDto] = await paginate<BlogEntity>(query, reqDto, {
      skipCount: false,
      takeAll: false,
    });

    return new OffsetPaginatedDto(plainToInstance(BlogResDto, blogs), metaDto);
  }

  async findOne(id: Uuid): Promise<BlogResDto> {
    const blog = await BlogEntity.findOneByOrFail({ id });
    return blog.toDto(BlogResDto);
  }

  async findOneBySlug(slug: string): Promise<BlogResDto> {
    const blog = await BlogEntity.findOneByOrFail({ slug });
    return blog.toDto(BlogResDto);
  }

  async create(reqDto: CreateBlogReqDto, userId: Uuid) {
    const user = await this.userRepository.findOneByOrFail({ id: userId });

    const { title, slug, description, content } = reqDto;

    const existingBlog = await BlogEntity.findOne({
      where: { slug },
    });

    if (existingBlog) {
      throw new ValidationException(ErrorCode.B001);
    }

    const newBlog = new BlogEntity({
      title,
      slug,
      description,
      content,
      userId,
      createdBy: user.username || user.email,
      updatedBy: user.username || user.email,
    });

    const savedBlog = await BlogEntity.save(newBlog);

    this.logger.debug(`Created new blog with ID: ${savedBlog.id}`);

    return plainToInstance(BlogResDto, savedBlog);
  }

  async update(id: Uuid, reqDto: UpdateBlogReqDto, userId: Uuid) {
    const [blog, user] = await Promise.all([
      BlogEntity.findOneByOrFail({ id }),
      UserEntity.findOneByOrFail({ id: userId }),
    ]);

    const { title, slug, description, content } = reqDto;
    if (slug && slug !== blog.slug) {
      const existingBlog = await BlogEntity.findOne({
        where: { slug },
      });
      if (existingBlog) {
        throw new ValidationException(ErrorCode.B001);
      }
    }

    blog.title = title || blog.title;
    blog.slug = slug || blog.slug;
    blog.description = description || blog.description;
    blog.content = content || blog.content;
    blog.updatedBy = user.username || user.email;

    const updatedBlog = await BlogEntity.save(blog);

    this.logger.debug(`Updated blog with ID: ${id}`);

    return plainToInstance(BlogResDto, updatedBlog);
  }

  async delete(id: Uuid) {
    await this.blogRepository.findOneByOrFail({ id });
    await this.blogRepository.softDelete(id);
  }
}
