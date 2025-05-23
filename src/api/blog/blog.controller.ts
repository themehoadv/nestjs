import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { Uuid } from '@/common/types/common.type';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { ApiAuth } from '@/decorators/http.decorators';
import { Public } from '@/decorators/public.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ListUserReqDto } from '../user/dto/list-user.req.dto';
import { BlogService } from './blog.service';
import { BlogResDto } from './dto/blog.res.dto';
import { CreateBlogReqDto } from './dto/create-blog.req.dto';
import { UpdateBlogReqDto } from './dto/update-blog.req.dto';

@ApiTags('blogs')
@Controller({
  path: 'blogs',
  version: '1',
})
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  @Public()
  @ApiAuth({
    type: BlogResDto,
    summary: 'Get blogs',
    isPaginated: true,
  })
  async findMany(
    @Query() reqDto: ListUserReqDto,
  ): Promise<OffsetPaginatedDto<BlogResDto>> {
    return this.blogService.findMany(reqDto);
  }

  @Get(':id')
  @Public()
  @ApiAuth({
    type: BlogResDto,
    summary: 'Get blog by id',
  })
  @ApiParam({ name: 'id', type: 'String' })
  async findOne(@Param('id', ParseUUIDPipe) id: Uuid) {
    return this.blogService.findOne(id);
  }

  @Get('/slug/:slug')
  @Public()
  @ApiAuth({
    type: BlogResDto,
    summary: 'Get blog by slug',
  })
  @ApiParam({ name: 'slug', type: 'String' })
  async findOneBySlug(@Param('slug') slug: string) {
    return this.blogService.findOneBySlug(slug);
  }

  @Post()
  @ApiAuth({
    type: BlogResDto,
    summary: 'Create blog',
  })
  async create(
    @Body() reqDto: CreateBlogReqDto,
    @CurrentUser('id') userId: Uuid,
  ) {
    return this.blogService.create(reqDto, userId);
  }

  @Patch(':id')
  @ApiAuth({
    type: BlogResDto,
    summary: 'Update blog by id',
  })
  @ApiParam({ name: 'id', type: 'String' })
  async update(
    @Param('id', ParseUUIDPipe) id: Uuid,
    @Body() reqDto: UpdateBlogReqDto,
    @CurrentUser('id') userId: Uuid,
  ) {
    return this.blogService.update(id, reqDto, userId);
  }

  @Delete(':id')
  @ApiAuth({
    summary: 'Delete blog',
  })
  @ApiParam({ name: 'id', type: 'String' })
  async delete(@Param('id', ParseUUIDPipe) id: Uuid) {
    return this.blogService.delete(id);
  }
}
