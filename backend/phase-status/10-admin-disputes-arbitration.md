# Phase 10: Admin Dispute Resolution & Arbitration Court

## 1. Purpose
The purpose of Phase 10 is to implement an enterprise-grade **Arbitration Court** for resolving contract disputes. When a client or freelancer flags a contract as `DISPUTED` due to unfulfilled expectations, scope creep, or missed milestones, admins inspect the deliverable history and execute enforceable verdicts: full client refund, full freelancer release, or a proportional split settlement.

---

## 2. What To Do
- [x] Create `AdminDisputesController`, `AdminDisputesQueryService`, and `AdminDisputesVerdictsService` inside `src/admin/`.
- [x] Implement `DisputeSplitDto`:
  - `clientRefundPercentage`: `@IsNumber()`, `@Min(1)`, `@Max(99)`.
  - `adminNotes`: `@IsString()`, `@MinLength(10)`, `@MaxLength(1000)`.
- [x] Implement `DisputeResolutionDto`:
  - `adminNotes`: `@IsString()`, `@MinLength(10)`, `@MaxLength(1000)`.
- [x] Implement `GET /admin/disputes` (Restricted to `ADMIN` role):
  - Retrieve all contracts in `ContractStatus.DISPUTED`.
  - Include client (`id`, `email`), freelancer (`id`, `email`), job title, and escrow amount.
  - Sort by latest dispute creation or update.
- [x] Implement `GET /admin/disputes/:id` (Restricted to `ADMIN` role):
  - Detailed arbitration dossier: original job post, accepted proposal, cover letter, work history/portfolios attached, contract timeline, escrow details, and existing messages/reviews.
- [x] Implement Verdict 1: **Full Client Refund** (`POST /admin/disputes/:id/refund`):
  - Verify contract is currently `DISPUTED`.
  - Transactionally mark contract `REFUNDED` and job `CANCELED`.
  - Refund 100% of `escrowAmount` to Client's `User.walletBalance`.
  - Insert permanent `Refund` record with `adminNotes`.
- [x] Implement Verdict 2: **Full Freelancer Release** (`POST /admin/disputes/:id/release`):
  - Verify contract is currently `DISPUTED`.
  - Transactionally mark contract `COMPLETED` and job `COMPLETED`.
  - Deduct platform fee (`(escrowAmount * feePercentage) / 100`).
  - Credit net payout (`escrowAmount - platformFee`) to Freelancer's `User.walletBalance`.
  - Increment `FreelancerProfile.earnings` and `FreelancerProfile.totalProjects`.
  - Increment `ClientProfile.totalSpent`.
- [x] Implement Verdict 3: **Split Settlement** (`POST /admin/disputes/:id/split`):
  - Proportional division of `escrowAmount`:
    $$\text{clientRefund} = \frac{\text{escrowAmount} \times \text{clientRefundPercentage}}{100}$$
    $$\text{freelancerGross} = \text{escrowAmount} - \text{clientRefund}$$
    $$\text{fee} = \frac{\text{freelancerGross} \times \text{feePercentage}}{100}$$
    $$\text{freelancerNet} = \text{freelancerGross} - \text{fee}$$
  - Transactionally credit `clientRefund` to client wallet and `freelancerNet` to freelancer wallet.
  - Mark contract `COMPLETED` (or `REFUNDED` with partial refund log).
- [x] Write unit & integration tests covering dispute verification, double-resolution prevention, and split monetary mathematics.

---

## 3. How To Do It (Implementation Details)

### A. Modular Sub-Service Architecture inside `src/admin/disputes/`
```
src/admin/disputes/
├── dto/
│   ├── dispute-resolution.dto.ts         # Admin notes schema for full refund/release (~15 lines)
│   └── dispute-split.dto.ts              # Proportional split schema with percentage and notes (~20 lines)
├── controllers/
│   └── admin-disputes.controller.ts      # Dispute queue, dossier, refund, release & split routes (~45 lines)
├── services/
│   ├── admin-disputes-query.service.ts   # Dispute queue and dossier retrieval (~45 lines)
│   └── admin-disputes-verdicts.service.ts# Atomic refund, release and split transactions (~90 lines)
├── admin-disputes.module.ts              # Dedicated Disputes Arbitration submodule
└── admin-disputes.service.spec.ts        # Vitest unit test suite
```


### B. Validation Schemas (`dto/`)
```ts
import { IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class DisputeResolutionDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(10, { message: 'Arbitration notes must be at least 10 characters long' })
  @MaxLength(1000, { message: 'Arbitration notes cannot exceed 1000 characters' })
  adminNotes: string;
}

export class DisputeSplitDto {
  @IsNotEmpty()
  @IsNumber({}, { message: 'clientRefundPercentage must be a number' })
  @Min(1, { message: 'clientRefundPercentage must be at least 1%' })
  @Max(99, { message: 'clientRefundPercentage cannot exceed 99%' })
  clientRefundPercentage: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(10, { message: 'Arbitration notes must be at least 10 characters long' })
  @MaxLength(1000, { message: 'Arbitration notes cannot exceed 1000 characters' })
  adminNotes: string;
}
```

### C. Verdict Execution Algorithms (`admin-disputes.service.ts`)

#### 1. Full Force-Release Algorithm
```ts
async forceReleaseToFreelancer(adminId: string, contractId: string, dto: DisputeResolutionDto) {
  const contract = await this.prisma.contract.findUnique({
    where: { id: contractId },
  });

  if (!contract) {
    throw new NotFoundException('Contract not found.');
  }
  if (contract.status !== ContractStatus.DISPUTED) {
    throw new BadRequestException('Only DISPUTED contracts can be resolved through arbitration.');
  }

  const escrowAmount = Number(contract.escrowAmount);
  const platformFee = Number(contract.platformFee);
  const netPayout = Number((escrowAmount - platformFee).toFixed(2));

  return await this.prisma.$transaction(async (tx) => {
    // 1. Mark contract COMPLETED
    const updatedContract = await tx.contract.update({
      where: { id: contractId },
      data: { status: ContractStatus.COMPLETED },
    });

    // 2. Transfer net payout to Freelancer wallet
    await tx.user.update({
      where: { id: contract.freelancerId },
      data: { walletBalance: { increment: netPayout } },
    });

    // 3. Update Freelancer Profile stats
    await tx.freelancerProfile.update({
      where: { userId: contract.freelancerId },
      data: {
        earnings: { increment: netPayout },
        totalProjects: { increment: 1 },
      },
    });

    // 4. Update Client Profile stats
    await tx.clientProfile.update({
      where: { userId: contract.clientId },
      data: { totalSpent: { increment: escrowAmount } },
    });

    // 5. Update Job status to COMPLETED
    await tx.job.update({
      where: { id: contract.jobId },
      data: { status: JobStatus.COMPLETED },
    });

    return {
      message: 'Dispute resolved in favor of Freelancer. Funds released successfully.',
      contract: updatedContract,
      verdict: 'FULL_RELEASE',
      netPayout,
      adminNotes: dto.adminNotes,
    };
  });
}
```

#### 2. Split Settlement Algorithm
```ts
async resolveSplitSettlement(adminId: string, contractId: string, dto: DisputeSplitDto) {
  const contract = await this.prisma.contract.findUnique({
    where: { id: contractId },
  });

  if (!contract) {
    throw new NotFoundException('Contract not found.');
  }
  if (contract.status !== ContractStatus.DISPUTED) {
    throw new BadRequestException('Only DISPUTED contracts can be split-settled.');
  }

  const totalEscrow = Number(contract.escrowAmount);
  const clientRefundAmount = Number(((totalEscrow * dto.clientRefundPercentage) / 100).toFixed(2));
  const freelancerGross = Number((totalEscrow - clientRefundAmount).toFixed(2));

  // Platform fee applies proportionally to freelancer's gross share
  const feeRate = totalEscrow > 0 ? Number(contract.platformFee) / totalEscrow : 0.1;
  const platformFee = Number((freelancerGross * feeRate).toFixed(2));
  const freelancerNet = Number((freelancerGross - platformFee).toFixed(2));

  return await this.prisma.$transaction(async (tx) => {
    // 1. Mark contract as COMPLETED
    const updatedContract = await tx.contract.update({
      where: { id: contractId },
      data: {
        status: ContractStatus.COMPLETED,
        platformFee,
      },
    });

    // 2. Refund client portion
    await tx.user.update({
      where: { id: contract.clientId },
      data: { walletBalance: { increment: clientRefundAmount } },
    });

    // 3. Credit freelancer portion
    await tx.user.update({
      where: { id: contract.freelancerId },
      data: { walletBalance: { increment: freelancerNet } },
    });

    // 4. Update stats
    await tx.freelancerProfile.update({
      where: { userId: contract.freelancerId },
      data: { earnings: { increment: freelancerNet } },
    });
    await tx.clientProfile.update({
      where: { userId: contract.clientId },
      data: { totalSpent: { increment: freelancerGross } },
    });

    // 5. Create refund record for client's portion
    await tx.refund.create({
      data: {
        contractId,
        clientId: contract.clientId,
        amount: clientRefundAmount,
        reason: `Dispute Split Settlement (${dto.clientRefundPercentage}%): ${dto.adminNotes}`,
        adminId,
      },
    });

    // 6. Complete job
    await tx.job.update({
      where: { id: contract.jobId },
      data: { status: JobStatus.COMPLETED },
    });

    return {
      message: 'Dispute split settlement executed successfully.',
      contract: updatedContract,
      verdict: 'SPLIT_SETTLEMENT',
      clientRefund: clientRefundAmount,
      freelancerNet,
      platformFee,
      adminNotes: dto.adminNotes,
    };
  });
}
```

---

## 4. Status & What Is Done
- [x] `DisputeResolutionDto` and `DisputeSplitDto`: **Completed**
- [x] `GET /admin/disputes` (Queue of active disputed contracts): **Completed**
- [x] `GET /admin/disputes/:id` (Full arbitration dossier): **Completed**
- [x] `POST /admin/disputes/:id/refund` (100% Client refund): **Completed**
- [x] `POST /admin/disputes/:id/release` (100% Freelancer release): **Completed**
- [x] `POST /admin/disputes/:id/split` (Proportional split settlement): **Completed**
- [x] Vitest unit test suite (testing dispute validations, fee splits & refunds): **Completed**
- [x] TypeScript compilation (`npm run build` 0 errors): **Completed**
