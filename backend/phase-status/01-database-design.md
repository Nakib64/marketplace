# Phase 1: Database Design & Architecture

## 1. Purpose
The purpose of Phase 1 is to construct a scalable, high-integrity relational database schema for the Freelance Marketplace application using **PostgreSQL** and **Prisma ORM 7**. A robust database model ensures strict data consistency, efficient indexing for search & query performance, and financial data integrity for client-freelancer transactions, escrow, double-blind reviews, and local payout processing.

---

## 2. What To Do
- [x] Select and set up database technology stack (PostgreSQL + Prisma 7 ORM).
- [x] Configure Prisma 7 configuration file ([`prisma.config.ts`](file:///e:/Web%20Dev/startup/marketplace/backend/prisma.config.ts)) using `@prisma/config` with `env('DATABASE_URL')`.
- [x] Define relational data models in `schema.prisma`:
  - `User`: Core authentication entity with role (`CLIENT`, `FREELANCER`, `ADMIN`) and `walletBalance`.
  - `ClientProfile` & `FreelancerProfile`: `1:1` polymorphic profiles linked to `User`.
  - `Job`: Posted requirements, skills, budget, and job status.
  - `Proposal`: Freelancer bids on jobs with cover letters and bid amounts.
  - `Contract`: Escrow agreement linking client, freelancer, job, and proposal.
  - `Review`: Double-blind review and rating system post-contract completion.
  - `Withdrawal`: Local payment payout requests (bKash & Nagad).
- [x] Set up strict database integrity constraints (Unique keys on dual profiles, job proposals, double reviews, and payment IDs).
- [x] Add high-performance indexes on frequent query paths (emails, roles, job statuses, contract statuses, withdrawal queues).
- [x] Execute DDL database push to synchronize schema with local PostgreSQL instance (`marketplace_db`).
- [x] Generate type-safe Prisma Client (`v7.10.0`).

---

## 3. How To Do It (Implementation Details)

### A. Environment & Prisma 7 Configuration
- Managed connection strings inside `.env` via `DATABASE_URL`.
- Initialized `prisma.config.ts` using `@prisma/config`'s `defineConfig` helper:
```ts
import 'dotenv/config';
import { defineConfig, env } from '@prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
});
```

### B. Schema Relations & Enums Definition
Defined enum types for clear state management (`Role`, `JobStatus`, `ProposalStatus`, `ContractStatus`, `ReviewStatus`, `WithdrawalStatus`, `WithdrawalMethod`).

### C. Visual Entity-Relationship (ER) Diagram
```mermaid
erDiagram
    User ||--o| ClientProfile : "has 1:1"
    User ||--o| FreelancerProfile : "has 1:1"
    User ||--o{ Job : "posts as Client"
    User ||--o{ Proposal : "submits as Freelancer"
    User ||--o{ Contract : "contracted as Client"
    User ||--o{ Contract : "contracted as Freelancer"
    User ||--o{ Review : "gives as Reviewer"
    User ||--o{ Review : "receives as Reviewee"
    User ||--o{ Withdrawal : "requests payout"

    Job ||--o{ Proposal : "receives bids"
    Job ||--o{ Contract : "associated contracts"

    Proposal ||--o| Contract : "converts to 1:1"
    Contract ||--o{ Review : "produces reviews"

    User {
        UUID id PK
        String email UK
        String passwordHash
        Role role
        Boolean isEmailVerified
        Boolean isBanned
        Decimal walletBalance
        DateTime createdAt
        DateTime updatedAt
    }

    ClientProfile {
        UUID id PK
        UUID userId FK, UK
        String companyName
        String billingDetails
        Int totalJobPosts
        Decimal totalSpent
        DateTime createdAt
        DateTime updatedAt
    }

    FreelancerProfile {
        UUID id PK
        UUID userId FK, UK
        String bio
        Decimal hourlyRate
        String[] skills
        Int totalProjects
        Decimal earnings
        Float successRate
        DateTime createdAt
        DateTime updatedAt
    }

    Job {
        UUID id PK
        UUID clientId FK
        String title
        String description
        Decimal budget
        String[] skills
        JobStatus status
        DateTime createdAt
        DateTime updatedAt
    }

    Proposal {
        UUID id PK
        UUID jobId FK
        UUID freelancerId FK
        Decimal bidAmount
        String coverLetter
        ProposalStatus status
        DateTime createdAt
        DateTime updatedAt
    }

    Contract {
        UUID id PK
        UUID proposalId FK, UK
        UUID jobId FK
        UUID clientId FK
        UUID freelancerId FK
        Decimal escrowAmount
        Decimal platformFee
        String sslcommerzId UK
        ContractStatus status
        DateTime createdAt
        DateTime updatedAt
    }

    Review {
        UUID id PK
        UUID contractId FK
        UUID reviewerId FK
        UUID revieweeId FK
        Int rating
        String feedback
        String counterFeedback
        ReviewStatus status
        DateTime createdAt
        DateTime updatedAt
    }

    Withdrawal {
        UUID id PK
        UUID freelancerId FK
        Decimal amount
        WithdrawalMethod method
        String accountNumber
        WithdrawalStatus status
        DateTime createdAt
        DateTime updatedAt
    }
```

---

## 4. Status & What Is Done
- [x] **Database Engine & ORM**: PostgreSQL installed, running locally on port 5432. Prisma 7 (`7.10.0`) configured.
- [x] **Prisma Configuration**: `prisma.config.ts` initialized and verified.
- [x] **Prisma Client**: Generated successfully to `node_modules/@prisma/client`.
- [x] **Database Sync**: Executed `npx prisma db push --force-reset` to establish database tables.
- [x] **NestJS Integration**: `PrismaService` updated for Prisma 7 compatibility in NestJS.
- [x] **Build Verification**: `npx tsc --noEmit` verified with 0 errors.
