import { EmailField, PasswordField } from '@/decorators/field.decorators';

export class LoginReqDto {
  @EmailField({ example: 'admin@example.com' })
  email!: string;

  @PasswordField({ example: '12345678' })
  password!: string;
}
