# Phase 15: System Broadcasts, Maintenance Banners & Support Desk

## 1. Purpose
The purpose of Phase 15 is to establish **Direct Platform Communication & Customer Support Helpdesk** infrastructure. Administrators need the ability to broadcast system maintenance alerts, holiday banking schedules, or urgent policy updates across the marketplace. Simultaneously, users need a formalized in-app channel to submit customer support tickets for billing queries, account issues, and technical bugs that support agents can triage and resolve.

---

## 2. What To Do
- [ ] Update `schema.prisma` with `SystemBroadcast`, `SupportTicket`, and `TicketMessage` models.
- [ ] Implement `CreateBroadcastDto`:
  - `title`: `@IsString()`, `@MinLength(3)`, `@MaxLength(150)`.
  - `message`: `@IsString()`, `@MinLength(10)`, `@MaxLength(1000)`.
  - `type`: `@IsEnum(['INFO', 'WARNING', 'CRITICAL'])`.
  - `targetRole`: `@IsEnum(['ALL', 'CLIENT', 'FREELANCER'])`.
  - `expiresAt?`: `@IsOptional()`, `@IsDateString()`.
- [ ] Implement `POST /admin/broadcasts` (Restricted to `ADMIN` role):
  - Publish system-wide alert banner.
- [ ] Implement `GET /admin/broadcasts` & `DELETE /admin/broadcasts/:id`:
  - Admin management and deactivation of alert banners.
- [ ] Implement `GET /broadcasts/active` (Public / Authenticated):
  - Returns currently active banners filtered by target role and expiration date.
- [ ] Implement `CreateTicketDto`:
  - `subject`: `@IsString()`, `@MinLength(5)`, `@MaxLength(150)`.
  - `category`: `@IsEnum(['BILLING', 'CONTRACT', 'ACCOUNT', 'BUG', 'OTHER'])`.
  - `description`: `@IsString()`, `@MinLength(20)`.
- [ ] Implement `POST /support/tickets`: Authenticated user opens support ticket.
- [ ] Implement `GET /admin/support/tickets` (Restricted to `ADMIN` role):
  - Triage inbox supporting status filters (`OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`).
- [ ] Implement `POST /admin/support/tickets/:id/reply` & `POST /support/tickets/:id/reply`:
  - Two-way conversation thread between customer and support agent.
- [ ] Write unit & integration tests for active broadcast filtering, ticket state transitions, and reply thread persistence.

---

## 3. How To Do It (Implementation Details)

### A. Modular File Layout inside `src/admin/` and `src/support/`
```
src/support/
├── dto/
│   ├── create-broadcast.dto.ts     # Broadcast banner creation schema
│   ├── create-ticket.dto.ts        # Support ticket schema
│   └── ticket-reply.dto.ts         # Message reply schema
├── controllers/
│   ├── broadcasts.controller.ts    # Public active banner queries & admin creation
│   └── support-tickets.controller.ts# User ticket creation & conversation thread
├── services/
│   ├── broadcasts.service.ts       # Active banner filtering & lifecycle
│   └── support-tickets.service.ts  # Ticket triage, status progression & replies
└── support.module.ts               # Support & Broadcasts module registration
```

### B. Database Schema Additions (`prisma/schema.prisma`)
```prisma
enum BroadcastType {
  INFO
  WARNING
  CRITICAL
}

model SystemBroadcast {
  id         String        @id @default(uuid())
  title      String
  message    String
  type       BroadcastType @default(INFO)
  targetRole String        @default("ALL") // ALL, CLIENT, FREELANCER
  isActive   Boolean       @default(true)
  expiresAt  DateTime?
  createdBy  String
  createdAt  DateTime      @default(now())
  updatedAt  DateTime      @updatedAt

  @@index([isActive, expiresAt])
}

enum TicketStatus {
  OPEN
  IN_PROGRESS
  RESOLVED
  CLOSED
}

model SupportTicket {
  id          String          @id @default(uuid())
  userId      String
  user        User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  subject     String
  category    String
  status      TicketStatus    @default(OPEN)
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
  messages    TicketMessage[]

  @@index([userId])
  @@index([status])
}

model TicketMessage {
  id        String        @id @default(uuid())
  ticketId  String
  ticket    SupportTicket @relation(fields: [ticketId], references: [id], onDelete: Cascade)
  senderId  String
  sender    User          @relation(fields: [senderId], references: [id], onDelete: Cascade)
  message   String
  isAdmin   Boolean       @default(false)
  createdAt DateTime      @default(now())

  @@index([ticketId])
}
```

---

## 4. Status & What Is Done
- [ ] `SystemBroadcast`, `SupportTicket`, `TicketMessage` models in `schema.prisma`: **Pending**
- [ ] `BroadcastsService` & `BroadcastsController`: **Pending**
- [ ] `SupportTicketsService` & `SupportTicketsController`: **Pending**
- [ ] Active banner filtering logic (`expiresAt > now` and `isActive: true`): **Pending**
- [ ] Admin ticket triage inbox & two-way threaded messaging: **Pending**
- [ ] Vitest unit test suite covering broadcast expiration & ticket workflows: **Pending**
- [ ] TypeScript compilation (`npm run build` 0 errors): **Pending**
