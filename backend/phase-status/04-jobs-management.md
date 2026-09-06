# Phase 4: Job Management Module

## 1. Purpose
The purpose of Phase 4 is to build the Job Management Engine where Clients can publish job postings, edit existing requirements, view posted jobs, and cancel jobs. It also allows Freelancers and general users to search, filter, and view details of open marketplace jobs.

---

## 2. What To Do
- [ ] Create `JobsModule`, `JobsController`, and `JobsService`.
- [ ] Implement `CreateJobDto` and `UpdateJobDto` with `class-validator`.
- [ ] Implement `POST /jobs`: Restrict to `CLIENT` role. Create job record and increment `ClientProfile.totalJobPosts`.
- [ ] Implement `GET /jobs`: Public search endpoint with pagination (`page`, `limit`), filtering (`skills`, `minBudget`, `maxBudget`, `status`), and search query (`q` matching title/description).
- [ ] Implement `GET /jobs/:id`: Retrieve detailed job payload with client information and proposal metrics.
- [ ] Implement `PATCH /jobs/:id`: Restrict to job owner (Client). Allow editing title, description, budget, skills.
- [ ] Implement `DELETE /jobs/:id` or `PATCH /jobs/:id/cancel`: Restrict to job owner. Change status to `CANCELED`.
- [ ] Implement `GET /jobs/my-jobs`: Client endpoint to retrieve all jobs posted by the authenticated user.
- [ ] Write unit & integration tests for job creation and search filtering.

---

## 3. How To Do It (Implementation Details)

### A. DTO Specifications
- **`CreateJobDto`**:
  - `title`: `@IsString()`, `@MinLength(5)`, `@MaxLength(150)`.
  - `description`: `@IsString()`, `@MinLength(20)`.
  - `budget`: `@IsNumber()`, `@Min(1)`.
  - `skills`: `@IsArray()`, `@IsString({ each: true })`, `@ArrayMinSize(1)`.

### B. Job Creation Logic
```ts
// Create Job
async createJob(clientId: string, dto: CreateJobDto) {
  return await this.prisma.$transaction(async (tx) => {
    const job = await tx.job.create({
      data: {
        clientId,
        title: dto.title,
        description: dto.description,
        budget: dto.budget,
        skills: dto.skills,
        status: JobStatus.OPEN,
      },
    });

    await tx.clientProfile.update({
      where: { userId: clientId },
      data: { totalJobPosts: { increment: 1 } },
    });

    return job;
  });
}
```

### C. Search & Pagination Querying
```ts
// Search Jobs
async searchJobs(query: SearchJobsDto) {
  const { q, skills, minBudget, maxBudget, status = JobStatus.OPEN, page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.JobWhereInput = {
    status,
    ...(q ? {
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ],
    } : {}),
    ...(skills && skills.length > 0 ? { skills: { hasSome: skills } } : {}),
    ...(minBudget || maxBudget ? {
      budget: {
        gte: minBudget ?? undefined,
        lte: maxBudget ?? undefined,
      },
    } : {}),
  };

  const [data, total] = await Promise.all([
    this.prisma.job.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        client: {
          select: { id: true, email: true, clientProfile: true },
        },
        _count: { select: { proposals: true } },
      },
    }),
    this.prisma.job.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}
```

---

## 4. Status & What Is Done
- [ ] `JobsModule`, `JobsController`, `JobsService`: **Pending**
- [ ] `CreateJobDto` & `UpdateJobDto`: **Pending**
- [ ] `POST /jobs` (Client job post): **Pending**
- [ ] `GET /jobs` (Public search & pagination): **Pending**
- [ ] `GET /jobs/:id` (Job detail): **Pending**
- [ ] `PATCH /jobs/:id` & `DELETE /jobs/:id`: **Pending**
- [ ] Unit & E2E tests: **Pending**
