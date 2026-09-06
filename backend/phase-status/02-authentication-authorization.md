# Phase 2: Authentication & Authorization System

## 1. Purpose
The purpose of Phase 2 is to establish a secure, enterprise-grade authentication and role-based access control (RBAC) foundation for the NestJS backend. This ensures users can securely register, log in, manage sessions via JSON Web Tokens (JWT), and access restricted API endpoints strictly according to their role (`CLIENT`, `FREELANCER`, or `ADMIN`).

---

## 2. What To Do
- [ ] Create `AuthModule`, `AuthController`, and `AuthService` in NestJS.
- [ ] Implement `RegisterDto` with `class-validator` (email validation, password strength rules, role selection).
- [ ] Implement `LoginDto` with `class-validator`.
- [ ] Implement secure password hashing and verification using `bcrypt` (10 salt rounds).
- [ ] Implement `POST /auth/register` endpoint:
  - Check for existing email duplicates.
  - Hash user password.
  - Create `User` record inside a Prisma transaction while automatically creating the corresponding `ClientProfile` or `FreelancerProfile`.
  - Return created user payload without `passwordHash`.
- [ ] Implement `POST /auth/login` endpoint:
  - Validate credentials.
  - Issue signed JWT access token containing `sub` (userId), `email`, and `role`.
- [ ] Implement `JwtStrategy` using `@nestjs/passport` and `passport-jwt`.
- [ ] Implement `JwtAuthGuard` and `@Public()` custom metadata decorator to secure endpoints by default.
- [ ] Implement `RolesGuard` and `@Roles(...)` custom decorator to enforce Role-Based Access Control.
- [ ] Implement `@CurrentUser()` parameter decorator to inject authenticated user object into controllers.
- [ ] Implement unit and E2E API tests using Vitest (`test/auth.e2e-spec.ts`).

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
// In AuthService.register
return await this.prisma.$transaction(async (tx) => {
  const hashedPassword = await bcrypt.hash(dto.password, 10);
  const user = await tx.user.create({
    data: {
      email: dto.email,
      passwordHash: hashedPassword,
      role: dto.role,
    },
  });

  if (dto.role === Role.CLIENT) {
    await tx.clientProfile.create({ data: { userId: user.id } });
  } else if (dto.role === Role.FREELANCER) {
    await tx.freelancerProfile.create({ data: { userId: user.id } });
  }

  const { passwordHash, ...result } = user;
  return result;
});
```

### C. JWT Strategy & Protection Mechanics
- `JwtStrategy`: Secret key loaded from `ConfigService.get('JWT_SECRET')`. Validates token payload against Prisma `User` database record.
- `JwtAuthGuard`: Registered globally in `AppModule` or applied per controller. Reflector checks `@Public()` decorator to bypass protection for public routes (`/auth/register`, `/auth/login`).
- `RolesGuard`: Reflector checks `@Roles(Role.CLIENT)` metadata and compares against `request.user.role`. Throws `ForbiddenException` if role requirement is not met.

### D. Parameter Decorator
```ts
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

---

## 4. Status & What Is Done
- [ ] `AuthModule` created: **Pending**
- [ ] `RegisterDto` & `LoginDto`: **Pending**
- [ ] Password hashing via `bcrypt`: **Pending**
- [ ] Transactional registration (`User` + Profile): **Pending**
- [ ] JWT authentication strategy: **Pending**
- [ ] `JwtAuthGuard`, `RolesGuard`, `@CurrentUser()` decorators: **Pending**
- [ ] Automated tests: **Pending**
