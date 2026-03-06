# ⚡ QUICK CREDENTIAL SETUP GUIDE

**Status**: ✅ Credentials created in n8n, ready for configuration

---

## 🎯 What to Do Right Now

### 1. Open n8n in Browser
```
http://nexus-n8n.local/
```

### 2. Go to Settings → Credentials
Click the **Settings icon ⚙️** → Select **Credentials**

You should see:
```
✅ NEXUS Postgres (Needs first setup)
✅ Resend SMTP (Needs first setup)
✅ NEXUS Telegram (Needs first setup)
✅ Google Gemini(PaLM) Api account
```

---

## 📝 Configuration Details

### Credential 1: NEXUS Postgres

**Click:** Edit (pencil icon) on "NEXUS Postgres"

**Fill in these fields:**
```
Host:              nexus_postgres
Port:              5432
Database:          nexus_v2
User:              nexus
Password:          your_strong_server_password
SSL:               OFF (toggle off)
Timeout:           (leave empty)
```

**Then:** Click **Save Credential**

---

### Credential 2: Resend SMTP

**Click:** Edit on "Resend SMTP"

**Fill in these fields:**
```
Host:              smtp.resend.com
Port:              465
User:              resend
Password:          re_C51jKwtZ_DeLcpK5JcX6mEp7YmD4ecDk6
Secure Connection: ON (toggle on - TLS/SSL)
From Email:        onboarding@resend.dev
```

**Then:** Click **Save Credential**

---

### Credential 3: NEXUS Telegram

**Click:** Edit on "NEXUS Telegram"

**Fill in these fields:**
```
Bot Token:         8682512263:AAGMrqWbsy5egthWb9pT5d0AYc7CEjdRvAM
```

**Then:** Click **Save Credential**

---

## ✅ Verification: Check Workflows Load

After saving credentials:

1. Click **Home** (back to main menu)
2. Click **Workflows**
3. You should see **18 workflows** in the left sidebar
4. **Green checkmarks** next to workflows (no red error icons)
5. Click on any workflow - it should load without "Problem loading credential" errors

---

## 🧪 Test a Workflow

### Quick Test: Workflow #17 (Site Audit Bot)

1. Click **🤖 NEXUS - Full Site Audit Bot**
2. You should see the workflow canvas with no red errors
3. Click **Execute Workflow** (play icon)
4. Watch the execution:
   - Nodes turn green as they complete
   - Should finish in ~10-15 seconds
5. Check for:
   - ✅ No error messages
   - ✅ Email sent (check logs or inbox)
   - ✅ Telegram notification sent (check Telegram)

---

## 🚀 Next Step: Activate All Workflows

Once verification passes:

1. Go to **Workflows** list
2. For each workflow, click the **▶️ Play button** to activate
3. Workflow status changes to "Active"
4. It will now execute on its schedule

---

## 🔍 Troubleshooting

### "Problem loading credential" Error

**If you see this:**
```
Problem loading credential
Credential with ID "postgres-nexus-1" could not be found
```

**Solution:**
1. Go to Settings → Credentials
2. Verify the credential exists
3. Click it to open and edit
4. Make sure all required fields are filled
5. Click **Save Credential**
6. Refresh the page (F5)

### "Credential needs first setup"

**If you see this:**
```
NEXUS Postgres - Needs first setup
```

**Solution:**
1. Click Edit on that credential
2. Fill in ALL the required fields
3. Click **Save Credential**
4. Status will change to ✅

### Email Not Sending

**Check:**
1. Resend SMTP credential has correct API key: `re_C51jKwtZ_DeLcpK5JcX6mEp7YmD4ecDk6`
2. Secure connection is **ON** (TLS/SSL)
3. Port is **465** (not 587)
4. User is **resend**

### Telegram Not Notifying

**Check:**
1. Bot token is exactly: `8682512263:AAGMrqWbsy5egthWb9pT5d0AYc7CEjdRvAM`
2. No spaces or extra characters
3. Send test message to verify bot is working

---

## 💡 Pro Tips

1. **Copy-Paste**: Copy the values from this guide to avoid typos
2. **Save After Each**: Save each credential immediately after filling
3. **Verify Order**: Complete credentials in order: Postgres → Resend → Telegram
4. **Test First**: Test workflow #17 before activating others
5. **Monitor Logs**: Watch n8n logs for any errors: `docker logs -f n8n | grep -i error`

---

## ⏱️ Estimated Time

- **NEXUS Postgres**: 2 minutes
- **Resend SMTP**: 2 minutes
- **NEXUS Telegram**: 1 minute
- **Verification**: 3 minutes
- **Activation**: 2 minutes

**Total: ~10 minutes**

---

## 📞 Support Commands

If something goes wrong:

```bash
# Check n8n is running
docker ps | grep n8n

# View recent n8n errors
docker logs n8n | grep -i error | tail -20

# Verify credentials in database
docker exec nexus_postgres psql -U nexus -d n8n -c \
  "SELECT id, name, type FROM credentials_entity;"

# Count active workflows
docker exec nexus_postgres psql -U nexus -d n8n -c \
  "SELECT COUNT(*) FROM workflow_entity WHERE active = true;"
```

---

## 🎊 Expected Result

After completing this guide:

```
✅ All 18 workflows visible in n8n
✅ No credential error messages
✅ Test workflow executes successfully
✅ Email notifications working
✅ Telegram notifications working
✅ All workflows ready to activate
```

---

**Status**: 🟢 Ready to configure credentials now!

**Next**: Open http://nexus-n8n.local/ and start filling in credentials →
