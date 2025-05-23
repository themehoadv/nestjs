import {
  EmailFieldOptional,
  StringFieldOptional,
} from '@/decorators/field.decorators';
import { lowerCaseTransformer } from '@/utils/transformers/lower-case.transformer';
import { Transform } from 'class-transformer';

export class UpdateUserReqDto {
  @StringFieldOptional()
  @Transform(lowerCaseTransformer)
  username?: string;

  @EmailFieldOptional()
  @Transform(lowerCaseTransformer)
  email?: string;

  @StringFieldOptional()
  bio?: string;

  @StringFieldOptional()
  image?: string;
}
