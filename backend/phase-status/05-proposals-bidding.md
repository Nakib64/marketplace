# Phase 5: Proposals & Bidding System

## 1. Purpose
The purpose of Phase 5 is to implement the competitive bidding module where Freelancers submit proposals for open jobs, view their submitted proposals, and withdraw proposals. Clients can inspect proposals submitted for their jobs and evaluate bids.

---

## 2. What To Do
- [ ] Create `ProposalsModule`, `ProposalsController`, and `ProposalsService`.
- [ ] Implement `CreateProposalDto` (`bidAmount`, `coverLetter`).
- [ ] Implement `POST /jobs/:jobId/proposals`: Restrict to `FREELANCER` role.
  - Verify target job exists and status is `OPEN`.
  - Enforce unique proposal constraint (`@@unique([jobId, freelancerId])`) to prevent duplicate bids.
  - Store proposal with `PENDING` status.
- [ ] Implement `GET /jobs/:jobId/proposals`: Restrict to job owner (Client). View all submitted bids for a specific job.
- [ ] Implement `GET /proposals/my-proposals`: Restrict to `FREELANCER` role. Retrieve freelancer's active and past proposals.
- [ ] Implement `PATCH /proposals/:id`: Restrict to proposal owner (Freelancer). Edit proposal cover letter or bid amount if still `PENDING`.
- [ ] Implement `DELETE /proposals/:id`: Restrict to proposal owner (Freelancer). Withdraw proposal.
- [ ] Write unit & integration tests for proposal creation rules and bid uniqueness.

---

## 3. How To Do It (Implementation Details)

### A. DTO Specifications
- **`CreateProposalDto`**:
  - `bidAmount`: `@IsNumber()`, `@Min(1)`.
  - `coverLetter`: `@IsString()`, `@MinLength(30)`, `@MaxLength(2000)`.

### B. Proposal Creation & Guard Checks
```ts
// Submit Proposal
async submitProposal(freelancerId: string, jobId: string, dto: CreateProposalDto) {
  const job = await this.prisma.job.findUnique({ where: { id: jobId } });
  if (!job) {
    throw new NotFoundException('Job not found');
  }
  if (job.status !== JobStatus.OPEN) {
    throw new BadRequestException('Proposals can only be submitted for open jobs');
  }

  // Check duplicate proposal
  const existing = await this.prisma.proposal.findUnique({
    where: { jobId_freelancerId: { jobId, freelancerId } },
  });
  if (existing) {
    throw new ConflictException('You have already submitted a proposal for this job');
  }

  return this.prisma.proposal.create({
    data: {
      jobId,
      freelancerId,
      bidAmount: dto.bidAmount,
      coverLetter: dto.coverLetter,
      status: ProposalStatus.PENDING,
    },
  });
}
```

### C. Client Proposal Inspection Query
```ts
// Get Job Proposals (Client perspective)
async getJobProposals(clientId: string, jobId: string) {
  const job = await this.prisma.job.findUnique({ where: { id: jobId } });
  if (!job || job.clientId !== clientId) {
    throw new ForbiddenException('You do not have access to view proposals for this job');
  }

  return this.prisma.proposal.findMany({
    where: { jobId },
    include: {
      freelancer: {
        select: {
          id: true,
          email: true,
          freelancerProfile: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}
```

---

## 4. Status & What Is Done
- [ ] `ProposalsModule`, `ProposalsController`, `ProposalsService`: **Pending**
- [ ] `CreateProposalDto`: **Pending**
- [ ] `POST /jobs/:jobId/proposals`: **Pending**
- [ ] `GET /jobs/:jobId/proposals`: **Pending**
- [ ] `GET /proposals/my-proposals`: **Pending**
- [ ] `PATCH /proposals/:id` & `DELETE /proposals/:id`: **Pending**
- [ ] Unit & E2E tests: **Pending**
