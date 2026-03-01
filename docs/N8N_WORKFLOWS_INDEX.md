# 📚 NEXUS n8n Workflows Index

**Complete**: 7 Production-Ready Workflows
**Status**: All files in `n8n-workflows/` directory
**Last Updated**: March 1, 2026
**Deployment**: Automatic via GitHub Actions or manual import

---

## Workflow Files

### Core Infrastructure

| File | Workflow | Purpose | Trigger | Status |
|------|----------|---------|---------|--------|
| `00-global-error-notifier.json` | 🔥 Global Error Notifier | Centralized error handling | Webhook | REQUIRED |

### Revenue Automation

| File | Workflow | Purpose | Trigger | Status |
|------|----------|---------|---------|--------|
| `01-stripe-order-fulfillment.json` | 🚀 Stripe Order Fulfillment | Real-time payment processing | Stripe Webhook | CRITICAL |
| `02-abandoned-order-recovery.json` | 💰 Abandoned Order Recovery | Revenue recovery | Cron (20 min) | ACTIVE |
| `06-ai-product-upsell.json` | 🎯 AI Product Upsell | Post-purchase upsell | Manual (on-demand) | ACTIVE |

### Analytics & Operations

| File | Workflow | Purpose | Trigger | Status |
|------|----------|---------|---------|--------|
| `03-daily-sales-report.json` | 📊 Daily Sales Report | Executive reporting | Cron (23:00 UTC) | ACTIVE |

### Security & Support

| File | Workflow | Purpose | Trigger | Status |
|------|----------|---------|---------|--------|
| `04-security-incident-aggregator.json` | 🛡️ Security Incident Aggregator | Auto-remediation | Webhook | ACTIVE |
| `05-ai-support-router.json` | 💬 AI Support Router | Smart support routing | Webhook | ACTIVE |

---

## Detailed Workflow Specs

### 🔥 Global Error Notifier

**File**: `00-global-error-notifier.json`

**Purpose**: Catches errors from all workflows and routes to multiple channels

**Nodes**: 5
- Error Webhook (receiver)
- Rust Error Analyzer (severity scoring)
- Telegram Critical Alert
- Loki Logger
- Admin Email

**Configuration**:
```
Path: /error-notifier
Method: POST
Auth: None (internal only)
```

**Requires**:
- `TELEGRAM_CHAT_ID` env var
- Telegram credential
- Resend SMTP credential

**Set as Error Workflow for**: All other workflows

---

### 🚀 Stripe Order Fulfillment

**File**: `01-stripe-order-fulfillment.json`

**Purpose**: Real-time order processing with AI personalization

**Nodes**: 8
- Stripe Webhook (receiver)
- IF Payment Success (conditional)
- Update Order → Paid (Postgres)
- Resend Confirmation (email)
- Rust Fraud Agent (check)
- Groq Personal Thank You (AI)
- Telegram Admin Alert
- Loki Logger

**Webhook Path**: `/stripe-webhook`

**Requires**:
- Order table with: `id`, `status`, `total`, `userId`
- Stripe account + webhook secret
- `GROQ_API_KEY` env var
- Postgres, Resend, Telegram credentials

**Revenue Impact**: 100% fulfillment + fraud detection + personalization

**Testing**:
```bash
curl -X POST https://n8n.yourdomain.com/webhook/stripe-webhook \
  -H "Content-Type: application/json" \
  -d '{"body":{"type":"checkout.session.completed",...}}'
```

---

### 💰 Abandoned Order Recovery

**File**: `02-abandoned-order-recovery.json`

**Purpose**: Recover lost revenue from incomplete orders

**Trigger**: Cron every 20 minutes

**Nodes**: 8
- Cron Trigger
- Find Abandoned Orders (SQL query)
- SplitInBatches (parallel processing)
- Groq Recovery Email (AI copy)
- Send Recovery (Resend)
- Mark Notified (Postgres update)
- Loki Logger

**SQL Query**:
```sql
SELECT o.id, o.total, o.userId, u.email, u.name,
  string_agg(p.name, ', ') as items
FROM Order o
JOIN User u ON o.userId = u.id
LEFT JOIN OrderItem oi ON o.id = oi.orderId
LEFT JOIN Product p ON oi.productId = p.id
WHERE o.status = 'pending'
  AND o.date < NOW() - INTERVAL '20 minutes'
  AND o.cancelled = false
GROUP BY o.id, u.id
LIMIT 30
```

**Requires**:
- Order table with: `status`, `date`, `cancelled`, `userId`
- User table with: `email`, `name`
- OrderItem & Product tables
- `GROQ_API_KEY` env var

**Discount Code**: `RECOVER20` (20% off)

**Expected Recovery**: 5-15% of abandoned orders

---

### 📊 Daily Sales Report

**File**: `03-daily-sales-report.json`

**Purpose**: Executive dashboard + AI insights

**Trigger**: Cron daily at 23:00 UTC

**Nodes**: 6
- Cron Trigger
- Daily Aggregate (SQL)
- Gemini Executive Summary (AI)
- Email Report (Resend)
- Generate Backup CSV
- Loki Logger

**SQL Query**:
```sql
SELECT DATE(date) as day,
  SUM(total) as revenue,
  COUNT(*) as orders,
  COUNT(DISTINCT userId) as customers
FROM Order
WHERE status = 'paid'
  AND DATE(date) = CURRENT_DATE
GROUP BY DATE(date)
```

**Requires**:
- Order table with: `date`, `status`, `total`, `userId`
- `GEMINI_API_KEY` env var

**Output**:
- HTML email to admin
- CSV backup in Postgres temp dir
- Loki entry

**Next Day Prediction**: Included in AI summary

---

### 🛡️ Security Incident Aggregator

**File**: `04-security-incident-aggregator.json`

**Purpose**: Auto-remediation for security threats

**Trigger**: Webhook from Fail2Ban / Uptime Kuma / Grafana

**Nodes**: 7
- Security Webhook
- Rust Severity Analyzer
- IF Critical (>70)
- Auto Block IP (Traefik)
- Telegram Alert
- Admin Email
- Loki Logger

**Webhook Path**: `/security-alert`

**Payload Format**:
```json
{
  "source": "fail2ban|uptime-kuma|grafana",
  "type": "ssh-brute-force|service-down|alert",
  "ip": "192.168.1.100",
  "message": "Description of incident"
}
```

**Requires**:
- Rust service at `http://nexus-rust-service:8080/severity-score`
- Traefik API available
- `TELEGRAM_CHAT_ID` env var

**Auto-Block**: IPs with severity > 70 (24h via Traefik)

**Integration Points**:
```bash
# Fail2Ban → webhook on ban
# Uptime Kuma → webhook notifier on down
# Grafana → webhook notifier on alert
```

---

### 💬 AI Support Router

**File**: `05-ai-support-router.json`

**Purpose**: Smart customer support ticket routing

**Trigger**: Webhook from frontend chat

**Nodes**: 10
- Support Webhook
- Groq Intent Classifier
- Switch Router (by intent)
- Refund Agent
- Fraud Agent
- Shipping Agent
- Product Agent
- Default Agent
- Reply to Frontend
- Loki Logger

**Webhook Path**: `/support-webhook`

**Payload Format**:
```json
{
  "userId": "user-123",
  "orderId": "order-456",
  "message": "I want a refund for my order",
  "callbackUrl": "https://app.yourdomain.com/api/chat/callback"
}
```

**Intent Classification**:
- `refund` → Refund Agent
- `fraud` → Fraud Agent
- `shipping` → Shipping Agent
- `product` → Product Agent
- `other` → Default Agent

**Requires**:
- `GROQ_API_KEY` env var
- Rust agents at `http://nexus-rust-service:8080/agents/*`
- Frontend callback webhook handler

**Response**:
```json
{
  "response": "Agent output here",
  "intent": "refund",
  "status": "completed"
}
```

---

### 🎯 AI Product Upsell

**File**: `06-ai-product-upsell.json`

**Purpose**: Post-purchase revenue boost with AI recommendations

**Trigger**: Manual (can be scheduled or event-driven)

**Nodes**: 8
- Poll Recent Paid Orders
- SplitInBatches
- Get User & Products
- Rust Product Recommender
- Groq Upsell Copy
- Send Upsell Email
- Mark Upsell Sent
- Loki Logger

**SQL Query**:
```sql
SELECT * FROM Order
WHERE status = 'paid'
  AND date > NOW() - INTERVAL '5 minutes'
  AND upsell_sent = false
ORDER BY date DESC
LIMIT 10
```

**Requires**:
- Order table with: `status`, `date`, `upsell_sent`
- User & Product tables
- `GROQ_API_KEY` env var
- Rust recommender service

**Discount Code**: `UPSELL15` (15% off)

**Expected AOV Increase**: 2-8%

---

## Environment Variables Required

```bash
# Database
DB_PASSWORD=<strong-password>

# n8n
N8N_ENCRYPTION_KEY=<32-char-hex>
N8N_BASIC_AUTH_PASSWORD=<strong>

# Redis
REDIS_PASSWORD=<strong-password>

# AI Models
GROQ_API_KEY=<groq-key>      # Fast inference
GEMINI_API_KEY=<gemini-key>  # For reports

# Email
RESEND_API_KEY=<resend-key>  # Transactional email

# Notifications
TELEGRAM_BOT_TOKEN=<token>
TELEGRAM_CHAT_ID=<id>
```

---

## Credentials to Create in n8n

1. **NEXUS Postgres**
   - Type: PostgreSQL
   - Host: `postgres` (internal)
   - Database: `nexus_v2`
   - User: `nexus`
   - Password: `${DB_PASSWORD}`

2. **Resend SMTP**
   - Type: SMTP
   - Host: `smtp.resend.com`
   - Port: 465
   - User: `default`
   - Password: `${RESEND_API_KEY}`
   - TLS: Enabled

3. **NEXUS Telegram**
   - Type: Telegram Bot API
   - Token: `${TELEGRAM_BOT_TOKEN}`

---

## Quick Activation Checklist

- [ ] Copy all 7 JSON files to `n8n-workflows/`
- [ ] Update `docker-compose.yml` n8n service
- [ ] Generate encryption key: `openssl rand -hex 32`
- [ ] Update `.env` with all required vars
- [ ] Restart n8n: `docker compose restart n8n`
- [ ] Login to n8n (admin / password)
- [ ] Create 3 credentials
- [ ] Import all workflows
- [ ] Activate Global Error Notifier first
- [ ] Activate remaining 6 workflows
- [ ] Test Stripe workflow
- [ ] Test abandoned recovery
- [ ] Monitor logs in Loki

---

## Testing Commands

```bash
# Test Stripe
curl -X POST https://n8n.yourdomain.com/webhook/stripe-webhook \
  -H "Content-Type: application/json" \
  -d '{"body":{"type":"checkout.session.completed",...}}'

# Test Security
curl -X POST https://n8n.yourdomain.com/webhook/security-alert \
  -H "Content-Type: application/json" \
  -d '{"source":"fail2ban","type":"ssh","ip":"1.2.3.4","message":"test"}'

# Test Support
curl -X POST https://n8n.yourdomain.com/webhook/support-webhook \
  -H "Content-Type: application/json" \
  -d '{"userId":"u1","orderId":"o1","message":"refund?","callbackUrl":"..."}'

# List all workflows
curl https://n8n.yourdomain.com/api/v1/workflows \
  -H "X-N8N-API-Key: $N8N_API_KEY" | jq '.data[] | {name, active}'
```

---

## Documentation References

- **Setup**: `docs/N8N_SETUP_PRODUCTION.md` (Complete setup guide)
- **Architecture**: `docs/ARCHITECTURE.md` (System overview)
- **Security**: `docs/SECURITY.md` (Security best practices)

---

**🎉 All 7 workflows are production-ready!**

Deploy with confidence. Monitor with Loki. Scale with queue mode.
