import {
  ChapterResDto,
  CreateChapterWithCourseReqDto,
} from '@/api/chapter/dto';
import {
  NumberField,
  NumberFieldOptional,
  StringField,
  StringFieldOptional,
} from '@/decorators/field.decorators';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';

export class CreateCourseReqDto {
  @StringField()
  title: string;

  @StringField()
  slug: string;

  @NumberField()
  price: number;

  @NumberFieldOptional()
  oldPrice?: number;

  @StringFieldOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateChapterWithCourseReqDto)
  chapters?: CreateChapterWithCourseReqDto[];
}

@Exclude()
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
