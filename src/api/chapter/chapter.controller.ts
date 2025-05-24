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
import { ChapterResDto } from '../chapter/dto';
import { ListUserReqDto } from '../user/dto';
import { ChapterService } from './chapter.service';
import { CreateChapterReqDto } from './dto';

@ApiTags('chapters')
@Controller({
  path: 'chapters',
  version: '1',
})
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @Get()
  @ApiPublic({
    type: ChapterResDto,
    summary: 'Get chapters',
    isPaginated: true,
  })
  async findMany(
    @Query() reqDto: ListUserReqDto,
  ): Promise<OffsetPaginatedDto<ChapterResDto>> {
    return this.chapterService.findMany(reqDto);
  }

  @Get(':id')
  @ApiPublic({
    type: ChapterResDto,
    summary: 'Get chapter by id',
  })
  @ApiParam({ name: 'id', type: 'String' })
  async findOne(@Param('id', ParseUUIDPipe) id: Uuid) {
    return this.chapterService.findOne(id);
  }

  @Post()
  @ApiAuth({
    type: CreateChapterReqDto,
    summary: 'Create chapter',
  })
  async create(
    @Body() reqDto: CreateChapterReqDto,
    @CurrentUser('id') userId: Uuid,
  ) {
    return this.chapterService.create(reqDto, userId);
  }

  @Delete(':id')
  @ApiAuth({
    summary: 'Delete chapter',
  })
  @ApiParam({ name: 'id', type: 'String' })
  async delete(@Param('id', ParseUUIDPipe) id: Uuid) {
    return this.chapterService.delete(id);
  }
}
