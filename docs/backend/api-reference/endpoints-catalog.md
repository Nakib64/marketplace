# Complete REST API Endpoints Catalog

This catalog provides a tabular reference of all REST API endpoints available on the Marketplace backend.

---

### 1. Customer Authentication (`/auth`)
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/auth/register` | None | Registers a new user as CLIENT or FREELANCER |
| `POST` | `/auth/login` | None | Authenticates user; sets access & refresh cookies |
| `POST` | `/auth/refresh` | None | Rotates access token using refresh cookie |
| `POST` | `/auth/logout` | JWT | Invalidates user refresh token session in Redis |
| `GET` | `/auth/me` | JWT | Returns current authenticated user profile |
| `POST` | `/auth/verify-email` | None | Verifies email token |

### 2. Back-Office Admin Authentication (`/admin/auth`)
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/admin/auth/login` | None | Staff login; checks 2FA status |
| `POST` | `/admin/auth/2fa/verify-login` | None | Authenticates pre-auth token with 6-digit TOTP |
| `POST` | `/admin/auth/2fa/generate` | Admin JWT | Generates TOTP secret and QR code data |
| `POST` | `/admin/auth/2fa/enable` | Admin JWT | Confirms TOTP code and enables 2FA |
| `POST` | `/admin/auth/2fa/disable` | Admin JWT | Verifies TOTP code and disables 2FA |
| `POST` | `/admin/auth/refresh` | None | Rotates admin access token |
| `POST` | `/admin/auth/logout` | Admin JWT | Clears admin session cookies |
| `GET` | `/admin/auth/me` | Admin JWT | Returns authenticated staff details |

### 3. User Governance (`/users` & `/admin/users`)
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/users/:id/profile` | Public | Returns public profile by ID |
| `GET` | `/users/slug/:slug` | Public | Returns public profile by SEO slug |
| `PATCH` | `/users/profile` | JWT | Updates own client/freelancer profile details |
| `GET` | `/admin/users` | Admin JWT | Paginated staff search across all users |
| `PATCH` | `/admin/users/:id/status` | Admin JWT | Bans or unbans user with audit reason |
| `POST` | `/admin/users/:id/impersonate`| Super Admin | Generates 15-min read-only token |

### 4. Job Listings & Taxonomy (`/jobs` & `/categories`)
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/categories` | Public | Retrieves all active categories and subcategories |
| `GET` | `/jobs` | Public | Searchable, paginated public job listings |
| `GET` | `/jobs/:id` | Public | Full job details with proposal counts |
| `POST` | `/jobs` | Client JWT | Posts a new job listing |
| `PATCH` | `/jobs/:id` | Client JWT | Updates job listing (if still OPEN) |
| `DELETE` | `/jobs/:id` | Client JWT | Cancels job listing |
| `POST` | `/jobs/:id/report` | JWT | Reports job for moderation review |

### 5. Proposals & Bidding (`/proposals`)
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/proposals` | Freelancer JWT| Submits a bid on an open job |
| `GET` | `/proposals/job/:jobId` | Client JWT | Lists all proposals received for a job |
| `GET` | `/proposals/my-proposals` | Freelancer JWT| Lists freelancer's submitted bids |
| `POST` | `/proposals/:id/reply` | Client JWT | Opens pre-hire chat room with candidate |

### 6. Escrow Contracts (`/contracts`)
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/contracts` | Client JWT | Accepts proposal and initializes SSLCommerz escrow |
| `POST` | `/contracts/sslcommerz/ipn` | Public | Gateway server-to-server IPN webhook |
| `GET` | `/contracts/:id` | Participant JWT| Returns full contract state and milestones |
| `GET` | `/contracts/my-contracts` | JWT | Returns user's active and completed contracts |
| `POST` | `/contracts/:id/submit-work` | Freelancer JWT| Submits deliverables handover |
| `POST` | `/contracts/:id/approve` | Client JWT | Approves work; releases net payment |
| `POST` | `/contracts/:id/dispute` | Participant JWT| Escalates contract to admin arbitration |

### 7. Wallet & Payouts (`/wallet` & `/admin/withdrawals`)
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/wallet/balance` | JWT | Returns user wallet balance and withdrawal history |
| `POST` | `/wallet/withdraw` | Freelancer JWT| Requests bKash or Nagad withdrawal |
| `GET` | `/admin/withdrawals` | Admin JWT | Staff queue of pending payout requests |
| `PATCH` | `/admin/withdrawals/:id/approve`| Admin JWT | Approves withdrawal with MFS reference |
| `PATCH` | `/admin/withdrawals/:id/reject` | Admin JWT | Rejects withdrawal and refunds wallet balance |

### 8. Dispute Arbitration Court (`/admin/disputes`)
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/admin/disputes` | Admin JWT | Lists all active disputed contracts |
| `GET` | `/admin/disputes/:id` | Admin JWT | Compiles complete evidentiary dossier |
| `POST` | `/admin/disputes/:id/refund` | Admin JWT | Verdict: Force full refund to client |
| `POST` | `/admin/disputes/:id/release` | Admin JWT | Verdict: Force net release to freelancer |
| `POST` | `/admin/disputes/:id/split` | Admin JWT | Verdict: Proportional escrow split |

### 9. Emergency Settings & Kill Switches (`/admin/settings`)
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/admin/settings/platform-fee` | Admin JWT | Retrieves active commission percentage |
| `PATCH` | `/admin/settings/platform-fee` | Admin JWT | Updates platform commission percentage |
| `GET` | `/admin/settings/circuit-breakers` | Admin JWT | Returns status of emergency kill switches |
| `POST` | `/admin/settings/circuit-breakers/toggle`| Super Admin| Toggles emergency kill switches |

### 10. Audit Trail & Health (`/admin/audit` & `/health`)
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/admin/audit` | Admin JWT | Queryable staff audit log trail |
| `GET` | `/health` | Public | System status (DB, Redis, Queues) |
