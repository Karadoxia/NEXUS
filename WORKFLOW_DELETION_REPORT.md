# 📋 n8n Workflow Deletion & Re-import Report

**Date**: March 2, 2026  
**Status**: Ready for Manual Deletion & Re-import  
**Reason**: Update all 11 AI workflows from Groq API to Gemini API

---

## 🎯 Objective

Delete all 11 old n8n workflows and re-import updated versions that use Gemini API instead of Groq.

---

## 📊 Workflows to Delete (11 total)

| # | Workflow Name | Current Issue | New Version |
|---|---|---|---|
| 01 | 🚀 NEXUS - Stripe Order Fulfillment | Groq cached in DB | ✓ Updated to Gemini |
| 02 | 📦 NEXUS - Abandoned Order Recovery | Groq cached in DB | ✓ Updated to Gemini |
| 05 | 💬 NEXUS - AI Support Router | Groq cached in DB | ✓ Updated to Gemini |
| 06 | 📈 NEXUS - AI Product Upsell | Groq cached in DB | ✓ Updated to Gemini |
| 08 | 📊 NEXUS - Inventory Restock AI | Groq cached in DB | ✓ Updated to Gemini |
| 09 | ⭐ NEXUS - Review Collection AI | Groq cached in DB | ✓ Updated to Gemini |
| 10 | ⚡ NEXUS - Performance Monitor | Groq cached in DB | ✓ Updated to Gemini |
| 13 | 🔍 NEXUS - SEO Optimizer | Groq cached in DB | ✓ Updated to Gemini |
| 15 | 📱 NEXUS - Social Media Poster | Groq cached in DB | ✓ Updated to Gemini |
| 16 | 📉 NEXUS - Churn Predictor + Retention | Wrong API endpoint + Groq cached | ✓ Fixed endpoint + Gemini |
| 17 | 🤖 NEXUS - Full Site Audit Bot | **404 error + Groq cached** | ✓ Fixed + Gemini |

---

## ✅ Manual Deletion Steps (in n8n UI)

Access n8n at: **http://localhost:5678**

### For each workflow above:

1. **Find the workflow** in the Workflows list
2. **Right-click** on it
3. **Select "Delete"**
4. **Confirm** deletion

Takes approximately 2-3 minutes total for all 11 workflows.

---

## ✅ Re-import Steps (in n8n UI)

### Import the updated workflows:

1. Go to **Workflows** → **Import**
2. For each file below, select and import:

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

Takes approximately 2-3 minutes total for all 11 workflows.

---

## 🔍 Verification Checklist

After re-importing, verify each workflow:

### Workflow #17 (Site Audit Bot) - CRITICAL ⚠️
- [ ] Node name: "Gemini: Generate Report" (NOT "Groq")
- [ ] URL contains: `generativelanguage.googleapis.com`
- [ ] URL does NOT contain: `api.groq.com`
- [ ] Execute workflow and check logs for 200 OK status
- [ ] Email sends successfully

### Workflow #16 (Churn Predictor) - CRITICAL ⚠️
- [ ] Node name: "Gemini: Predict Churn"
- [ ] URL uses correct Gemini endpoint
- [ ] Execute workflow and verify churn scores are generated

### All Other Workflows
- [ ] Node names contain "Gemini" (not "Groq")
- [ ] No 404 errors in logs
- [ ] API returns 200 status
- [ ] Notifications (email/Telegram) send properly

---

## 🔄 What Changed in Updated Workflows

### API Endpoints
```
OLD:  https://api.groq.com/openai/v1/chat/completions
NEW:  https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-{flash|pro}:generateContent?key={{ $env.GEMINI_API_KEY }}
```

### Node Names
```
OLD:  "Groq: Generate Report" / "Groq: Predict Churn" / etc.
NEW:  "Gemini: Generate Report" / "Gemini: Predict Churn" / etc.
```

### Response Parsing
```
OLD:  $response.body.candidates[0].content.parts[0].text (unsafe)
NEW:  $response?.body?.candidates?.[0]?.content?.parts?.[0]?.text || fallback (safe)
```

### Models Used
- **gemini-1.5-flash**: 11 workflows (fast, cost-effective)
- **gemini-1.5-pro**: 2 workflows (#03 sales report, #16 churn predictor)

---

## 📁 Updated Files Location

All updated workflow JSON files are in:
```
/home/redbend/Desktop/Local-Projects/NEXUS-V2/n8n-workflows/
```

Backups are in:
```
/home/redbend/Desktop/Local-Projects/NEXUS-V2/n8n-workflows-backup/
```

---

## ⏱️ Time Estimate

- **Delete 11 workflows**: 2-3 minutes
- **Re-import 11 workflows**: 2-3 minutes
- **Verify & test**: 5 minutes
- **Total**: ~10 minutes

---

## 🚀 Next Steps

1. **Open n8n**: http://localhost:5678
2. **Delete** all 11 workflows listed above
3. **Re-import** the 11 updated JSON files from `n8n-workflows/`
4. **Verify** that nodes show "Gemini" instead of "Groq"
5. **Test** critical workflows (#16 and #17) by executing them
6. **Confirm** emails and Telegram notifications work

---

## 📚 Reference Documents

- **QUICK_START.txt** - Quick overview
- **FIX_SUMMARY.md** - Complete fix details
- **MANUAL_WORKFLOW_UPDATE.md** - Step-by-step UI guide
- **GEMINI_API_UPDATE_SUMMARY.md** - Technical details
- **delete-and-reimport-workflows.sh** - Automated script (when n8n API is ready)

---

## ✨ Success Criteria

After completing deletion and re-import:

✅ All 11 workflows imported successfully  
✅ No "Groq" references in any workflow  
✅ All nodes use Gemini API endpoints  
✅ Workflow #17 (Site Audit Bot) executes without 404 error  
✅ Workflow #16 (Churn Predictor) executes successfully  
✅ Email notifications send  
✅ Telegram notifications send (if configured)

---

## 🔗 Documentation

See `MANUAL_WORKFLOW_UPDATE.md` for detailed step-by-step UI instructions.

See `delete-and-reimport-workflows.sh` for automated deletion/import script.

---

**Ready to proceed with deletion and re-import!** 🚀

