# 🚀 NEXUS V2 Workflows - Activation & Credential Setup Guide

**Status**: 🟢 Workflows visible in n8n dashboard, but credentials need to be configured

**Date**: March 2, 2026
**Next**: Complete credential setup through n8n Web UI

---

## 📊 Current Status

### ✅ What's Working
- **18 Workflows imported** into n8n database
- **All workflows visible** in dashboard at `http://nexus-n8n.local/home/workflows`
- **18 workflows linked** to project (shared_workflow entries confirmed)
- **Gemini API** configured in environment (GEMINI_API_KEY set)
- **Database connectivity** verified
- **Workflows ready for activation** once credentials are added

### ❌ What Needs Fixing
- **Credentials incomplete**: Placeholder credentials created but need real encrypted data
- **Email sending**: Resend SMTP credential needs actual configuration
- **Telegram notifications**: Bot token needs to be verified
- **Database access**: PostgreSQL credential needs proper configuration

---

## 🔐 Credentials Status

| Credential | Status | Action |
|-----------|--------|--------|
| **NEXUS Postgres** | ⚠️ Placeholder | Add via n8n Web UI |
| **Resend SMTP** | ⚠️ Placeholder | Add via n8n Web UI |
| **NEXUS Telegram** | ⚠️ Placeholder | Add via n8n Web UI |
| **Gemini API** | ✅ Configured | Via environment variable |

---

## 🎯 Step-by-Step: Add Credentials via n8n Web UI

### Step 1: Access n8n
1. Open: **http://nexus-n8n.local/**
2. You should see the login page
3. Login with owner credentials:
   - **Email**: `caspertech92@gmail.com`
   - **Password**: (use your n8n owner password)

### Step 2: Navigate to Credentials
1. Click **Settings** ⚙️ (bottom left)
2. Select **Credentials**
3. You should see the placeholder credentials we created

### Step 3: Update NEXUS Postgres Credential
1. Find **NEXUS Postgres** in the list
2. Click **Edit** (pencil icon)
3. Fill in the database details:
   - **Host**: `nexus_postgres` (or `localhost` if n8n is on local network)
   - **Port**: `5432`
   - **Database**: `nexus_v2`
   - **User**: `nexus`
   - **Password**: Check `.env` file for `DB_PASSWORD`
   - **SSL**: OFF (disabled for internal network)
4. Click **Save Credential**

### Step 4: Update Resend SMTP Credential
1. Find **Resend SMTP** in the list
2. Click **Edit**
3. Fill in the email details:
   - **Host**: `smtp.resend.com`
   - **Port**: `465`
   - **Secure**: ON (TLS/SSL)
   - **User**: `resend`
   - **Password**: `re_C51jKwtZ_DeLcpK5JcX6mEp7YmD4ecDk6`
   - **From Email**: `onboarding@resend.dev`
4. Click **Save Credential**

### Step 5: Update NEXUS Telegram Credential
1. Find **NEXUS Telegram** in the list
2. Click **Edit**
3. Fill in the bot details:
   - **Bot Token**: `8682512263:AAGMrqWbsy5egthWb9pT5d0AYc7CEjdRvAM`
4. Click **Save Credential**

### Step 6: Verify Credentials in Workflows
1. Open **Workflow #17** (🤖 Full Site Audit Bot)
2. Click on the **"Send Report"** node (Email node)
3. You should see a dropdown for **SMTP Credential**
4. Select **Resend SMTP** from the dropdown
5. The node should now have a green checkmark (no errors)
6. **Save** the workflow
7. Repeat for all workflows that use Email or Telegram nodes

---

## 🧪 Testing Critical Workflows

### Test #1: Site Audit Bot (Workflow #17)
1. Open: **http://nexus-n8n.local/home/workflows**
2. Find: **🤖 NEXUS - Full Site Audit Bot**
3. Click **Open**
4. Click **Execute Workflow** (Play button)
5. Monitor execution:
   - ✅ Cron trigger fires
   - ✅ Audit nodes complete
   - ✅ Gemini API generates report
   - ✅ Email sends successfully
   - ✅ Telegram notification sent
6. Expected result: Workflow completes in ~10-15 seconds

### Test #2: Churn Predictor (Workflow #16)
1. Open: **📉 NEXUS - Churn Predictor + Retention**
2. Click **Execute Workflow**
3. Verify:
   - ✅ Database query returns active users
   - ✅ Gemini API analyzes churn risk
   - ✅ Email sent to high-risk customers
   - ✅ Log entry created in database
4. Expected result: Completes in ~15-20 seconds

---

## ⚙️ Environment Variables (Already Configured)

These are set in `.env` and `docker-compose.yml`:

```bash
# Telegram
TELEGRAM_BOT_TOKEN=8682512263:AAGMrqWbsy5egthWb9pT5d0AYc7CEjdRvAM
TELEGRAM_CHAT_ID=6899339578

# Gemini API
GEMINI_API_KEY=AIzaSyBaN99ql044GQTSmHcSHFv4H_OsdtCbaMw

# Resend Email
RESEND_KEY=re_C51jKwtZ_DeLcpK5JcX6mEp7YmD4ecDk6

# Admin Email
ADMIN_EMAIL=caspertech92@gmail.com,admin@nexus-io
```

---

## 🚀 Activation Steps (After Credentials Configured)

### For Each Workflow:
1. Open the workflow
2. **Verify all nodes have green checkmarks** (no errors)
3. Click the **▶️ Play button** (Activate workflow)
4. Confirm **Active** status shows in the list
5. Workflow will now execute on its schedule

### Workflow Schedules:
- **#00** (Error Notifier): Real-time (webhook)
- **#01** (Stripe Fulfillment): Every order placement
- **#02** (Abandoned Orders): Daily 2 AM UTC
- **#03** (Daily Sales): Daily 6 AM UTC
- **#04** (Security): Daily 1 AM UTC
- **#05-18**: Various schedules (see workflow details)

---

## 🔍 Troubleshooting

### Issue: "Found credential with no ID"
**Cause**: Workflow nodes reference credentials that aren't properly configured
**Solution**:
1. Go to Settings → Credentials
2. Click on each credential to edit
3. Ensure all fields are filled
4. Save credential
5. Update workflow nodes to select the credential from dropdown
6. Save workflow

### Issue: Email not sending
**Cause**: Resend SMTP credential not configured
**Solution**:
1. Verify RESEND_KEY in `.env` is correct
2. Update SMTP credential with correct API key
3. Test by executing a workflow with Email node
4. Check n8n logs: `docker logs n8n | grep -i "email\|resend"`

### Issue: Telegram not notifying
**Cause**: Bot token or Chat ID incorrect
**Solution**:
1. Verify TELEGRAM_BOT_TOKEN in `.env`
2. Verify TELEGRAM_CHAT_ID in `.env`
3. Test with simple workflow: Telegram node → Send test message
4. Check n8n logs: `docker logs n8n | grep -i "telegram"`

### Issue: Workflow executes but Gemini API fails
**Cause**: GEMINI_API_KEY not set or API rate limited
**Solution**:
1. Check `.env` has GEMINI_API_KEY set
2. Verify key is valid: `echo $GEMINI_API_KEY`
3. Check n8n logs for API errors: `docker logs n8n | grep -i "gemini\|401\|429"`
4. If rate limited, wait 60 seconds before retrying

### Issue: "Cannot read properties of undefined"
**Cause**: Gemini API response format unexpected
**Solution**:
1. This is handled by safe navigation operators: `$response?.body?.candidates?.[0]?.content?.parts?.[0]?.text`
2. Check n8n execution logs for actual API response
3. If response format changed, update the parsing logic

---

## 📋 Verified Configuration

### Docker Network
- **Network**: `nexus-v2_internal`
- **n8n service**: `n8n` (port 5678)
- **PostgreSQL service**: `nexus_postgres` (port 5432)
- **Redis service**: `nexus_redis` (port 6379)

### Database
- **n8n Database**: `n8n` (PostgreSQL)
- **App Database**: `nexus_v2` (PostgreSQL)
- **HR Database**: `nexus_hr` (PostgreSQL)

### n8n API Key
- **Status**: ✅ Active
- **Expires**: June 2026
- **Scope**: Full public API access

---

## 📞 Quick Command Reference

**Check n8n health:**
```bash
docker logs n8n | tail -20 | grep -iE "ready|error|workflow"
```

**Verify database connectivity:**
```bash
docker exec nexus_postgres psql -U nexus -d nexus_v2 -c "SELECT COUNT(*) FROM \"User\";"
```

**View all workflows:**
```bash
docker exec nexus_postgres psql -U nexus -d n8n -c "SELECT id, name, active FROM workflow_entity LIMIT 18;"
```

**View active workflows:**
```bash
docker exec nexus_postgres psql -U nexus -d n8n -c "SELECT COUNT(*) FROM workflow_entity WHERE active = true;"
```

**Check credentials:**
```bash
docker exec nexus_postgres psql -U nexus -d n8n -c "SELECT id, name, type FROM credentials_entity;"
```

---

## 🎊 Expected Results After Setup

### Immediate (within 1 hour):
- ✅ All 18 workflows visible in dashboard
- ✅ All credential warnings cleared
- ✅ First workflow executions successful
- ✅ Email and Telegram notifications received

### Short-term (24 hours):
- ✅ All scheduled workflows executing autonomously
- ✅ Business intelligence data being generated
- ✅ Customer communications flowing
- ✅ No errors in n8n logs

### Medium-term (1 week):
- ✅ Complete automation operational
- ✅ Revenue impact visible
- ✅ Retention campaigns active
- ✅ Real-time alerts functioning

---

## 📍 Next Action

1. **Open n8n Web UI**: http://nexus-n8n.local/
2. **Login** with owner account
3. **Add credentials** using the steps above
4. **Test workflows** starting with #17 and #16
5. **Activate all workflows** when tests pass
6. **Monitor logs** for the first 24 hours

---

**Status**: 🟢 Ready for credential configuration
**Prepared by**: Claude Code Assistant
**Last updated**: March 2, 2026
