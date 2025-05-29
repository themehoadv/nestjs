import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SuccessDto<TData> {
  @ApiProperty()
  @Expose()
  readonly code: number;

  @ApiProperty({ type: [Object] })
  @Expose()
  readonly result: TData;

  @ApiProperty()
  @Expose()
  readonly message: string;

  @ApiProperty()
  @Expose()
  readonly success: boolean;

  constructor(result: TData, code = 200, message = 'Success', success = true) {
    this.code = code;
    this.result = result;
    this.message = message;
    this.success = success;
  }
}
