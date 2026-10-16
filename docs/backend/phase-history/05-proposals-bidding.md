# Phase 5: Proposals & Bidding System

## 1. Purpose
The purpose of Phase 5 is to implement the competitive bidding module where Freelancers submit proposals for open jobs, attach relevant Work History entries, select up to **4 Portfolio Projects**, and manage submitted bids. Clients can inspect submitted bids, which automatically tracks proposal viewing state (`isViewed`).

---

## 2. What To Do
- [x] Update `Proposal` model in `schema.prisma`:
  - `workHistoryIds`: `String[]` (array of attached WorkHistory IDs)
  - `portfolioItemIds`: `String[]` (array of attached PortfolioItem IDs)
  - `isViewed`: `Boolean @default(false)`
- [x] Create `ProposalsModule`, sub-controllers, and sub-services.
- [x] Implement `CreateProposalDto`:
  - `bidAmount`: `@IsNumber()`, `@Min(1)`.
  - `coverLetter`: `@IsString()`, `@MinLength(30)`.
  - `workHistoryIds?`: `@IsArray()`, `@IsUUID(4, { each: true })`.
  - `portfolioItemIds?`: `@IsArray()`, `@IsUUID(4, { each: true })`, `@ArrayMaxSize(4, { message: 'You can attach a maximum of 4 portfolio projects to a proposal.' })`.
- [x] Implement `POST /proposals/job/:jobId`: Restrict to `FREELANCER` role.
  - Verify job is `OPEN`.
  - Enforce single proposal rule per job (`@@unique([jobId, freelancerId])`). Throw `ConflictException` if user already applied.
  - Store proposal with `isViewed: false`.
- [x] Implement `GET /jobs/:jobId/proposals`: Restrict to job owner (Client). Automatically marks retrieved proposals as `isViewed: true`.
- [x] Implement `GET /proposals/my-proposals`: Restrict to `FREELANCER` role. View submitted bids and their viewing status (`isViewed`).
- [x] Implement `PATCH /proposals/:id`: Restrict to proposal owner (Freelancer).
  - Verify `isViewed === false`. Throw `ForbiddenException('Cannot edit proposal after it has been viewed by the client.')` if viewed.
  - Allow editing bid amount, cover letter, work histories, or attached portfolio items (max 4).
- [x] Implement `DELETE /proposals/:id`: Restrict to proposal owner (Freelancer). Withdraw proposal.
- [x] Write unit tests for proposal creation rules, max 4 portfolio items, unviewed edit restriction, auto `isViewed` client update, and duplicate application prevention.

---

## 3. How To Do It (Sub-Service Architecture Layout)

### A. Modular File Layout inside `src/proposals/`
```
src/proposals/
├── dto/
│   ├── create-proposal.dto.ts      # Proposal submission schema with max 4 portfolio items
│   └── update-proposal.dto.ts      # Proposal update schema
├── controllers/
│   ├── proposals.controller.ts     # Freelancer proposal submission, edit & withdraw routes
│   └── client-proposals.controller.ts # Client proposal review & viewing state routes
├── services/
│   ├── proposals.service.ts        # Proposal creation, unviewed editing, withdrawal logic
│   └── client-proposals.service.ts # Client proposal inspection & automatic isViewed state tracking
├── proposals.service.spec.ts       # Vitest unit test suite
└── proposals.module.ts             # NestJS Proposals module definition
```

---

## 4. Status & What Is Done
- [x] `Proposal` Schema Update (`workHistoryIds`, `portfolioItemIds`, `isViewed`): **Completed**
- [x] `ProposalsModule`, `ProposalsController`, `ProposalsService`: **Completed**
- [x] `CreateProposalDto` (Max 4 Portfolio items): **Completed**
- [x] `POST /proposals/job/:jobId` (Single application check): **Completed**
- [x] `GET /jobs/:jobId/proposals` (Automatic `isViewed` update): **Completed**
- [x] `PATCH /proposals/:id` (Unviewed edit restriction): **Completed**
- [x] `DELETE /proposals/:id`: **Completed**
- [x] Unit & E2E tests (29 tests passing across workspace): **Completed**
- [x] TypeScript Compilation (`npm run build` / `nest build` 0 errors): **Completed**
