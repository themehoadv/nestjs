import {
  EmailField,
  PasswordField,
  StringField,
  TokenField,
} from '@/decorators/field.decorators';
import { Exclude, Expose } from 'class-transformer';

export class RegisterReqDto {
  @EmailField({ example: 'user@example.com' })
  email!: string;

  @PasswordField()
  password!: string;
}

@Exclude()
export class RegisterResDto {
  @Expose()
  @StringField()
  userId!: string;

  @Expose()
  @TokenField()
  token!: string;
}
