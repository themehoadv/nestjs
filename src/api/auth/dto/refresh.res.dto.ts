import { NumberField, StringField } from '@/decorators/field.decorators';

export class RefreshResDto {
  @StringField()
  token!: string;

  @StringField()
  refreshToken!: string;

  @NumberField()
  tokenExpires!: number;
}
