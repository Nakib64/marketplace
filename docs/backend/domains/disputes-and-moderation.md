# Dispute Arbitration Court & Content Moderation

This document details the arbitration workflow, evidentiary dossier aggregation, standardized verdicts, and anti-circumvention rule scanning.

---

## 1. Dispute Arbitration Court

When a client and freelancer cannot reach agreement on project deliverables, either party can escalate to arbitration (`ContractStatus.DISPUTED`).

### Evidentiary Dossier Aggregation (`GET /admin/disputes/:id`)
Platform staff review a unified evidentiary file containing:
* Contract scope, milestone dates, and escrow deposit receipts.
* Chronological workroom chat transcript with attachments.
* Submitted deliverables, live links, and handover notes.
* Client & Freelancer reputation dossiers (total spent, completed projects, dispute rates).

### Standardized Arbitration Verdicts:
1. **Force Full Refund to Client (`POST /admin/disputes/:id/refund`):**
   * Sets `Contract.status = REFUNDED`, `Job.status = CANCELED`.
   * Atomically credits 100% of `escrowAmount` to client's `walletBalance`.
2. **Force Full Release to Freelancer (`POST /admin/disputes/:id/release`):**
   * Sets `Contract.status = COMPLETED`, `Job.status = COMPLETED`.
   * Releases net funds (`escrowAmount - platformFee`) to freelancer wallet.
3. **Proportional Split Settlement (`POST /admin/disputes/:id/split`):**
   * Admin inputs `clientRefundPercentage` (e.g., 40%).
   * Calculates exact client refund vs. freelancer gross, deducts proportional platform fee from freelancer share, and credits both user wallets in one atomic transaction.

---

## 2. Content Moderation & Anti-Circumvention Pipeline

### Anti-Circumvention Rule Engine (`AntiCircumventionService`):
Content is scanned against regex and heuristic patterns:
* **Bangladeshi Phone Number Formats:** Matches standard (`01712345678`), international (`+8801...`), hyphenated, spaced (`0 1 7 1 ...`), and Bengali script numerals.
* **Prohibited Channel Keywords:** `whatsapp`, `telegram`, `imo`, `viber`, `skype`, `wechat`, `personal bkash`, `pay me outside`, `direct payment`.
* **Prohibited Communication Shortlinks:** `wa.me`, `t.me`, `api.whatsapp.com`.

### Asynchronous Queue Workers (BullMQ):
* `ProposalQueueProcessor`: Scans cover letters upon submission. Violations set `isFlagged = true` with flagged reasons.
* `MessageQueueProcessor`: Scans chat messages asynchronously without interrupting WebSocket delivery speed.
