import { createMulterOptions } from '@/utils/upload..util';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaEntity } from './entities/media.entity';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MediaEntity]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: createMulterOptions,
    }),
  ],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
