import { PostResDto } from '@/api/post/dto/post.res.dto';
import { WrapperType } from '@/common/types/types';
import { RoleType } from '@/constants/role-type';
import {
  ClassField,
  EnumField,
  StringField,
  StringFieldOptional,
} from '@/decorators/field.decorators';
import { Exclude, Expose } from 'class-transformer';

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

  @EnumField(() => RoleType)
  @Expose()
  role: string;

  @StringFieldOptional()
  @Expose()
  bio?: string;

  @StringField()
  @Expose()
  avatar: string;

  @ClassField(() => PostResDto)
  @Expose()
  posts?: WrapperType<PostResDto[]>;

  @ClassField(() => Date)
  @Expose()
  createdAt: Date;

  @ClassField(() => Date)
  @Expose()
  updatedAt: Date;
}
