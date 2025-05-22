import { Uuid } from '@/common/types/common.type';
import {
  DateField,
  EnumFieldOptional,
  StringField,
  URLFieldOptional,
  UUIDField,
} from '@/decorators/field.decorators';
import { Exclude, Expose } from 'class-transformer';
import { MediaReferenceType } from '../entities/media.entity';

@Exclude()
export class MediaResDto {
  @Expose()
  @UUIDField()
  id: string;

  @Expose()
  @StringField()
  originalName: string;

  @Expose()
  @StringField()
  fileName: string;

  @Expose()
  @StringField()
  path: string;

  @Expose()
  @URLFieldOptional()
  url?: string;

  @Expose()
  @StringField()
  mimeType: string;

  @Expose()
  @EnumFieldOptional(() => MediaReferenceType)
  referenceType?: MediaReferenceType;

  @Expose()
  @URLFieldOptional()
  referenceId?: Uuid;

  @StringField()
  @Expose()
  createdBy: string;

  @StringField()
  @Expose()
  updatedBy: string;

  @DateField()
  @Expose()
  createdAt: Date;

  @DateField()
  @Expose()
  updatedAt: Date;
}
