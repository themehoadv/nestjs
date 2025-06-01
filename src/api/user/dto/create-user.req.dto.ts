import { Uuid } from '@/common/types/common.type';
import {
  EmailField,
  PasswordField,
  StringField,
  StringFieldOptional,
  UUIDFieldOptional,
} from '@/decorators/field.decorators';
import { lowerCaseTransformer } from '@/utils/transformers/lower-case.transformer';
import { Transform } from 'class-transformer';

export class CreateUserReqDto {
  @StringField({ example: 'user1' })
  @Transform(lowerCaseTransformer)
  username: string;

  @EmailField({ example: 'user1@example.com' })
  email: string;

  @PasswordField({ example: '123456789user' })
  password: string;

  @StringFieldOptional({ example: "I'm a backend developer" })
  bio?: string;

  @StringFieldOptional({ example: 'https://i.pravatar.cc/150?img=5' })
  avatar?: string;

  @UUIDFieldOptional({ example: '13d4f96e-f32c-459a-bd9d-d612bdf2ffa2' })
  roleId?: Uuid;
}
