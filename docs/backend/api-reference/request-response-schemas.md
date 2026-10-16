# Production JSON Request & Response Schemas

Below are the exact, production-grade HTTP payload contracts, headers, and status codes for all core platform operations.

---

### 1. Staff Authentication & 2FA Flow

#### A. Initial Staff Login (`POST /admin/auth/login`)
* **Headers:** `Content-Type: application/json`
* **Request Payload:**
  ```json
  {
    "email": "chief.admin@marketplace.com",
    "password": "SuperSecureAdminPassword123!"
  }
  ```
* **Response (200 OK — When 2FA is Active):**
  ```json
  {
    "requires2FA": true,
    "preAuthToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbi0wMDEiLCJlbWFpbCI6ImNoaWVmLmFkbWluQG1hcmtldHBsYWNlLmNvbSIsInRva2VuVHlwZSI6ImFkbWluX3ByZV9hdXRoIiwidXNlclR5cGUiOiJBRE1JTiIsImV4cCI6MTcyOTE5NDYwMH0.signature",
    "message": "Two-factor authentication code required.",
    "admin": {
      "id": "admin-001-uuid",
      "email": "chief.admin@marketplace.com",
      "name": "Chief Administrator",
      "role": "SUPER_ADMIN"
    }
  }
  ```

#### B. Verify 2FA & Complete Staff Sign-in (`POST /admin/auth/2fa/verify-login`)
* **Request Payload:**
  ```json
  {
    "preAuthToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "code": "841295"
  }
  ```
* **Response Headers:**
  * `Set-Cookie: admin_access_token=eyJhbGci...; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400`
  * `Set-Cookie: admin_refresh_token=eyJhbGci...; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`
* **Response (200 OK):**
  ```json
  {
    "message": "Two-factor authentication verified successfully",
    "admin": {
      "id": "admin-001-uuid",
      "email": "chief.admin@marketplace.com",
      "name": "Chief Administrator",
      "role": "SUPER_ADMIN",
      "isActive": true,
      "twoFactorEnabled": true
    }
  }
  ```

---

### 2. Pre-Hire Candidate Interview Messaging

#### Client Replies to Proposal (`POST /proposals/:id/reply`)
* **Headers:** `Cookie: access_token=...` (Client Role)
* **Request Payload:**
  ```json
  {
    "initialMessage": "Hello! I reviewed your portfolio on e-commerce designs. Are you available for a quick technical interview this afternoon?"
  }
  ```
* **Response (201 Created):**
  ```json
  {
    "message": "Pre-hire conversation opened successfully.",
    "conversation": {
      "id": "conv-8841-uuid",
      "jobId": "job-101-uuid",
      "proposalId": "prop-505-uuid",
      "clientId": "client-001-uuid",
      "freelancerId": "free-002-uuid",
      "lastMessageText": "Hello! I reviewed your portfolio on e-commerce designs...",
      "lastMessageAt": "2026-10-17T00:15:30.124Z",
      "messages": [
        {
          "id": "msg-001-uuid",
          "senderId": "client-001-uuid",
          "content": "Hello! I reviewed your portfolio on e-commerce designs...",
          "messageType": "TEXT",
          "isRead": false,
          "createdAt": "2026-10-17T00:15:30.124Z"
        }
      ]
    }
  }
  ```

---

### 3. Escrow Formation & Payment Gateway Webhook

#### A. Client Accepts Proposal & Initializes Escrow (`POST /contracts`)
* **Headers:** `Cookie: access_token=...`
* **Request Payload:**
  ```json
  {
    "proposalId": "prop-505-uuid"
  }
  ```
* **Response (201 Created):**
  ```json
  {
    "message": "Contract created. Please complete escrow deposit.",
    "contract": {
      "id": "contract-772-uuid",
      "jobId": "job-101-uuid",
      "proposalId": "prop-505-uuid",
      "clientId": "client-001-uuid",
      "freelancerId": "free-002-uuid",
      "escrowAmount": 15000.00,
      "platformFee": 1500.00,
      "status": "FUNDED",
      "createdAt": "2026-10-17T00:20:00.000Z"
    },
    "paymentUrl": "https://sandbox.sslcommerz.com/gwprocess/v4/gw.php?Q=pay&val_id=2610170020SSLCOMMERZ"
  }
  ```

#### B. SSLCommerz Server-to-Server IPN Webhook (`POST /contracts/sslcommerz/ipn`)
* **Headers:** `Content-Type: application/x-www-form-urlencoded`
* **Incoming Payload:**
  ```
  val_id=2610170020SSLCOMMERZ&tran_id=contract-772-uuid&amount=15000.00&card_type=BKASH-BKash&currency=BDT&status=VALID
  ```
* **Response (200 OK):**
  ```json
  {
    "status": "success",
    "message": "IPN validated. Escrow secured in holding vault.",
    "contractId": "contract-772-uuid",
    "escrowAmount": 15000.00
  }
  ```

---

### 4. Deliverable Handover & Work Approval

#### A. Freelancer Submits Deliverable (`POST /contracts/:id/submit-work`)
* **Headers:** `Cookie: access_token=...` (Freelancer Role)
* **Request Payload:**
  ```json
  {
    "handoverNotes": "All milestone deliverables completed. The production build is live at https://staging.clientapp.com and code has been merged into main repository pull request #14.",
    "deliverableUrls": [
      "https://github.com/organization/project/pull/14",
      "https://staging.clientapp.com"
    ]
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "message": "Deliverables submitted for client approval. 14-day review SLA timer started.",
    "contractId": "contract-772-uuid",
    "status": "PENDING_APPROVAL",
    "submittedAt": "2026-10-17T00:25:00.000Z",
    "autoApprovalDeadline": "2026-10-31T00:25:00.000Z"
  }
  ```

#### B. Client Approves Work & Releases Payment (`POST /contracts/:id/approve`)
* **Headers:** `Cookie: access_token=...` (Client Role)
* **Response (200 OK):**
  ```json
  {
    "message": "Work approved. Net escrow released to freelancer wallet.",
    "contractId": "contract-772-uuid",
    "escrowAmount": 15000.00,
    "platformFee": 1500.00,
    "netPayout": 13500.00,
    "status": "COMPLETED",
    "completedAt": "2026-10-17T00:30:00.000Z"
  }
  ```

---

### 5. Dispute Dossier & Proportional Split Settlement

#### Staff Executes Proportional Split Settlement (`POST /admin/disputes/:id/split`)
* **Headers:** `Cookie: admin_access_token=...`
* **Request Payload:**
  ```json
  {
    "clientRefundPercentage": 30,
    "adminNotes": "Mutual conciliation agreement: Deliverables were 70% complete. 30% refunded to client; 70% released to freelancer minus platform commission."
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "message": "Dispute resolved via proportional split settlement.",
    "verdict": "SPLIT_SETTLEMENT",
    "contractId": "contract-994-uuid",
    "totalEscrow": 20000.00,
    "clientRefundAmount": 6000.00,
    "freelancerGross": 14000.00,
    "platformFee": 1400.00,
    "freelancerNet": 12600.00
  }
  ```

---

### 6. Payouts & Mobile Money (bKash/Nagad)

#### Freelancer Requests Withdrawal (`POST /wallet/withdraw`)
* **Headers:** `Cookie: access_token=...`
* **Request Payload:**
  ```json
  {
    "amount": 10000.00,
    "method": "BKASH",
    "accountNumber": "01798123456"
  }
  ```
* **Response (201 Created):**
  ```json
  {
    "message": "Withdrawal request submitted for staff processing.",
    "withdrawal": {
      "id": "wth-412-uuid",
      "amount": 10000.00,
      "method": "BKASH",
      "accountNumber": "01798123456",
      "status": "PENDING",
      "createdAt": "2026-10-17T00:35:00.000Z"
    },
    "remainingWalletBalance": 2600.00
  }
  ```

---

### 7. Emergency Circuit Breakers & Kill Switches

#### Trip Emergency Kill Switch (`POST /admin/settings/circuit-breakers/toggle`)
* **Headers:** `Cookie: admin_access_token=...`
* **Request Payload:**
  ```json
  {
    "type": "payouts",
    "state": true,
    "reason": "Immediate freeze requested during suspicious MFS volume audit."
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "message": "Circuit breaker [payouts] successfully updated.",
    "type": "payouts",
    "state": true
  }
  ```
