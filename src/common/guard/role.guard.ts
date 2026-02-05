import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/entities/user.entity';
import { AuthenticatedRequest } from 'src/type/common.type';
import { ROLES_KEY } from '../decorator/role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<UserRole>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!requiredRole) {
      return true; // No roles required, allow access
    }
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;
    return user && user.role === requiredRole;
  }
}
