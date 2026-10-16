# Authentication, Authorization & Staff RBAC

This document outlines the authentication architecture, token lifecycle, two-factor authentication (TOTP RFC 6238), and role-based access control (RBAC).

---

## 1. Dual-Actor Domain Segregation

The marketplace strictly segregates public customers from internal back-office staff:

| Characteristic | Customer Domain (`/auth`) | Staff Domain (`/admin/auth`) |
|---|---|---|
| **Database Model** | `User` (Role: `CLIENT`, `FREELANCER`) | `Admin` (Role: `SUPER_ADMIN`, `ADMIN`, `MODERATOR`, `SUPPORT`) |
| **Token Secret** | `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | `JWT_ADMIN_ACCESS_SECRET` / `JWT_ADMIN_REFRESH_SECRET` |
| **Access Token Cookie** | `access_token` (24h) | `admin_access_token` (24h) |
| **Refresh Token Cookie**| `refresh_token` (7d) | `admin_refresh_token` (7d) |
| **Redis Session Key** | `user:refresh:<userId>` | `admin:refresh:<adminId>` (SHA-256 Hashed) |
| **2FA Requirement** | Optional | Enforced for sensitive administrative actions |

---

## 2. Two-Factor Authentication (TOTP RFC 6238)

Staff accounts can enable two-factor authentication using standard TOTP apps (Google Authenticator, Authy):

### Cryptographic Implementation:
* **Algorithm:** HMAC-SHA1 using Node.js built-in `node:crypto`.
* **Secret Format:** 20 bytes random buffer encoded as Base32 string (32 characters).
* **Time Step:** 30 seconds.
* **Drift Window:** The server validates time steps $t-1$, $t$, and $t+1$ (90 seconds total) to accommodate client clock skew.

### 2FA Sign-In Workflow:
1. `POST /admin/auth/login`: Validates email and password.
2. If `admin.twoFactorEnabled === true`, the server returns:
   ```json
   {
     "requires2FA": true,
     "preAuthToken": "<5-minute JWT signed with tokenType: 'admin_pre_auth'>"
   }
   ```
3. Staff enters 6-digit TOTP code via `POST /admin/auth/2fa/verify-login`.
4. Only upon valid code verification are the real `admin_access_token` and `admin_refresh_token` cookies issued.

---

## 3. Sliding-Window Redis Rate Limiter

* **Decorator:** `@RateLimit({ limit: 5, ttlSeconds: 300 })` applied to brute-force targets (login, 2FA verification, password resets).
* **Algorithm:** Uses Redis sorted sets (`ZADD`, `ZREMRANGEBYSCORE`, `ZCARD`) tracking exact microsecond timestamps.
* **Behavior:** Rejects requests exceeding threshold with `429 Too Many Requests`.
