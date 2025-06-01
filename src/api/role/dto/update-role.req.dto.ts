import { StringFieldOptional } from '@/decorators/field.decorators';
import { lowerCaseTransformer } from '@/utils/transformers/lower-case.transformer';
import { Transform } from 'class-transformer';

export class UpdateRoleReqDto {
  @StringFieldOptional({ example: 'Người dùng' })
  name!: string;

  @StringFieldOptional({ example: 'common' })
  @Transform(lowerCaseTransformer)
  code!: string;

  @StringFieldOptional({ example: 'Người dùng thông thường' })
  remark: string;
}
