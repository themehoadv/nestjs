import { Uuid } from '@/common/types/common.type';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { ApiAuth } from '@/decorators/http.decorators';
import { Public } from '@/decorators/public.decorator';
import {
  BadRequestException,
  Controller,
  Get,
  Header,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { existsSync } from 'fs';
import { lookup } from 'mime-types';
import { join } from 'path';
import { MediaResDto } from './dto/index';
import { MediaService } from './media.service';

@ApiTags('media')
@Controller({
  path: 'media',
  version: '1',
})
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiAuth({
    type: MediaResDto,
    summary: 'Upload a media file',
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser('id') userId: Uuid,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return this.mediaService.create({
      file,
      userId,
    });
  }

  @Get(':id')
  @ApiAuth({
    type: MediaResDto,
    summary: 'Get media by id',
  })
  @ApiParam({ name: 'id', type: 'String' })
  async findOne(@Param('id', ParseUUIDPipe) id: Uuid): Promise<MediaResDto> {
    return await this.mediaService.findOne(id);
  }

  @Get('/path/:path')
  @Header('Cache-Control', 'max-age=31536000') // Cache for 1 year
  @Public()
  @ApiParam({ name: 'path', type: 'String' })
  async getFile(
    @Param('path') path: string,
    @Res() res: Response,
  ): Promise<void> {
    //TODO Refactor code and move media service
    const uploadPath = 'uploads';

    if (path.includes('..')) {
      throw new BadRequestException('Invalid file path');
    }

    const fullPath = join(process.cwd(), uploadPath, path);

    if (!existsSync(fullPath)) {
      throw new NotFoundException('File not found');
    }

    const mimeType = lookup(path) || 'application/octet-stream';
    res.setHeader('Content-Type', mimeType);

    res.sendFile(fullPath, (err) => {
      if (err) {
        throw new NotFoundException('File not found');
      }
    });
  }
}
