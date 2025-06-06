import { Uuid } from '@/common/types/common.type';
import {
  BooleanFieldOptional,
  UUIDFieldOptional,
} from '@/decorators/field.decorators';

export class UpdatePermissionDto {
  @UUIDFieldOptional({ example: 'c42e653b-5549-4be8-b589-55dddc21f32b' })
  roleId: Uuid;

  @UUIDFieldOptional({ example: 'c42e653b-5549-4be8-b589-55dddc21f32b' })
  resourceId: Uuid;

  @BooleanFieldOptional({ example: true })
  canCreate: boolean;

  @BooleanFieldOptional({ example: true })
  canRead: boolean;

  @BooleanFieldOptional({ example: true })
  canUpdate: boolean;

  @BooleanFieldOptional({ example: true })
  canDelete: boolean;
}
