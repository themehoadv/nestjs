import { Uuid } from '@/common/types/common.type';
import { AllConfigType } from '@/config/config.type';
import { MediaUrlUtil } from '@/utils/upload..util';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { CreateMediaReqDto, MediaResDto } from './dto/index';
import { MediaEntity } from './entities/media.entity';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(MediaEntity)
    @InjectRepository(UserEntity)
    private readonly mediaRepository: Repository<MediaEntity>,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  async create({
    file,
    userId,
  }: {
    file: Express.Multer.File;
    userId: Uuid;
  } & CreateMediaReqDto): Promise<MediaResDto> {
    const user = await UserEntity.findOneByOrFail({ id: userId });

    const newMedia = new MediaEntity({
      originalName: file.originalname,
      fileName: file.filename,
      path: file.path,
      mimeType: file.mimetype,
      size: file.size,
      createdBy: user.username || user.email,
      updatedBy: user.username || user.email,
      referenceId: userId,
      referenceType: 'blog' as MediaEntity['referenceType'],
      type: 'image' as MediaEntity['type'],
    });

    const saveMedia = await this.mediaRepository.save(newMedia);
    return plainToInstance(MediaResDto, saveMedia);
  }

  async findOne(id: Uuid): Promise<MediaResDto> {
    const media = await MediaEntity.findOneByOrFail({ id });
    const url = MediaUrlUtil.getMediaUrl(media.path, this.configService);
    return { ...media, url };
  }

  async remove(id: Uuid) {
    await MediaEntity.findOneByOrFail({ id });
    await this.mediaRepository.softDelete(id);
  }

  async getMediaWithUrl(mediaId: Uuid): Promise<MediaResDto> {
    const media = await this.mediaRepository.findOneByOrFail({ id: mediaId });
    const url = MediaUrlUtil.getMediaUrl(media.path, this.configService);
    return { ...media, url };
  }
}
