# Standardized Machine Error Code Dictionary

All error responses from the platform conform to an immutable, machine-readable JSON envelope:

```json
{
  "statusCode": 409,
  "error": "Conflict",
  "errorCode": "ERR_CONTRACT_ALREADY_COMPLETED",
  "message": "This contract has already been approved and funds released.",
  "timestamp": "2026-10-17T00:40:00.000Z",
  "correlationId": "req_8dfa91b2"
}
```

---

## Complete Error Code Reference Matrix

| Error Code | HTTP Status | Domain | Cause & Resolution |
|---|---|---|---|
| `ERR_AUTH_INVALID_CREDENTIALS` | `401 Unauthorized` | Auth | Incorrect email or password entered. |
| `ERR_AUTH_2FA_REQUIRED` | `403 Forbidden` | Auth | Account requires 6-digit TOTP verification before issuing access cookies. |
| `ERR_AUTH_2FA_INVALID_CODE` | `401 Unauthorized` | Auth | 6-digit code does not match TOTP drift window. |
| `ERR_AUTH_PREAUTH_EXPIRED` | `401 Unauthorized` | Auth | Pre-authentication 5-minute session expired. Re-authenticate with password. |
| `ERR_ACCOUNT_DEACTIVATED` | `403 Forbidden` | Auth | User or staff account marked `isActive = false` or `isBanned = true`. |
| `ERR_EMAIL_NOT_VERIFIED` | `403 Forbidden` | Auth | User must verify email before executing sensitive actions. |
| `ERR_RATE_LIMIT_EXCEEDED` | `429 Too Many Requests` | Edge | Sliding-window Redis rate limit hit. Wait for TTL window to expire. |
| `ERR_CIRCUIT_BREAKER_PAYOUTS` | `503 Service Unavailable` | FinOps | Payout kill switch active. All withdrawals paused. |
| `ERR_CIRCUIT_BREAKER_ESCROW` | `503 Service Unavailable` | FinOps | Escrow funding kill switch active. New contract checkout paused. |
| `ERR_CIRCUIT_BREAKER_MAINTENANCE`| `503 Service Unavailable` | Edge | Global maintenance mode active. Client routes unavailable. |
| `ERR_WALLET_INSUFFICIENT_FUNDS` | `400 Bad Request` | FinOps | Requested withdrawal amount exceeds current available `walletBalance`. |
| `ERR_WITHDRAWAL_ALREADY_RESOLVED`| `409 Conflict` | FinOps | Payout record has already been approved or rejected. |
| `ERR_CONTRACT_NOT_DISPUTED` | `400 Bad Request` | Arbitration | Attempted arbitration verdict on a contract not in `DISPUTED` status. |
| `ERR_CONTRACT_ALREADY_COMPLETED` | `409 Conflict` | Contracts | Client attempted approval on a contract already finalized. |
| `ERR_CIRCUMVENTION_DETECTED` | `400 Bad Request` | Moderation | Message or proposal contains prohibited phone numbers or external channels. |
| `ERR_FILE_TOO_LARGE` | `413 Payload Too Large` | Storage | Uploaded file exceeds the 10MB ceiling. |
| `ERR_INVALID_FILE_TYPE` | `415 Unsupported Media` | Storage | File MIME type not in authorized whitelist (PDF, PNG, JPG, ZIP). |
