import { URLField } from '@/decorators/field.decorators';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class MediaResDto {
  @URLField()
  @Expose()
  url: string;
}
