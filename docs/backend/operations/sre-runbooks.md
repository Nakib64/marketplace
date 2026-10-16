# SRE On-Call Incident Response Runbooks

These runbooks represent the standard operating procedures (SOPs) for site reliability engineers (SREs) and on-call platform developers.

---

## Playbook 1: Payment Gateway Outage or Webhook Failure

* **Symptoms:** Clients report failed payment redirects; contracts remain in `PENDING` without transitioning to `FUNDED`.
* **Step 1 — Triage:** Check SSLCommerz status page and `/health` database status.
* **Step 2 — Activate Circuit Breaker:**
  ```bash
  # Using Admin API or direct Redis CLI:
  redis-cli SET circuit_breaker:escrow "true"
  ```
* **Step 3 — Reconcile Pending Callbacks:**
  Query contracts stuck without `sslcommerzId`:
  ```sql
  SELECT id, "clientId", "escrowAmount", "createdAt" 
  FROM "Contract" 
  WHERE status = 'FUNDED' AND "sslcommerzId" IS NULL;
  ```
* **Step 4 — Deactivate Circuit Breaker:**
  ```bash
  redis-cli SET circuit_breaker:escrow "false"
  ```

---

## Playbook 2: Suspicious Withdrawal Volume / Payout Drain

* **Symptoms:** Alert fires: *"Withdrawal volume exceeded ৳500,000 in 1 hour"*.
* **Step 1 — Instant Freeze:**
  Immediately halt all outgoing disbursements:
  ```bash
  redis-cli SET circuit_breaker:payouts "true"
  ```
* **Step 2 — Audit Recent Requests:**
  Query pending withdrawals for suspicious clustering:
  ```sql
  SELECT w.id, w."accountNumber", w.amount, u.email, u."walletBalance"
  FROM "Withdrawal" w
  JOIN "User" u ON u.id = w."freelancerId"
  WHERE w.status = 'PENDING'
  ORDER BY w.amount DESC;
  ```
* **Step 3 — Resolution:**
  Reject fraudulent requests via `PATCH /admin/withdrawals/:id/reject` and ban attacker accounts. Reset kill switch once resolved.

---

## Playbook 3: BullMQ Queue Backlog & Dead-Letter Queue (DLQ) Recovery

* **Symptoms:** Messages or proposals not being moderated; Redis queue length growing.
* **Step 1 — Inspect Queue Depth:**
  ```bash
  redis-cli LLEN "marketplace:queue:proposals"
  redis-cli LLEN "marketplace:queue:messages"
  redis-cli LLEN "marketplace:queue:dlq:marketplace:queue:messages"
  ```
* **Step 2 — Inspect Failed Jobs:**
  Check the dead-letter queue (DLQ) for repeated errors:
  ```bash
  redis-cli LRANGE "marketplace:queue:dlq:marketplace:queue:messages" 0 5
  ```
* **Step 3 — Replay Dead-Letter Queue:**
  Trigger DLQ re-ingestion via queue management CLI or restart worker pods.

---

## Playbook 4: Zero-Downtime Scheduled Maintenance Execution

* **Step 1 — Trip Maintenance Mode:**
  ```bash
  redis-cli SET circuit_breaker:maintenance_mode "true"
  ```
* **Step 2 — Verify Back-Office Accessibility:**
  Confirm that `/admin/*` and `/health` return `200 OK`, while `/jobs` returns `503 Service Unavailable`.
* **Step 3 — Execute Database Migrations:**
  ```bash
  npx prisma migrate deploy
  ```
* **Step 4 — Disable Maintenance Mode:**
  ```bash
  redis-cli SET circuit_breaker:maintenance_mode "false"
  ```
