import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

export function RoleGuard(roles: string[]) {
  @Injectable()
  class RolesGuard implements CanActivate {
    constructor() {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      if (roles.includes('user')) {
        const userId = request.params.id;
        if (request.user.id === +userId || roles.includes(request.user.role)) {
          return true;
        } else {
          throw new UnauthorizedException();
        }
      } else if (roles.includes(request.user.role)) {
        return true;
      }
      throw new UnauthorizedException();
    }
  }

  return RolesGuard;
}
