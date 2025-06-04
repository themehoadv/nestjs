import { Inject, Injectable } from '@nestjs/common';
import { FileStorageService } from './config/media-config.type';

@Injectable()
export class MediaService {
  constructor(
    @Inject('STORAGE_SERVICE')
    private readonly storageService: FileStorageService,
  ) {}
  async uploadFile(file: Express.Multer.File): Promise<string> {
    const uploadResult = await this.storageService.upload(file);

    return uploadResult?.url;
  }
}
