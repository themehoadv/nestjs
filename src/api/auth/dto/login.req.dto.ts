import { PasswordField, StringField } from '@/decorators/field.decorators';

export class LoginReqDto {
  @StringField({ example: 'admin' })
  username!: string;

  @PasswordField({ example: '123456789admin' })
  password!: string;
}
