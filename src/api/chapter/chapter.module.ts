import { ChapterEntity } from '@/api/chapter/entities/chapter.entity';
import { UserEntity } from '@/api/user/entities/user.entity';
import { UserModule } from '@/api/user/user.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([ChapterEntity, UserEntity])],
  controllers: [ChapterController],
  providers: [ChapterService],
})
export class ChapterModule {}
