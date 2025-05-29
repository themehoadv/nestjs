import { Uuid } from '@/common/types/common.type';

export type JwtRefreshPayloadType = {
  id: Uuid;
  iat: number;
  exp: number;
};
