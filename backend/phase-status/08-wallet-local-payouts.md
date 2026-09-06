# Phase 8: Wallet & Local Payouts Module

## 1. Purpose
The purpose of Phase 8 is to empower freelancers to manage their earned wallet balances and request withdrawals via local mobile financial services (**bKash**, **Nagad**). It also provides an Admin processing workflow to approve or reject pending payout requests.

---

## 2. What To Do
- [ ] Create `WalletModule`, `WalletController`, `WalletService`, and `AdminWithdrawalsController`.
- [ ] Implement `RequestWithdrawalDto` (`amount`, `method`: `BKASH` | `NAGAD`, `accountNumber`).
- [ ] Implement `POST /wallet/withdraw`: Restrict to `FREELANCER` role.
  - Check freelancer `User.walletBalance`.
  - Validate minimum withdrawal threshold (e.g. 500 BDT).
  - Transactionally deduct amount from `User.walletBalance` and create `Withdrawal` record with status `PENDING`.
- [ ] Implement `GET /wallet/balance`: Retrieve current wallet balance and withdrawal history for the user.
- [ ] Implement `GET /admin/withdrawals`: Restrict to `ADMIN` role. Retrieve queued payout requests filtered by status.
- [ ] Implement `PATCH /admin/withdrawals/:id/approve`: Restrict to `ADMIN` role.
  - Update `WithdrawalStatus` to `APPROVED`.
- [ ] Implement `PATCH /admin/withdrawals/:id/reject`: Restrict to `ADMIN` role.
  - Update `WithdrawalStatus` to `REJECTED`.
  - Transactionally refund amount back to Freelancer `User.walletBalance`.
- [ ] Write unit & integration tests for withdrawal deductions and admin approval/rejection refunds.

---

## 3. How To Do It (Implementation Details)

### A. Freelancer Payout Request Transaction
```ts
// Request Payout
async requestWithdrawal(freelancerId: string, dto: RequestWithdrawalDto) {
  return await this.prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: freelancerId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const currentBalance = Number(user.walletBalance);
    if (currentBalance < dto.amount) {
      throw new BadRequestException('Insufficient wallet balance');
    }

    // 1. Deduct balance immediately
    await tx.user.update({
      where: { id: freelancerId },
      data: { walletBalance: { decrement: dto.amount } },
    });

    // 2. Create PENDING withdrawal record
    return tx.withdrawal.create({
      data: {
        freelancerId,
        amount: dto.amount,
        method: dto.method,
        accountNumber: dto.accountNumber,
        status: WithdrawalStatus.PENDING,
      },
    });
  });
}
```

### B. Admin Rejection Refund Transaction
```ts
// Reject Payout & Refund
async rejectWithdrawal(adminId: string, withdrawalId: string) {
  return await this.prisma.$transaction(async (tx) => {
    const withdrawal = await tx.withdrawal.findUnique({
      where: { id: withdrawalId },
    });

    if (!withdrawal || withdrawal.status !== WithdrawalStatus.PENDING) {
      throw new BadRequestException('Withdrawal request is not pending');
    }

    // 1. Mark REJECTED
    const updated = await tx.withdrawal.update({
      where: { id: withdrawalId },
      data: { status: WithdrawalStatus.REJECTED },
    });

    // 2. Refund balance
    await tx.user.update({
      where: { id: withdrawal.freelancerId },
      data: { walletBalance: { increment: withdrawal.amount } },
    });

    return updated;
  });
}
```

---

## 4. Status & What Is Done
- [ ] `WalletModule`, `WalletController`, `WalletService`: **Pending**
- [ ] `AdminWithdrawalsController`: **Pending**
- [ ] `POST /wallet/withdraw` (Deduct & queue): **Pending**
- [ ] `GET /wallet/balance`: **Pending**
- [ ] `GET /admin/withdrawals`: **Pending**
- [ ] `PATCH /admin/withdrawals/:id/approve` & `reject` (Refund): **Pending**
- [ ] Unit & E2E tests: **Pending**
