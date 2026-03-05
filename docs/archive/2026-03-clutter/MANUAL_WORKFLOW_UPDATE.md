# 🔄 Manual Workflow Update Guide (UI-Based)

## 📋 Quick Summary

You need to:
1. **Delete** 11 old workflows in n8n
2. **Re-import** 11 updated workflow JSON files

This will fix the Groq/Gemini API issues and Telegram problems.

---

## 🗑️ **Step 1: Delete Old Workflows in n8n UI**

Go to your n8n dashboard: https://n8n.nexus-io.duckdns.org

### Workflows to Delete

Find and delete these workflows (right-click → Delete):

| # | Workflow Name | Status |
|---|---|---|
| 01 | 🚀 NEXUS - Stripe Order Fulfillment | Delete |
| 02 | 📦 NEXUS - Abandoned Order Recovery | Delete |
| 05 | 💬 NEXUS - AI Support Router | Delete |
| 06 | 📈 NEXUS - AI Product Upsell | Delete |
| 08 | 📊 NEXUS - Inventory Restock AI | Delete |
| 09 | ⭐ NEXUS - Review Collection AI | Delete |
| 10 | ⚡ NEXUS - Performance Monitor | Delete |
| 13 | 🔍 NEXUS - SEO Optimizer | Delete |
| 15 | 📱 NEXUS - Social Media Poster | Delete |
| 16 | 📉 NEXUS - Churn Predictor + Retention | Delete |
| 17 | 🤖 NEXUS - Full Site Audit Bot | Delete ⚠️ CRITICAL |

**Steps:**
1. Click on each workflow
2. Click the menu icon (three dots) in top-right
3. Select "Delete"
4. Confirm deletion

---

## 📥 **Step 2: Re-Import Updated Workflows**

### Method A: Manual Import (Easiest)

1. Go to **Workflows** → Click **Import** button
2. For each of these 11 workflows (in order):

```
/home/redbend/Desktop/Local-Projects/NEXUS-V2/n8n-workflows/
├── 01-stripe-order-fulfillment.json
├── 02-abandoned-order-recovery.json
├── 05-ai-support-router.json
├── 06-ai-product-upsell.json
├── 08-inventory-restock-ai.json
├── 09-review-collection-ai.json
├── 10-performance-monitor.json
├── 13-seo-optimizer.json
├── 15-social-media-poster.json
├── 16-churn-predictor.json
└── 17-site-audit-bot.json
```

3. Click Import for each file
4. Wait for "Successfully imported" message

### Method B: Automated Import (API)

```bash
# 1. Get your n8n API key from n8n UI:
#    Settings → API Keys → Create API Key

export N8N_API_KEY="your_api_key_here"
export N8N_URL="https://n8n.nexus-io.duckdns.org"

# 2. Run this in the NEXUS-V2 directory:
cd /home/redbend/Desktop/Local-Projects/NEXUS-V2

bash delete-and-reimport-workflows.sh
```

---

## ✅ **Step 3: Verify the Update**

After importing, check that:

### For Workflow #17 (Site Audit Bot) - CRITICAL ⚠️

1. Open the workflow
2. Look at the node that was called "Groq: Generate Report"
3. It should now be called **"Gemini: Generate Report"**
4. Click on it to verify:
   - ✅ URL contains: `generativelanguage.googleapis.com`
   - ✅ NOT: `api.groq.com` or `api.gemini.google.com`

### For All Workflows

1. Check the API request node names (should say "Gemini" not "Groq")
2. Verify Telegram credentials are set up
3. Check environment variable: `GEMINI_API_KEY` is defined in n8n

---

## 🧪 **Step 4: Test Each Workflow**

### Critical Tests

**Workflow #17 - Site Audit Bot** ⚠️
```
1. Open the workflow
2. Click "Execute Workflow" button
3. Watch the logs
4. VERIFY:
   ✅ No 404 error
   ✅ No "Groq" references
   ✅ Gemini API returns 200 status
   ✅ Email sends to ADMIN_EMAIL
   ✅ Telegram notification sends (if Telegram is enabled)
```

**Workflow #16 - Churn Predictor**
```
1. Open the workflow
2. Click "Execute Workflow" button
3. Watch the logs
4. VERIFY:
   ✅ "Gemini: Predict Churn" node shows 200 status
   ✅ Retention email format is correct
```

### Quick Tests for Others

For workflows 01, 02, 05, 06, 08, 09, 10, 13, 15:
- Click "Execute Workflow"
- Check logs for any errors
- Verify no "Groq" or "404" errors appear

---

## 🔧 **Troubleshooting**

### Problem: "Cannot import workflow"
**Solution:**
- Check that old workflow is deleted
- Try importing again
- Check browser console for errors

### Problem: "Gemini: Generate Report shows error 404"
**Solution:**
- Verify workflow was re-imported (not just edited)
- Delete and re-import the workflow file
- Ensure GEMINI_API_KEY is set in n8n Environment Variables

### Problem: "Telegram node not sending"
**Solution:**
- Go to workflow
- Find "Notify Completion" node (Telegram node)
- Check credentials are set: "NEXUS Telegram"
- Verify TELEGRAM_CHAT_ID is correct

### Problem: "Email not sending"
**Solution:**
- Check "Send Report" node credentials
- Verify "Resend SMTP" credentials are configured
- Check ADMIN_EMAIL environment variable is set

---

## 📝 **Workflow Status Checklist**

After completing all steps, mark these as complete:

- [ ] Workflow #01 imported and tested
- [ ] Workflow #02 imported and tested
- [ ] Workflow #05 imported and tested
- [ ] Workflow #06 imported and tested
- [ ] Workflow #08 imported and tested
- [ ] Workflow #09 imported and tested
- [ ] Workflow #10 imported and tested
- [ ] Workflow #13 imported and tested
- [ ] Workflow #15 imported and tested
- [ ] Workflow #16 imported and tested - ⚠️ CRITICAL
- [ ] Workflow #17 imported and tested - ⚠️ CRITICAL
- [ ] All Telegram notifications work
- [ ] All API errors are 404 (from old cache)

---

## 📞 **Support**

If you encounter issues:

1. **Check the logs** in the workflow execution view
2. **Verify credentials** are configured in n8n
3. **Check environment variables** are set
4. Reference: `DEPLOYMENT_STEPS.md`

**Files location:**
```
/home/redbend/Desktop/Local-Projects/NEXUS-V2/
├── n8n-workflows/           (Updated workflow files)
├── GEMINI_API_UPDATE_SUMMARY.md
├── DEPLOYMENT_STEPS.md
└── delete-and-reimport-workflows.sh
```

---

## ✨ Done!

Once all workflows are imported and tested, your n8n automation should work perfectly with Gemini API! 🚀

