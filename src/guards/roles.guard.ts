import { RoleType } from '@/constants/role-type';
import { ROLES_KEY } from '@/decorators/roles.decorator';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,

      [context.getClass(), context.getHandler()],
    );
    if (!roles) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<{ user: { role: string } }>();

    const user = request.user;

    if (!user?.role) {
      throw new ForbiddenException('User does not have any role assigned');
    }

    const requiredRoles = [...roles, RoleType.Admin];
    const hasPermission = requiredRoles.includes(user.role);

    if (!hasPermission) {
      throw new ForbiddenException(
        `Requires roles: ${requiredRoles.join(', ')}. Your role: ${user.role}`,
      );
    }

    return true;
  }
}
