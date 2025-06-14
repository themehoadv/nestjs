import { Uuid } from '@/common/types/common.type';

export type JwtRefreshPayloadType = {
  id: Uuid;
  roleId: Uuid;
  iat: number;
  exp: number;
};
