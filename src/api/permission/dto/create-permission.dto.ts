import { Uuid } from '@/common/types/common.type';
import { BooleanField, UUIDField } from '@/decorators/field.decorators';

export class CreatePermissionDto {
  @UUIDField({ example: 'c42e653b-5549-4be8-b589-55dddc21f32b' })
  roleId: Uuid;

  @UUIDField({ example: 'c42e653b-5549-4be8-b589-55dddc21f32b' })
  resourceId: Uuid;

  @BooleanField({ example: true })
  canCreate: boolean;

  @BooleanField({ example: true })
  canRead: boolean;

  @BooleanField({ example: true })
  canUpdate: boolean;

  @BooleanField({ example: true })
  canDelete: boolean;
}
