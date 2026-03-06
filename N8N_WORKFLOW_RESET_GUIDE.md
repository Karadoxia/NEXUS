# 🔄 N8N WORKFLOW RESET & RECONFIGURATION GUIDE

## Overview

This guide covers:
1. Resetting all databases from scratch
2. Reconfiguring all 18 n8n workflows
3. Testing each workflow end-to-end
4. Verifying database integrations

---

## ⚠️ Step 1: Reset All Databases

```bash
# Full reset with migrations and test data
./scripts/reset-databases.sh --with-migrations --seed

# Or step-by-step:
./scripts/reset-databases.sh              # Just reset databases
npx prisma migrate deploy                  # Run migrations manually
npx prisma db seed                        # Seed test data
```

**What Gets Reset:**
- `nexus_v2`: All products, orders, users, addresses deleted
- `nexus_hr`: All employees deleted
- `nexus_ai`: All ML training data, embeddings, predictions deleted

**What Remains:**
- Database schemas (tables, indexes, constraints)
- Environment variables and secrets
- n8n workflows and credentials

---

## 📋 Step 2: Verify Database Connections

### From n8n UI:

1. Go to **Credentials** → **New Credential**
2. Create PostgreSQL credentials for each database:

#### Credential: `postgres-nexus-v2`
```
Host: postgres
Port: 5432
User: nexus
Password: (from db_password.txt)
Database: nexus_v2
```

#### Credential: `postgres-nexus-hr`
```
Host: postgres
Port: 5432
User: nexus
Password: (from db_password.txt)
Database: nexus_hr
```

#### Credential: `postgres-nexus-ai`
```
Host: postgres-ai
Port: 5432
User: nexus_ai
Password: (from db_password.txt)
Database: nexus_ai
```

---

## 🔧 Step 3: Reconfigure Each Workflow

### 1. **00-global-error-notifier** ✅
**Purpose:** Centralized error handler
**Nodes to Check:**
- [ ] Trigger (webhook)
- [ ] Error Parser (code)
- [ ] Telegram Node - verify bot token & chat ID
- [ ] Email Node - verify Resend API key
- [ ] Loki Node - verify endpoint

**Configuration:**
```json
{
  "Telegram": {
    "botToken": "${TELEGRAM_BOT_TOKEN}",
    "chatId": "6899339578"
  },
  "Email": {
    "apiKey": "${RESEND_API_KEY}",
    "from": "NEXUS Store <onboarding@resend.dev>"
  }
}
```

---

### 2. **01-stripe-order-fulfillment** 🚀
**Purpose:** Real-time Stripe webhook → Order fulfillment
**Nodes to Check:**
- [ ] Stripe Webhook (Webhook)
- [ ] Parse Webhook (Code)
- [ ] Fetch Order (Database - nexus_v2)
- [ ] Verify Payment (HTTP - Stripe API)
- [ ] Update Order Status (Database - nexus_v2)
- [ ] Generate Confirmation Email (Gemini)
- [ ] Send Confirmation (Email)
- [ ] Fraud Check (Code or HTTP)
- [ ] Notify Admin (Telegram)

**Workflow:**
1. Webhook receives Stripe `payment_intent.succeeded`
2. Parse payload to extract order ID
3. Query `Order` table to get customer email
4. Update order `status` → "paid"
5. Use Gemini to write personalized confirmation
6. Send via Resend email
7. Alert admin on Telegram

**Test Data Setup:**
```sql
INSERT INTO "Order" (id, "userId", total, status, "createdAt") VALUES
  ('order-test-001', 'user-001', 99.99, 'pending', NOW());

INSERT INTO "OrderItem" (id, "orderId", "productId", quantity, price) VALUES
  ('item-001', 'order-test-001', 'product-001', 1, 99.99);
```

---

### 3. **02-abandoned-order-recovery** 💰
**Purpose:** Recover orders abandoned >20 minutes
**Nodes to Check:**
- [ ] Cron Trigger (every 20 minutes)
- [ ] Query Pending Orders (Database - nexus_v2)
- [ ] Check Age (Code)
- [ ] Gemini AI (Generate recovery email)
- [ ] Send Email (Resend)
- [ ] Log Recovery (optional)

**Workflow:**
1. Cron triggers every 20 minutes
2. Query: `SELECT * FROM "Order" WHERE status='pending' AND created_at < NOW() - INTERVAL '20 minutes'`
3. For each order, generate recovery message with RECOVER20 code
4. Send personalized email
5. Update order metadata with recovery attempt

---

### 4. **03-daily-sales-report** 📊
**Purpose:** Daily 23:00 - sales summary + Gemini analysis + backup
**Nodes to Check:**
- [ ] Cron Trigger (daily 23:00)
- [ ] Query Paid Orders (Database - nexus_v2)
- [ ] Gemini Analysis (generate executive summary)
- [ ] Create CSV (Code)
- [ ] Email Report (Resend)
- [ ] Backup to S3 (optional)

**SQL Query:**
```sql
SELECT
  COUNT(*) as total_orders,
  SUM(total) as revenue,
  AVG(total) as avg_order_value,
  DATE("createdAt") as date
FROM "Order"
WHERE status = 'paid'
  AND DATE("createdAt") = CURRENT_DATE
GROUP BY DATE("createdAt");
```

---

### 5. **04-security-incident-aggregator** 🛡️
**Purpose:** Webhook handler for Fail2Ban/Uptime Kuma/Grafana
**Nodes to Check:**
- [ ] Webhook Trigger
- [ ] Parse Alert (Code)
- [ ] Severity Analyzer (Gemini or Code)
- [ ] Auto-Block IP (optional)
- [ ] Log to Loki (HTTP)
- [ ] Alert Telegram

---

### 6. **05-ai-support-router** 💬
**Purpose:** Support ticket classifier + router
**Nodes to Check:**
- [ ] Webhook Trigger (from frontend)
- [ ] Parse Message (Code)
- [ ] Gemini Classification (refund/fraud/shipping/product/other)
- [ ] Route to Handler (Switch node)
- [ ] Send Reply (Callback)

**Gemini Prompt:**
```
Classify this support request into one of:
- "refund": Customer wants money back
- "fraud": Account security issue
- "shipping": Tracking/delivery question
- "product": Product quality/specs
- "other": General inquiry

Request: {{message}}

Response format: { "category": "...", "confidence": 0.95 }
```

---

### 7. **06-ai-product-upsell** 🎯
**Purpose:** Triggered on paid order - personalized upsell email
**Nodes to Check:**
- [ ] Trigger: Order paid
- [ ] Fetch Customer + Order (Database - nexus_v2)
- [ ] Gemini: Generate upsell (code name for 15% UPSELL15)
- [ ] Send Email (Resend)

---

### 8. **07-container-auto-registration** 🐳
**Purpose:** Auto-detect Docker containers
**Nodes to Check:**
- [ ] Webhook Trigger (from docker-event-watcher script)
- [ ] Parse Container Event (Code)
- [ ] Register Container (Database - nexus_ai)
- [ ] Update Status (Database)

**Status Tracking:**
```sql
CREATE TABLE IF NOT EXISTS "ContainerRegistry" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT NOT NULL,
  status TEXT,
  detectedAt TIMESTAMP,
  registeredAt TIMESTAMP,
  lastHealthCheck TIMESTAMP
);
```

---

### 9. **08-inventory-restock-ai** 📦
**Purpose:** AI-driven inventory management
**Nodes to Check:**
- [ ] Trigger: Low inventory
- [ ] Gemini: Generate supplier email
- [ ] Send Supplier Email
- [ ] Track Restock Order (Database)

---

### 10. **09-review-collection-ai** ⭐
**Purpose:** Post-purchase review collection
**Nodes to Check:**
- [ ] Trigger: Order delivered
- [ ] Gemini: Generate review request
- [ ] Send Email
- [ ] Sentiment Analysis (if review received)

---

### 11. **10-performance-monitor** 📈
**Purpose:** Site performance monitoring
**Nodes to Check:**
- [ ] Cron: Every hour
- [ ] Check page load time
- [ ] Check API latency
- [ ] Check database response
- [ ] Auto-trigger optimization if slow

---

### 12. **11-newsletter-generator** 📧
**Purpose:** Weekly automated newsletter
**Nodes to Check:**
- [ ] Cron: Every Monday 9:00
- [ ] Fetch featured products (Database - nexus_v2)
- [ ] Gemini: Write newsletter content
- [ ] Get subscribers (Database - nexus_v2)
- [ ] Send bulk email (Resend)

---

### 13. **12-automated-backup** 💾
**Purpose:** Daily automated backup
**Nodes to Check:**
- [ ] Cron: Daily 02:00
- [ ] pg_dump (Shell)
- [ ] Verify integrity (Code)
- [ ] Upload to S3 (optional)
- [ ] Notify admin (Telegram)

---

### 14. **13-seo-optimizer** 🔍
**Purpose:** Auto-generate SEO meta tags
**Nodes to Check:**
- [ ] Trigger: New product
- [ ] Gemini: Generate meta tags
- [ ] Update product metadata (Database)
- [ ] Submit to Google Search Console (optional)

---

### 15. **14-fraud-detector** 🛡️
**Purpose:** Real-time fraud detection
**Nodes to Check:**
- [ ] Trigger: New order
- [ ] Fetch order data (Database - nexus_v2)
- [ ] Analyze patterns (Database - nexus_ai)
- [ ] Gemini: Risk assessment
- [ ] Update fraud score (Database - nexus_ai)
- [ ] Block if high risk (Code)

**Fraud Indicators:**
- New customer + large order
- Multiple orders same day
- Different shipping address
- High-risk country
- Card velocity (multiple cards same IP)

---

### 16. **15-social-media-poster** 📱
**Purpose:** Auto-post to social media
**Nodes to Check:**
- [ ] Trigger: New product or promotion
- [ ] Gemini: Generate social post
- [ ] Post to Twitter (HTTP)
- [ ] Post to Instagram (HTTP)
- [ ] Log post (Database)

---

### 17. **16-churn-predictor** 📉
**Purpose:** Predict churn + send retention campaigns
**Nodes to Check:**
- [ ] Cron: Daily
- [ ] Fetch customers (Database - nexus_v2)
- [ ] Compute churn score (Database - nexus_ai)
- [ ] Gemini: Generate retention offer
- [ ] Send email (Resend)

---

### 18. **17-site-audit-bot** 🤖
**Purpose:** Weekly comprehensive site audit
**Nodes to Check:**
- [ ] Cron: Every Sunday 02:00
- [ ] Check page load time
- [ ] Check broken links
- [ ] Check SSL certificate
- [ ] Check API availability
- [ ] Generate report (Gemini)
- [ ] Email report (Resend)

---

## 🧪 Step 4: Test Each Workflow

### Test Checklist (for each workflow):

```bash
# 1. Check workflow is active
[ ] Workflow toggle is ON

# 2. Check credentials exist
[ ] All referenced credentials are created
[ ] Credentials have correct values

# 3. Check database connections
[ ] Database nodes can connect (test query)
[ ] Correct database selected (v2 vs hr vs ai)

# 4. Check API integrations
[ ] Gemini API working (test node)
[ ] Telegram working (test node)
[ ] Resend email working (test node)

# 5. Dry run
[ ] Trigger workflow manually
[ ] Check n8n execution log
[ ] Verify database changes
[ ] Check external notifications
```

### Manual Test Commands:

```bash
# Test Stripe webhook (01-stripe-order-fulfillment)
curl -X POST http://localhost:5678/webhook/stripe \
  -H "Content-Type: application/json" \
  -d '{
    "id": "evt_123",
    "type": "payment_intent.succeeded",
    "data": {
      "object": {
        "id": "pi_123",
        "metadata": {"order_id": "order-test-001"}
      }
    }
  }'

# Test support webhook (05-ai-support-router)
curl -X POST http://localhost:5678/webhook/support \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I want a refund for my order",
    "customerId": "user-001"
  }'
```

---

## ✅ Step 5: Verification Checklist

- [ ] All 18 workflows appear in n8n UI
- [ ] All workflows are ACTIVE (toggle on)
- [ ] All credentials created and tested
- [ ] All database connections verified
- [ ] Gemini API working
- [ ] Telegram bot working
- [ ] Resend email working
- [ ] At least one workflow has been manually triggered
- [ ] Workflow execution logs show success
- [ ] Database changes are visible in tables

---

## 🆘 Troubleshooting

### Workflow Won't Trigger
1. Check if workflow is active (toggle ON)
2. Check if trigger is correctly configured
3. Manually trigger in n8n UI
4. Check execution logs for errors

### Database Connection Failed
1. Verify credentials in n8n UI
2. Check database is running: `docker-compose ps postgres`
3. Test connection manually: `psql -h localhost -U nexus -d nexus_v2`
4. Verify DATABASE_URL environment variable

### Gemini Node Failing
1. Check typeVersion is 4
2. Check request format uses "parts" array
3. Verify GEMINI_API_KEY is set
4. Check error message in execution log

### Email Not Sending
1. Verify RESEND_API_KEY is set
2. Check "from" email is correct
3. Check "to" email is in test list
4. Review execution logs

---

## 📊 Success Metrics

After reset and reconfiguration, verify:

```sql
-- Check Order table exists and is empty
SELECT COUNT(*) FROM "Order";  -- Should be 0 or low test count

-- Check Employee table
SELECT COUNT(*) FROM "Employee";  -- Should be 2 (admins)

-- Check Product Embedding table
SELECT COUNT(*) FROM "ProductEmbedding";  -- Should be empty initially

-- Check Churn Predictions
SELECT COUNT(*) FROM "ChurnPrediction";  -- Should be empty initially

-- Check AI Audit Log
SELECT COUNT(*) FROM "AIAuditLog";  -- Should show workflow executions
```

---

## 🚀 Next Steps

1. **Run reset script**: `./scripts/reset-databases.sh --with-migrations --seed`
2. **Verify databases**: `psql -h localhost -U nexus -d nexus_v2 -c "SELECT 1"`
3. **Create credentials** in n8n UI for each database
4. **Import or recreate workflows** in n8n
5. **Test each workflow** manually
6. **Monitor logs** for 24 hours
7. **Commit configuration** to Git

---

## 📝 Notes

- All workflows should be configured to use the **nexus_v2** database for orders/products/users unless specified otherwise (hr for employees, ai for ML data)
- Always test workflows in development before enabling in production
- Keep backup of working workflow configurations
- Monitor n8n execution logs regularly
- Set up alerts for workflow failures

---

**Last Updated**: 2026-03-02
**Status**: Ready for implementation
