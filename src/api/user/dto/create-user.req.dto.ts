import {
  EmailField,
  PasswordField,
  StringField,
  StringFieldOptional,
} from '@/decorators/field.decorators';
import { lowerCaseTransformer } from '@/utils/transformers/lower-case.transformer';
import { Transform } from 'class-transformer';

export class CreateUserReqDto {
  @StringField({ example: 'user1' })
  @Transform(lowerCaseTransformer)
  username: string;

  @EmailField({ example: 'user@example.com' })
  email: string;

  @PasswordField({ example: '12345678' })
  password: string;

  @StringFieldOptional({ example: "I'm a backend developer" })
  bio?: string;

  @StringFieldOptional({ example: 'https://i.pravatar.cc/150?img=5' })
  avatar?: string;
}
