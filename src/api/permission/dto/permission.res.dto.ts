import { Uuid } from '@/common/types/common.type';
import { WrapperType } from '@/common/types/types';
import {
  BooleanField,
  ClassField,
  StringField,
  UUIDField,
} from '@/decorators/field.decorators';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
class RoleResDto {
  @UUIDField()
  @Expose()
  id: Uuid;

  @StringField()
  @Expose()
  name: string;

  @StringField()
  @Expose()
  code: string;
}

@Exclude()
class ResourceResDto {
  @UUIDField()
  @Expose()
  id: Uuid;

  @StringField()
  @Expose()
  name: string;
}

@Exclude()
export class PermissionResDto {
  @UUIDField()
  @Expose()
  id: Uuid;

  @ClassField(() => RoleResDto)
  @Expose()
  role: WrapperType<RoleResDto>;

  @ClassField(() => ResourceResDto)
  @Expose()
  resource: WrapperType<ResourceResDto>;

  @BooleanField()
  @Expose()
  canCreate: boolean;

  @BooleanField()
  @Expose()
  canDelete: boolean;

  @BooleanField()
  @Expose()
  canRead: boolean;

  @BooleanField()
  @Expose()
  canUpdate: boolean;

  @ClassField(() => Date)
  @Expose()
  createdAt: Date;

  @ClassField(() => Date)
  @Expose()
  updatedAt: Date;
}
