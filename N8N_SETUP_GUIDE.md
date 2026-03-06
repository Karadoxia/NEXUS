# n8n Setup Guide - Complete Credentials & User Setup

## Status

✅ **All 18 workflows successfully imported into n8n database**
✅ **All workflows using Gemini API (not Groq)**
⏳ **PENDING: Credentials & User Account Setup**

---

## Step 1: Create n8n Owner Account

1. Go to: **https://n8n.nexus-io.duckdns.org**
2. You'll see the n8n owner setup wizard
3. Create your admin account:
   - **Email**: `caspertech92@gmail.com`
   - **Password**: Use a strong password
   - **First Name**: Any name (e.g., "Admin")
   - **Last Name**: Your last name

4. Click **"Set up n8n"** to complete

---

## Step 2: Create Credentials - Telegram

**Telegram Bot Token Required:**

To get your bot token:
1. Go to Telegram and message **@BotFather**
2. Send `/newbot` command
3. Follow the prompts to create a bot
4. Copy the **Bot Token** (looks like: `123456789:ABCDEFGhijklmnoPqrstUVWxyz...`)

**In n8n:**
1. Click the **Settings** icon (⚙️) → **Credentials**
2. Click **Create** → **New Credentials**
3. Choose: **Telegram Bot API**
4. Enter:
   - **Bot Token**: `YOUR_BOT_TOKEN_HERE`
   - **Chat ID**: `6899339578` (your admin Telegram chat ID)
5. Name it: **NEXUS Telegram**
6. Click **Create**

---

## Step 3: Create Credentials - Resend SMTP

**Resend API Key:**
```
re_V9cz4Yo9_FckLit2sDveNe1Ot1FGEJGhzJJt4aJ
```

**In n8n:**
1. Click **Settings** ⚙️ → **Credentials**
2. Click **Create** → **New Credentials**
3. Choose: **Resend SMTP**
4. Enter:
   - **API Key**: `re_V9cz4Yo9_FckLit2sDveNe1Ot1FGEJGhzJJt4aJ`
5. Name it: **Resend SMTP**
6. Click **Create**

---

## Step 4: Verify Credentials Are Linked to Workflows

1. Click **Workflows** in the left sidebar
2. Open any workflow (e.g., **17-site-audit-bot**)
3. Find nodes that use credentials:
   - Look for email nodes: Should show **"Resend SMTP"** ✅
   - Look for Telegram nodes: Should show **"NEXUS Telegram"** ✅
4. If red warnings appear, click the node and select the correct credential from the dropdown

---

## Step 5: Test Workflow #17 (Site Audit Bot)

1. Go to **Workflows** → **"🤖 NEXUS - Full Site Audit Bot"**
2. Click **Test Workflow** or **Execute Workflow**
3. Check for success - you should see:
   - ✅ All nodes execute (check status circles)
   - ✅ Gemini API call succeeds
   - ✅ Email is sent (or would be sent)
   - ✅ Telegram notification sent (or would be sent)

---

## Step 6: Test Workflow #16 (Churn Predictor)

1. Go to **Workflows** → **"📉 NEXUS - Churn Predictor + Retention"**
2. Click **Test Workflow**
3. Verify:
   - ✅ Gemini API integration works
   - ✅ Email/Telegram notifications functional

---

## Credential Summary

| Credential | Type | Status | Location |
|---|---|---|---|
| **Resend SMTP** | Email | ✅ Ready | Settings → Credentials |
| **NEXUS Telegram** | Telegram Bot | ⏳ Pending | Settings → Credentials |
| **Gemini API** | Built-in to workflows | ✅ Ready | Environment: `GEMINI_API_KEY` |

---

## Troubleshooting

### Workflows show credential errors (red warnings)
**Solution**: The workflows haven't been linked to the credentials yet
1. Open the workflow
2. Click on any Telegram/Email node
3. Click on the **credential selector** dropdown
4. Select the matching credential name
5. Save the workflow

### Telegram messages not sending
**Check**:
- Telegram bot token is correct (from @BotFather)
- Chat ID is correct: `6899339578`
- Telegram credential name exactly matches: `NEXUS Telegram`

### Emails not sending
**Check**:
- Resend API key is correct
- Email credential name exactly matches: `Resend SMTP`
- From email is configured correctly

### Gemini API errors
**Status**: Gemini API is configured in environment variable `GEMINI_API_KEY`
- All workflows already have the correct endpoint
- No action needed unless you see 401/403 errors

---

## Quick Reference: Workflow Credential Usage

| Workflow | Credentials Used | Status |
|---|---|---|
| 01-stripe-order-fulfillment | Resend SMTP, NEXUS Telegram | Uses both |
| 02-abandoned-order-recovery | Resend SMTP, NEXUS Telegram | Uses both |
| 05-ai-support-router | Resend SMTP | Email only |
| 17-site-audit-bot | Resend SMTP, NEXUS Telegram, Gemini API | Full featured |
| 16-churn-predictor | Resend SMTP, Gemini API | AI + Email |

---

## Next Steps After Setup

1. ✅ Create owner account
2. ✅ Set up Telegram credential (need bot token)
3. ✅ Set up Resend SMTP credential (API key provided)
4. ✅ Test workflows #17 and #16
5. ✅ Verify all 18 workflows load without errors
6. 🚀 Enable auto-execution (set schedule triggers for each workflow)

---

## API Endpoints (for reference)

- **n8n Web**: https://n8n.nexus-io.duckdns.org
- **n8n API**: https://n8n.nexus-io.duckdns.org/api/v1
- **Gemini API**: Configured via environment variable (internal use)
- **Resend API**: re_V9cz4Yo9_FckLit2sDveNe1Ot1FGEJGhzJJt4aJ

---

**Last Updated**: March 2, 2026
**Workflows**: 18/18 imported ✅
**Status**: Ready for credential setup 🎯
