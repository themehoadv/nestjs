import { EmailField, PasswordField } from '@/decorators/field.decorators';

export class RegisterReqDto {
  @EmailField({ example: 'user@example.com' })
  email!: string;

  @PasswordField({ example: '123456789user' })
  password!: string;
}
