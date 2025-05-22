import { EmailField, TokenField } from '@/decorators/field.decorators';
import { Exclude, Expose } from 'class-transformer';

export class VerifyEmailResendReqDto {
  @EmailField({ example: 'user@example.com' })
  email!: string;
}

@Exclude()
export class VerifyEmailResendResDto {
  @Expose()
  @TokenField()
  token!: string;
}
