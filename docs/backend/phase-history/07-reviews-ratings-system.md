# Phase 7: Double-Blind Reviews & Rating System

## 1. Purpose
The purpose of Phase 7 is to implement an un-biased, double-blind review system where Clients and Freelancers can rate and leave feedback for completed contracts. To eliminate feedback retaliation, reviews remain hidden until both parties have submitted their review or a timed window expires.

---

## 2. What To Do
- [x] Create `ReviewsModule`, `ReviewsController`, and `ReviewsService`.
- [x] Implement `CreateReviewDto` (`contractId`, `rating` 1-5, `feedback`) and `CounterFeedbackDto` (`counterFeedback`).
- [x] Implement `POST /reviews`:
  - Ensure contract is `COMPLETED`.
  - Validate that user is either the Client or Freelancer of the contract.
  - Enforce single review constraint per participant (`@@unique([contractId, reviewerId])`).
  - Create review record with default `status: HIDDEN`.
  - Check if the counterpart has already submitted a review for this contract.
  - If both parties have submitted, update both reviews' `status` to `PUBLISHED` in a single transaction.
  - Recalculate target freelancer's `successRate` based on published ratings.
- [x] Implement `GET /reviews/user/:userId`: Retrieve public published reviews for a given user with aggregated average rating and total counts.
- [x] Implement `POST /reviews/:id/counter-feedback`: Allow reviewee to post a one-time public counter-response to a published review.
- [x] Implement `GET /reviews/contract/:contractId`: Allow contract participants to inspect submitted review state.
- [x] Write unit & integration tests for double-blind reveal mechanics, rating calculations, and counter-feedback rules.

---

## 3. How To Do It (Implementation Details)

### A. Modular File Layout inside `src/reviews/`
```
src/reviews/
├── dto/
│   ├── create-review.dto.ts        # Review submission schema (rating 1-5, feedback min 10 chars)
│   └── counter-feedback.dto.ts     # Reviewee counter-feedback schema
├── controllers/
│   └── reviews.controller.ts       # Review submission, counter feedback, public user reviews & contract check
├── services/
│   └── reviews.service.ts          # Double-blind reveal transaction & freelancer successRate recomputation
├── reviews.service.spec.ts         # Vitest unit test suite (11 passing tests)
└── reviews.module.ts               # Bundles controller & provider
```

### B. Double-Blind Reveal Algorithm
```ts
// Submit Review & Handle Reveal
async submitReview(reviewerId: string, dto: CreateReviewDto) {
  const contract = await this.prisma.contract.findUnique({
    where: { id: dto.contractId },
  });

  if (!contract || contract.status !== ContractStatus.COMPLETED) {
    throw new BadRequestException('Reviews can only be submitted for completed contracts.');
  }

  const isClient = contract.clientId === reviewerId;
  const isFreelancer = contract.freelancerId === reviewerId;

  if (!isClient && !isFreelancer) {
    throw new ForbiddenException('You are not a participant in this contract.');
  }

  const revieweeId = isClient ? contract.freelancerId : contract.clientId;

  return await this.prisma.$transaction(async (tx) => {
    // 1. Create reviewer's review (default HIDDEN)
    const newReview = await tx.review.create({
      data: {
        contractId: dto.contractId,
        reviewerId,
        revieweeId,
        rating: dto.rating,
        feedback: dto.feedback,
        status: ReviewStatus.HIDDEN,
      },
    });

    // 2. Check if counterpart submitted review
    const counterpartReview = await tx.review.findFirst({
      where: {
        contractId: dto.contractId,
        reviewerId: revieweeId,
      },
    });

    // 3. If both submitted, reveal both reviews
    if (counterpartReview) {
      await tx.review.updateMany({
        where: { contractId: dto.contractId },
        data: { status: ReviewStatus.PUBLISHED },
      });

      // Recalculate Freelancer success rate
      await this.recalculateFreelancerStats(tx, contract.freelancerId);

      return {
        ...newReview,
        status: ReviewStatus.PUBLISHED,
        message: 'Both reviews have been submitted and published.',
      };
    }

    return {
      ...newReview,
      message: 'Review submitted. It will remain hidden until the counterpart submits their review.',
    };
  });
}
```

---

## 4. Status & What Is Done
- [x] `ReviewsModule`, `ReviewsController`, `ReviewsService`: **Completed**
- [x] `CreateReviewDto` & `CounterFeedbackDto`: **Completed**
- [x] `POST /reviews` (Double-blind submit): **Completed**
- [x] Automatic reveal transaction logic (`HIDDEN` -> `PUBLISHED`): **Completed**
- [x] Automatic Freelancer `successRate` recomputation: **Completed**
- [x] `GET /reviews/user/:userId` (Public published reviews & rating metrics): **Completed**
- [x] `POST /reviews/:id/counter-feedback` (One-time reviewee response): **Completed**
- [x] `GET /reviews/contract/:contractId` (Participant review inspection): **Completed**
- [x] Vitest Unit Tests (49 passed across 8 test suites): **Completed**
- [x] TypeScript Compilation (`npm run build` 0 errors): **Completed**
