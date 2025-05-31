import { ErrorDto } from '@/common/dto/error.dto';
import {
  HttpCode,
  HttpStatus,
  type Type,
  applyDecorators,
} from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { STATUS_CODES } from 'http';
import { Public } from './public.decorator';
import { ApiPaginatedResponse } from './swagger.decorators';

const DEFAULT_PAGINATION_TYPE: PaginationType = 'offset';
const DEFAULT_STATUS_CODE = HttpStatus.OK;

type ApiResponseType = number;
type ApiAuthType = 'basic' | 'api-key' | 'jwt';
type PaginationType = 'offset' | 'cursor';

interface IApiOptions<T extends Type<any>> {
  type?: T;
  summary?: string;
  description?: string;
  errorResponses?: ApiResponseType[];
  statusCode?: HttpStatus;
  isPaginated?: boolean;
  paginationType?: PaginationType;
}

type IApiPublicOptions<T extends Type<any>> = IApiOptions<T>;

interface IApiAuthOptions<T extends Type<any>> extends IApiOptions<T> {
  auths?: ApiAuthType[];
}
const DEFAULT_ERROR_RESPONSES: ApiResponseType[] = [
  HttpStatus.BAD_REQUEST,
  // HttpStatus.FORBIDDEN,
  // HttpStatus.NOT_FOUND,
  // HttpStatus.UNPROCESSABLE_ENTITY,
  // HttpStatus.INTERNAL_SERVER_ERROR,
];
const createSuccessResponse = <T extends Type<any>>(options: {
  type?: T;
  description?: string;
  paginationType?: PaginationType;
}) => ({
  type: options.type,
  description: options?.description ?? 'OK',
  paginationType: options.paginationType || DEFAULT_PAGINATION_TYPE,
});

const createErrorResponses = (
  errorCodes: ApiResponseType[] = DEFAULT_ERROR_RESPONSES,
) => {
  return errorCodes.map((statusCode) =>
    ApiResponse({
      status: statusCode,
      type: ErrorDto,
      description: STATUS_CODES[statusCode],
    }),
  );
};

export const ApiPublic = <T extends Type<any>>(
  options: IApiPublicOptions<T> = {},
): MethodDecorator => {
  const {
    type,
    summary,
    description,
    errorResponses = DEFAULT_ERROR_RESPONSES,
    statusCode = DEFAULT_STATUS_CODE,
    isPaginated = false,
    paginationType = DEFAULT_PAGINATION_TYPE,
  } = options;

  const successResponse = createSuccessResponse({
    type,
    description,
    paginationType,
  });
  const errorResponseDecorators = createErrorResponses(errorResponses);

  return applyDecorators(
    Public(),
    ApiOperation({ summary }),
    HttpCode(statusCode),
    isPaginated
      ? ApiPaginatedResponse(successResponse)
      : ApiOkResponse(successResponse),
    ...errorResponseDecorators,
  );
};

export const ApiAuth = <T extends Type<any>>(
  options: IApiAuthOptions<T> = {},
): MethodDecorator => {
  const {
    type,
    summary,
    description,
    errorResponses = DEFAULT_ERROR_RESPONSES,
    statusCode = DEFAULT_STATUS_CODE,
    isPaginated = false,
    paginationType = DEFAULT_PAGINATION_TYPE,
    auths = ['jwt'] as ApiAuthType[],
  } = options;

  const successResponse = createSuccessResponse({
    type,
    description,
    paginationType,
  });
  const errorResponseDecorators = createErrorResponses(errorResponses);
  const authDecorators = createAuthDecorators(auths);

  const successResponseDecorator = getSuccessResponseDecorator(
    statusCode,
    isPaginated,
    successResponse,
  );

  return applyDecorators(
    ApiOperation({ summary }),
    HttpCode(statusCode),
    successResponseDecorator,
    ...authDecorators,
    ...errorResponseDecorators,
  );
};

// Helper functions
const createAuthDecorators = (auths: ApiAuthType[]) => {
  return auths.map((auth) => {
    switch (auth) {
      case 'basic':
        return ApiBasicAuth();
      case 'api-key':
        return ApiSecurity('Api-Key');
      case 'jwt':
      default:
        return ApiBearerAuth();
    }
  });
};

const getSuccessResponseDecorator = (
  statusCode: HttpStatus,
  isPaginated: boolean,
  successResponse: any,
) => {
  if (isPaginated) {
    return ApiPaginatedResponse(successResponse);
  }
  return statusCode === HttpStatus.CREATED
    ? ApiCreatedResponse(successResponse)
    : ApiOkResponse(successResponse);
};
