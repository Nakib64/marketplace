# Phase 6: Escrow, Contracts & Payment Integration

## 1. Purpose
The purpose of Phase 6 is to build the financial core of the platform: converting accepted proposals into binding contracts, locking client funds into secure escrow, integrating SSLCommerz local payment gateway for escrow funding, allowing admin-configurable platform fee deduction from freelancer payouts, and handling contract completion and release of escrowed funds into freelancer wallets upon job approval.

---

## 2. What To Do
- [x] Create `PlatformSetting` model in `schema.prisma` for admin-managed platform fee percentage.
- [x] Create `ContractsModule`, `ContractsController`, `AdminSettingsController`, `PaymentsController`, `ContractsService`, and `SslCommerzService`.
- [x] Implement `AcceptProposalDto` (`proposalId`) and `UpdatePlatformFeeDto` (`platformFeePercentage`).
- [x] Implement Admin Platform Fee endpoints:
  - `GET /admin/settings/platform-fee` (`@Roles(Role.ADMIN)`).
  - `PATCH /admin/settings/platform-fee` (`@Roles(Role.ADMIN)`).
- [x] Implement `POST /contracts/accept-proposal`: Restrict to `CLIENT` role.
  - Verify client ownership of job.
  - Dynamically fetch platform fee percentage from `PlatformSetting`.
  - Check client `walletBalance` or generate SSLCommerz payment gateway initialization URL.
  - Transactionally create `Contract` record with status `FUNDED`, update `Job.status` to `IN_PROGRESS`, and update `Proposal.status` to `ACCEPTED`.
- [x] Implement SSLCommerz Payment Webhooks / Callbacks (`POST /payments/sslcommerz/success`, `POST /payments/sslcommerz/fail`, `POST /payments/sslcommerz/cancel`).
- [x] Implement `POST /contracts/:id/submit-work`: Restrict to `FREELANCER` role. Update contract status from `FUNDED` to `PENDING_APPROVAL`.
- [x] Implement `POST /contracts/:id/approve-work`: Restrict to `CLIENT` role.
  - Complete contract (`ContractStatus.COMPLETED`).
  - Deduct platform fee from Freelancer earnings (`netPayout = escrowAmount - platformFee`).
  - Transfer net payout to Freelancer's `walletBalance`.
  - Increment `FreelancerProfile.totalProjects` and `FreelancerProfile.earnings`.
  - Update `ClientProfile.totalSpent`.
  - Update `Job.status` to `COMPLETED`.
- [x] Implement `POST /contracts/:id/dispute`: Allow Client or Freelancer to flag contract status as `DISPUTED` for admin review.
- [x] Implement `GET /contracts` & `GET /contracts/:id`: Retrieve user contracts and contract detail view.
- [x] Write unit & integration tests for contract state machine transitions, admin settings, and monetary calculations.

---

## 3. How To Do It (Sub-Service Architecture Layout)

### A. Modular File Layout inside `src/contracts/`
```
src/contracts/
├── dto/
│   ├── accept-proposal.dto.ts      # Proposal acceptance schema
│   └── update-platform-fee.dto.ts  # Admin platform fee schema
├── controllers/
│   ├── contracts.controller.ts     # Proposal acceptance, submit work, approve work & dispute endpoints
│   ├── admin-settings.controller.ts# Admin platform fee percentage configuration (/admin/settings/platform-fee)
│   └── payments.controller.ts      # SSLCommerz IPN / payment callback webhooks
├── services/
│   ├── contracts.service.ts        # Escrow locking, net payout calculation, approval & dispute logic
│   └── sslcommerz.service.ts       # SSLCommerz payment gateway session & payload signature validation
├── contracts.service.spec.ts       # Vitest unit test suite (9 passing tests)
└── contracts.module.ts             # Bundles all controllers & services
```

### B. Transactional Contract Completion & Net Freelancer Payout
```ts
// Approve Work & Release Net Payout to Freelancer
async approveWork(clientId: string, contractId: string) {
  const contract = await this.prisma.contract.findUnique({
    where: { id: contractId },
  });

  if (!contract || contract.clientId !== clientId) {
    throw new ForbiddenException('Unauthorized contract approval');
  }
  if (contract.status !== ContractStatus.PENDING_APPROVAL) {
    throw new BadRequestException('Contract is not pending approval');
  }

  const escrowAmount = Number(contract.escrowAmount);
  const platformFee = Number(contract.platformFee);
  const netPayout = Number((escrowAmount - platformFee).toFixed(2));

  return await this.prisma.$transaction(async (tx) => {
    // 1. Mark contract as COMPLETED
    const updatedContract = await tx.contract.update({
      where: { id: contractId },
      data: { status: ContractStatus.COMPLETED },
    });

    // 2. Transfer net payout to Freelancer's wallet balance
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
      where: { userId: clientId },
      data: { totalSpent: { increment: escrowAmount } },
    });

    // 5. Update Job Status to COMPLETED
    await tx.job.update({
      where: { id: contract.jobId },
      data: { status: JobStatus.COMPLETED },
    });

    return updatedContract;
  });
}
```

---

## 4. Status & What Is Done
- [x] `PlatformSetting` Schema Update: **Completed**
- [x] `ContractsModule`, `ContractsController`, `AdminSettingsController`, `PaymentsController`, `ContractsService`, `SslCommerzService`: **Completed**
- [x] `AcceptProposalDto` & `UpdatePlatformFeeDto`: **Completed**
- [x] `GET` & `PATCH /admin/settings/platform-fee` (Admin fee configuration): **Completed**
- [x] `POST /contracts/accept-proposal` (Escrow creation & client wallet balance check / SSLCommerz gateway fallback): **Completed**
- [x] `POST /contracts/:id/submit-work` (`FUNDED` -> `PENDING_APPROVAL`): **Completed**
- [x] `POST /contracts/:id/approve-work` (Net freelancer payout calculation & job completion): **Completed**
- [x] `POST /contracts/:id/dispute` (`DISPUTED` status flag): **Completed**
- [x] SSLCommerz Payment IPN Callbacks (`/payments/sslcommerz/success`, `/fail`, `/cancel`): **Completed**
- [x] Vitest Unit Tests (38 passed across 7 test suites): **Completed**
- [x] TypeScript Compilation (`npm run build` 0 errors): **Completed**
