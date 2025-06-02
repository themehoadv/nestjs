// permission.guard.ts
import { PermissionAction } from '@/api/permission/entities/permission.entity';
import { PERMISSIONS_KEY } from '@/decorators/permissions.decorator';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const [action, entity] = this.reflector.get<[PermissionAction, string]>(
      PERMISSIONS_KEY,
      context.getHandler(),
    ) || [null, null];

    if (!action || !entity) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.role?.permissions) {
      return false;
    }

    return user.role.permissions.some(
      (permission) =>
        permission.entity === entity &&
        (permission.actions.includes(action) ||
          permission.actions.includes(PermissionAction.MANAGE)),
    );
  }
}
