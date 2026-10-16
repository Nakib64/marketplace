# Backend System Documentation — Master Index

Welcome to the **Marketplace Backend System** documentation. The backend is an enterprise-grade REST and real-time engine built with **NestJS 12**, **TypeScript**, **PostgreSQL**, **Prisma ORM**, **Redis**, and **BullMQ**.

---

## Documentation Directory Map

```
docs/backend/
├── README.md                          # You are here: Backend Master Index
│
├── architecture/
│   ├── system-design.md               # Sub-service modularity, layer pipeline, security guards
│   ├── data-topology.md               # Relational entity diagram, Prisma models, compound indexes
│   └── sql-diagrams.md                # Comprehensive SQL schema and relationship mapping
│
├── domains/
│   ├── auth-and-rbac.md               # Dual-actor JWT, RFC 6238 TOTP 2FA, sliding-window rate limiting
│   ├── user-profiles.md               # Polymorphic Client/Freelancer profiles, portfolios, SEO slugs
│   ├── jobs-and-taxonomy.md           # Two-tier taxonomy, job lifecycle state machine, reports
│   ├── proposals-and-chat.md          # Bidding rules, pre-hire chat, workrooms, Socket.io
│   ├── escrow-and-finops.md           # 7-Step escrow state machine, SSLCommerz IPN, bKash/Nagad payouts
│   ├── reviews-and-reputation.md      # Double-blind review hiding and simultaneous publication
│   └── disputes-and-moderation.md     # Arbitration court, dossiers, anti-circumvention regex
│
├── api-reference/
│   ├── endpoints-catalog.md           # Full tabular REST API endpoint reference
│   ├── request-response-schemas.md    # Exact JSON request and response payloads with examples
│   └── error-code-dictionary.md       # Standard machine error envelopes (ERR_*)
│
├── operations/
│   ├── sre-runbooks.md                # Incident response playbooks (gateway outage, queue DLQ)
│   ├── emergency-circuit-breakers.md  # Redis kill switches (payouts, escrow, maintenance mode)
│   └── environment-matrix.md          # Environment configuration, secrets & rotation cadences
│
└── phase-history/                     # Archive of the 14 backend development phase reports
```

---

## Core Architectural Principles

1. **Sub-Service Modularity:** Every service exceeding standard CRUD complexity is split into focused, single-responsibility sub-services under ~120 lines of code (e.g. `ContractFormationSubService`, `ContractApprovalSubService`, `AdminAuthTokensSubService`).
2. **Dual-Actor Domain Isolation:** Platform customers (`CLIENT` and `FREELANCER`) are strictly isolated from staff (`SUPER_ADMIN`, `ADMIN`, `MODERATOR`, `SUPPORT`). Internal staff data resides in the dedicated `Admin` model and uses isolated JWT secrets.
3. **Zero Financial Drift (ACID Invariants):** All wallet balance movements, escrow holds, dispute releases, and payout deductions are executed inside atomic PostgreSQL `$transaction` blocks.
4. **Asynchronous Non-Blocking Edge:** Content moderation scanning and offline notifications are offloaded to BullMQ queues backed by Redis, preserving sub-50ms API response times.
