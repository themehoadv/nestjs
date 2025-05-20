import {
  PasswordField,
  StringField,
  TokenField,
} from '@/decorators/field.decorators';

export class ResetPasswordReqDto {
  @TokenField()
  token!: string;

  @PasswordField()
  password!: string;
}

export class ResetPasswordResDto {
  @StringField({ example: 'Password has been reset successfully' })
  message!: string;
}
