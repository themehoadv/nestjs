import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class SuccessDto<TData> {
  @ApiProperty({ example: 200 })
  @Expose()
  readonly code: number;

  @ApiProperty({ example: 'Success' })
  @Expose()
  readonly message: string;

  @ApiProperty({ example: true })
  @Expose()
  readonly success: boolean;

  @ApiProperty({ type: Object as () => TData })
  @Expose()
  @Type((options) => {
    return (
      (options?.newObject as SuccessDto<TData>)?.result?.constructor || Object
    );
  })
  readonly result: TData;

  constructor(result: TData, code = 200, message = 'Success', success = true) {
    this.code = code;
    this.result = result;
    this.message = message;
    this.success = success;
  }
}
