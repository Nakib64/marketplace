# Environment Variables & Security Matrix

The following matrix documents every environment variable required for production deployment:

---

## Configuration Matrix

| Variable Name | Description | Production Value Format | Security Tier | Rotation Cadence |
|---|---|---|---|---|
| `DATABASE_URL` | PostgreSQL connection URI | `postgresql://user:pass@host:5432/db?connection_limit=20` | Critical | 90 Days |
| `REDIS_URL` | Redis cluster connection URI | `redis://default:token@host:6379` | High | 180 Days |
| `JWT_ACCESS_SECRET` | Secret for customer access tokens (24h) | 64-char cryptographically random hex | Critical | 180 Days |
| `JWT_REFRESH_SECRET` | Secret for customer refresh tokens (7d) | 64-char cryptographically random hex | Critical | 180 Days |
| `JWT_ADMIN_ACCESS_SECRET` | Isolated secret for staff access tokens | 64-char cryptographically random hex | Critical | 90 Days |
| `JWT_ADMIN_REFRESH_SECRET`| Isolated secret for staff refresh tokens | 64-char cryptographically random hex | Critical | 90 Days |
| `SSLCOMMERZ_STORE_ID` | Merchant store identifier | Registered SSLCommerz store ID | High | Annual |
| `SSLCOMMERZ_STORE_PASSWD`| Merchant store secret key | Registered SSLCommerz password | Critical | 180 Days |
| `SSLCOMMERZ_IS_LIVE` | Payment gateway environment toggle | `true` (Production) / `false` (Sandbox)| Low | N/A |
| `FRONTEND_URL` | Allowed origin for CORS & cookie policies | `https://marketplace.com` | Medium | On DNS change |
| `MAIL_HOST` | SMTP server hostname | `smtp.postmarkapp.com` / `smtp.sendgrid.net` | Medium | Annual |
| `MAIL_USER` / `MAIL_PASS` | SMTP authentication credentials | Dedicated API key | High | 180 Days |
