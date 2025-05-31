import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { PageOptionsDto } from './page-options.dto';

export class OffsetListDto<TData> {
  @ApiProperty()
  @Expose()
  readonly limit: number;

  @ApiProperty()
  @Expose()
  readonly current: number;

  @ApiProperty()
  @Expose()
  readonly total: number;

  @ApiProperty()
  @Expose()
  readonly totalPages: number;

  @ApiProperty({ type: [Object] })
  @Expose()
  readonly list: TData[];

  constructor(
    data: TData[],
    totalRecords: number,
    pageOptions: PageOptionsDto,
  ) {
    this.list = data;
    this.limit = pageOptions.limit;
    this.current = pageOptions.page;
    this.total = totalRecords;
    this.totalPages =
      this.limit > 0 ? Math.ceil(totalRecords / pageOptions.limit) : 0;
  }
}
