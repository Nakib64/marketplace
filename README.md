# Freelance Marketplace Platform

An enterprise-grade, full-stack freelance marketplace (similar to Upwork / Fiverr) designed for secure transactions, safe escrow holding vaults, real-time workroom messaging, double-blind reviews, local mobile financial services (bKash & Nagad), and an autonomous back-office administration command center.

---

## 🏛️ Repository Architecture

This repository is structured as a modular full-stack monorepo:

```
marketplace/
├── frontend/                          # Consumer Next.js 16 (App Router), Port 3000
│   ├── app/                           # Route trees: (auth), client, freelancer, contracts, wallet
│   ├── features/                      # Domain-driven feature slices (contracts, messages, proposals)
│   └── components/                    # Design system components, layouts, UI primitives
│
├── admin/                             # Dedicated Admin Command Center (Next.js 16), Port 3001
│   ├── app/                           # Route trees: login, dashboard, payouts, disputes, users, settings, audit
│   ├── components/                    # Operations consoles, arbitration modals, circuit breaker controls
│   └── lib/api/                       # Isolated, cookie-aware admin API client and services
│
├── backend/                           # NestJS 12, PostgreSQL, Prisma ORM, Redis, Port 4000
│   ├── src/admin/                     # Back-office admin, 2FA, disputes, moderation, audit
│   ├── src/contracts/                 # Escrow holding vaults, milestone approvals, SSLCommerz IPN
│   ├── src/wallet/                    # Atomic ledger balances, bKash & Nagad payout queues
│   ├── src/chat/                      # Real-time WebSocket gateway, workrooms, file attachments
│   └── src/queues/                    # Asynchronous BullMQ background worker processors
│
└── docs/                              # Centralized Enterprise Documentation Hub
    ├── README.md                      # Master Documentation Hub & Navigation
    ├── plans/                         # Strategic Roadmaps (Admin Panel, Server Architecture)
    ├── backend/                       # Modular backend specifications, architecture, and domains
    ├── frontend/                      # Frontend guidelines, UI/UX directives & work patterns
    └── api-reference/                 # Endpoints catalog, JSON schemas & error code dictionary
```

---

## 📚 Documentation & Engineering Plans

All technical documentation and strategic execution plans have been consolidated into the centralized [`docs/`](docs/README.md) portal:

* **[Master Documentation Hub](docs/README.md)** — The interactive index to all guides.
* **[Admin Command Center Plan](docs/plans/admin-panel-plan.md)** — Two-phase roadmap for `frontend/app/admin`.
* **[Server Architecture Plan](docs/plans/server-architecture-plan.md)** — Backend hardening and enterprise scalability roadmap.
* **[Backend System Specifications](docs/backend/README.md)** — Architecture, sub-service pattern (<120 LOC), and domain guides.
* **[API Reference & Contracts](docs/backend/api-reference/endpoints-catalog.md)** — Complete endpoint catalogs and JSON schemas.
* **[SRE On-Call Runbooks](docs/backend/operations/sre-runbooks.md)** — Incident playbooks for on-call engineers.
* **[Frontend Design & Engineering Guidelines](docs/frontend/README.md)** — Creative UI/UX directive and work patterns.

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js** (v20+ recommended)
* **PostgreSQL** running locally or via Docker
* **Redis** running locally (or fallback to memory store)

### 1. Backend Setup
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run start:dev
```
*API runs at `http://localhost:5000` (Health check at `http://localhost:5000/health`)*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs at `http://localhost:3000`*

---

## 🛡️ Security & Financial Safeguards
* **Zero Financial Drift:** All wallet transactions, escrow releases, and refunds execute inside atomic PostgreSQL `$transaction` blocks.
* **Staff Dual-Actor Security:** Internal staff accounts are isolated in the `Admin` model with separate JWT secrets and RFC 6238 TOTP 2FA.
* **Emergency Circuit Breakers:** Redis-backed kill switches (`KILL_SWITCH_PAYOUTS`, `KILL_SWITCH_ESCROW`, `MAINTENANCE_MODE`) with sub-millisecond route guards.
* **Immutable Audit Trail:** Automated interceptor permanently logging all staff mutations with credential sanitization.
