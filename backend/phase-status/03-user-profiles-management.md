# Phase 3: Users & Profiles Management Module

## 1. Purpose
The purpose of Phase 3 is to provide comprehensive management for user profiles, allowing Clients to manage their company details and job metrics, and Freelancers to customize their public portfolio, bio, hourly rate, and skills. It also provides endpoints for users to manage account details and view profile statistics.

---

## 2. What To Do
- [ ] Create `UsersModule`, `UsersController`, and `UsersService`.
- [ ] Implement `GET /users/me`: Retrieve currently authenticated user with their associated `ClientProfile` or `FreelancerProfile`.
- [ ] Implement `PATCH /users/me/client-profile`: Update Client profile fields (`companyName`, `billingDetails`).
- [ ] Implement `PATCH /users/me/freelancer-profile`: Update Freelancer profile fields (`bio`, `hourlyRate`, `skills`).
- [ ] Implement `GET /users/freelancers`: Public directory listing of freelancers with filtering by skills, hourly rate range, and success rate sorting.
- [ ] Implement `GET /users/freelancers/:id`: Public detail view for a freelancer profile.
- [ ] Implement `UpdateClientProfileDto` and `UpdateFreelancerProfileDto` with validation rules.
- [ ] Write unit & integration tests for user profile updates.

---

## 3. How To Do It (Implementation Details)

### A. DTO Specifications
- **`UpdateClientProfileDto`**:
  - `companyName`: `@IsOptional()`, `@IsString()`, `@MaxLength(100)`.
  - `billingDetails`: `@IsOptional()`, `@IsString()`.
- **`UpdateFreelancerProfileDto`**:
  - `bio`: `@IsOptional()`, `@IsString()`, `@MaxLength(1000)`.
  - `hourlyRate`: `@IsOptional()`, `@IsNumber()`, `@Min(0)`.
  - `skills`: `@IsOptional()`, `@IsArray()`, `@IsString({ each: true })`.

### B. Profile Querying & Updates
```ts
// Update Freelancer Profile
async updateFreelancerProfile(userId: string, dto: UpdateFreelancerProfileDto) {
  const profile = await this.prisma.freelancerProfile.findUnique({
    where: { userId },
  });
  if (!profile) {
    throw new NotFoundException('Freelancer profile not found');
  }
  return this.prisma.freelancerProfile.update({
    where: { userId },
    data: dto,
  });
}
```

### C. Freelancer Directory Search Query
```ts
// Search Freelancers
async searchFreelancers(skills?: string[], minRate?: number, maxRate?: number) {
  return this.prisma.freelancerProfile.findMany({
    where: {
      ...(skills && skills.length > 0 ? { skills: { hasSome: skills } } : {}),
      ...(minRate || maxRate ? {
        hourlyRate: {
          gte: minRate ?? undefined,
          lte: maxRate ?? undefined,
        }
      } : {}),
    },
    include: {
      user: {
        select: { id: true, email: true, createdAt: true },
      },
    },
    orderBy: { successRate: 'desc' },
  });
}
```

---

## 4. Status & What Is Done
- [ ] `UsersModule`, `UsersController`, `UsersService`: **Pending**
- [ ] `GET /users/me`: **Pending**
- [ ] `PATCH /users/me/client-profile`: **Pending**
- [ ] `PATCH /users/me/freelancer-profile`: **Pending**
- [ ] `GET /users/freelancers` (Directory search): **Pending**
- [ ] Unit & E2E tests: **Pending**
