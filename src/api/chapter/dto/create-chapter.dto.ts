import { Uuid } from '@/common/types/common.type';
import {
  NumberFieldOptional,
  StringField,
  UUIDField,
} from '@/decorators/field.decorators';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class CreateLessonDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsNumber()
  @IsOptional()
  order?: number;
}

export class LessonResDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description?: string;

  @Expose()
  content: string;

  @Expose()
  order: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

export class CreateChapterWithCourseReqDto {
  @StringField()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @NumberFieldOptional()
  order?: number;
}

export class CreateChapterReqDto {
  @UUIDField()
  courseId: Uuid;

  @StringField()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @NumberFieldOptional()
  order?: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateLessonDto)
  lessons?: CreateLessonDto[];
}

export class ChapterResDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description?: string;

  @Expose()
  order?: number;

  @Expose()
  @Type(() => LessonResDto)
  lessons?: LessonResDto[];
}
