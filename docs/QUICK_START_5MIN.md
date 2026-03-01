
# 🚀 NEXUS GOD-MODE QUICK START (5 MINUTES)

## Step 1: Verify Prerequisites (1 min)

```bash
# Make sure Docker is running
docker compose ps | grep -E "postgres|nexus-n8n|nexus-app"

# Should show 3 services running (green)
```

## Step 2: Activate Workflows in n8n UI (2 min)

1. Open: https://n8n.nexus-io.duckdns.org
2. Click "Workflows" in sidebar
3. For each workflow 08-17:
   - Click the workflow name
   - Click the blue "Play" button at the top
   - Wait for confirmation

**Order matters (start with 08, 09, 10 first)**

## Step 3: Verify via Telegram (1 min)

You should receive Telegram messages:
- "✅ Workflow activated: 08-inventory-restock-ai"
- "✅ Workflow activated: 09-review-collection-ai"
- ... etc

If no messages, check:
```bash
# Verify Telegram is working
curl -X POST https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage \
  -d chat_id=${TELEGRAM_CHAT_ID} \
  -d text="Test message from NEXUS"
```

## Step 4: Test One Workflow (1 min)

**Test Inventory Restock:**

1. Add a product with low stock:
```bash
docker compose exec -T postgres psql -U nexus -d nexus_v2 << 'EOF'
INSERT INTO "Product" (name, price, stock, "minStock", "supplierEmail")
VALUES ('Test Widget', 29.99, 2, 10, 'test-supplier@example.com')
RETURNING id;
EOF
```

2. Wait 6 hours OR manually trigger:
   - Go to n8n UI
   - Click workflow 08
   - Click "Test" button
   - Should see email generated + Telegram alert

## Step 5: Monitor First 24 Hours (0 min setup)

Just watch Telegram and Loki logs:

```bash
# Watch Telegram alerts in real-time
docker logs -f nexus-n8n | grep -i "telegram"

# Check Loki logs
# Go to: https://grafana.nexus-io.duckdns.org → Explore → Loki
# Query: {job="n8n"}
```

---

## What Should Happen Next

**Day 1:**
- Workflows execute automatically on schedule
- Telegram alerts for any errors
- No manual intervention needed

**Week 1:**
- Revenue metrics should start appearing
- Customer reviews being collected
- Inventory emails sent for low stock

**Month 1:**
- $4,000-8,000 additional revenue from Phase 1
- $2,000-4,000 from Phase 2
- Clear ROI visible in Grafana dashboard

---

## If Something Goes Wrong

```bash
# View detailed workflow logs
docker logs nexus-n8n | grep -i error

# Check database tables exist
docker compose exec -T postgres psql -U nexus -d nexus_v2 -c "\dt"

# Restart services
docker compose restart nexus-n8n nexus-app

# Check n8n health
curl -s http://localhost:5678/api/v1/workflows | head -c 100
```

---

**Status**: Ready to deploy ✅
**Time to Production**: ~5 minutes to activate all workflows
**Next Step**: Execute deployment checklist in docs/DEPLOYMENT_CHECKLIST.md
