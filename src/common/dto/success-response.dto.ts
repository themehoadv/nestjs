import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto<T> {
  @ApiProperty({ example: true })
  status: boolean;

  @ApiProperty({ example: 200 })
  code: number;

  @ApiProperty({ example: 'Operation successful' })
  message: string;

  @ApiProperty({ type: () => Object }) // Sẽ được override bởi class con
  data: T;
}

export function createSuccessResponseType<T>(
  type: Type<T>,
): Type<SuccessResponseDto<T>> {
  class SuccessResponseDtoGeneric extends SuccessResponseDto<T> {
    @ApiProperty({ type })
    declare data: T;
  }

  Object.defineProperty(SuccessResponseDtoGeneric, 'name', {
    value: `SuccessResponseDto<${type.name}>`,
  });

  return SuccessResponseDtoGeneric;
}
