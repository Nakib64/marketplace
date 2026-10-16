# Proposals, Bidding & Real-Time Workroom Messaging

This document details proposal submission, pre-hire candidate interview chat, contract workrooms, and Socket.io WebSocket architecture.

---

## 1. Proposal Bidding & Validation

* Freelancers submit bids with:
  * `bidAmount`: Quoted budget in ৳ BDT.
  * `coverLetter`: Approach and qualification explanation.
  * Linked `workHistoryIds` and `portfolioItemIds`.
* **Database Constraint:** `@@unique([jobId, freelancerId])` prevents spamming multiple bids on the same job.

---

## 2. Pre-Hire Candidate Interview Workflow

1. **Pre-Hire Chat Initiation:** Clients click "Message Candidate" on a proposal, sending an initial message via `POST /proposals/:id/reply`.
2. **Dedicated Conversation:** Creates a `Conversation` record linked to `jobId` and `proposalId`.
3. **Automatic Promotion upon Hire:** When the client accepts the proposal:
   * The accepted proposal is marked `ACCEPTED`.
   * All competing pending proposals on that job are automatically marked `REJECTED`.
   * The conversation is automatically promoted to the project's official **Contract Workroom**.

---

## 3. Real-Time Chat & WebSocket Gateway

* **Technology:** **Socket.io** over WebSockets with JWT token authentication.
* **Room Architecture:** Clients join rooms identified by `conversationId`.
* **Events:**
  * `sendMessage`: Broadcasts message to all participants in the conversation room.
  * `messageRead`: Pushes real-time read receipts (`readAt`).
  * `typingStart` / `typingStop`: Real-time typing indicators.
* **Workroom Deep-Linking:** `GET /chat/contracts/:contractId` allows frontend deep-linking directly from a contract view (`/contracts/:id`) into its communication thread.
* **File Attachments:** Managed via Multer disk storage in `backend/uploads/` with MIME-type validation and 10MB size limit.
