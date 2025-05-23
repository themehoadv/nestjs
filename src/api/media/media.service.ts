import { Uuid } from '@/common/types/common.type';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import path from 'path';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { FileStorageService } from './config/media-config.type';
import {
  MediaEntity,
  MediaReferenceType,
  MediaType,
} from './entities/media.entity';

@Injectable()
export class MediaService {
  constructor(
    @Inject('STORAGE_SERVICE')
    private readonly storageService: FileStorageService,
    @InjectRepository(MediaEntity)
    @InjectRepository(UserEntity)
    private readonly mediaRepository: Repository<MediaEntity>,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    userId: Uuid,
  ): Promise<MediaEntity> {
    const user = await UserEntity.findOneByOrFail({ id: userId });
    const uploadResult = await this.storageService.upload(file);

    const mediaData = new MediaEntity({
      originalName: file.originalname,
      mimeType: file.mimetype,
      type: MediaType.IMAGE,
      size: file.size,
      referenceType: MediaReferenceType.USER,
      referenceId: userId as Uuid,
      createdBy: user.username || user.email,
      updatedBy: user.username || user.email,
    });
    if (uploadResult.public_id) {
      mediaData.fileName = uploadResult.public_id;
      mediaData.path = uploadResult.secure_url;
      mediaData.width = uploadResult.width || null;
      mediaData.height = uploadResult.height || null;
    } else if (uploadResult.path) {
      mediaData.fileName = path.basename(uploadResult.path);
      mediaData.path = uploadResult.url;
      mediaData.width = null;
      mediaData.height = null;
    }
    return this.mediaRepository.save(mediaData);
  }

  // async create({
  //   file,
  //   userId,
  // }: {
  //   file: Express.Multer.File;
  //   userId: Uuid;
  // } & CreateMediaReqDto): Promise<MediaResDto> {
  //   const user = await UserEntity.findOneByOrFail({ id: userId });

  //   const newMedia = new MediaEntity({
  //     originalName: file.originalname,
  //     fileName: file.filename,
  //     path: file.path,
  //     mimeType: file.mimetype,
  //     size: file.size,
  //     createdBy: user.username || user.email,
  //     updatedBy: user.username || user.email,
  //     referenceId: userId,
  //     referenceType: 'blog' as MediaEntity['referenceType'],
  //     type: MediaType.IMAGE,
  //   });

  //   const saveMedia = await this.mediaRepository.save(newMedia);
  //   return plainToInstance(MediaResDto, saveMedia);
  // }

  // async findOne(id: Uuid): Promise<MediaResDto> {
  //   const media = await MediaEntity.findOneByOrFail({ id });
  //   const url = MediaUrlUtil.getMediaUrl(media.path, this.configService);
  //   return { ...media, url };
  // }

  // async remove(id: Uuid) {
  //   await MediaEntity.findOneByOrFail({ id });
  //   await this.mediaRepository.softDelete(id);
  // }

  // async getMediaWithUrl(mediaId: Uuid): Promise<MediaResDto> {
  //   const media = await this.mediaRepository.findOneByOrFail({ id: mediaId });
  //   const url = MediaUrlUtil.getMediaUrl(media.path, this.configService);
  //   return { ...media, url };
  // }
}
