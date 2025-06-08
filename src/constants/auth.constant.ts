import { HttpStatus } from '@nestjs/common';

export const RESOURCE_KEY = 'resource';
export const ACTION_KEY = 'action';

export const DEFAULT_PAGINATION_TYPE: PaginationType = 'offset';
export const DEFAULT_STATUS_CODE = HttpStatus.OK;

export const RESPONSE_MESSAGE_KEY = 'responseMessage';
export const RESPONSE_CODE_KEY = 'responseCode';

export type ApiResponseType = number;
export type ApiAuthType = 'basic' | 'api-key' | 'jwt';
export type PaginationType = 'offset' | 'cursor';
export type PermissionActionType = 'read' | 'create' | 'update' | 'delete';

// Export metadata keys for use in interceptor
export const API_RESPONSE_METADATA = {
  MESSAGE: RESPONSE_MESSAGE_KEY,
  CODE: RESPONSE_CODE_KEY,
  RESOURCE: RESOURCE_KEY,
  ACTION: ACTION_KEY,
};

export const DEFAULT_ERROR_RESPONSES: ApiResponseType[] = [
  HttpStatus.BAD_REQUEST,
  // HttpStatus.FORBIDDEN,
  // HttpStatus.NOT_FOUND,
  // HttpStatus.UNPROCESSABLE_ENTITY,
  // HttpStatus.INTERNAL_SERVER_ERROR,
];

export const PERMISSION_ACTION: Record<
  Uppercase<PermissionActionType>,
  PermissionActionType
> = {
  READ: 'read',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
};

export const RESOURCE_NAME = {
  USER: 'user',
  ROLE: 'role',
  PERMISSION: 'permission',
  BLOG: 'blog',
};
