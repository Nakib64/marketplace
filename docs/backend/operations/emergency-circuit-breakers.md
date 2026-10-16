# Emergency Kill Switches & Platform Circuit Breakers

In the event of an upstream payment gateway outage or security incident, platform administrators can instantly trigger circuit breakers without redeploying code.

---

## 1. Supported Circuit Breakers

* **`KILL_SWITCH_PAYOUTS`:** Halts all new withdrawal requests (`POST /wallet/withdraw`) and staff approvals.
* **`KILL_SWITCH_ESCROW`:** Halts new contract creations and payment initiation.
* **`MAINTENANCE_MODE`:** Restricts all customer-facing routes with `503 Service Unavailable` while keeping the `/admin/*` portal and `/health` fully accessible.

---

## 2. Zero-Overhead Performance Design

* **Redis Persistence:** Flags are stored in Redis (`circuit_breaker:payouts`, `circuit_breaker:escrow`, `circuit_breaker:maintenance_mode`).
* **5-Second In-Memory Cache:** `CircuitBreakerService` caches values locally for 5 seconds, guaranteeing zero database/Redis network latency on high-throughput client requests.
* **Global Guard:** `CircuitBreakerGuard` checks requests at the entry point of the NestJS execution pipeline before any controller logic executes.

---

## 3. Administrative Control Endpoints

* **Query Status:** `GET /admin/settings/circuit-breakers`
* **Toggle Switch:** `POST /admin/settings/circuit-breakers/toggle`
  ```json
  {
    "type": "payouts",
    "state": true,
    "reason": "Routine financial audit of MFS accounts."
  }
  ```
