# Phase 12: Immutable Activity Audit Log & Compliance System

## 1. Purpose
The purpose of Phase 12 is to implement a permanent, immutable **Activity Audit Trail** for the marketplace platform. For financial accountability, regulatory compliance, and internal fraud prevention, every privileged administrative action—including balance refunds, payout approvals/rejections, dispute verdicts, platform fee adjustments, user bans, and account impersonations—must be permanently recorded with administrator identity, timestamp, action type, and IP address.

---

## 2. What To Do
- [ ] Update `prisma/schema.prisma` with the `AuditLog` model:
  - `id`: `String @id @default(uuid())`
  - `adminId`: `String` (ID of administrator who executed the action)
  - `action`: `String` (e.g. `FEE_UPDATED`, `PAYOUT_APPROVED`, `PAYOUT_REJECTED`, `ESCROW_REFUNDED`, `DISPUTE_RELEASE`, `DISPUTE_SPLIT`, `USER_BANNED`, `USER_UNBANNED`, `USER_IMPERSONATED`)
  - `targetType`: `String` (`SETTING`, `WITHDRAWAL`, `CONTRACT`, `USER`, `JOB`)
  - `targetId`: `String?`
  - `details`: `String?` (JSON metadata or human-readable explanation)
  - `ipAddress`: `String?`
  - `createdAt`: `DateTime @default(now())`
- [ ] Create `AuditLoggerService` to provide centralized audit recording across all admin modules.
- [ ] Implement `AuditLogQueryDto`:
  - `action?`: `@IsOptional()`, `@IsString()`.
  - `targetType?`: `@IsOptional()`, `@IsString()`.
  - `adminId?`: `@IsOptional()`, `@IsUUID(4)`.
  - `page?`: `@IsOptional()`, `@Type(() => Number)`, `@Min(1)`.
  - `limit?`: `@IsOptional()`, `@Type(() => Number)`, `@Min(1)`, `@Max(100)`.
- [ ] Implement `GET /admin/audit-logs` (Restricted to `ADMIN` role):
  - Paginated audit log search with multi-parameter filtering.
  - Return total counts and chronological event listing.
- [ ] Integrate `AuditLoggerService` into:
  - Platform Fee updates (`AdminSettingsController`).
  - Withdrawal approvals and rejections (`AdminWithdrawalsController`).
  - Contract escrow refunds (`AdminWithdrawalsController`).
  - Dispute resolution verdicts (`AdminDisputesController`).
  - User status sanctions and impersonation (`AdminUsersController`).
- [ ] Write unit & integration tests for audit creation, query filtering, and event indexing.

---

## 3. How To Do It (Implementation Details)

### A. Modular File Layout inside `src/admin/`
```
src/admin/
├── dto/
│   └── audit-log-query.dto.ts      # Multi-parameter filter schema
├── controllers/
│   └── admin-audit.controller.ts   # GET /admin/audit-logs route
├── services/
│   └── audit-logger.service.ts     # Centralized logAction() helper & query service
└── audit-logger.service.spec.ts    # Vitest unit test suite
```

### B. Database Schema Definition (`prisma/schema.prisma`)
```prisma
model AuditLog {
  id         String   @id @default(uuid())
  adminId    String
  action     String   // e.g. "USER_BANNED", "PAYOUT_APPROVED", "DISPUTE_RELEASE"
  targetType String   // "USER", "CONTRACT", "WITHDRAWAL", "SETTING"
  targetId   String?
  details    String?  // JSON string or notes
  ipAddress  String?
  createdAt  DateTime @default(now())

  @@index([adminId])
  @@index([action])
  @@index([targetType])
  @@index([createdAt])
}
```

### C. Validation Schema (`dto/audit-log-query.dto.ts`)
```ts
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class AuditLogQueryDto {
  @IsOptional()
  @IsString()
  action?: string;

  @IsOptional()
  @IsString()
  targetType?: string;

  @IsOptional()
  @IsUUID(4)
  adminId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 25;
}
```

### D. Centralized Audit Logger (`audit-logger.service.ts`)
```ts
@Injectable()
export class AuditLoggerService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Permanently records an administrative action into the audit trail.
   */
  async logAction(params: {
    adminId: string;
    action: string;
    targetType: string;
    targetId?: string;
    details?: string;
    ipAddress?: string;
  }) {
    return await this.prisma.auditLog.create({
      data: {
        adminId: params.adminId,
        action: params.action,
        targetType: params.targetType,
        targetId: params.targetId,
        details: params.details,
        ipAddress: params.ipAddress,
      },
    });
  }

  /**
   * Retrieves paginated audit logs based on query filters.
   */
  async getAuditLogs(query: AuditLogQueryDto) {
    const { action, targetType, adminId, page = 1, limit = 25 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.AuditLogWhereInput = {
      ...(action ? { action } : {}),
      ...(targetType ? { targetType } : {}),
      ...(adminId ? { adminId } : {}),
    };

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
```

---

## 4. Status & What Is Done
- [ ] Schema Update (`AuditLog` model in `schema.prisma`): **Pending**
- [ ] `AuditLogQueryDto`: **Pending**
- [ ] `AuditLoggerService` (centralized `logAction()` & query methods): **Pending**
- [ ] `AdminAuditController` (`GET /admin/audit-logs`): **Pending**
- [ ] Wiring audit hooks across Admin fee updates, payouts, refunds, disputes & user bans: **Pending**
- [ ] Vitest unit test suite covering audit persistence & multi-filter search: **Pending**
- [ ] TypeScript compilation (`npm run build` 0 errors): **Pending**
