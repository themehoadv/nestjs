import {
  BooleanField,
  EmailField,
  TokenField,
} from '@/decorators/field.decorators';

export class ForgotPassordReqDto {
  @EmailField({ example: 'user@example.com' })
  email!: string;
}

export class ForgotPasswordResDto {
  @TokenField()
  token!: string;
}

export class VerifyForgotPassordReqDto {
  @TokenField()
  token!: string;
}

export class VerifyForgotPassordResDto {
  @BooleanField()
  isValid!: boolean;
}
