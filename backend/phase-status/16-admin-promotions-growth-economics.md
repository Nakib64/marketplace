# Phase 16: Promotions, Fee Discounts & Growth Economics

## 1. Purpose
The purpose of Phase 16 is to equip the marketplace with **Growth Levers & Flexible Commercial Terms**. To attract high-value enterprise clients and incentivize adoption, administrators need the capability to issue promotional discount codes (e.g. 0% fee on first hire), establish custom negotiated commission overrides for enterprise clients (e.g. 5% take-rate instead of 10%), and track referral incentives.

---

## 2. What To Do
- [ ] Update `schema.prisma` with `Coupon`, `CouponRedemption`, and `customFeePercentage` on `ClientProfile`:
  - `ClientProfile.customFeePercentage`: `Float?` (custom negotiated commission override).
  - `Coupon`: `code`, `discountType` (`PERCENTAGE` | `FIXED_AMOUNT`), `discountValue`, `minOrderAmount`, `maxUses`, `usedCount`, `expiresAt`, `isActive`.
  - `CouponRedemption`: Tracks user, contract, coupon, and amount saved.
- [ ] Implement `CreateCouponDto`:
  - `code`: `@IsString()`, `@Matches(/^[A-Z0-9_-]+$/)`.
  - `discountType`: `@IsEnum(['PERCENTAGE', 'FIXED_AMOUNT'])`.
  - `discountValue`: `@IsNumber()`, `@Min(1)`.
  - `minOrderAmount?`: `@IsOptional()`, `@IsNumber()`.
  - `maxUses?`: `@IsOptional()`, `@IsInt()`, `@Min(1)`.
  - `expiresAt?`: `@IsOptional()`, `@IsDateString()`.
- [ ] Implement `SetCustomFeeDto`:
  - `customFeePercentage`: `@IsNumber()`, `@Min(0)`, `@Max(100)`.
- [ ] Implement `POST /admin/coupons` (Restricted to `ADMIN` role):
  - Create promotional voucher codes with usage limits and expiry dates.
- [ ] Implement `GET /admin/coupons` (Restricted to `ADMIN` role):
  - Track coupon redemption rates and total promotional discounts granted.
- [ ] Implement `PATCH /admin/clients/:id/custom-fee` (Restricted to `ADMIN` role):
  - Configure VIP/Enterprise client custom commission rates.
- [ ] Implement `POST /coupons/validate` (Authenticated):
  - Validate voucher code eligibility against contract bid amount before checkout.
- [ ] Integrate custom fee and coupon deductions into `ContractsService.acceptProposal`:
  - Hierarchy: Custom client fee > Active applied coupon > Global default `PlatformSetting`.
- [ ] Write unit & integration tests covering coupon expiry, usage limit exhaustion, and fee calculation precedence.

---

## 3. How To Do It (Implementation Details)

### A. Modular File Layout inside `src/promotions/`
```
src/promotions/
├── dto/
│   ├── create-coupon.dto.ts        # Coupon creation schema
│   ├── set-custom-fee.dto.ts       # Enterprise fee override schema
│   └── validate-coupon.dto.ts      # Checkout coupon validation schema
├── controllers/
│   ├── admin-coupons.controller.ts # Admin coupon CRUD & client custom fee endpoints
│   └── public-coupons.controller.ts# Public coupon eligibility checks
├── services/
│   └── promotions.service.ts       # Coupon redemption validation & enterprise fee overrides
└── promotions.module.ts            # Promotions module registration
```

### B. Database Schema Additions (`prisma/schema.prisma`)
```prisma
enum CouponDiscountType {
  PERCENTAGE
  FIXED_AMOUNT
}

model Coupon {
  id             String               @id @default(uuid())
  code           String               @unique
  discountType   CouponDiscountType   @default(PERCENTAGE)
  discountValue  Float
  minOrderAmount Decimal?             @db.Decimal(12, 2)
  maxUses        Int?
  usedCount      Int                  @default(0)
  isActive       Boolean              @default(true)
  expiresAt      DateTime?
  createdAt      DateTime             @default(now())
  updatedAt      DateTime             @updatedAt
  redemptions    CouponRedemption[]

  @@index([code, isActive])
}

model CouponRedemption {
  id         String   @id @default(uuid())
  couponId   String
  coupon     Coupon   @relation(fields: [couponId], references: [id], onDelete: Cascade)
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  contractId String   @unique
  contract   Contract @relation(fields: [contractId], references: [id], onDelete: Cascade)
  savedAmount Decimal  @db.Decimal(12, 2)
  createdAt  DateTime @default(now())

  @@index([couponId])
  @@index([userId])
}
```

### C. Fee Resolution Hierarchy (`promotions.service.ts`)
```ts
@Injectable()
export class PromotionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly contractsService: ContractsService,
  ) {}

  /**
   * Resolves effective fee percentage for a client.
   * Priority: Client customFeePercentage > Global PlatformSetting
   */
  async resolveEffectiveFeePercentage(clientId: string): Promise<number> {
    const clientProfile = await this.prisma.clientProfile.findUnique({
      where: { userId: clientId },
      select: { customFeePercentage: true },
    });

    if (clientProfile && clientProfile.customFeePercentage !== null) {
      return clientProfile.customFeePercentage;
    }

    return await this.contractsService.getPlatformFeePercentage();
  }

  /**
   * Validates a coupon code against a contract order amount.
   */
  async validateCoupon(code: string, orderAmount: number) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon || !coupon.isActive) {
      throw new BadRequestException('Invalid or inactive coupon code.');
    }
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      throw new BadRequestException('This coupon has expired.');
    }
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      throw new BadRequestException('This coupon has reached its maximum usage limit.');
    }
    if (coupon.minOrderAmount && orderAmount < Number(coupon.minOrderAmount)) {
      throw new BadRequestException(`Order amount must be at least ${coupon.minOrderAmount} BDT to use this coupon.`);
    }

    const discountAmount =
      coupon.discountType === CouponDiscountType.PERCENTAGE
        ? Number(((orderAmount * coupon.discountValue) / 100).toFixed(2))
        : Math.min(coupon.discountValue, orderAmount);

    return {
      couponId: coupon.id,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
      finalAmount: Math.max(0, orderAmount - discountAmount),
    };
  }
}
```

---

## 4. Status & What Is Done
- [ ] `Coupon` & `CouponRedemption` models in `schema.prisma`: **Pending**
- [ ] `ClientProfile.customFeePercentage` column: **Pending**
- [ ] `CreateCouponDto` & `SetCustomFeeDto`: **Pending**
- [ ] `AdminCouponsController` & `PromotionsService`: **Pending**
- [ ] `POST /admin/coupons` & `PATCH /admin/clients/:id/custom-fee`: **Pending**
- [ ] Coupon validation logic with min-order & usage-limit checking: **Pending**
- [ ] Fee resolution integration into contract escrow formation: **Pending**
- [ ] Vitest unit test suite covering fee precedence & redemption rules: **Pending**
- [ ] TypeScript compilation (`npm run build` 0 errors): **Pending**
