import { Uuid } from '@/common/types/common.type';

export type JwtPayloadType = {
  id: Uuid;
  roleId: Uuid;
  iat: number;
  exp: number;
};
