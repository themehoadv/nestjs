import { ErrorDto } from '@/common/dto/error.dto';
import { createSuccessResponseType } from '@/common/dto/success-response.dto';
import {
  ACTION_KEY,
  ApiAuthType,
  ApiResponseType,
  DEFAULT_ERROR_RESPONSES,
  DEFAULT_PAGINATION_TYPE,
  DEFAULT_STATUS_CODE,
  PaginationType,
  RESOURCE_KEY,
  RESPONSE_CODE_KEY,
  RESPONSE_MESSAGE_KEY,
} from '@/constants/auth.constant';
import {
  applyDecorators,
  HttpCode,
  HttpStatus,
  SetMetadata,
  type Type,
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

interface IApiOptions<T extends Type<any>> {
  type?: T; // Type của data (không phải của toàn bộ response)
  summary?: string;
  description?: string;
  errorResponses?: ApiResponseType[];
  statusCode?: HttpStatus;
  isPaginated?: boolean;
  paginationType?: PaginationType;
  successMessage?: string;
  resource?: string;
  action?: 'create' | 'read' | 'update' | 'delete';
}

type IApiPublicOptions<T extends Type<any>> = IApiOptions<T>;

interface IApiAuthOptions<T extends Type<any>> extends IApiOptions<T> {
  auths?: ApiAuthType[];
}

const createSuccessResponse = <T extends Type<any>>(options: {
  type?: T;
  description?: string;
  paginationType?: PaginationType;
}) => {
  const responseType = options.type
    ? createSuccessResponseType(options.type)
    : undefined;

  return {
    type: responseType,
    description: options?.description ?? 'OK',
    paginationType: options.paginationType || DEFAULT_PAGINATION_TYPE,
  };
};

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
    successMessage = description,
    resource,
    action,
  } = options;

  const successResponse = createSuccessResponse({
    type,
    description,
    paginationType,
  });
  const errorResponseDecorators = createErrorResponses(errorResponses);

  const decorators = [
    Public(),
    SetMetadata(RESPONSE_MESSAGE_KEY, successMessage),
    SetMetadata(RESPONSE_CODE_KEY, statusCode),
    ApiOperation({ summary }),
    HttpCode(statusCode),
    isPaginated
      ? ApiPaginatedResponse(successResponse)
      : ApiOkResponse(successResponse),
    ...errorResponseDecorators,
  ];

  if (resource) {
    decorators.push(SetMetadata(RESOURCE_KEY, resource));
  }
  if (action) {
    decorators.push(SetMetadata(ACTION_KEY, action));
  }

  return applyDecorators(...decorators);
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
    successMessage = description,
    resource,
    action,
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

  const decorators = [
    SetMetadata(RESPONSE_MESSAGE_KEY, successMessage),
    SetMetadata(RESPONSE_CODE_KEY, statusCode),
    ApiOperation({ summary }),
    HttpCode(statusCode),
    successResponseDecorator,
    ...authDecorators,
    ...errorResponseDecorators,
  ];

  if (resource) {
    decorators.push(SetMetadata(RESOURCE_KEY, resource));
  }
  if (action) {
    decorators.push(SetMetadata(ACTION_KEY, action));
  }

  return applyDecorators(...decorators);
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
