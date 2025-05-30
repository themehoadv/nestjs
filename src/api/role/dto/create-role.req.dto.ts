import {
  StringField,
  StringFieldOptional,
} from '@/decorators/field.decorators';
import { upperCaseTransformer } from '@/utils/transformers/upper-case.transformer';
import { Transform } from 'class-transformer';

export class CreateRoleReqDto {
  @StringField({ example: 'USER' })
  @Transform(upperCaseTransformer)
  name: string;

  @StringFieldOptional({ example: 'Người dùng thông thường' })
  description: string;
}
