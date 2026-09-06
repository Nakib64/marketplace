# Phase 13: Admin Content Moderation & Anti-Circumvention

## 1. Purpose
The purpose of Phase 13 is to protect marketplace integrity, enforce platform policy, and prevent revenue leakage (disintermediation / off-platform poaching). When clients or freelancers attempt to share direct contact channels (`WhatsApp`, `Telegram`, phone numbers, personal `bKash`/`Nagad` accounts) or post fraudulent job offers, this module automatically flags, quarantines, and queues them for administrative action. It also provides arbiters with the ability to strike defamatory or blackmail reviews.

---

## 2. What To Do
- [ ] Update `schema.prisma` with `JobReport` and moderation flag columns:
  - `Job.isFlagged`: `Boolean @default(false)`
  - `Job.flagReason`: `String?`
  - `JobReport` model linking reporter, target job, reason, and status (`PENDING`, `RESOLVED`, `DISMISSED`).
- [ ] Create `AdminModerationController` and `AdminModerationService` inside `src/admin/`.
- [ ] Implement `AntiCircumventionScanner`:
  - Regex pattern matching for Bangladeshi mobile numbers (`01XXXXXXXXX`, `+8801...`).
  - Blacklist keywords: `whatsapp`, `telegram`, `imo`, `gmail.com`, `yahoo.com`, `direct payment`, `offline`, `outside payment`, `personal bkash`.
- [ ] Implement `ModerateJobDto`:
  - `action`: `@IsEnum(['APPROVE', 'TERMINATE', 'EDIT_REQUIRED'])`.
  - `adminNotes`: `@IsString()`, `@MinLength(5)`, `@MaxLength(500)`.
- [ ] Implement `GET /admin/moderation/jobs` (Restricted to `ADMIN` role):
  - List jobs flagged by automated anti-circumvention scans or user reports.
- [ ] Implement `PATCH /admin/moderation/jobs/:id/action` (Restricted to `ADMIN` role):
  - `APPROVE`: Clears flag, restores status to `OPEN`.
  - `TERMINATE`: Changes job status to `CANCELED`, cancels any pending proposals, logs reason.
- [ ] Implement `GET /admin/moderation/reviews` (Restricted to `ADMIN` role):
  - List reported or disputed reviews.
- [ ] Implement `DELETE /admin/moderation/reviews/:id` (Restricted to `ADMIN` role):
  - Permanently remove defamatory or policy-violating reviews.
  - Automatically recompute affected freelancer's `successRate`.
- [ ] Write unit & integration tests covering keyword scanning, regex phone detection, job termination, and review removal side effects.

---

## 3. How To Do It (Implementation Details)

### A. Modular File Layout inside `src/admin/`
```
src/admin/
├── dto/
│   ├── moderate-job.dto.ts         # Job moderation action schema (APPROVE | TERMINATE)
│   └── moderation-query.dto.ts     # Status filter schema
├── controllers/
│   └── admin-moderation.controller.ts # Flagged jobs & reviews management routes
├── services/
│   ├── admin-moderation.service.ts # Job termination & review removal logic
│   └── anti-circumvention.service.ts # Regex & keyword scanner
└── admin-moderation.service.spec.ts # Vitest unit test suite
```

### B. Database Schema Additions (`prisma/schema.prisma`)
```prisma
model JobReport {
  id         String   @id @default(uuid())
  jobId      String
  job        Job      @relation(fields: [jobId], references: [id], onDelete: Cascade)
  reporterId String
  reporter   User     @relation(fields: [reporterId], references: [id], onDelete: Cascade)
  reason     String
  status     String   @default("PENDING") // PENDING, RESOLVED, DISMISSED
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([jobId])
  @@index([reporterId])
  @@index([status])
}
```

### C. Anti-Circumvention Scanner (`anti-circumvention.service.ts`)
```ts
@Injectable()
export class AntiCircumventionService {
  private readonly blacklistedKeywords = [
    'whatsapp',
    'telegram',
    'imo',
    'viber',
    'direct pay',
    'pay outside',
    'personal bkash',
    'personal nagad',
    'bank transfer directly',
    'pay me directly',
    'off platform',
  ];

  private readonly phoneRegex = /(?:\+?880|0)\s*1[3-9]\d{2}[\s-]*\d{3}[\s-]*\d{3}/g;
  private readonly emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

  /**
   * Scans text for off-platform communication triggers.
   */
  scanContent(text: string): { isFlagged: boolean; reasons: string[] } {
    const lower = text.toLowerCase();
    const reasons: string[] = [];

    // Check blacklisted keywords
    for (const kw of this.blacklistedKeywords) {
      if (lower.includes(kw)) {
        reasons.push(`Contains blacklisted term: "${kw}"`);
      }
    }

    // Check phone numbers
    if (this.phoneRegex.test(text)) {
      reasons.push('Contains phone number pattern');
    }

    // Check emails
    if (this.emailRegex.test(text)) {
      reasons.push('Contains email address pattern');
    }

    return {
      isFlagged: reasons.length > 0,
      reasons,
    };
  }
}
```

### D. Moderation Actions (`admin-moderation.service.ts`)
```ts
@Injectable()
export class AdminModerationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reviewsService: ReviewsService,
  ) {}

  async moderateJob(adminId: string, jobId: string, dto: ModerateJobDto) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundException('Job not found.');
    }

    if (dto.action === 'TERMINATE') {
      return await this.prisma.$transaction(async (tx) => {
        const updated = await tx.job.update({
          where: { id: jobId },
          data: {
            status: JobStatus.CANCELED,
            categoryName: `[TERMINATED BY ADMIN]: ${dto.adminNotes}`,
          },
        });

        // Reject pending proposals
        await tx.proposal.updateMany({
          where: { jobId, status: ProposalStatus.PENDING },
          data: { status: ProposalStatus.REJECTED },
        });

        return {
          message: 'Job terminated and proposals dismissed.',
          job: updated,
        };
      });
    }

    // APPROVE
    return await this.prisma.job.update({
      where: { id: jobId },
      data: { status: JobStatus.OPEN },
    });
  }

  async removeDefamatoryReview(adminId: string, reviewId: string) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
      throw new NotFoundException('Review not found.');
    }

    return await this.prisma.$transaction(async (tx) => {
      // 1. Delete review
      await tx.review.delete({ where: { id: reviewId } });

      // 2. Recompute freelancer stats
      await this.reviewsService.recalculateFreelancerStats(tx, review.revieweeId);

      return { message: 'Review removed and freelancer statistics recomputed.' };
    });
  }
}
```

---

## 4. Status & What Is Done
- [ ] `JobReport` model in `schema.prisma`: **Pending**
- [ ] `AntiCircumventionService` (Phone, email, and keyword scanner): **Pending**
- [ ] `AdminModerationController` and `AdminModerationService`: **Pending**
- [ ] `GET /admin/moderation/jobs` (Flagged jobs queue): **Pending**
- [ ] `PATCH /admin/moderation/jobs/:id/action` (Approve or terminate): **Pending**
- [ ] `DELETE /admin/moderation/reviews/:id` (Defamatory review removal): **Pending**
- [ ] Vitest unit test suite covering scanner rules and termination transactions: **Pending**
- [ ] TypeScript compilation (`npm run build` 0 errors): **Pending**
