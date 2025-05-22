import {
  EmailField,
  NumberField,
  PasswordField,
  StringField,
  TokenField,
} from '@/decorators/field.decorators';
import { Exclude, Expose } from 'class-transformer';

export class LoginReqDto {
  @EmailField({ example: 'user@example.com' })
  email!: string;

  @PasswordField()
  password!: string;
}

@Exclude()
export class LoginResDto {
  @Expose()
  @StringField()
  userId!: string;

  @Expose()
  @TokenField()
  accessToken!: string;

  @Expose()
  @TokenField()
  refreshToken!: string;

  @Expose()
  @NumberField()
  tokenExpires!: number;
}
