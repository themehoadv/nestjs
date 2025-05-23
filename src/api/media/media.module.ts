import { AllConfigType } from '@/config/config.type';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileDriver } from './config/media-config.type';
import { MediaEntity } from './entities/media.entity';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { createCloudinaryProvider } from './providers/cloudinary.provider';
import { createLocalProvider } from './providers/local.provider';

@Module({
  imports: [TypeOrmModule.forFeature([MediaEntity])],
  providers: [
    {
      provide: 'STORAGE_SERVICE',
      useFactory: (configService: ConfigService<AllConfigType>) => {
        const driver = configService.getOrThrow('media.driver', {
          infer: true,
        });
        switch (driver) {
          case FileDriver.LOCAL:
            return createLocalProvider(configService);
          case FileDriver.CLOUDINARY:
            return createCloudinaryProvider(configService);
          default:
            throw new Error(`Unsupported file driver: ${driver}`);
        }
      },
      inject: [ConfigService],
    },
    MediaService,
  ],
  controllers: [MediaController],
  exports: ['STORAGE_SERVICE', MediaService],
})
export class MediaModule {}
