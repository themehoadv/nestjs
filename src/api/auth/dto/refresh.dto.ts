import { NumberField, TokenField } from '@/decorators/field.decorators';

export class RefreshReqDto {
  @TokenField()
  refreshToken!: string;
}

export class RefreshResDto {
  @TokenField()
  accessToken!: string;

  @TokenField()
  refreshToken!: string;

  @NumberField()
  tokenExpires!: number;
}
