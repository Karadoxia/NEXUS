# 🚀 NEXUS WORKFLOWS - MANUAL IMPORT TO n8n DASHBOARD

## STATUS: 18 Workflow Files Ready ✅

All 18 workflow JSON files are in the `n8n-workflows/` directory and ready for import.

## FILES READY:
```
✅ 00-global-error-notifier.json
✅ 01-stripe-order-fulfillment.json
✅ 02-abandoned-order-recovery.json
✅ 03-daily-sales-report.json
✅ 04-security-incident-aggregator.json
✅ 05-ai-support-router.json
✅ 06-ai-product-upsell.json
✅ 07-container-auto-registration-FIXED.json
✅ 08-inventory-restock-ai.json
✅ 09-review-collection-ai.json
✅ 10-performance-monitor.json
✅ 11-newsletter-generator.json
✅ 12-automated-backup.json
✅ 13-seo-optimizer.json
✅ 14-fraud-detector.json
✅ 15-social-media-poster.json
✅ 16-churn-predictor.json
✅ 17-site-audit-bot.json
```

## IMPORT OPTIONS

### Option 1: Import via n8n Web UI (RECOMMENDED - 5 minutes)

1. **Open n8n Dashboard**
   ```
   http://localhost:5678
   ```

2. **For each workflow file:**
   - Click "+" (New) → "Import from file"
   - Select workflow JSON from `n8n-workflows/` directory
   - Click "Import"
   - Workflow appears in dashboard

3. **Configure Credentials (Do Once):**
   - Go to Settings → Credentials
   - Create these credentials:
   
   **PostgreSQL nexus_v2:**
   ```
   Type: PostgreSQL
   Host: postgres
   Port: 5432
   User: nexus
   Password: (from db_password.txt)
   Database: nexus_v2
   ```
   
   **PostgreSQL nexus_hr:**
   ```
   Type: PostgreSQL
   Host: postgres
   Port: 5432
   User: nexus
   Password: (from db_password.txt)
   Database: nexus_hr
   ```
   
   **PostgreSQL nexus_ai:**
   ```
   Type: PostgreSQL
   Host: postgres-ai
   Port: 5432
   User: nexus_ai
   Password: (from db_password.txt)
   Database: nexus_ai
   ```
   
   **Telegram Bot:**
   ```
   Type: Telegram
   Bot Token: 8682512263:AAGMrqWbsy5egthWb9pT5d0AYc7CEjdRvAM
   ```
   
   **Resend Email:**
   ```
   Type: SMTP
   Host: smtp.resend.com
   Port: 465
   User: default
   Password: re_C51jKwtZ_DeLcpK5JcX6mEp7YmD4ecDk6
   Secure: true
   ```

4. **Activate Workflows:**
   - For each workflow, click toggle to "Active"
   - All 18 workflows will be LIVE

### Option 2: Docker-based Import Script (Advanced)

```bash
# Docker-compose already has n8n database set up
# Run n8n CLI import (if available in container)
docker-compose exec n8n npx n8n workflows:import <file.json>
```

### Option 3: Direct Database Import (Expert)

Already all 18 workflow files are JSON-valid and ready to be inserted into the n8n database via SQL if needed.

## CREDENTIALS SUMMARY

### Database Connections
- **Host**: postgres (container name in docker network)
- **Port**: 5432
- **User**: nexus
- **Password**: Check `db_password.txt`
- **Databases**: nexus_v2, nexus_hr, nexus_ai

### External APIs
- **Telegram Bot Token**: `8682512263:AAGMrqWbsy5egthWb9pT5d0AYc7CEjdRvAM`
- **Telegram Chat ID**: `6899339578`
- **Resend API Key**: `re_C51jKwtZ_DeLcpK5JcX6mEp7YmD4ecDk6`
- **Gemini API Key**: (set in environment variables)

## VERIFICATION

After importing all 18 workflows:

1. **Check Dashboard:**
   - Go to Workflows menu
   - Should see all 18 workflows listed
   - All should be toggled to "Active"

2. **Test One Workflow:**
   - Click on "01-stripe-order-fulfillment"
   - Click "Execute"
   - Should show execution history

3. **Check Telegram Alerts:**
   - Any workflow with Telegram node should send test message

## NEXT STEPS

1. ✅ Import all 18 workflows (Option 1 is fastest)
2. ✅ Configure all credentials
3. ✅ Activate all workflows
4. ✅ Test critical ones manually
5. ✅ Monitor execution logs

## TROUBLESHOOTING

**Workflows not importing?**
- Ensure n8n is running: `docker-compose ps | grep n8n`
- Ensure n8n dashboard is accessible: http://localhost:5678
- Check n8n logs: `docker-compose logs n8n`

**Credentials not working?**
- Verify database is running: `docker-compose ps | grep postgres`
- Test credentials in n8n UI: Click credential → "Test" button
- Check credential values match exactly

**Telegram not sending?**
- Verify bot token: should start with digits, contain ':'
- Verify chat ID: should be numeric
- Check n8n logs for Telegram errors

## EXPECTED RESULT

After completing all steps:
- ✅ 18 workflows visible in n8n dashboard
- ✅ All workflows toggled to "Active"  
- ✅ All credentials configured
- ✅ Test message received on Telegram
- ✅ Ready for production use

---

**Status**: 🟢 READY FOR IMPORT
**Workflows**: 18/18 files available
**Documentation**: Complete
**Time to complete**: ~10 minutes

