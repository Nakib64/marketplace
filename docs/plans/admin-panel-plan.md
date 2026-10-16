# Marketplace Admin Command Center — Comprehensive Frontend Plan

This plan establishes the complete, production-grade architecture and implementation roadmap for the **Marketplace Admin Command Center** (`frontend/app/admin`).

It is structured into two distinct execution horizons:
* **Phase 1: Launch-Ready Command Center (Implement Now):** Everything required to safely launch, monitor financial transactions, process withdrawals, arbitrate disputes, govern users, and enforce platform rules.
* **Phase 2: Enterprise Scaling & Autonomous Hardening (Post-Launch):** Advanced enterprise capabilities including Maker-Checker dual authorization, live fraud/collusion detection, visual state-diff audit inspection, and custom dispute escrow splits.

---

```mermaid
flowchart TD
    subgraph Phase 1: Launch-Ready Command Center
        A1[1. Dedicated Admin Auth & TOTP 2FA]
        A2[2. Executive Telemetry & Real-Time KPI Dashboard]
        A3[3. Escrow Vault & Payout Command Hub bKash/Nagad]
        A4[4. Dispute Resolution & Arbitration Court]
        A5[5. User & Identity Governance KYC/Bans]
        A6[6. Job & Content Moderation Flagged Content]
        A7[7. Commission & Platform Configurations]
        A8[8. Searchable Audit Trail Explorer]
    end

    subgraph Phase 2: Enterprise Scaling & Deep Defense
        B1[1. Maker-Checker 4-Eyes Approval Workspace]
        B2[2. Automated Fraud & Collusion Radar]
        B3[3. Visual State-Diff JSON Audit Inspector]
        B4[4. Scoped & Watermarked User Impersonation]
        B5[5. Interactive Proportional Escrow Splitter]
        B6[6. Granular RBAC Permissions Matrix]
    end

    Phase 1 -->|Continue to Launch| Launch((Marketplace Launch))
    Launch --> Phase 2
```

---

## Part 1: Phase 1 — Launch-Ready Command Center (Execute Now)

### 1. Route Hierarchy & Layout Shell
The admin panel operates under a dedicated, protected routing tree (`frontend/app/admin`) isolated from public marketplace navigation:

```
frontend/app/admin/
├── layout.tsx                     # Admin AppShell: Collapsible Sidebar, TopBar, Breadcrumb, Staff Badge
├── login/
│   └── page.tsx                   # Dedicated Admin Sign-in & TOTP 2FA Verification
├── page.tsx                       # Redirects to /admin/dashboard
├── dashboard/
│   └── page.tsx                   # Executive BI Dashboard: GMV, Escrow TVL, Revenue, Live Events
├── payouts/
│   └── page.tsx                   # Payouts & Escrow Ledger: bKash/Nagad Approval/Reject Queue
├── disputes/
│   ├── page.tsx                   # Active Dispute Mediation List
│   └── [id]/page.tsx              # Dispute Arbitration Court: Dossier, Chat Transcript, Verdicts
├── users/
│   ├── page.tsx                   # User Directory: Search, Roles, Verification, Bans
│   └── [id]/page.tsx              # Deep User Dossier: Financials, Jobs, Contracts, Audit
├── moderation/
│   ├── jobs/page.tsx              # Reported & Suspicious Job Listings Queue
│   └── circumvention/page.tsx     # Flagged Chat Messages & Off-Platform Keyword Queue
├── settings/
│   └── page.tsx                   # Platform Fee %, Gateway Toggles, Review SLAs, Maintenance Mode
└── audit/
    └── page.tsx                   # Immutable Audit Trail Table & Filters
```

---

### 2. Module Specifications (Phase 1)

#### Module 1.1: Dedicated Admin Authentication & 2FA (`/admin/login`)
* **Staff Login Screen:** Separate visual styling (dark, high-contrast command aesthetic) distinct from regular client/freelancer login.
* **Two-Factor Authentication (TOTP):** Upon valid email/password, prompts for 6-digit Google Authenticator / Authy code against `/admin/auth/verify-2fa`.
* **Admin Role Guard (`AdminRoleGuard.tsx`):**
  * Intercepts all requests under `/admin/*`.
  * Verifies presence of a valid admin JWT with role checking (`SUPER_ADMIN`, `ADMIN`, `MODERATOR`, `SUPPORT`).
  * Enforces automatic inactivity timeout (logout after 30 minutes of idle time).

#### Module 1.2: Executive Telemetry & KPI Dashboard (`/admin/dashboard`)
* **Executive Metric Cards:**
  * **GMV (Gross Merchandise Value):** Cumulative volume funded in escrow (all-time & last 30 days).
  * **Platform Net Revenue:** 10% commission captured upon contract completions.
  * **Active Escrow (TVL):** Funds currently protected in `FUNDED` or `PENDING_APPROVAL` contracts.
  * **Pending Payout Liability:** Total ৳ BDT in requested withdrawals awaiting staff dispatch.
* **Volume Graphs:** Daily jobs posted, bids submitted, and contracts formed over 7d/30d/90d intervals.
* **Live System Activity Feed:** Streaming ticker of significant events (new escrow deposits, disputes opened, high-value withdrawals requested).

#### Module 1.3: Escrow & Payout Command Hub (`/admin/payouts`)
* **Pending Withdrawal Queue:**
  * Displays freelancer name, account email, requested amount (৳ BDT), MFS method (`BKASH` / `NAGAD`), account phone number, and submission timestamp.
* **Action Modal — Approve Payout:**
  * Staff inputs the MFS Transaction ID / Reference (e.g., `BKASH-TX-981249`).
  * Calls `POST /admin/payouts/:id/approve` to seal the withdrawal as `APPROVED`.
* **Action Modal — Reject Payout:**
  * Requires mandatory staff rejection reason (e.g., *"Account number invalid or KYC name mismatch"*).
  * Calls `POST /admin/payouts/:id/reject`, automatically executing atomic balance refund back to the freelancer's wallet.
* **Active Escrow Vaults Tab:**
  * Filterable table of all active contracts with milestone timers, grace periods, and participant links.

#### Module 1.4: Dispute Resolution & Arbitration Court (`/admin/disputes/[id]`)
* **Case Overview:** Contract ID, Job Title, Client & Freelancer profiles, Total Escrow locked, Dispute initiator, and opened timestamp.
* **Evidence Dossier Tabs:**
  * **Workroom Chat Transcript:** Chronological display of the actual chat conversation between the parties.
  * **Scope & Deliverables:** Original job description, proposal approach, submitted deliverable URLs, pull requests, and freelancer handover notes.
* **Arbitration Verdict Buttons:**
  * **Force Full Refund:** Cancel contract and return 100% of escrow back to client's wallet (`POST /admin/disputes/:id/refund`).
  * **Force Full Release:** Release net funds (`escrowAmount - platformFee`) to freelancer wallet (`POST /admin/disputes/:id/release`).
  * Confirmation modal requiring arbitration reasoning notes that get permanently recorded in the audit log.

#### Module 1.5: User Directory & Trust Management (`/admin/users`)
* **Filterable User Table:** Search by email, name, role (`CLIENT`, `FREELANCER`), email verification status, and ban state.
* **Account Status Actions:**
  * **Ban User Modal:** Input ban reason, immediate termination of active sessions, toggle `isBanned: true` (`PATCH /admin/users/:id/status`).
  * **Unban User Modal:** Re-enable access with audit documentation.
* **Profile Detail Drawer:** Quick inspection of client's total spent / total jobs vs. freelancer's earnings / completed projects / rating.

#### Module 1.6: Moderation & Anti-Circumvention (`/admin/moderation`)
* **Flagged Circumvention Queue (`/admin/moderation/circumvention`):**
  * List of messages and proposals flagged by anti-circumvention heuristics (phone numbers, WhatsApp, Telegram, email, off-platform banking terms).
  * View snippet with highlighted offending patterns.
  * Actions: Dismiss flag, warn user, or suspend account.
* **Reported Jobs Queue (`/admin/moderation/jobs`):**
  * View user-submitted reports on jobs (`JobReport` table).
  * Actions: Dismiss report or Force-cancel job post.

#### Module 1.7: Platform Settings & Commission (`/admin/settings`)
* **Commission Rate Configuration:**
  * View and update global platform fee percentage (`PlatformSetting.platformFeePercentage`, default: 10.0%).
* **Operational Toggles:**
  * Payment gateway mode toggle (Sandbox vs. Live SSLCommerz).
  * Maintenance Mode toggle with customizable alert message.
* **Escrow SLAs:** Review window hours (default: 48h) and double-blind auto-reveal timeout (default: 14 days).

#### Module 1.8: Audit Trail Explorer (`/admin/audit`)
* **Filterable Action Log:**
  * Search by Admin email, action type (`APPROVE_PAYOUT`, `REJECT_PAYOUT`, `FORCE_REFUND`, `BAN_USER`, `UPDATE_SETTING`), target type, and date range.
  * Displays IP address, timestamp, and details payload for every administrative mutation.

---

## Part 2: Phase 2 — Enterprise Scaling & Autonomous Hardening (Post-Launch)

### 1. Overview of Phase 2 Enhancements
Phase 2 transforms the operational panel into a self-protecting, multi-tiered risk engine capable of scaling to high financial volumes with institutional security controls.

---

### 2. Module Specifications (Phase 2)

#### Module 2.1: Maker-Checker (4-Eyes) Approval Workspace
* **Dual-Authorization Workflow:**
  * Any action with financial impact exceeding a configurable limit (e.g., > ৳25,000 payout, forced contract refund, manual wallet credit, fee change) cannot be executed by a single admin.
  * The initiating staff member becomes the **"Maker"** (action queued as `PENDING_APPROVAL`).
  * A separate `SUPER_ADMIN` or `FINANCE_ADMIN` acts as the **"Checker"**, inspecting the dossier and confirming/rejecting with digital sign-off.
* **UI:** Dedicated `/admin/approvals` queue with countdown timers and diff inspection.

#### Module 2.2: Automated Fraud & Collusion Radar
* **Collusion Detection Engine:**
  * Scans for shared IP addresses, browser fingerprints, or device identifiers between Client and Freelancer accounts (detecting **fake jobs created to fabricate reviews or farm ratings**).
  * Displays a visual **Collusion Network Graph** connecting suspicious accounts.
* **Velocity Anomaly Alerts:**
  * Flags accounts with abnormal bidding velocity, instant milestone approvals within minutes of funding, or rapid 100% balance depletion.

#### Module 2.3: Visual State-Diff JSON Audit Inspector
* **Side-by-Side Diff Viewer:**
  * Clicking any audit entry reveals a visual GitHub-style green/red JSON diff showing exact `before` and `after` states:
    ```diff
    - platformFeePercentage: 10.0
    + platformFeePercentage: 12.5
    ```
* **Tamper-Evident Verification:** Displays cryptographic hash seals verifying that logs have not been altered in the database.

#### Module 2.4: Scoped & Watermarked User Impersonation
* **Read-Only Support Session:**
  * Staff inputs a Zendesk / Intercom Support Ticket ID to generate a scoped, 15-minute token (`/admin/impersonate/:userId`).
  * Financial mutation endpoints (withdraw, spend, alter password) are locked with `403 Forbidden`.
* **Translucent Watermark Banner:**
  * Displays a permanent, non-removable diagonal watermark across the viewport:
    > *`SUPPORT SESSION: Impersonated by staff@banglance.com | Ticket #TK-4819 | Read-Only`*

#### Module 2.5: Interactive Proportional Escrow Splitter
* **Arbitration Escrow Splitter Tool:**
  * In dispute mediation, instead of all-or-nothing verdicts, provides an interactive slider:
    * e.g., 65% (৳6,500) released to Freelancer for delivered progress.
    * 35% (৳3,500) refunded to Client for uncompleted milestones.
  * Visual breakdown automatically calculates platform fee deductions on the freelancer's share and previews exact net payouts before confirmation.

#### Module 2.6: Granular RBAC Permissions Matrix
* **Custom Role Builder:**
  * Define custom staff roles beyond presets with granular checkbox matrix:
    * `can_view_payouts`, `can_approve_payouts`, `can_mediate_disputes`, `can_ban_users`, `can_change_fees`, `can_view_chats`.
* **Session & Hardware Security:**
  * WebAuthn / FIDO2 YubiKey hardware key support.
  * IP Geofencing restricting admin panel access to authorized corporate VPN addresses.

---

## Part 3: Component Architecture & State Management

### 1. Technology Stack
* **Framework:** Next.js 16 App Router + React 19 + TypeScript.
* **Design System:** Custom Tailored Tailwind CSS matching existing theme tokens (`surface`, `surface-container`, `primary`, `on-surface`).
* **Icons:** Material Symbols Outlined + Lucide Icons.
* **Charts & Visualizations:** Recharts / Tremor for financial and volume telemetry.
* **Data Fetching & Cache:** TanStack Query (React Query) with polling or WebSockets for real-time queues.
* **Notifications:** Sonner toast alerts with action callbacks.

### 2. State & Auth Store (`stores/useAdminAuthStore.ts`)
```ts
interface AdminAuthStore {
  admin: {
    id: string;
    email: string;
    name: string;
    role: 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR' | 'SUPPORT';
    twoFactorEnabled: boolean;
  } | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, adminData: any) => void;
  logout: () => void;
}
```

---

## Part 4: Implementation Checklist (Phase 1)

- [ ] **Step 1: Admin Store & Auth Guard**
  - Create `frontend/stores/useAdminAuthStore.ts`.
  - Create `frontend/features/admin/components/AdminRoleGuard.tsx`.
- [ ] **Step 2: Admin AppShell Layout**
  - Create `frontend/app/admin/layout.tsx`.
  - Build `AdminSidebar.tsx`, `AdminTopHeader.tsx`, and breadcrumbs.
- [ ] **Step 3: Admin Login & 2FA Page**
  - Create `frontend/app/admin/login/page.tsx`.
  - Wire to `/admin/auth/login` and `/admin/auth/verify-2fa`.
- [ ] **Step 4: Executive Dashboard**
  - Create `frontend/app/admin/dashboard/page.tsx`.
  - Wire to `/admin/analytics` and `/admin/ledger`.
- [ ] **Step 5: Payouts & Escrow Hub**
  - Create `frontend/app/admin/payouts/page.tsx`.
  - Build approval dialog with Transaction ID input and reject dialog with refund reason.
- [ ] **Step 6: Dispute Arbitration Court**
  - Create `frontend/app/admin/disputes/page.tsx` and `[id]/page.tsx`.
  - Wire dossier, transcript view, and force-refund / force-release actions.
- [ ] **Step 7: User Management Directory**
  - Create `frontend/app/admin/users/page.tsx` and ban/unban modal.
- [ ] **Step 8: Content & Circumvention Moderation**
  - Create `frontend/app/admin/moderation/page.tsx`.
- [ ] **Step 9: Platform Settings & Audit Log Explorer**
  - Create `frontend/app/admin/settings/page.tsx` and `frontend/app/admin/audit/page.tsx`.
- [ ] **Step 10: Full System Verification**
  - Run `npx tsc --noEmit` and `npm run build` to confirm 0 compilation errors.
