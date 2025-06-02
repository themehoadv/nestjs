import { AllConfigType } from '@/config/config.type';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { createCloudinaryProvider } from './provider/cloudinary.provider';

@Module({
  providers: [
    {
      provide: 'STORAGE_SERVICE',
      useFactory: (configService: ConfigService<AllConfigType>) =>
        createCloudinaryProvider(configService),
      inject: [ConfigService],
    },
    MediaService,
  ],
  controllers: [MediaController],
  exports: ['STORAGE_SERVICE', MediaService],
})
export class MediaModule {}
