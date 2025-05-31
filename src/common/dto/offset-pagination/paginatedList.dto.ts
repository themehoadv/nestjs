import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { OffsetListDto } from './offset-list.dto';

export class OffsetPaginatedListDto<TData> {
  @ApiProperty({ example: 200 })
  @Expose()
  readonly code: number;

  @ApiProperty({ example: 'Success' })
  @Expose()
  readonly message: string;

  @ApiProperty({ example: true })
  @Expose()
  readonly success: boolean;

  @ApiProperty({ type: [Object] })
  @Expose()
  result: OffsetListDto<TData>;

  constructor(
    result: OffsetListDto<TData>,
    code = 200,
    message = 'Success',
    success = true,
  ) {
    this.code = code;
    this.message = message;
    this.success = success;
    this.result = result;
  }
}
