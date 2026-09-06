# Freelance Marketplace - Backend API

A high-performance, enterprise-grade RESTful and Real-Time Backend API for a Freelance Marketplace platform (similar to Upwork / Fiverr) built with **NestJS 12**, **PostgreSQL**, **Prisma ORM**, **Redis**, and **Socket.io**.

---

## 💡 What Is This Project? (Plain English Summary)

Imagine a trusted digital marketplace where businesses and individuals can hire skilled professionals—like software developers, designers, writers, and marketers—safely and transparently.

This backend application is the **digital brain and engine** powering the entire platform. It handles everything behind the scenes: user accounts, job postings, proposals, live chat, payments, escrow protection, wallets, and administration.

### 👥 Who Uses the Platform?

1. **Clients (Employers / Businesses)**:
   - Post jobs describing tasks they need completed along with their budget.
   - Review incoming proposals, prices, and portfolios submitted by freelancers.
   - Chat live with candidates, interview them, and share project documents.
   - Hire freelancers with 100% financial peace of mind using escrow protection.
   - Approve finished work and leave honest feedback ratings.

2. **Freelancers (Service Providers / Talent)**:
   - Create professional profiles showcasing their skills, hourly rates, work history, and project portfolios.
   - Search for open job opportunities and submit custom proposals with their price bid.
   - Message directly with clients to clarify project details and coordinate delivery.
   - Get paid guaranteed money into their platform wallet as soon as work is approved.
   - Withdraw earnings directly to their local mobile money accounts (bKash, Nagad).

3. **Platform Administrators & Moderators (Back-Office Team)**:
   - Monitor platform health, verify accounts, and resolve disputes if a client and freelancer disagree on deliverables.
   - Approve withdrawal payout requests and manage platform transaction fees.
   - Review automatically flagged messages or proposals (e.g. users attempting to share phone numbers or take payments off-platform).
   - Ensure the marketplace remains safe, professional, and fraud-free.

---

### 🔄 How Does a Complete Project Work? (The 7-Step Journey)

```mermaid
flowchart LR
    A["1. Client Posts Job"] --> B["2. Freelancers Bid"]
    B --> C["3. Real-Time Chat"]
    C --> D["4. Escrow Deposit"]
    D --> E["5. Work Submitted"]
    E --> F["6. Funds Released"]
    F --> G["7. Review & Payout"]
```

1. **Posting a Job**: A client creates a job listing describing the task (e.g., *"Build an E-commerce Website"*), setting a budget (e.g., *$500*), and choosing the required skills.
2. **Submitting Proposals**: Freelancers browse open jobs and submit their bid (e.g., *$450*), estimated delivery time, cover letter, and relevant portfolio samples.
3. **Live Chat & File Sharing**: When a client replies to a proposal, a secure chat room opens instantly. Both parties can exchange messages, ask questions, and share project files.
4. **Hiring with Safe Escrow**: When the client hires the freelancer, the money is not sent directly to the freelancer right away. Instead, it is locked into a **secure escrow holding vault**. The freelancer knows the money is guaranteed, and the client knows they only pay if the work is delivered.
5. **Submitting Deliverables**: The freelancer completes the project and submits the final deliverables through the contract portal.
6. **Approval & Wallet Payout**: The client inspects the work. Once satisfied, they click **"Approve"**. The platform automatically releases the escrow funds directly into the freelancer's wallet balance (after deducting the platform service fee).
7. **Withdrawal & Double-Blind Reviews**:
   - The freelancer can withdraw their wallet funds to bKash or Nagad.
   - Both parties review each other. Reviews stay hidden until both submit (or the deadline expires), ensuring 100% honest and non-retaliatory feedback.
   - If a dispute ever happens, platform admins step in as unbiased judges to review the submitted work and either refund the client or release the payment.

---

## Architecture & System Design

```
+-----------------------------------------------------------------------------------+
|                                CLIENT APPLICATION                                  |
|     (Freelancer Web / Client Web / Mobile Web / Admin Back-Office Portal)          |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                           SECURITY & GUARD PIPELINE                               |
|  [Helmet Security Headers] -> [Strict CORS] -> [Redis Rate Limiting (Sliding)]    |
|       -> [JwtAuthGuard (Dual Actor)] -> [RolesGuard] -> [EmailVerifiedGuard]      |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                             API CONTROLLER LAYER                                  |
|   /auth       /admin/auth   /users      /jobs       /proposals    /chat           |
|   /contracts  /reviews      /wallet     /categories /admin/*      WebSocket       |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                        SUB-SERVICE ARCHITECTURE LAYER                             |
|  High-complexity domains split into single-responsibility sub-services (<120 LOC) |
|  coordinated by lean facades (e.g. ChatService, AuthService, AdminAuthService)    |
+-------------------+---------------------------------------+-----------------------+
                    |                                       |
                    v                                       v
+-------------------------------------+   +-----------------------------------------+
|     POSTGRESQL (via Prisma ORM)     |   |          REDIS CACHE & QUEUES           |
|  - Actor Segregation (Admin vs User)|   |  - Token Revocation & Sessions          |
|  - Escrow Contracts & Ledgers       |   |  - Sliding-Window Rate Limit Counters   |
|  - Real-time Chat Threads & Messages|   |  - Proposals Queue (Anti-Circumvention) |
|  - Taxonomy, Reviews, Audit Logs    |   |  - Messages Queue (Offline Alerts)      |
+-------------------------------------+   +-----------------------------------------+
```

### Key Architectural Highlights
1. **Front-Office vs. Back-Office Segregation (Actor Separation)**:
   - **Marketplace Users (`User` table)**: Restricted strictly to `CLIENT` or `FREELANCER` roles. Public signup cannot escalate to staff privileges.
   - **Internal Staff (`Admin` table)**: Dedicated credentials, isolated login routes (`/admin/auth/*`), granular staff roles (`SUPER_ADMIN`, `ADMIN`, `MODERATOR`, `SUPPORT`), and scaffolded 2FA/TOTP fields.
2. **Enterprise Security Hardening**:
   - **Dual-Token System**: 15-minute access tokens and rotating refresh tokens (7 days for users, 24 hours for staff) backed by Redis session blacklisting and theft revocation.
   - **Distributed Sliding-Window Rate Limiting**: Redis-powered protection against brute-force attacks on sensitive auth routes.
   - **Defense-in-Depth Email Verification**: `EmailVerifiedGuard` restricts posting jobs, submitting proposals, and requesting fund withdrawals to verified accounts.
   - **Helmet & CORS**: Hardened HTTP headers and restricted origins.
3. **Asynchronous Redis Queues & Background Workers**:
   - **Proposal Queue**: Background moderation worker scans proposal cover letters for contact and off-platform payment circumvention keywords (e.g., WhatsApp, Telegram, PayPal). Auto-flags suspicious proposals for admin review and notifies clients.
   - **Message Queue**: Background content scanner detects off-platform communication leaks and dispatches offline email/push alerts to recipients.
   - **Dead-Letter Queue (DLQ)**: Failed background jobs are safely rerouted to DLQ queues after 3 retries.
4. **Sub-Service Architecture Pattern**:
   - All complex domains adhere to the sub-service architecture: lean coordinator facades delegating to focused sub-services under 120 lines for high maintainability, isolated unit testing, and modularity.

---

## API Endpoints Reference

### 1. Public Authentication (`/auth`)
Handles client and freelancer registration, login, token rotation, and sessions.

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Public | Register new user. Role must be `CLIENT` or `FREELANCER`. (Rate Limit: 3/min) |
| `POST` | `/auth/login` | Public | Login with email & password. Returns 15m Access Token & 7d Refresh Token. (Rate Limit: 5/min) |
| `POST` | `/auth/refresh` | Public | Rotates refresh token and returns a new token pair. (Rate Limit: 10/min) |
| `POST` | `/auth/logout` | User | Revokes the user's active refresh token in Redis. |
| `GET` | `/auth/me` | User | Returns the authenticated user's session profile. |

---

### 2. Admin Back-Office Authentication (`/admin/auth`)
Dedicated isolated authentication for internal staff and administrators.

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/admin/auth/login` | Public | Staff login. Returns 15m Access Token & 24h Refresh Token. (Rate Limit: 5/5min) |
| `POST` | `/admin/auth/refresh` | Public | Rotates staff refresh token. |
| `POST` | `/admin/auth/logout` | Admin | Revokes active admin session in Redis. |
| `GET` | `/admin/auth/me` | Admin | Returns current admin profile and assigned staff role. |

---

### 3. User Profiles & Freelancer Discovery (`/users`)
Profile management, portfolio items, work history, and public search.

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/users/me` | User | Get current user's profile with client/freelancer details. |
| `PATCH` | `/users/me/client` | Client | Update client company name and billing details. |
| `PATCH` | `/users/me/freelancer` | Freelancer | Update freelancer bio, hourly rate, and skill tags. |
| `GET` | `/users/freelancers` | Public | Search and browse freelancers by skills, hourly rate, and rating. |
| `GET` | `/users/freelancers/:id` | Public | View public freelancer dossier with work history, portfolio, and reviews. |
| `POST` | `/users/me/portfolio` | Freelancer | Add a portfolio project item. |
| `GET` | `/users/me/portfolio` | Freelancer | List freelancer's own portfolio projects. |
| `DELETE` | `/users/me/portfolio/:id` | Freelancer | Delete a portfolio project. |
| `POST` | `/users/me/work-history` | Freelancer | Add past employment or external work history. |
| `GET` | `/users/me/work-history` | Freelancer | List freelancer's work history. |
| `DELETE` | `/users/me/work-history/:id` | Freelancer | Delete a work history entry. |

---

### 4. Categories & Skills (`/categories`, `/skills`, `/admin/categories`, `/admin/skills`)
Platform taxonomy for jobs and profile tagging.

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/categories` | Public | List all active categories with their nested subcategories. |
| `GET` | `/categories/:id` | Public | Get single category details. |
| `GET` | `/skills` | Public | List all available skill tags. |
| `POST` | `/admin/categories` | Admin | Create a new top-level job category. |
| `PATCH` | `/admin/categories/:id` | Admin | Update category name, slug, or active state. |
| `DELETE` | `/admin/categories/:id` | Admin | Soft/hard delete category. |
| `POST` | `/admin/categories/:id/subcategories` | Admin | Add a subcategory under a category. |
| `POST` | `/admin/skills` | Admin | Add a new standardized skill tag. |
| `DELETE` | `/admin/skills/:id` | Admin | Delete a skill tag. |

---

### 5. Jobs & Job Search (`/jobs`)
Job lifecycle management, filters, and community abuse reporting.

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/jobs` | Client | Post a new job. (Requires Verified Email). |
| `GET` | `/jobs` | Public | Search and filter open jobs (search, category, skills, budget range, pagination). |
| `GET` | `/jobs/my` | Client | List jobs posted by the authenticated client. |
| `GET` | `/jobs/:id` | Public | Retrieve job details, requirements, and budget. |
| `PATCH` | `/jobs/:id` | Client | Update job details (title, description, budget, skills). |
| `DELETE` | `/jobs/:id` | Client | Cancel an open job post. |
| `POST` | `/jobs/:id/report` | User | Report a job for violating platform terms. |

---

### 6. Proposals & Bidding (`/proposals`, `/jobs/:jobId/proposals`)
Freelancer bidding, Redis background queue moderation, and client review.

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/proposals/job/:jobId` | Freelancer | Submit bid for a job. Enqueues to Redis queue for background moderation. (Requires Verified Email). |
| `GET` | `/proposals/my` | Freelancer | List all proposals submitted by the authenticated freelancer. |
| `GET` | `/proposals/:id` | User | Get proposal details (accessible by submitting freelancer or job owner client). |
| `PATCH` | `/proposals/:id` | Freelancer | Withdraw or edit submitted proposal. |
| `GET` | `/jobs/:jobId/proposals` | Client | Client reviews all proposals submitted to their job. |
| `PATCH` | `/jobs/:jobId/proposals/:id/status` | Client | Accept or reject a proposal. |

---

### 7. Real-Time Chat & Messaging (`/chat` & WebSockets)
Conversation threads, proposal replies, file attachments, and WebSocket messaging.

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/chat/conversations` | User | List user's conversations with last message and unread count. |
| `GET` | `/chat/conversations/:id` | User | Get conversation details. |
| `GET` | `/chat/conversations/:id/messages` | User | Paginated message history for a conversation thread. |
| `POST` | `/chat/proposals/:proposalId/reply` | Client | Client replies to a proposal, automatically initiating a chat conversation thread. |
| `POST` | `/chat/conversations/:id/messages` | User | Send a text message (dispatches to Redis queue for content moderation & offline alerts). |
| `POST` | `/chat/conversations/:id/attachments` | User | Upload file attachments (PDF, DOCX, images) to conversation. |
| `PATCH` | `/chat/conversations/:id/read` | User | Mark all received messages in the thread as read. |

#### WebSocket Gateway (`/chat`)
- **Namespace**: `/chat`
- **Events**:
  - `joinConversation`: Joins conversation room (`conversation:{id}`).
  - `sendMessage`: Broadcasts new message to participants in real-time.
  - `typing`: Emits typing indicator (`{ conversationId, isTyping }`).
  - `messageRead`: Emits read receipts to the sender.

---

### 8. Contracts, Escrow & Milestones (`/contracts`)
Milestone tracking, escrow deposit, work submissions, and dispute raising.

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/contracts/from-proposal/:proposalId` | Client | Creates a funded contract from an accepted proposal with escrow calculation. |
| `GET` | `/contracts/my` | User | List active and historical contracts for current user. |
| `GET` | `/contracts/:id` | User | View contract details, escrow status, and deliverables. |
| `POST` | `/contracts/:id/submit-work` | Freelancer | Freelancer submits deliverables for client review. |
| `POST` | `/contracts/:id/approve-work` | Client | Client approves submitted work; releases escrow funds into freelancer wallet. |
| `POST` | `/contracts/:id/dispute` | User | Raises a formal dispute, locking escrow for admin intervention. |

---

### 9. SSLCommerz Payment Gateway (`/payments/sslcommerz`)
Automated client payment gateway for funding contract escrow.

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/payments/sslcommerz/initiate` | Client | Generates an SSLCommerz gateway session URL for contract funding. |
| `POST` | `/payments/sslcommerz/success` | Public | SSLCommerz IPN success callback; activates contract escrow. |
| `POST` | `/payments/sslcommerz/fail` | Public | Payment failure callback. |
| `POST` | `/payments/sslcommerz/cancel` | Public | Payment cancellation callback. |

---

### 10. Reviews & Ratings (`/reviews`)
Double-blind review system preventing retaliatory ratings.

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/reviews/contract/:contractId` | User | Submit feedback for completed contract. Hidden until both parties submit or deadline expires. |
| `GET` | `/reviews/user/:userId` | Public | List published reviews and aggregated rating for a user. |

---

### 11. Wallet & Payouts (`/wallet`)
Wallet balances, transaction ledger, and local mobile money payouts (bKash / Nagad).

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/wallet/balance` | User | Get current available wallet balance. |
| `POST` | `/wallet/withdraw` | Freelancer | Request payout via `BKASH` or `NAGAD`. (Requires Verified Email). |
| `GET` | `/wallet/transactions` | User | Paginated history of earnings, escrow debits, and withdrawals. |

---

### 12. Admin Back-Office Operations (`/admin/*`)
Complete control center for platform staff, guarded by `AdminRole` permissions.

#### User Management (`/admin/users`)
| Method | Endpoint | Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/users` | Admin | Search and list marketplace users with filters (role, status, search). |
| `GET` | `/admin/users/:id` | Admin | Detailed dossier on a user (profile, spending, earnings, contracts). |
| `PATCH` | `/admin/users/:id/status` | Admin | Suspend / ban or reactivate a user account. |
| `PATCH` | `/admin/users/:id/verify` | Admin | Manually mark user email as verified. |
| `POST` | `/admin/users/:id/impersonate` | Admin | Issue support impersonation token for troubleshooting. |
| `DELETE` | `/admin/users/:id` | Admin | Hard delete user account and associated profiles. |

#### Content Moderation (`/admin/moderation`)
| Method | Endpoint | Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/moderation/flagged-proposals` | Moderator | View proposals auto-flagged by Redis background worker for circumvention. |
| `PATCH` | `/admin/moderation/proposals/:id` | Moderator | Dismiss flag or take punitive action (reject proposal / ban user). |
| `GET` | `/admin/moderation/flagged-messages` | Moderator | View chat messages auto-flagged for off-platform contact sharing. |
| `PATCH` | `/admin/moderation/messages/:id` | Moderator | Moderate flagged message. |

#### Global Jobs & Reports (`/admin`)
| Method | Endpoint | Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/jobs` | Admin | List all marketplace jobs across all statuses. |
| `GET` | `/admin/jobs/reports` | Admin | View user-submitted job abuse reports. |
| `PATCH` | `/admin/jobs/reports/:id/resolve` | Admin | Resolve or dismiss a job report. |
| `DELETE` | `/admin/jobs/:id` | Admin | Force take down an abusive or fraudulent job post. |

#### Dispute Resolution & Escrow Refunds (`/admin/disputes`)
| Method | Endpoint | Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/disputes` | Admin | List contracts currently in `DISPUTED` state. |
| `POST` | `/admin/disputes/:contractId/resolve` | Admin | Arbitrate dispute: split escrow, issue full refund to client, or release to freelancer. |

#### Withdrawal Payout Processing (`/admin/withdrawals`)
| Method | Endpoint | Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/withdrawals` | Financial Auditor | List pending withdrawal requests. |
| `PATCH` | `/admin/withdrawals/:id/approve` | Financial Auditor | Mark payout as completed after sending bKash/Nagad funds. |
| `PATCH` | `/admin/withdrawals/:id/reject` | Financial Auditor | Reject payout and refund amount back to freelancer wallet balance. |

#### Platform Settings (`/admin/settings`)
| Method | Endpoint | Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/settings` | Admin | View global settings (e.g., current platform fee percentage). |
| `PATCH` | `/admin/settings` | Admin | Update platform fee percentage. |

#### Audit Logging (`/admin/audit-logs`)
| Method | Endpoint | Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/audit-logs` | Admin | Paginated, searchable immutable audit trail of all staff actions. |

#### Business Analytics (`/admin/analytics`)
| Method | Endpoint | Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/analytics/overview` | Admin | Key platform KPIs: Gross Marketplace Volume (GMV), platform revenue, active escrow liquidity, total user counts. |

---

## Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Port & Node Environment
PORT=4000
NODE_ENV=development

# PostgreSQL Database (Prisma)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/marketplace_db?schema=public"

# Redis Connection (Queues, Cache, Token Sessions, Rate Limiting)
REDIS_HOST="127.0.0.1"
REDIS_PORT=6379
REDIS_PASSWORD=""

# JWT Secrets & Expiration
JWT_SECRET="super_secret_jwt_key_replace_in_production"
JWT_EXPIRES_IN="15m"

# Initial Super Admin Credentials (used by prisma/seed.ts)
INITIAL_ADMIN_EMAIL="admin@marketplace.com"
INITIAL_ADMIN_PASSWORD="SuperSecureAdminPassword123!"
INITIAL_ADMIN_NAME="Super Administrator"

# SSLCommerz Payment Gateway
SSLCOMMERZ_STORE_ID="test_store_id"
SSLCOMMERZ_STORE_PASSWD="test_store_password"
SSLCOMMERZ_IS_LIVE=false

# CORS Allowed Origins
CORS_ORIGINS="http://localhost:3000,http://localhost:3001"
```

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Synchronize Database Schema
```bash
# Push schema changes directly to PostgreSQL
npm run prisma:push

# Generate the typed Prisma Client
npm run prisma:generate
```

### 3. Seed the Initial Super Admin
Run the automated bootstrap seed script:
```bash
npm run prisma:seed
```
This creates the first `SUPER_ADMIN` in the `Admin` table using the credentials defined in your `.env`.

### 4. Start the Application
```bash
# Start in watch mode (Development)
npm run start:dev

# Start in production mode
npm run start:prod
```

### 5. Running the Test Suite
The codebase includes **160 tests** across **24 test suites** powered by Vitest:
```bash
# Run all unit and sub-service tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate test coverage report
npm run test:cov
```

---

## License
UNLICENSED - Proprietary commercial software.
