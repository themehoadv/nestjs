import { SuccessDto } from '@/common/dto/sucess.dto';
import { Inject, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { FileStorageService } from './config/media-config.type';
import { MediaResDto } from './dto/media.res.dto';

@Injectable()
export class MediaService {
  constructor(
    @Inject('STORAGE_SERVICE')
    private readonly storageService: FileStorageService,
  ) {}
  async uploadFile(
    file: Express.Multer.File,
  ): Promise<SuccessDto<MediaResDto>> {
    const uploadResult = await this.storageService.upload(file);

    return new SuccessDto(plainToInstance(MediaResDto, uploadResult));
  }
}
