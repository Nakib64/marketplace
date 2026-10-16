# Phase 14: Real-Time Messenger Chat & File Sharing System

## 1. Purpose
The purpose of Phase 14 is to provide seamless, real-time communication between Clients and Freelancers directly within the context of submitted job proposals. Designed like Facebook Messenger / Upwork Messages, the system automatically unlocks a dedicated conversation thread when a client replies to a proposal, stores permanent chat history, enables multimedia file attachments (images, PDFs, documents, archives), tracks unread counts and read receipts, and broadcasts real-time events over WebSockets (`socket.io`).

---

## 2. What Was Done
- [x] Update `schema.prisma` with `Conversation`, `Message`, and `MessageAttachment` models and `MessageType` enum (`TEXT`, `FILE`, `SYSTEM`):
  - `Conversation` unique per `[jobId, freelancerId]`, linked to `Job`, `Proposal`, `clientId`, and `freelancerId`.
  - `Message` linked to `Conversation` and `senderId`, with `isRead`, `readAt`, `isFlagged`, and `flagReason`.
  - `MessageAttachment` linked to `Message` storing `fileName`, `fileUrl`, `fileType`, and `fileSize`.
  - Push schema to PostgreSQL database using `prisma db push`.
- [x] Create `ChatFileService` for file validation, safe storage in `uploads/chat/`, and streaming:
  - Supports images (`png`, `jpeg`, `webp`, `gif`), documents (`pdf`, `word`, `excel`, `txt`), and archives (`zip`).
  - 15MB file size limit with sanitized unique filenames.
- [x] Implement `ChatService`:
  - `replyToProposal`: Creates/finds conversation from proposal, runs anti-circumvention scan, inserts initial message, and marks proposal as viewed.
  - `getConversations`: Paginated user inbox with counterpart profile (client company name/rating, freelancer title/success rate), unread message count, and preview of last message.
  - `getConversation`: Validates participant authorization and retrieves conversation metadata.
  - `getMessages`: Chronological paginated message history with sender info and attachments.
  - `sendMessage`: Sends text message, scans content with `AntiCircumventionService`, and updates conversation last message timestamp.
  - `sendFileMessage`: Creates file message with attachment metadata and updates conversation preview.
  - `markConversationAsRead`: Bulk marks incoming unread messages as read with timestamp.
- [x] Implement `ChatGateway` WebSocket server (`/chat` namespace):
  - Handshake JWT token validation extracting authenticated user ID.
  - Automatic joining of personal room `user_${userId}`.
  - Room management: `join_conversation` and `leave_conversation` (`conversation_${id}`).
  - Bidirectional events:
    - `send_message` -> broadcasts `new_message` to room and `conversation_updated` to recipient.
    - `typing` -> broadcasts `user_typing` to counterpart.
    - `mark_as_read` -> broadcasts `messages_read` to conversation participants.
- [x] Implement `ChatController` REST endpoints:
  - `POST /chat/proposals/:proposalId/reply`: Client initiates chat from a proposal.
  - `GET /chat/conversations`: Inbox listing with unread counts.
  - `GET /chat/conversations/:id`: Conversation details.
  - `GET /chat/conversations/:id/messages`: Paginated chat history.
  - `POST /chat/conversations/:id/messages`: Send text message.
  - `POST /chat/conversations/:id/attachments`: Upload and share attachment.
  - `PATCH /chat/conversations/:id/read`: Mark conversation as read.
  - `GET /chat/attachments/:filename`: Download/view attachment.
- [x] Write unit & integration tests covering proposal reply, participant authorization, message creation, file sharing, and read receipts (`src/chat/chat.service.spec.ts`).

---

## 3. Architecture & Endpoints

### A. Endpoints Overview
| Method | Route | Description |
| :--- | :--- | :--- |
| `POST` | `/chat/proposals/:proposalId/reply` | Client replies to a proposal, opening the conversation |
| `GET` | `/chat/conversations` | List user's conversations with unread counts and last message |
| `GET` | `/chat/conversations/:id` | Get specific conversation metadata (verifies participant) |
| `GET` | `/chat/conversations/:id/messages` | Paginated message history (chronological order) |
| `POST` | `/chat/conversations/:id/messages` | Send text message (with anti-circumvention scan) |
| `POST` | `/chat/conversations/:id/attachments` | Upload and send file attachment (multipart/form-data) |
| `PATCH` | `/chat/conversations/:id/read` | Mark all unread incoming messages as read |
| `GET` | `/chat/attachments/:filename` | Stream/download uploaded attachment |

### B. WebSocket Events (`/chat` namespace)
| Event (Client -> Server) | Payload | Server Response / Broadcast |
| :--- | :--- | :--- |
| `join_conversation` | `{ conversationId }` | Joins room `conversation_${id}` |
| `leave_conversation` | `{ conversationId }` | Leaves room `conversation_${id}` |
| `send_message` | `{ conversationId, content }` | Broadcasts `new_message` to room and `conversation_updated` to recipient |
| `typing` | `{ conversationId, isTyping }` | Broadcasts `user_typing` to counterpart |
| `mark_as_read` | `{ conversationId }` | Broadcasts `messages_read` to counterpart |
