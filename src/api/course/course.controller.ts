import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { Uuid } from '@/common/types/common.type';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { ApiAuth, ApiPublic } from '@/decorators/http.decorators';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ListUserReqDto } from '../user/dto';
import { CourseService } from './course.service';
import { CourseResDto, CreateCourseReqDto } from './dto/create-course.dto';

@ApiTags('courses')
@Controller({
  path: 'courses',
  version: '1',
})
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get('/all')
  @ApiPublic({
    type: Array<CourseResDto>,
    summary: 'Get courses all',
  })
  async findAll(): Promise<CourseResDto[]> {
    return this.courseService.findAll();
  }

  @Get()
  @ApiPublic({
    type: CourseResDto,
    summary: 'Get courses',
    isPaginated: true,
  })
  async findMany(
    @Query() reqDto: ListUserReqDto,
  ): Promise<OffsetPaginatedDto<CourseResDto>> {
    return this.courseService.findManyWithChapters(reqDto);
  }

  @Get(':id')
  @ApiPublic({
    type: CourseResDto,
    summary: 'Get course by id',
  })
  @ApiParam({ name: 'id', type: 'String' })
  async findOne(@Param('id', ParseUUIDPipe) id: Uuid) {
    return this.courseService.findOne(id);
  }

  @Get(':id/chapters')
  @ApiPublic({
    type: CourseResDto,
    summary: 'Get chapters by course id',
  })
  @ApiParam({ name: 'id', type: 'String' })
  async findOneWithChapters(
    @Param('id', ParseUUIDPipe) id: Uuid,
    @Query() reqDto: ListUserReqDto,
  ) {
    return this.courseService.findManyByCourseId(id, reqDto);
  }

  @Post()
  @ApiAuth({
    type: CourseResDto,
    summary: 'Create course',
  })
  async create(
    @Body() reqDto: CreateCourseReqDto,
    @CurrentUser('id') userId: Uuid,
  ) {
    return this.courseService.create(reqDto, userId);
  }

  @Delete(':id')
  @ApiAuth({
    summary: 'Delete course',
  })
  @ApiParam({ name: 'id', type: 'String' })
  async delete(@Param('id', ParseUUIDPipe) id: Uuid) {
    return this.courseService.delete(id);
  }
}
