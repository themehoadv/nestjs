import { PermissionResDto } from '@/api/permission/dto';
import { Uuid } from '@/common/types/common.type';
import { WrapperType } from '@/common/types/types';
import {
  ClassField,
  StringField,
  UUIDField,
} from '@/decorators/field.decorators';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RoleResDto {
  @UUIDField()
  @Expose()
  id: Uuid;

  @StringField()
  @Expose()
  name: string;

  @StringField()
  @Expose()
  code: string;

  @StringField()
  @Expose()
  remark: string;

  @ClassField(() => PermissionResDto)
  @Expose()
  permissions?: WrapperType<PermissionResDto[]>;

  @ClassField(() => Date)
  @Expose()
  createdAt: Date;

  @ClassField(() => Date)
  @Expose()
  updatedAt: Date;
}
