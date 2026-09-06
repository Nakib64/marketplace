# Phase 14: Admin RBAC & Staff Team Management

## 1. Purpose
The purpose of Phase 14 is to enforce the **Principle of Least Privilege** across administrative personnel. As a startup scales, granting every internal employee universal database and treasury access is a catastrophic security risk. This module establishes granular role-based access control (RBAC) separating Super Admins, Financial Auditors, Dispute Arbiters, and Customer Support Agents, with full lifecycle management (inviting staff, editing permissions, revoking access).

---

## 2. What To Do
- [ ] Update `schema.prisma` with `AdminRole` enum and `AdminProfile` model:
  - `AdminRole`: `SUPER_ADMIN`, `FINANCE_AUDITOR`, `DISPUTE_ARBITER`, `SUPPORT_AGENT`.
  - `AdminProfile`: Links to `User`, stores assigned `AdminRole`, department, and creator ID.
- [ ] Implement `@AdminRoles(...)` decorator and `AdminRolesGuard`.
- [ ] Implement `CreateAdminStaffDto`:
  - `email`: `@IsEmail()`.
  - `password`: `@MinLength(8)`.
  - `adminRole`: `@IsEnum(AdminRole)`.
  - `department?`: `@IsOptional()`, `@IsString()`.
- [ ] Implement `UpdateAdminStaffDto`:
  - `adminRole?`: `@IsOptional()`, `@IsEnum(AdminRole)`.
  - `isActive?`: `@IsOptional()`, `@IsBoolean()`.
- [ ] Implement `GET /admin/staff` (Restricted to `SUPER_ADMIN`):
  - Lists all administrative staff with their roles, active statuses, and last login.
- [ ] Implement `POST /admin/staff` (Restricted to `SUPER_ADMIN`):
  - Onboards an internal admin employee, creates `User` (`role: Role.ADMIN`) and `AdminProfile`.
- [ ] Implement `PATCH /admin/staff/:id` (Restricted to `SUPER_ADMIN`):
  - Modify role or revoke access (`isActive: false`).
  - Prevent super-admin from demoting their own account.
- [ ] Implement `DELETE /admin/staff/:id` (Restricted to `SUPER_ADMIN`):
  - Deactivates or removes admin account.
- [ ] Write unit & integration tests for role hierarchies, permission guards, and self-demotion guards.

---

## 3. How To Do It (Implementation Details)

### A. Modular File Layout inside `src/admin/`
```
src/admin/
├── dto/
│   ├── create-admin-staff.dto.ts   # Staff onboarding schema
│   └── update-admin-staff.dto.ts   # Role adjustment schema
├── guards/
│   └── admin-roles.guard.ts        # Granular sub-role access guard
├── decorators/
│   └── admin-roles.decorator.ts    # @AdminRoles(...) metadata decorator
├── controllers/
│   └── admin-staff.controller.ts   # Staff management CRUD endpoints
├── services/
│   └── admin-staff.service.ts      # Staff onboarding, credential creation & access revocation
└── admin-staff.service.spec.ts     # Vitest unit test suite
```

### B. Database Schema Additions (`prisma/schema.prisma`)
```prisma
enum AdminRole {
  SUPER_ADMIN
  FINANCE_AUDITOR
  DISPUTE_ARBITER
  SUPPORT_AGENT
}

model AdminProfile {
  id         String    @id @default(uuid())
  userId     String    @unique
  user       User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  adminRole  AdminRole @default(SUPPORT_AGENT)
  department String?
  isActive   Boolean   @default(true)
  createdBy  String?
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt

  @@index([adminRole])
  @@index([isActive])
}
```

### C. Granular Access Guard (`admin-roles.guard.ts`)
```ts
@Injectable()
export class AdminRolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<AdminRole[]>('adminRoles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || user.role !== 'ADMIN') {
      return false;
    }

    const adminProfile = await this.prisma.adminProfile.findUnique({
      where: { userId: user.id },
    });

    if (!adminProfile || !adminProfile.isActive) {
      throw new ForbiddenException('Admin account is inactive or missing profile.');
    }

    // SUPER_ADMIN has access to everything
    if (adminProfile.adminRole === AdminRole.SUPER_ADMIN) {
      return true;
    }

    return requiredRoles.includes(adminProfile.adminRole);
  }
}
```

---

## 4. Status & What Is Done
- [ ] `AdminRole` enum and `AdminProfile` model in `schema.prisma`: **Pending**
- [ ] `@AdminRoles()` decorator & `AdminRolesGuard`: **Pending**
- [ ] `CreateAdminStaffDto` & `UpdateAdminStaffDto`: **Pending**
- [ ] `AdminStaffController` & `AdminStaffService`: **Pending**
- [ ] `GET /admin/staff`, `POST /admin/staff`, `PATCH /admin/staff/:id`: **Pending**
- [ ] Vitest unit test suite for staff permissions & self-demotion protection: **Pending**
- [ ] TypeScript compilation (`npm run build` 0 errors): **Pending**
