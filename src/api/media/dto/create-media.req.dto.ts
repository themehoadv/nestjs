import { Uuid } from '@/common/types/common.type';
import { FileField, UUIDField } from '@/decorators/field.decorators';

export class CreateMediaReqDto {
  @FileField()
  file: Express.Multer.File;

  @UUIDField()
  userId: Uuid;

  // @EnumFieldOptional(() => MediaReferenceType)
  // referenceType?: MediaReferenceType;
}
