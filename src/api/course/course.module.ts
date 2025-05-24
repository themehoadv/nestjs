import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { ChapterEntity } from './entities/chapter.entity';
import { CourseEntity } from './entities/course.entity';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([CourseEntity, UserEntity, ChapterEntity]),
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
