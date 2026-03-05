# 🚀 NEXUS-V2 Deployment Checklist

**Date**: March 2, 2026
**Status**: Ready for Deployment ✅
**Commit**: `1ce861e`

---

## Pre-Deployment Verification

- [x] All Gemini nodes fixed (12/12)
- [x] All credentials configured (3/3)
- [x] MCP server implementation complete
- [x] Docker Compose updated
- [x] All changes committed to Git
- [x] Documentation created (8 files)

---

## Phase 1: Start Services (5 minutes)

### 1.1 Start MCP Server
```bash
cd /home/redbend/Desktop/Local-Projects/NEXUS-V2
docker-compose up -d n8n-mcp
```

### 1.2 Verify MCP Health
```bash
curl http://localhost:3000/mcp/health | jq
```

Expected response:
```json
{
  "success": true,
  "status": "healthy",
  "version": "1.0.0",
  "n8nConnected": true
}
```

### 1.3 List Available Workflows
```bash
curl http://localhost:3000/mcp/workflows | jq '.data[] | {id, name, active}'
```

---

## Phase 2: Import Workflows (10 minutes)

### 2.1 Access n8n Dashboard
- URL: `http://nexus-n8n.local/` or `http://localhost:5678/`
- Login with your n8n credentials

### 2.2 Import Workflow Files
1. Click "Import workflow" button
2. Select files from `/home/redbend/Desktop/Local-Projects/NEXUS-V2/n8n-workflows/`
3. Import all 18 JSON files:
   - 00-global-error-notifier.json
   - 01-stripe-order-fulfillment.json
   - 02-abandoned-order-recovery.json
   - 03-daily-sales-report.json
   - 04-security-incident-aggregator.json
   - 05-ai-support-router.json
   - 06-ai-product-upsell.json
   - 07-container-auto-registration-FIXED.json
   - 08-inventory-restock-ai.json
   - 09-review-collection-ai.json
   - 10-performance-monitor.json
   - 11-newsletter-generator.json
   - 13-seo-optimizer.json
   - 15-social-media-poster.json
   - 16-churn-predictor.json
   - 17-site-audit-bot.json

---

## Phase 3: Verify Credentials (5 minutes)

### 3.1 Check Credentials in n8n
1. Go to Settings → Credentials
2. Verify these exist with status ✅:
   - **NEXUS Postgres** (postgres-nexus-1)
     - Type: PostgreSQL
     - Database: nexus_v2
     - Status: ✅ Ready

   - **Resend SMTP** (email-resend-1)
     - Type: SMTP
     - Host: smtp.resend.com
     - Status: ✅ Ready

   - **NEXUS Telegram** (telegram-nexus-1)
     - Type: Telegram
     - Bot Token: Configured
     - Status: ✅ Ready

### 3.2 Test Credentials
```bash
# Test PostgreSQL connection
docker exec nexus_postgres psql -U nexus -d nexus_v2 -c "SELECT version();"

# Test Telegram
curl -X GET "https://api.telegram.org/bot8682512263:AAGMrqWbsy5egthWb9pT5d0AYc7CEjdRvAM/getMe"

# Test Resend Email
curl -X POST "https://api.resend.com/emails" \
  -H "Authorization: Bearer re_C51jKwtZ_DeLcpK5JcX6mEp7YmD4ecDk6" \
  -d '{"from":"test@resend.dev","to":"test@example.com","subject":"Test","html":"Test"}'
```

---

## Phase 4: Test Key Workflows (15 minutes)

### 4.1 Test Stripe Order Fulfillment (Workflow #1)
```bash
# Simulate Stripe webhook
curl -X POST http://localhost:5678/webhook/stripe \
  -H "Content-Type: application/json" \
  -d '{
    "body": {
      "type": "checkout.session.completed",
      "data": {
        "object": {
          "client_reference_id": "TEST-001",
          "amount_total": 9999,
          "customer_details": {
            "name": "Test Customer",
            "email": "test@example.com"
          }
        }
      }
    }
  }'
```

Expected result:
- ✅ Order status updated to "paid"
- ✅ Confirmation email sent
- ✅ Fraud check executed
- ✅ Gemini personalization applied
- ✅ Admin Telegram notification sent

### 4.2 Test Churn Predictor (Workflow #16)
```bash
curl -X POST http://localhost:3000/mcp/execute/16-churn-predictor \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "analysisDate": "2026-03-02",
      "includeRecommendations": true
    }
  }'
```

Expected result:
- ✅ Gemini analysis completes
- ✅ Churn predictions generated
- ✅ Recommendations sent via email
- ✅ Results logged to Loki

### 4.3 Test Site Audit Bot (Workflow #17)
```bash
curl -X POST http://localhost:3000/mcp/execute/17-site-audit-bot \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "auditType": "full",
      "includeDatabase": true,
      "includeSecurity": true
    }
  }'
```

Expected result:
- ✅ System audit completes
- ✅ Gemini generates detailed report
- ✅ Report sent via email
- ✅ Admin notified via Telegram

---

## Phase 5: Activate Workflows (10 minutes)

### 5.1 Activate Test Workflows First
1. Open Workflow #16 (Churn Predictor)
2. Click the "Activate" button (play icon)
3. Open Workflow #17 (Site Audit Bot)
4. Click the "Activate" button (play icon)

### 5.2 Monitor for 1 Hour
```bash
# Watch MCP server logs
docker logs -f n8n-mcp

# Watch n8n logs
docker logs -f n8n

# Watch workflow execution
# (In n8n UI: Executions tab)
```

### 5.3 Activate Remaining Workflows
Once test workflows run successfully:
1. Activate remaining 16 workflows
2. Set execution schedules as needed
3. Configure webhook URLs

---

## Phase 6: Production Monitoring (Ongoing)

### 6.1 Health Checks
```bash
# MCP Server health
curl http://localhost:3000/mcp/health

# n8n health
curl http://localhost:5678/api/v1/health

# Database health
docker exec nexus_postgres pg_isready
```

### 6.2 Monitor Execution
- Open n8n dashboard
- Go to "Executions" tab
- Monitor workflow runs
- Check for errors in logs

### 6.3 View Logs
```bash
# MCP server logs
docker logs -f n8n-mcp

# n8n logs
docker logs -f n8n

# Database logs
docker logs -f nexus_postgres

# Application logs
docker logs -f nexus-app
```

### 6.4 Performance Metrics
- Access Grafana: `http://localhost:3000/`
- Dashboard: n8n Workflows
- Metrics: Execution time, success rate, error rate

---

## Troubleshooting

### Issue: MCP Server Not Responding
```bash
# 1. Check if container is running
docker ps | grep n8n-mcp

# 2. Check logs
docker logs n8n-mcp

# 3. Verify n8n is accessible
curl http://n8n:5678/api/v1/workflows

# 4. Restart MCP server
docker-compose restart n8n-mcp
```

### Issue: Credentials Not Found
```bash
# Check credentials in database
docker exec nexus_postgres psql -U nexus -d n8n -c \
  "SELECT id, name, type FROM credentials_entity;"

# Expected output:
# postgres-nexus-1    | NEXUS Postgres | postgres
# email-resend-1      | Resend SMTP    | smtp
# telegram-nexus-1    | NEXUS Telegram | telegram
```

### Issue: Workflow Execution Failed
1. Open workflow in n8n
2. Click "Executions" tab
3. Find failed execution
4. Click to see error details
5. Fix the issue
6. Re-execute workflow

---

## Success Criteria

✅ All workflows imported to n8n
✅ All credentials verified and working
✅ MCP server responding to health checks
✅ Test workflows executing successfully
✅ Email notifications being sent
✅ Telegram notifications being sent
✅ Database updates occurring
✅ Logs being written to Loki
✅ No errors in logs for 1 hour
✅ Performance metrics showing normal values

---

## Documentation References

1. **MCP_SERVER_GUIDE.md** - Complete MCP setup and usage
2. **WORK_COMPLETED_SUMMARY.md** - Session overview and technical details
3. **ALL_GEMINI_NODES_FIXED_FINAL.md** - Detailed Gemini API changes
4. **FINAL_STATUS_REPORT.md** - Deployment checklist and next steps

---

## Quick Command Reference

```bash
# Start services
docker-compose up -d

# Start MCP server only
docker-compose up -d n8n-mcp

# Verify MCP health
curl http://localhost:3000/mcp/health | jq

# List workflows
curl http://localhost:3000/mcp/workflows | jq

# Execute workflow
curl -X POST http://localhost:3000/mcp/execute/{workflowId} \
  -H "Content-Type: application/json" \
  -d '{"data": {...}}'

# View logs
docker logs -f n8n-mcp

# Check credentials
docker exec nexus_postgres psql -U nexus -d n8n \
  -c "SELECT id, name, type FROM credentials_entity;"
```

---

## Support Resources

- **n8n Documentation**: https://docs.n8n.io/
- **Gemini API Docs**: https://ai.google.dev/
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Telegram Bot API**: https://core.telegram.org/bots/api
- **Resend Email API**: https://resend.com/docs

---

**Status**: 🟢 Ready for Deployment
**Commit**: 1ce861e
**Date**: March 2, 2026

🎉 **All systems are ready. Begin deployment!**
