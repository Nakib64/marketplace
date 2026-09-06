import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminRole, Role } from '@prisma/client';
import { AllowedRole, ROLES_KEY } from '../decorators/roles.decorator.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<AllowedRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) {
      throw new ForbiddenException('Access denied. User role not resolved.');
    }

    // Direct match
    if (requiredRoles.includes(user.role)) {
      return true;
    }

    // If the authenticated entity is an Admin:
    if (user.userType === 'ADMIN') {
      // SUPER_ADMIN has full permissions across all admin routes
      if (user.role === AdminRole.SUPER_ADMIN) {
        return true;
      }
      // If the route allows general admin access (e.g. 'ADMIN', AdminRole.ADMIN, or Role.ADMIN)
      if (
        requiredRoles.includes('ADMIN') ||
        requiredRoles.includes(AdminRole.ADMIN) ||
        requiredRoles.includes(Role.ADMIN)
      ) {
        return true;
      }
    }

    throw new ForbiddenException(
      `Forbidden resource. Requires one of roles: [${requiredRoles.join(', ')}]`,
    );
  }
}
