import { BlogResDto } from '@/api/blog/dto';
import { CourseResDto } from '@/api/course/dto';
import {
  ClassField,
  DateField,
  StringField,
  StringFieldOptional,
} from '@/decorators/field.decorators';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class SessionResDto {
  @StringField()
  @Expose()
  id: string;

  @DateField()
  @Expose()
  createdAt: Date;
}

@Exclude()
export class UserResDto {
  @StringField()
  @Expose()
  id: string;

  @StringField()
  @Expose()
  username: string;

  @StringField()
  @Expose()
  email: string;

  @StringFieldOptional()
  @Expose()
  bio?: string;

  @StringField()
  @Expose()
  image: string;

  @ClassField(() => Date)
  @Expose()
  createdAt: Date;

  @ClassField(() => Date)
  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => BlogResDto)
  blogs?: BlogResDto[];

  @Expose()
  @Type(() => CourseResDto)
  courses?: CourseResDto[];

  @Expose()
  @Type(() => SessionResDto)
  sessions?: SessionResDto[];
}
