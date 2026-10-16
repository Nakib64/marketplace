# Phase 11: Admin Trust, Safety & User Moderation

## 1. Purpose
The purpose of Phase 11 is to provide administrators with enterprise-grade **Trust, Safety & Customer Support** capabilities. Marketplace security requires monitoring accounts, identifying bad actors, applying account sanctions (banning/unbanning), manual verification overrides for OTP deliverability problems, and issuing secure, audited **Impersonation JWT Tokens** for customer support assistance.

---

## 2. What To Do
- [x] Create `AdminUsersController`, `AdminUsersQueryService`, and `AdminUsersActionsService` inside `src/admin/`.
- [x] Implement `UserQueryDto`:
  - `role?`: `@IsOptional()`, `@IsEnum(Role)`.
  - `isBanned?`: `@IsOptional()`, `@IsBoolean()`.
  - `search?`: `@IsOptional()`, `@IsString()` (search by email).
  - `page?`: `@IsOptional()`, `@Type(() => Number)`, `@Min(1)`.
  - `limit?`: `@IsOptional()`, `@Type(() => Number)`, `@Min(1)`, `@Max(50)`.
- [x] Implement `UpdateUserStatusDto`:
  - `isBanned`: `@IsBoolean()`.
  - `reason?`: `@IsOptional()`, `@IsString()`, `@MaxLength(500)`.
- [x] Implement `GET /admin/users` (Restricted to `ADMIN` role):
  - Paginated user list with role, ban status, and search filters.
  - Return lifetime stats: `clientProfile.totalSpent`, `freelancerProfile.earnings`, `walletBalance`.
- [x] Implement `GET /admin/users/:id` (Restricted to `ADMIN` role):
  - Complete user profile dossier including posted jobs, contracts, proposals, withdrawals, and reviews.
- [x] Implement `PATCH /admin/users/:id/status` (Restricted to `ADMIN` role):
  - Toggle user `isBanned` flag.
  - Prevent self-banning (admin cannot ban their own account).
  - Immediately invalidates access in authentication checks.
- [x] Implement `PATCH /admin/users/:id/verify` (Restricted to `ADMIN` role):
  - Manually override `isEmailVerified: true` for users with delivery issues.
- [x] Implement `POST /admin/users/:id/impersonate` (Restricted to `ADMIN` role):
  - Generates a signed, temporary JWT token (1-hour expiration) with payload:
    `{ id: targetUser.id, email: targetUser.email, role: targetUser.role, isImpersonated: true, impersonatedBy: adminId }`.
  - Enables customer support agents to view the app through the client/freelancer's eyes.
- [x] Write unit & integration tests covering user queries, self-ban prevention, sanction toggling, and impersonation token payload verification.

---

## 3. How To Do It (Implementation Details)

### A. Modular Sub-Service Architecture inside `src/admin/users/`
```
src/admin/users/
├── dto/
│   ├── user-query.dto.ts                 # Filtering & pagination schema (~30 lines)
│   └── update-user-status.dto.ts         # Ban/unban sanction schema (~15 lines)
├── controllers/
│   └── admin-users.controller.ts         # User directory, sanctions, verification & impersonation routes (~50 lines)
├── services/
│   ├── admin-users-query.service.ts      # User filtering, pagination & dossier retrieval (~60 lines)
│   └── admin-users-actions.service.ts    # Sanctions, email verify & impersonation JWT signing (~65 lines)
├── admin-users.module.ts                 # Dedicated Users Moderation submodule
└── admin-users.service.spec.ts           # Vitest unit test suite
```


### B. Validation Schemas (`dto/`)
```ts
import { Role } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class UserQueryDto {
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isBanned?: boolean;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 20;
}

export class UpdateUserStatusDto {
  @IsBoolean()
  isBanned: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
```

### C. Impersonation & Sanction Logic (`admin-users.service.ts`)
```ts
@Injectable()
export class AdminUsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Search and filter user directory with aggregated financials.
   */
  async getUsers(query: UserQueryDto) {
    const { role, isBanned, search, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      ...(role ? { role } : {}),
      ...(isBanned !== undefined ? { isBanned } : {}),
      ...(search ? { email: { contains: search, mode: 'insensitive' } } : {}),
    };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          role: true,
          isEmailVerified: true,
          isBanned: true,
          walletBalance: true,
          createdAt: true,
          clientProfile: { select: { companyName: true, totalSpent: true, totalJobPosts: true } },
          freelancerProfile: { select: { hourlyRate: true, earnings: true, totalProjects: true, successRate: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Applies ban or unban sanctions.
   */
  async updateUserStatus(adminId: string, targetUserId: string, dto: UpdateUserStatusDto) {
    if (adminId === targetUserId) {
      throw new BadRequestException('Administrators cannot sanction their own account.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: targetUserId },
      data: { isBanned: dto.isBanned },
      select: { id: true, email: true, role: true, isBanned: true },
    });

    return {
      message: dto.isBanned ? 'User has been banned.' : 'User ban has been lifted.',
      user: updatedUser,
      reason: dto.reason,
    };
  }

  /**
   * Issues a signed impersonation token for customer support.
   */
  async generateImpersonationToken(adminId: string, targetUserId: string) {
    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      throw new NotFoundException('Target user for impersonation not found.');
    }
    if (targetUser.role === Role.ADMIN) {
      throw new BadRequestException('Cannot impersonate another administrator.');
    }

    const payload = {
      sub: targetUser.id,
      email: targetUser.email,
      role: targetUser.role,
      isImpersonated: true,
      impersonatedBy: adminId,
    };

    const accessToken = await this.jwtService.signAsync(payload, { expiresIn: '1h' });

    return {
      accessToken,
      impersonatedUser: {
        id: targetUser.id,
        email: targetUser.email,
        role: targetUser.role,
      },
      expiresIn: '1h',
    };
  }
}
```

---

## 4. Status & What Is Done
- [x] `UserQueryDto` and `UpdateUserStatusDto`: **Completed**
- [x] `GET /admin/users` (Paginated search with financial stats): **Completed**
- [x] `GET /admin/users/:id` (Full user dossier): **Completed**
- [x] `PATCH /admin/users/:id/status` (Ban/unban toggle with self-ban protection): **Completed**
- [x] `PATCH /admin/users/:id/verify` (Manual email verification override): **Completed**
- [x] `POST /admin/users/:id/impersonate` (Signed support JWT issuance): **Completed**
- [x] Vitest unit test suite (query filtering, ban safety & impersonation tokens): **Completed**
- [x] TypeScript compilation (`npm run build` 0 errors): **Completed**
