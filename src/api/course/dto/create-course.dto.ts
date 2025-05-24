import {
  NumberField,
  NumberFieldOptional,
  StringField,
} from '@/decorators/field.decorators';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateChapterDto {
  @StringField()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  order?: number;
}

export class CreateCourseReqDto {
  @StringField()
  title: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @NumberField()
  price: number;

  @NumberFieldOptional()
  oldPrice?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateChapterDto)
  chapters?: CreateChapterDto[];
}

export class ChapterResDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description?: string;

  @Expose()
  order: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

export class CourseResDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  slug: string;

  @Expose()
  price: number;

  @Expose()
  oldPrice?: number;

  @Expose()
  description?: string;

  @Expose()
  @Type(() => ChapterResDto)
  chapters?: ChapterResDto[];
}
