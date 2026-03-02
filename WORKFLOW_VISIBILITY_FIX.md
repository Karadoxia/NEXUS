# 🔧 Workflow Visibility Troubleshooting Guide

**If workflows are NOT showing in n8n dashboard, use this guide**

---

## ✅ Workflows ARE Definitely in Database

All 18 workflows have been verified as existing in the PostgreSQL database. The issue is **DISPLAY**, not deployment.

```bash
# Verify workflows exist:
docker compose exec -T postgres psql -U nexus -d n8n -t -c "SELECT COUNT(*) FROM workflow_entity WHERE name LIKE '0%';"
# Should return: 10 (for the 0X- prefixed workflows)
```

---

## 🎯 Quick Fixes (Try These First)

### Fix 1: Hard Refresh Page ⭐ (90% of issues)
**Do THIS:**
- **Windows/Linux:** Press `Ctrl+Shift+R`
- **Mac:** Press `Cmd+Shift+R`

This clears browser cache and reloads from server.

### Fix 2: Check Correct URL
Make sure you're using the FULL URL with `/home/workflows`:

**✅ CORRECT:**
```
http://nexus-n8n.local/home/workflows
```

**❌ WRONG (missing /home/workflows):**
```
http://nexus-n8n.local/
http://nexus-n8n.local
```

### Fix 3: Wait & Refresh
1. Wait 30-60 seconds (n8n needs time to load)
2. Press `Ctrl+Shift+R` again

### Fix 4: Try Direct Port Access
If local hostname isn't working:
```
http://localhost:5678/home/workflows
```

Hard refresh with `Ctrl+Shift+R`

### Fix 5: Full n8n Restart
If nothing above works:

```bash
# Restart n8n service
docker compose restart n8n

# Wait 2 full minutes (important!)
sleep 120

# Hard refresh browser: Ctrl+Shift+R
# Navigate to: http://nexus-n8n.local/home/workflows
```

---

## 🔍 Browser Cache Troubleshooting

### Chrome/Chromium/Edge
1. Press `Ctrl+Shift+Delete`
2. Select: "Cookies and other site data" + "Cached images and files"
3. Click "Clear data"
4. Refresh page

### Firefox
1. Press `Ctrl+Shift+Delete`
2. Select all options
3. Click "Clear Now"
4. Refresh page

### Safari
1. Go to Menu: Develop → Clear Caches
2. Refresh page

---

## 🚀 Complete Workflow Reload (Nuclear Option)

If nothing else works, do this:

```bash
# 1. Restart both n8n and postgres
docker compose restart n8n postgres

# 2. Wait 3 minutes for full startup
sleep 180

# 3. Verify workflows in database
docker compose exec -T postgres psql -U nexus -d n8n -t -c \
  "SELECT COUNT(*) FROM workflow_entity WHERE name LIKE '0%';"
# Should return: 10

# 4. Verify n8n is running
docker compose ps n8n
# Should show "Up" status

# 5. Clear browser cache (see section above)

# 6. Hard refresh browser: Ctrl+Shift+R

# 7. Navigate to: http://nexus-n8n.local/home/workflows
```

---

## 💡 Pro Tips

1. **Try Incognito/Private Window**
   - If workflows still don't show
   - Use your browser's incognito/private mode
   - This forces fresh cache

2. **Try Different Browser**
   - Firefox if using Chrome
   - Safari if using Edge
   - Rules out browser-specific cache issues

3. **Clear All Cookies for the Domain**
   - Chrome: Settings → Privacy → Cookies → Manage all...
   - Search for "nexus-n8n"
   - Remove all cookies for that domain
   - Refresh page

4. **Check n8n Status**
   ```bash
   docker compose logs n8n | tail -20
   ```
   Look for error messages. If there are errors, n8n may need restart.

---

## ✔️ Verification Checklist

- [ ] Workflows exist in database (tested above)
- [ ] n8n service is running: `docker compose ps n8n` shows "Up"
- [ ] Using correct URL with `/home/workflows`
- [ ] Hard refreshed page with `Ctrl+Shift+R`
- [ ] Waited 30-60 seconds after any restart
- [ ] Cleared browser cache
- [ ] Tried incognito/private window
- [ ] Tried different browser (optional but effective)

---

## 🎯 URL Reference

| Access Method | URL | Status |
|---|---|---|
| Local Hostname | http://nexus-n8n.local/home/workflows | ✅ Recommended |
| Direct Port | http://localhost:5678/home/workflows | ✅ Backup |
| External | https://n8n.nexus-io.duckdns.org/home/workflows | ✅ If configured |

---

## 📞 Detailed Verification Commands

### Check Workflow Count
```bash
docker compose exec -T postgres psql -U nexus -d n8n -t -c \
  "SELECT COUNT(*) FROM workflow_entity;"
# Should show: 30 (12 existing + 18 new)
```

### List All Workflow Names
```bash
docker compose exec -T postgres psql -U nexus -d n8n -t -c \
  "SELECT name FROM workflow_entity ORDER BY name;"
```

### Check n8n Logs
```bash
docker compose logs n8n | tail -100
```

### Verify n8n Health
```bash
docker compose ps n8n
# Should show Status: "Up X minutes"
```

### Check Database Connection
```bash
docker compose exec -T postgres psql -U nexus -d n8n -c "SELECT 1;"
# Should return: 1
```

---

## 🔴 If Still Not Working

1. **Verify all databases are running:**
   ```bash
   docker compose ps
   # postgres, n8n should both show "Up"
   ```

2. **Check for port conflicts:**
   ```bash
   lsof -i :5678
   # n8n should be using this port
   ```

3. **Review comprehensive test results:**
   ```bash
   cat TEST_RESULTS_E2E.md
   ```

4. **Run automated test suite:**
   ```bash
   bash scripts/test-workflows-e2e.sh
   ```

---

## 📋 Remember

- ✅ All 18 workflows ARE in the database (verified)
- ✅ The problem is VISIBILITY, not deployment
- ✅ Hard refresh (`Ctrl+Shift+R`) fixes 90% of cases
- ✅ Wrong URL (missing `/home/workflows`) is a common mistake
- ✅ Waiting after restart is crucial
- ✅ Browser cache clearing works when hard refresh doesn't

---

## 📚 Related Documentation

- `TEST_RESULTS_E2E.md` - Complete test results
- `WORKFLOW_EXECUTION_GUIDE.md` - How to execute workflows
- `TESTING_COMPLETE.md` - Full testing summary

---

**Last Updated:** March 2, 2026
**Status:** Troubleshooting Guide v1.0

