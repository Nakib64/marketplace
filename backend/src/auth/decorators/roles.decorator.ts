import { SetMetadata } from '@nestjs/common';
import { AdminRole, Role } from '@prisma/client';

export type AllowedRole = Role | AdminRole | string;

export const ROLES_KEY = 'roles';
export const Roles = (...roles: AllowedRole[]) => SetMetadata(ROLES_KEY, roles);
