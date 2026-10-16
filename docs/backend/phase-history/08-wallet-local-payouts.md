# Phase 8: Wallet, Local Payouts & Escrow Refund Module

## 1. Purpose
The purpose of Phase 8 is to empower freelancers to manage their earned wallet balances and request withdrawals via local mobile financial services (**bKash**, **Nagad**), provide an Admin processing workflow to approve or reject pending payout requests (with automatic balance refunds), and handle Admin project cancellations/rejections by refunding locked escrow balances back to clients and tracking refund audit records.

---

## 2. What To Do
- [x] Update `schema.prisma`:
  - Add `REFUNDED` status to `ContractStatus` enum.
  - Create `Refund` model tracking `contractId`, `clientId`, `amount`, `reason`, and `adminId`.
- [x] Create `WalletModule`, `WalletController`, `WalletService`, and `AdminWithdrawalsController`.
- [x] Implement DTOs:
  - `RequestWithdrawalDto` (`amount`, `method`: `BKASH` | `NAGAD`, `accountNumber`).
  - `WithdrawalQueryDto` (`status`: `PENDING` | `APPROVED` | `REJECTED`).
  - `CreateRefundDto` (`reason`).
- [x] Implement `POST /wallet/withdraw`: Restrict to `FREELANCER` role.
  - Check freelancer `User.walletBalance`.
  - Validate minimum withdrawal threshold (500 BDT).
  - Transactionally deduct amount from `User.walletBalance` and create `Withdrawal` record with status `PENDING`.
- [x] Implement `GET /wallet/balance`: Retrieve current wallet balance, withdrawal history, and refund history for the user.
- [x] Implement `GET /admin/withdrawals`: Restrict to `ADMIN` role. Retrieve queued payout requests filtered by status.
- [x] Implement `PATCH /admin/withdrawals/:id/approve`: Restrict to `ADMIN` role. Update `WithdrawalStatus` to `APPROVED`.
- [x] Implement `PATCH /admin/withdrawals/:id/reject`: Restrict to `ADMIN` role.
  - Update `WithdrawalStatus` to `REJECTED`.
  - Transactionally refund amount back to Freelancer `User.walletBalance`.
- [x] Implement `POST /admin/contracts/:id/refund`: Restrict to `ADMIN` role.
  - Update `Contract.status` to `REFUNDED` and `Job.status` to `CANCELED`.
  - Transactionally refund `escrowAmount` to Client `User.walletBalance`.
  - Create and store `Refund` record.
- [x] Implement `GET /admin/refunds`: Restrict to `ADMIN` role. Retrieve all project refund audit records.
- [x] Write unit & integration tests for withdrawal deductions, admin approval/rejection refunds, and admin contract escrow refunds.

---

## 3. How To Do It (Implementation Details)

### A. Modular File Layout inside `src/wallet/`
```
src/wallet/
├── dto/
│   ├── request-withdrawal.dto.ts   # Payout request schema (bKash/Nagad, min 500 BDT)
│   ├── withdrawal-query.dto.ts     # Payout status filter schema
│   └── create-refund.dto.ts        # Admin project refund reason schema
├── controllers/
│   ├── wallet.controller.ts        # Balance query & withdrawal request endpoints
│   └── admin-withdrawals.controller.ts # Admin payout approvals, payout rejections & contract refunds
├── services/
│   └── wallet.service.ts           # Balance queries, immediate deductions, refunds & contract escrow returns
├── wallet.service.spec.ts          # Vitest unit test suite (10 passing tests)
└── wallet.module.ts                # Bundles controllers & provider
```

### B. Admin Project Cancellation & Escrow Refund Transaction
```ts
// Admin Cancel/Reject Project & Refund Client Escrow
async refundContract(adminId: string, contractId: string, dto: CreateRefundDto) {
  const contract = await this.prisma.contract.findUnique({
    where: { id: contractId },
  });

  if (!contract || contract.status === ContractStatus.COMPLETED) {
    throw new BadRequestException('Cannot refund completed contract');
  }
  if (contract.status === ContractStatus.REFUNDED) {
    throw new ConflictException('Contract already refunded');
  }

  const escrowAmount = Number(contract.escrowAmount);

  return await this.prisma.$transaction(async (tx) => {
    // 1. Mark contract REFUNDED
    const updatedContract = await tx.contract.update({
      where: { id: contractId },
      data: { status: ContractStatus.REFUNDED },
    });

    // 2. Mark job CANCELED
    await tx.job.update({
      where: { id: contract.jobId },
      data: { status: JobStatus.CANCELED },
    });

    // 3. Refund escrow back to client wallet
    await tx.user.update({
      where: { id: contract.clientId },
      data: { walletBalance: { increment: escrowAmount } },
    });

    // 4. Create permanent Refund record
    const refund = await tx.refund.create({
      data: {
        contractId,
        clientId: contract.clientId,
        amount: escrowAmount,
        reason: dto.reason,
        adminId,
      },
    });

    return { refund, contract: updatedContract };
  });
}
```

---

## 4. Status & What Is Done
- [x] `Refund` Model & `ContractStatus.REFUNDED` Schema Update: **Completed**
- [x] `WalletModule`, `WalletController`, `AdminWithdrawalsController`, `WalletService`: **Completed**
- [x] `RequestWithdrawalDto`, `WithdrawalQueryDto`, `CreateRefundDto`: **Completed**
- [x] `POST /wallet/withdraw` (Deduct & queue): **Completed**
- [x] `GET /wallet/balance` (Balance, withdrawals, and refunds history): **Completed**
- [x] `GET /admin/withdrawals` (Status filtered queries): **Completed**
- [x] `PATCH /admin/withdrawals/:id/approve` (Mark approved): **Completed**
- [x] `PATCH /admin/withdrawals/:id/reject` (Mark rejected & refund balance): **Completed**
- [x] `POST /admin/contracts/:id/refund` (Project rejection & client escrow return): **Completed**
- [x] `GET /admin/refunds` (Admin audit trail): **Completed**
- [x] Vitest Unit Tests (59 passed across 9 test suites): **Completed**
- [x] TypeScript Compilation (`npm run build` 0 errors): **Completed**
