# 🚀 NEXUS GOD-MODE WORKFLOWS - EXECUTION GUIDE

**Quick Start Guide for Triggering & Testing All 18 Production Workflows**

---

## 🎯 Quick Access

### Dashboard
```bash
# Primary (local hostname)
http://nexus-n8n.local/home/workflows

# Backup (direct port)
http://localhost:5678/home/workflows

# External
https://n8n.nexus-io.duckdns.org/home/workflows
```

---

## 📋 All 18 Workflows - Quick Reference

| # | Workflow | ID | Trigger | Priority |
|---|----------|----|---------| ---------|
| 1 | 🔴 Error Notifier | `00-global-error-notifier` | Auto (on error) | CRITICAL |
| 2 | 💳 Stripe Fulfillment | `01-stripe-order-fulfillment` | Webhook | CRITICAL |
| 3 | 🛒 Cart Recovery | `02-abandoned-order-recovery` | Scheduled (4h) | HIGH |
| 4 | 📊 Sales Report | `03-daily-sales-report` | Scheduled (9 AM) | HIGH |
| 5 | 🛡️  Security Monitor | `04-security-incident-aggregator` | Real-time | MEDIUM |
| 6 | 🤖 Support Router | `05-ai-support-router` | Webhook | MEDIUM |
| 7 | ⬆️  Product Upsell | `06-ai-product-upsell` | Event-based | MEDIUM |
| 8 | 🐳 Container Auto-Reg | `07-container-auto-registration-FIXED` | Docker events | LOW |
| 9 | 📦 Inventory Restock | `08-inventory-restock-ai` | Scheduled (daily) | MEDIUM |
| 10 | ⭐ Review Collection | `09-review-collection-ai` | Scheduled (2 days) | LOW |
| 11 | 📈 Performance Monitor | `10-performance-monitor` | Scheduled (5m) | MEDIUM |
| 12 | 📧 Newsletter | `11-newsletter-generator` | Scheduled (weekly) | MEDIUM |
| 13 | 💾 Auto Backup | `12-automated-backup` | Scheduled (3 AM) | CRITICAL |
| 14 | 🔍 SEO Optimizer | `13-seo-optimizer` | Scheduled (weekly) | LOW |
| 15 | 🚨 Fraud Detector | `14-fraud-detector` | Real-time | CRITICAL |
| 16 | 📱 Social Poster | `15-social-media-poster` | Scheduled (8 AM, noon) | MEDIUM |
| 17 | 📉 Churn Predictor | `16-churn-predictor` | Scheduled (daily) | MEDIUM |
| 18 | 🔎 Site Audit | `17-site-audit-bot` | Scheduled (weekly) | LOW |

---

## ▶️ How to Trigger Workflows

### Method 1: Manual Execution (Web Dashboard)
1. Open: `http://nexus-n8n.local/home/workflows`
2. Find workflow by name
3. Click the **▶ PLAY** button
4. View execution in "Executions" tab

### Method 2: Webhook HTTP Request
Each workflow has a unique webhook URL:

```bash
# Example: Trigger Stripe fulfillment workflow
curl -X POST \
  'http://localhost:5678/webhook/stripe-order-fulfillment' \
  -H 'Content-Type: application/json' \
  -d '{
    "orderId": "12345",
    "amount": 99.99,
    "email": "customer@example.com"
  }'

# Example: Trigger abandoned cart recovery
curl -X POST \
  'http://localhost:5678/webhook/abandoned-cart-recovery' \
  -H 'Content-Type: application/json' \
  -d '{
    "userId": "user123",
    "cartValue": 199.99,
    "cartItems": 5
  }'
```

### Method 3: Scheduled/Cron Triggers
Configure in n8n dashboard under "Trigger" settings:

**Daily Workflows:**
```
03-daily-sales-report     → 9:00 AM
12-automated-backup       → 3:00 AM
16-churn-predictor        → 11:00 PM
08-inventory-restock-ai   → 2:00 AM
```

**Weekly Workflows:**
```
11-newsletter-generator   → Monday 8:00 AM
13-seo-optimizer          → Saturday 3:00 AM
17-site-audit-bot         → Sunday 1:00 AM
```

**Real-time/Continuous:**
```
10-performance-monitor    → Every 5 minutes
14-fraud-detector         → Every 1 minute
04-security-incident-aggregator → Every 2 minutes
```

### Method 4: Event-Based Triggers
These activate automatically when specific events occur:

```javascript
// Order created → Stripe fulfillment
POST /api/orders → Triggers 01-stripe-order-fulfillment

// User signup → Could trigger welcome sequence
POST /api/auth/signup → Could trigger 11-newsletter-generator

// Container started → Container registration
Docker event → Triggers 07-container-auto-registration-FIXED

// New review submitted → Could send to AI analyzer
POST /api/reviews → Could trigger 09-review-collection-ai
```

---

## 🧪 Testing Individual Workflows

### Test 1: Global Error Notifier
```bash
# Simulate an error in another workflow
# This workflow automatically catches it and sends Telegram notification
# Verify: Check Telegram chat for error alert
```

### Test 2: Stripe Order Fulfillment
```bash
curl -X POST http://localhost:5678/webhook/stripe-order-fulfillment \
  -H 'Content-Type: application/json' \
  -d '{
    "id": "stripe_evt_test_12345",
    "type": "charge.succeeded",
    "data": {
      "object": {
        "id": "ch_test_123456789",
        "amount": 9999,
        "customer": "cus_test_abc123",
        "status": "succeeded"
      }
    }
  }'
```

### Test 3: Abandoned Cart Recovery
```bash
curl -X POST http://localhost:5678/webhook/abandoned-cart-recovery \
  -H 'Content-Type: application/json' \
  -d '{
    "cartId": "cart_123",
    "userId": "user_456",
    "email": "test@example.com",
    "itemCount": 3,
    "total": 150.00
  }'
```

### Test 4: Daily Sales Report
```bash
# Manually trigger from dashboard
# Or via scheduled time
# Expect: Telegram message with sales summary
```

### Test 5: Performance Monitor
```bash
# Runs every 5 minutes automatically
# Check Prometheus metrics at: http://localhost:9090
# Check Grafana dashboards at: http://localhost:3000
```

---

## 📊 Viewing Workflow Execution

### In n8n Dashboard
1. Click workflow name
2. Go to "Executions" tab
3. View:
   - Execution status (Success/Failed/Running)
   - Execution time
   - Input data
   - Output results
   - Error messages (if failed)

### Via Logs
```bash
# View n8n logs
docker compose logs -f n8n

# View execution history in database
docker compose exec -T postgres psql -U nexus -d n8n -c \
  "SELECT id, name, status, startedAt FROM execution_entity ORDER BY startedAt DESC LIMIT 10;"
```

### Via Monitoring
- **Prometheus:** `http://localhost:9090`
- **Grafana:** `http://localhost:3000`
- **Loki (Logs):** Built into Grafana

---

## ⚙️ Workflow Configuration

### To Enable Auto-Triggering
1. Dashboard → Workflow → Edit
2. Click trigger node
3. Set schedule/webhook/event
4. Save
5. Click ✓ checkbox to enable

### To Disable Workflow
1. Click workflow name
2. Click disable button (circle icon)
3. Workflow won't trigger until re-enabled

### To Modify Workflow
1. Click edit button
2. Edit nodes/connections
3. Test run
4. Save

---

## 🔔 Notifications & Alerts

### Telegram Integration
Workflows send alerts to Telegram. Configure:

1. Get Telegram Bot Token
2. Get Chat ID
3. Update n8n environment variables
4. Restart n8n service

```bash
# Configure in docker-compose.yml
environment:
  TELEGRAM_BOT_TOKEN: "your_token_here"
  TELEGRAM_CHAT_ID: "your_chat_id_here"
```

### Email Notifications
Configure Resend for email alerts:

```bash
# Already configured
RESEND_API_KEY: "re_V9cz4Yo9_..."
```

### Slack Integration (Optional)
Add Slack webhook to any workflow:

```bash
# Slack webhook URL
https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

---

## 🚀 High-Impact Execution Plan

**Day 1: Activate Critical Path**
```
1. Enable: 01-stripe-order-fulfillment
2. Enable: 12-automated-backup
3. Enable: 00-global-error-notifier
4. Enable: 14-fraud-detector
```

**Day 2-3: Add Revenue Streams**
```
1. Enable: 02-abandoned-order-recovery (Recover lost sales)
2. Enable: 06-ai-product-upsell (Increase AOV)
3. Enable: 11-newsletter-generator (Email revenue)
4. Enable: 15-social-media-poster (Brand awareness)
```

**Week 1: Complete Setup**
```
1. Enable: 03-daily-sales-report (Daily metrics)
2. Enable: 10-performance-monitor (System health)
3. Enable: 16-churn-predictor (Retention)
4. Enable: All remaining workflows
```

---

## 📈 Monitoring Impact

### Track in Grafana
1. Open: `http://localhost:3000`
2. Login with Grafana credentials
3. View dashboards:
   - n8n Workflow Execution
   - Revenue Impact
   - System Performance
   - Customer Metrics

### Track in App Dashboard
1. Open: `https://app.nexus-io.duckdns.org/admin`
2. View:
   - Real-time order processing
   - Automation metrics
   - Revenue reports
   - System status

---

## 🐛 Troubleshooting

### Workflow Not Triggering
```bash
# Check if n8n is running
docker compose ps n8n

# Check n8n logs
docker compose logs n8n | grep -i error

# Verify database connection
docker compose exec -T postgres psql -U nexus -d n8n -c "SELECT COUNT(*) FROM workflow_entity;"
```

### Webhook Not Responding
```bash
# Test webhook endpoint
curl http://localhost:5678/webhook/test-endpoint

# Check if endpoint exists
curl http://localhost:5678/api/v1/workflows | jq '.workflows[] | select(.name | contains("test"))'
```

### Execution Failed
1. Check execution logs in dashboard
2. Review error message
3. Check database connectivity
4. Verify API keys/credentials
5. Restart n8n: `docker compose restart n8n`

---

## 📚 Additional Resources

- **Full E2E Test Report:** `TEST_RESULTS_E2E.md`
- **API Documentation:** `docs/n8n-workflow-setup.md`
- **Troubleshooting:** `docs/n8n-container-automation.md`
- **Local Access Guide:** `ACCESS_N8N_LOCALLY.md`

---

## ✅ Verification Checklist

Before going live:

- [ ] All 18 workflows appear in dashboard
- [ ] At least 1 critical workflow manually tested
- [ ] Telegram notifications configured and working
- [ ] Database backups running on schedule
- [ ] Error notifier tested
- [ ] Performance monitor showing metrics
- [ ] Team trained on workflow management
- [ ] Runbooks created for failures

---

**Generated:** 2026-03-02
**Status:** Production Ready
**Next Review:** Weekly

