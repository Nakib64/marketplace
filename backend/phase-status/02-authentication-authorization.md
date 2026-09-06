# Phase 2: Authentication & Authorization System

## 1. Purpose
The purpose of Phase 2 is to establish a secure, enterprise-grade authentication and role-based access control (RBAC) foundation for the NestJS backend. This ensures users can securely register, log in, manage sessions via JSON Web Tokens (JWT), and access restricted API endpoints strictly according to their role (`CLIENT`, `FREELANCER`, or `ADMIN`).

---

## 2. What To Do
- [x] Create `AuthModule`, `AuthController`, and `AuthService` in NestJS.
- [x] Implement `RegisterDto` with `class-validator` (email validation, password strength rules, role selection).
- [x] Implement `LoginDto` with `class-validator`.
- [x] Implement secure password hashing and verification using `bcrypt` (10 salt rounds).
- [x] Implement `POST /auth/register` endpoint:
  - Check for existing email duplicates.
  - Hash user password.
  - Create `User` record inside a Prisma transaction while automatically creating the corresponding `ClientProfile` or `FreelancerProfile`.
  - Return created user payload without `passwordHash`.
- [x] Implement `POST /auth/login` endpoint:
  - Validate credentials.
  - Issue signed JWT access token containing `sub` (userId), `email`, and `role`.
- [x] Implement `JwtStrategy` using `@nestjs/passport` and `passport-jwt`.
- [x] Implement `JwtAuthGuard` and `@Public()` custom metadata decorator to secure endpoints by default.
- [x] Implement `RolesGuard` and `@Roles(...)` custom decorator to enforce Role-Based Access Control.
- [x] Implement `@CurrentUser()` parameter decorator to inject authenticated user object into controllers.
- [x] Implement unit and E2E API tests using Vitest (`src/auth/auth.service.spec.ts`).

---

## 3. How To Do It (Implementation Details)

### A. DTO Specifications & Validation Rules
- **`RegisterDto`**:
  - `email`: `@IsEmail()`, lowercased and trimmed.
  - `password`: `@MinLength(8)`, `@IsString()`.
  - `role`: `@IsEnum(Role)`. Must be either `Role.CLIENT` or `Role.FREELANCER`.
- **`LoginDto`**:
  - `email`: `@IsEmail()`.
  - `password`: `@IsNotEmpty()`.

### B. Transactional User & Profile Creation
```ts
return await this.prisma.$transaction(async (tx) => {
  const user = await tx.user.create({
    data: {
      email: dto.email.toLowerCase(),
      passwordHash: hashedPassword,
      role: dto.role,
    },
  });

  if (dto.role === Role.CLIENT) {
    await tx.clientProfile.create({ data: { userId: user.id } });
  } else if (dto.role === Role.FREELANCER) {
    await tx.freelancerProfile.create({ data: { userId: user.id } });
  }

  return user;
});
```

---

## 4. Status & What Is Done
- [x] `AuthModule` created: **Completed**
- [x] `RegisterDto` & `LoginDto`: **Completed**
- [x] Password hashing via `bcrypt`: **Completed**
- [x] Transactional registration (`User` + Profile): **Completed**
- [x] JWT authentication strategy: **Completed**
- [x] `JwtAuthGuard`, `RolesGuard`, `@CurrentUser()` decorators: **Completed**
- [x] Vitest Unit Tests (6 passed): **Completed**
- [x] TypeScript Compilation (`tsc --noEmit` 0 errors): **Completed**
