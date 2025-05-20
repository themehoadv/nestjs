import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { Uuid } from '@/common/types/common.type';
import { paginate } from '@/utils/offset-pagination';
import { Injectable } from '@nestjs/common';
import assert from 'assert';
import { plainToInstance } from 'class-transformer';
import { ListUserReqDto } from '../user/dto/list-user.req.dto';
import { BlogResDto } from './dto/blog.res.dto';
import { CreateBlogReqDto } from './dto/create-blog.req.dto';
import { UpdateBlogReqDto } from './dto/update-blog.req.dto';
import { BlogEntity } from './entities/blog.entity';

@Injectable()
export class BlogService {
  constructor() {}

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
    assert(id, 'id is required');
    const blog = await BlogEntity.findOneByOrFail({ id });

    return blog.toDto(BlogResDto);
  }

  create(_reqDto: CreateBlogReqDto) {
    throw new Error('Method not implemented.');
  }

  update(_id: Uuid, _reqDto: UpdateBlogReqDto) {
    throw new Error('Method not implemented.');
  }

  delete(_id: Uuid) {
    throw new Error('Method not implemented.');
  }
}
