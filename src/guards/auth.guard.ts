import { AuthService } from '@/api/auth/auth.service';
import { PermissionService } from '@/api/permission/permission.service';
import { IS_AUTH_OPTIONAL, IS_PUBLIC } from '@/constants/app.constant';
import {
  ACTION_KEY,
  PermissionActionType,
  RESOURCE_KEY,
} from '@/constants/auth.constant';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
    private permissionService: PermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Kiểm tra endpoint public
    if (this.isPublicEndpoint(context)) {
      return true;
    }

    // Xác thực token
    const user = await this.authenticateRequest(request);
    request.user = user;

    // Lấy thông tin resource và action
    const { resource, action } = this.getResourceAndAction(context);

    // Log debug (có thể bỏ trong production)
    this.logDebugInfo(resource, action);

    if (!resource || !action) {
      return true;
    }
    return await this.permissionService.checkPermission(user, resource, action);
  }

  private isPublicEndpoint(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);

    const isAuthOptional = this.reflector.getAllAndOverride<boolean>(
      IS_AUTH_OPTIONAL,
      [context.getHandler(), context.getClass()],
    );

    const accessToken = this.extractTokenFromHeader(
      context.switchToHttp().getRequest(),
    );

    return isPublic || (isAuthOptional && !accessToken);
  }

  private async authenticateRequest(request: Request) {
    const accessToken = this.extractTokenFromHeader(request);

    if (!accessToken) {
      throw new UnauthorizedException('Missing authentication token');
    }

    try {
      return await this.authService.verifyAccessToken(accessToken);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private getResourceAndAction(context: ExecutionContext) {
    return {
      resource: this.reflector.getAllAndOverride<string>(RESOURCE_KEY, [
        context.getClass(),
        context.getHandler(),
      ]),
      action: this.reflector.getAllAndOverride<PermissionActionType>(
        ACTION_KEY,
        [context.getClass(), context.getHandler()],
      ),
    };
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private logDebugInfo(resource?: string, action?: string) {
    if (process.env.NODE_ENV === 'development') {
      console.debug({
        action,
        resource,
        message:
          resource && action
            ? `Checking ${action} permission for ${resource}`
            : 'No resource/action metadata provided',
      });
    }
  }
}
