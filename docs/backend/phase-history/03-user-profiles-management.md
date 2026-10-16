# Phase 3: Users & Profiles Management Module

## 1. Purpose
The purpose of Phase 3 is to provide comprehensive management for user profiles, work history, and portfolio showcases:
- **Both Client & Freelancer Profiles**: Support adding, updating, and viewing **Work History** entries (`title`, `company`, `startDate`, `endDate`, `description`).
- **Freelancer Profiles**: Support a rich **Portfolio Section** where freelancers can publish project showcases with a `title`, `details`, `liveLink`, and up to **7 media images**, each with an optional `subtitle`/caption.

---

## 2. What To Do
- [x] Create modular sub-services and sub-controllers for `UsersModule`.
- [x] Implement `GET /users/me`: Retrieve currently authenticated user with their associated `ClientProfile` or `FreelancerProfile`, `workHistories`, and `portfolioItems` with media.
- [x] Implement `PATCH /users/me/client-profile`: Update Client profile fields (`companyName`, `billingDetails`).
- [x] Implement `PATCH /users/me/freelancer-profile`: Update Freelancer profile fields (`bio`, `hourlyRate`, `skills`).
- [x] **Work History Management**:
  - `POST /users/me/work-history`: Add a work history entry.
  - `PATCH /users/me/work-history/:id`: Update a work history entry.
  - `DELETE /users/me/work-history/:id`: Delete a work history entry.
- [x] **Freelancer Portfolio Management**:
  - `POST /users/me/portfolio`: Add a portfolio project (`title`, `details`, `liveLink`, `images` array max 7 with `imageUrl` & `subtitle`).
  - `PATCH /users/me/portfolio/:id`: Update a portfolio item or its images.
  - `DELETE /users/me/portfolio/:id`: Delete a portfolio project.
- [x] Implement `GET /users/freelancers`: Public directory listing of freelancers with filtering by skills, hourly rate range, and success rate sorting.
- [x] Implement `GET /users/freelancers/:id`: Public detail view for a freelancer profile with full portfolio and work history.
- [x] Write unit & integration tests for user profile, work history, and portfolio validation.

---

## 3. How To Do It (Refactored Sub-Service Architecture)

### A. Modular File Layout inside `src/users/`
```
src/users/
├── controllers/
│   ├── users.controller.ts          # /users/me profile endpoints
│   ├── work-history.controller.ts   # /users/me/work-history endpoints
│   ├── portfolio.controller.ts      # /users/me/portfolio endpoints
│   └── freelancers.controller.ts    # /users/freelancers public directory endpoints
├── services/
│   ├── users.service.ts             # Core user & client/freelancer profile logic
│   ├── work-history.service.ts      # Dedicated Work History CRUD
│   ├── portfolio.service.ts         # Dedicated Portfolio project & media gallery CRUD
│   └── freelancers-search.service.ts# Directory search & public freelancer profiles
├── dto/                             # Validation DTO schemas
└── users.module.ts                  # Bundles all sub-controllers & sub-services
```

### B. Portfolio DTO & Image Validation Rules
```ts
export class CreatePortfolioImageDto {
  @IsUrl()
  imageUrl: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  subtitle?: string;
}

export class CreatePortfolioItemDto {
  @IsString()
  @MinLength(3)
  @MaxLength(150)
  title: string;

  @IsString()
  @MinLength(10)
  details: string;

  @IsOptional()
  @IsUrl()
  liveLink?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePortfolioImageDto)
  @ArrayMaxSize(7, { message: 'A portfolio item can contain a maximum of 7 images.' })
  images: CreatePortfolioImageDto[];
}
```

---

## 4. Status & What Is Done
- [x] Database Models (`WorkHistory`, `PortfolioItem`, `PortfolioImage`): **Completed & Synced**
- [x] Modular Architecture Refactoring (Sub-services & sub-controllers under ~60 lines each): **Completed**
- [x] `UsersModule` registered in `AppModule`: **Completed**
- [x] Work History API Endpoints (`POST`, `PATCH`, `DELETE`): **Completed**
- [x] Freelancer Portfolio API Endpoints (`POST`, `PATCH`, `DELETE` with max 7 images & subtitles): **Completed**
- [x] `GET /users/freelancers` & `GET /users/freelancers/:id` (Full profile view): **Completed**
- [x] Vitest Unit Tests (13 passed across 3 suites): **Completed**
- [x] TypeScript Compilation (`tsc --noEmit` 0 errors): **Completed**
