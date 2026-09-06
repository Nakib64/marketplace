# Phase 6: Escrow, Contracts & Payment Integration

## 1. Purpose
The purpose of Phase 6 is to build the financial core of the platform: converting accepted proposals into binding contracts, locking client funds into secure escrow, integrating SSLCommerz local payment gateway for escrow funding, and handling contract completion and release of escrowed funds into freelancer wallets upon job approval.

---

## 2. What To Do
- [ ] Create `ContractsModule`, `ContractsController`, `ContractsService`, and `SslCommerzService`.
- [ ] Implement `AcceptProposalDto` (`proposalId`).
- [ ] Implement `POST /contracts/accept-proposal`: Restrict to `CLIENT` role.
  - Verify client ownership of job.
  - Calculate platform fee (e.g. 10% platform commission).
  - Check client `walletBalance` or generate SSLCommerz payment gateway initialization URL.
  - Transactionally create `Contract` record with status `FUNDED`, update `Job.status` to `IN_PROGRESS`, and update `Proposal.status` to `ACCEPTED`.
- [ ] Implement SSLCommerz Payment Webhooks / Callbacks (`POST /payments/sslcommerz/success`, `POST /payments/sslcommerz/fail`, `POST /payments/sslcommerz/cancel`).
- [ ] Implement `POST /contracts/:id/submit-work`: Restrict to `FREELANCER` role. Update contract status from `FUNDED` to `PENDING_APPROVAL`.
- [ ] Implement `POST /contracts/:id/approve-work`: Restrict to `CLIENT` role.
  - Complete contract (`ContractStatus.COMPLETED`).
  - Transfer net payout (`escrowAmount - platformFee`) to Freelancer's `walletBalance`.
  - Increment `FreelancerProfile.totalProjects` and `FreelancerProfile.earnings`.
  - Update `ClientProfile.totalSpent`.
  - Update `Job.status` to `COMPLETED`.
- [ ] Implement `POST /contracts/:id/dispute`: Allow Client or Freelancer to flag contract status as `DISPUTED` for admin review.
- [ ] Implement `GET /contracts/:id`: Retrieve contract details.
- [ ] Write unit & integration tests for contract state machine transitions and monetary calculations.

---

## 3. How To Do It (Implementation Details)

### A. Contract State Machine
```
[ACCEPTED PROPOSAL] ➔ FUNDED ➔ PENDING_APPROVAL ➔ COMPLETED
                                              ↳ DISPUTED
```

### B. Transactional Contract Completion & Fund Transfer
```ts
// Approve Work & Release Funds
async approveWork(clientId: string, contractId: string) {
  return await this.prisma.$transaction(async (tx) => {
    const contract = await tx.contract.findUnique({
      where: { id: contractId },
    });

    if (!contract || contract.clientId !== clientId) {
      throw new ForbiddenException('Unauthorized contract approval');
    }
    if (contract.status !== ContractStatus.PENDING_APPROVAL) {
      throw new BadRequestException('Contract is not pending approval');
    }

    const netPayout = Number(contract.escrowAmount) - Number(contract.platformFee);

    // 1. Update Contract Status
    const updatedContract = await tx.contract.update({
      where: { id: contractId },
      data: { status: ContractStatus.COMPLETED },
    });

    // 2. Transfer funds to Freelancer Wallet & Profile
    await tx.user.update({
      where: { id: contract.freelancerId },
      data: { walletBalance: { increment: netPayout } },
    });
    await tx.freelancerProfile.update({
      where: { userId: contract.freelancerId },
      data: {
        earnings: { increment: netPayout },
        totalProjects: { increment: 1 },
      },
    });

    // 3. Update Client Stats
    await tx.clientProfile.update({
      where: { userId: clientId },
      data: { totalSpent: { increment: contract.escrowAmount } },
    });

    // 4. Update Job Status
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
- [ ] `ContractsModule`, `ContractsController`, `ContractsService`: **Pending**
- [ ] `SslCommerzService` & payment webhooks: **Pending**
- [ ] `POST /contracts/accept-proposal` (Escrow creation): **Pending**
- [ ] `POST /contracts/:id/submit-work`: **Pending**
- [ ] `POST /contracts/:id/approve-work` (Fund release): **Pending**
- [ ] `POST /contracts/:id/dispute`: **Pending**
- [ ] Unit & E2E tests: **Pending**
