# Phase 7: Double-Blind Reviews & Rating System

## 1. Purpose
The purpose of Phase 7 is to implement an un-biased, double-blind review system where Clients and Freelancers can rate and leave feedback for completed contracts. To eliminate feedback retaliation, reviews remain hidden until both parties have submitted their review or a timed window expires.

---

## 2. What To Do
- [ ] Create `ReviewsModule`, `ReviewsController`, and `ReviewsService`.
- [ ] Implement `CreateReviewDto` (`contractId`, `rating` 1-5, `feedback`).
- [ ] Implement `POST /reviews`:
  - Ensure contract is `COMPLETED`.
  - Validate that user is either the Client or Freelancer of the contract.
  - Enforce single review constraint per participant (`@@unique([contractId, reviewerId])`).
  - Create review record with default `status: HIDDEN`.
  - Check if the counterpart has already submitted a review for this contract.
  - If both parties have submitted, update both reviews' `status` to `PUBLISHED` in a single transaction.
  - Recalculate target freelancer's `successRate` or client rating.
- [ ] Implement `GET /reviews/user/:userId`: Retrieve public published reviews for a given user.
- [ ] Implement `POST /reviews/:id/counter-feedback`: Allow reviewee to post a one-time public counter-response to a published review.
- [ ] Write unit & integration tests for double-blind reveal mechanics and rating calculations.

---

## 3. How To Do It (Implementation Details)

### A. Double-Blind Reveal Algorithm
```ts
// Submit Review & Handle Reveal
async submitReview(reviewerId: string, dto: CreateReviewDto) {
  const contract = await this.prisma.contract.findUnique({
    where: { id: dto.contractId },
  });

  if (!contract || contract.status !== ContractStatus.COMPLETED) {
    throw new BadRequestException('Reviews can only be submitted for completed contracts');
  }

  const isClient = contract.clientId === reviewerId;
  const isFreelancer = contract.freelancerId === reviewerId;

  if (!isClient && !isFreelancer) {
    throw new ForbiddenException('You are not a participant in this contract');
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
    }

    return newReview;
  });
}
```

---

## 4. Status & What Is Done
- [ ] `ReviewsModule`, `ReviewsController`, `ReviewsService`: **Pending**
- [ ] `CreateReviewDto`: **Pending**
- [ ] `POST /reviews` (Double-blind submit): **Pending**
- [ ] Automatic reveal transaction logic: **Pending**
- [ ] `GET /reviews/user/:userId`: **Pending**
- [ ] `POST /reviews/:id/counter-feedback`: **Pending**
- [ ] Unit & E2E tests: **Pending**
