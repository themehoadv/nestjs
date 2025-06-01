import { PostResDto } from '@/api/post/dto/post.res.dto';
import { Uuid } from '@/common/types/common.type';
import { WrapperType } from '@/common/types/types';
import {
  ClassField,
  StringField,
  StringFieldOptional,
  UUIDField,
} from '@/decorators/field.decorators';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
class UserRoleResDto {
  @StringField()
  @Expose()
  name: string;

  @StringField()
  @Expose()
  code: string;
}

@Exclude()
export class UserResDto {
  @UUIDField()
  @Expose()
  id: Uuid;

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
  avatar: string;

  @UUIDField()
  @Expose()
  roleId: Uuid;

  @ClassField(() => UserRoleResDto)
  @Expose()
  role: WrapperType<UserRoleResDto>;

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
