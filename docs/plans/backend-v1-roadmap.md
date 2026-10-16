# Implementation Plan - Freelance Marketplace

This plan outlines the architecture, database schema, NestJS backend API design, and execution strategy for the freelance marketplace based on the **Master Specification Document**.

## User Review Required

> [!IMPORTANT]
> **Database & Stack Highlights:**
> 1. **PostgreSQL + Prisma ORM**: Ensures strict schema enforcement, relational integrity, native Enums, and precise money handling using `Decimal(12, 2)`.
> 2. **Anti-N+1 Strategy**: Solves Postgres/ORM N+1 query bottlenecks through structured Prisma `include`/`select` queries and database compound indexes (`@@index([status, createdAt])`, `@@index([jobId, status])`, `@@index([contractId, status])`).
> 3. **Financial Concurrency Safety**: Atomic balance locks and escrow release using Prisma `$transaction` and conditional updates to prevent double-spending or race conditions on withdrawals and contract approvals.
> 4. **Redis Integration**: 5-minute TTL for email registration OTPs.

---

## 1. Database Schema & Postgres Optimization Architecture

### PostgreSQL N+1 & Concurrency Resolution Design

1. **N+1 Prevention**:
   - Every foreign key column (`userId`, `jobId`, `freelancerId`, `clientId`, `contractId`, `reviewerId`, `revieweeId`) will have explicit database indexes.
   - High-cardinality search queries (e.g. `OPEN` jobs browsing, bid listings per job, pending payout queue) use compound indexes like `[status, createdAt]` and `[jobId, status]`.
   - Backend queries mandate targeted `select` / `include` structures rather than unindexed runtime join loops.

2. **Money Precision & Math Safety**:
   - `budget`, `bid_amount`, `escrow_amount`, `platform_fee`, `walletBalance`, and `amount` are defined as `Decimal(12, 2)` (PostgreSQL `NUMERIC(12, 2)`), eliminating IEEE floating-point precision flaws.

3. **Double-Spending & Race Condition Guardrails**:
   - **Withdrawal Lock (Step 18)**: Executed via `$transaction` with condition checking: `walletBalance >= amount`. Only if satisfied, `walletBalance` is decremented atomically in the same query block before inserting the `Withdrawal` record.
   - **Escrow Release (Step 12)**: Executed within an isolated `$transaction` block. Guarantees contract status checks before mutating balances and updating contract/job statuses simultaneously.
   - **Double-Blind Review Constraints**: DB-level unique index `@@unique([contractId, reviewerId])` prevents double review submission.

### Core Schema Definition (`prisma/schema.prisma`)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  CLIENT
  FREELANCER
  ADMIN
}

enum JobStatus {
  OPEN
  IN_PROGRESS
  COMPLETED
  CANCELED
}

enum ProposalStatus {
  PENDING
  ACCEPTED
  REJECTED
}

enum ContractStatus {
  FUNDED
  PENDING_APPROVAL
  COMPLETED
  DISPUTED
}

enum ReviewStatus {
  HIDDEN
  PUBLISHED
}

enum WithdrawalStatus {
  PENDING
  APPROVED
  REJECTED
}

enum WithdrawalMethod {
  BKASH
  NAGAD
}

model User {
  id               String            @id @default(uuid())
  email            String            @unique
  passwordHash     String
  role             Role
  isEmailVerified  Boolean           @default(false)
  isBanned         Boolean           @default(false)
  walletBalance    Decimal           @default(0.00) @db.Decimal(12, 2)
  createdAt        DateTime          @default(now())
  updatedAt        DateTime          @updatedAt

  clientProfile    ClientProfile?
  freelancerProfile FreelancerProfile?
  postedJobs       Job[]             @relation("ClientJobs")
  proposals        Proposal[]
  clientContracts  Contract[]        @relation("ClientContracts")
  freelancerContracts Contract[]     @relation("FreelancerContracts")
  givenReviews     Review[]          @relation("GivenReviews")
  receivedReviews  Review[]          @relation("ReceivedReviews")
  withdrawals      Withdrawal[]

  @@index([email])
  @@index([role])
}

model ClientProfile {
  id            String   @id @default(uuid())
  userId        String   @unique
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  companyName   String?
  billingDetails String?
  totalJobPosts Int      @default(0)
  totalSpent    Decimal  @default(0.00) @db.Decimal(12, 2)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model FreelancerProfile {
  id            String   @id @default(uuid())
  userId        String   @unique
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  bio           String?
  hourlyRate    Decimal? @db.Decimal(10, 2)
  skills        String[]
  totalProjects Int      @default(0)
  earnings      Decimal  @default(0.00) @db.Decimal(12, 2)
  successRate   Float    @default(0.0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Job {
  id          String    @id @default(uuid())
  clientId    String
  client      User      @relation("ClientJobs", fields: [clientId], references: [id], onDelete: Cascade)
  title       String
  description String
  budget      Decimal   @db.Decimal(12, 2)
  skills      String[]
  status      JobStatus @default(OPEN)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  proposals   Proposal[]
  contracts   Contract[]

  @@index([status, createdAt])
  @@index([clientId])
}

model Proposal {
  id           String         @id @default(uuid())
  jobId        String
  job          Job            @relation(fields: [jobId], references: [id], onDelete: Cascade)
  freelancerId String
  freelancer   User           @relation(fields: [freelancerId], references: [id], onDelete: Cascade)
  bidAmount    Decimal        @db.Decimal(12, 2)
  coverLetter  String
  status       ProposalStatus @default(PENDING)
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt

  contract     Contract?

  @@unique([jobId, freelancerId])
  @@index([jobId, status])
  @@index([freelancerId])
}

model Contract {
  id            String         @id @default(uuid())
  proposalId    String         @unique
  proposal      Proposal       @relation(fields: [proposalId], references: [id], onDelete: Cascade)
  jobId         String
  job           Job            @relation(fields: [jobId], references: [id], onDelete: Cascade)
  clientId      String
  client        User           @relation("ClientContracts", fields: [clientId], references: [id], onDelete: Cascade)
  freelancerId  String
  freelancer    User           @relation("FreelancerContracts", fields: [freelancerId], references: [id], onDelete: Cascade)
  escrowAmount  Decimal        @db.Decimal(12, 2)
  platformFee   Decimal        @db.Decimal(12, 2)
  sslcommerzId  String?        @unique
  status        ContractStatus @default(FUNDED)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  reviews       Review[]

  @@index([clientId])
  @@index([freelancerId])
  @@index([status])
}

model Review {
  id             String       @id @default(uuid())
  contractId     String
  contract       Contract     @relation(fields: [contractId], references: [id], onDelete: Cascade)
  reviewerId     String
  reviewer       User         @relation("GivenReviews", fields: [reviewerId], references: [id])
  revieweeId     String
  reviewee       User         @relation("ReceivedReviews", fields: [revieweeId], references: [id])
  rating         Int          
  feedback       String
  counterFeedback String?
  status         ReviewStatus @default(HIDDEN)
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  @@unique([contractId, reviewerId])
  @@index([contractId])
  @@index([revieweeId, status])
}

model Withdrawal {
  id            String           @id @default(uuid())
  freelancerId  String
  freelancer    User             @relation(fields: [freelancerId], references: [id], onDelete: Cascade)
  amount        Decimal          @db.Decimal(12, 2)
  method        WithdrawalMethod
  accountNumber String
  status        WithdrawalStatus @default(PENDING)
  createdAt     DateTime         @default(now())
  updatedAt     DateTime         @updatedAt

  @@index([freelancerId])
  @@index([status, createdAt])
}
```

---

## 2. NestJS Backend Architecture & Endpoints

### Core NestJS Modules

1. **PrismaModule**: Global Prisma database connection service.
2. **RedisModule / RedisService**: Redis client for OTP management (`SET key otp EX 300`).
3. **AuthModule**: JWT strategy, Guards (`JwtAuthGuard`, `RolesGuard`), password hashing, OTP verification.
4. **ProfileModule**: Client and Freelancer profile creation, updating, and querying.
5. **JobModule**: Creating jobs, browsing OPEN jobs with filters/pagination, fetching single job details.
6. **ProposalModule**: Bidding on jobs, listing proposals for clients and freelancers.
7. **ContractModule**: SSLCommerz payment initialization, IPN Webhook handling, escrow locking, work submission, and client approval/fund release.
8. **ReviewModule**: Submitting double-blind reviews, auto-publishing engine (both reviews submitted or 14-day timeout), profile statistics recalculation, and counter-review submission.
9. **WithdrawalModule**: Requesting bKash/Nagad withdrawals, wallet balance validation & deduction.
10. **AdminModule**: Ledger monitoring, payout approval/rejection with wallet refunds, dispute resolution (force refund/release), user management, and user impersonation token generation.

### Detailed API Specs & Validation DTOs

| Method | Endpoint | Auth / Roles | Request Body / Query | Description / Action |
| --- | --- | --- | --- | --- |
| `POST` | `/auth/register` | Public | `RegisterDto` (email, password, role) | Creates user with `isEmailVerified: false`, stores 6-digit OTP in Redis (5 min TTL), sends email. |
| `POST` | `/auth/verify-otp` | Public | `VerifyOtpDto` (email, otp) | Validates OTP against Redis, sets `isEmailVerified: true`, returns JWT token. |
| `POST` | `/auth/resend-otp` | Public | `ResendOtpDto` (email) | Generates new OTP in Redis and sends email. |
| `POST` | `/auth/login` | Public | `LoginDto` (email, password) | Validates credentials & email verification, returns JWT token. |
| `POST` | `/profiles/client` | Client | `CreateClientProfileDto` (companyName, billingDetails) | Initializes `ClientProfile`. |
| `POST` | `/profiles/freelancer` | Freelancer | `CreateFreelancerProfileDto` (bio, hourlyRate, skills) | Initializes `FreelancerProfile`. |
| `GET` | `/profiles/me` | Authenticated | None | Returns profile data & current statistics. |
| `POST` | `/jobs` | Client | `CreateJobDto` (title, description, budget, skills) | Creates job record with status `OPEN`. |
| `GET` | `/jobs` | Public | Query: `page, limit, search, skills` | Lists `OPEN` jobs with pagination (N+1 optimized). |
| `GET` | `/jobs/:id` | Public | Param: `id` | Single job details + proposal count. |
| `POST` | `/proposals` | Freelancer | `CreateProposalDto` (jobId, bidAmount, coverLetter) | Submits bid with status `PENDING`. |
| `GET` | `/proposals/job/:jobId` | Client | Param: `jobId` | Lists all proposals submitted for client's job. |
| `GET` | `/proposals/my-proposals` | Freelancer | Query: `status` | Lists bids submitted by freelancer. |
| `POST` | `/contracts/initialize` | Client | `InitializeContractDto` (proposalId) | Generates SSLCommerz payment gateway URL for proposal bid amount. |
| `POST` | `/contracts/webhook/sslcommerz` | Public / Webhook | Form/JSON: IPN payload | Transaction: verifies payment -> creates `Contract` (`FUNDED`), sets job `IN_PROGRESS`, sets proposal `ACCEPTED`, rejects other proposals. |
| `POST` | `/contracts/:id/submit-work` | Freelancer | Param: `id` | Sets `Contract` status to `PENDING_APPROVAL`. |
| `POST` | `/contracts/:id/approve` | Client | Param: `id` | Transaction: deducts escrow, adds `(escrow - platformFee)` to freelancer's `walletBalance`, sets contract & job to `COMPLETED`. |
| `POST` | `/reviews` | Authenticated | `CreateReviewDto` (contractId, rating, feedback) | Submits rating (1-5) and feedback as status `HIDDEN`. |
| `GET` | `/reviews/contract/:contractId` | Authenticated | Param: `contractId` | Fetches review state. Returns content only if `PUBLISHED` or user's own review. |
| `POST` | `/reviews/:id/counter` | Client | `CounterReviewDto` (counterFeedback) | Submits counter-response on freelancer review after publishing. |
| `POST` | `/withdrawals/request` | Freelancer | `CreateWithdrawalDto` (amount, method, accountNumber) | Validates balance, atomically deducts amount from `walletBalance`, creates `Withdrawal` (`PENDING`). |
| `GET` | `/withdrawals/my-requests` | Freelancer | None | Gets history of freelancer withdrawal requests. |
| `GET` | `/admin/ledger` | Admin | None | System financial dashboard (escrow locked, fees earned, total payouts). |
| `GET` | `/admin/payouts` | Admin | Query: `status` | Lists withdrawal requests (default: `PENDING`). |
| `POST` | `/admin/payouts/:id/approve` | Admin | Param: `id` | Marks withdrawal status `APPROVED`. |
| `POST` | `/admin/payouts/:id/reject` | Admin | Param: `id` | Marks withdrawal `REJECTED`, refunds amount back to freelancer `walletBalance`. |
| `POST` | `/admin/disputes/:contractId/refund` | Admin | Param: `contractId` | Forces full refund of `FUNDED`/`PENDING_APPROVAL` contract back to client. |
| `POST` | `/admin/disputes/:contractId/release` | Admin | Param: `contractId` | Forces release of escrow funds to freelancer. |
| `PATCH` | `/admin/users/:id/status` | Admin | `UpdateUserStatusDto` (isBanned) | Bans/unbans user. |
| `POST` | `/admin/impersonate/:userId` | Admin | Param: `userId` | Issues a valid JWT token for target user to impersonate them. |

---

## 3. Implementation Workflow Strategy

### Phase 1: Database Setup & Infrastructure Core
- Install Prisma, `@prisma/client`, `@nestjs/jwt`, `passport-jwt`, `bcrypt`, `class-validator`, `ioredis` in `backend`.
- Create `prisma/schema.prisma` with exact enums, models, indexes, and relations.
- Initialize database service (`PrismaService`) and Redis service (`RedisService`).

### Phase 2: Auth, Onboarding & User Profiles
- Implement `AuthModule` with registration, 6-digit OTP generation, Redis 5-min TTL storage, Nodemailer/console mailer, OTP validation, and JWT issuing.
- Implement `ProfileModule` for client billing details and freelancer bio/skills/rate initialization.
- Implement JWT Guards and Role-based Access Control (`@Roles('CLIENT')`, `@Roles('FREELANCER')`, `@Roles('ADMIN')`).

### Phase 3: Job Market & Bidding Loop
- Implement `JobModule` with validation DTOs (`CreateJobDto`) and OPEN job query endpoints with pagination & skill filtering.
- Implement `ProposalModule` ensuring only freelancers can bid on OPEN jobs, enforcing 1 proposal per job per freelancer via DB unique index.

### Phase 4: Financial Transactions, Escrow & Work Submission
- Build `ContractModule` with SSLCommerz payment session creation.
- Build SSLCommerz IPN webhook with database `$transaction` (Contract `FUNDED`, Job `IN_PROGRESS`, accepted proposal `ACCEPTED`, other proposals `REJECTED`).
- Build work submission endpoint (`PENDING_APPROVAL`) and client approval endpoint with financial transaction (escrow deduction, platform fee calculation, freelancer wallet credit, `COMPLETED` statuses).

### Phase 5: Double-Blind Review Engine & Stats Calculation
- Implement `ReviewModule` saving initial reviews as `HIDDEN`.
- Add auto-publish checker: when both reviews exist (or on contract trigger), transition reviews to `PUBLISHED` and update freelancer (`totalProjects`, `earnings`, `successRate`) and client (`totalJobPosts`, `totalSpent`) profile metrics.
- Support client counter-feedback post-publication.

### Phase 6: Freelancer Withdrawals & Admin Command Center
- Build `WithdrawalModule` with balance verification and atomic lock.
- Build `AdminModule` featuring global ledger statistics, payout approval/rejection (with wallet refund on rejection), dispute force-refund and force-release actions, user banning, and token impersonation.

### Phase 7: Backend Verification & E2E Testing
- Run test suites and verify all API endpoints against strict specification logic.
