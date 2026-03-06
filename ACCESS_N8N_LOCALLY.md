# 🔥 ACCESS N8N LOCALLY - QUICK GUIDE

## ✅ The Problem

When you try to access n8n via the public domain (https://n8n.nexus-io.duckdns.org), you get a WiFi router login page instead. This is a DNS/routing issue.

## ✅ The Solution

Use **local access** instead! Your system is already configured to support this.

---

## 🎯 3 Ways to Access n8n Locally

### **Option 1: Via Local Hostname (RECOMMENDED)** ⭐

**Best for:** Easy to remember, proper routing through Traefik

```
http://nexus-n8n.local
```

**Status**: ✅ **CONFIGURED & READY**

Your `/etc/hosts` file already has this entry:
```
127.0.0.1  nexus-n8n.local
```

**Just open in your browser:**
```
http://nexus-n8n.local
```

---

### **Option 2: Direct Port Access**

**Best for:** When local hostname isn't resolving

```
http://localhost:5678
```

**Status**: ✅ **ALWAYS AVAILABLE**

This directly accesses the n8n container on its exposed port.

---

### **Option 3: Direct IP Access**

**Best for:** Mobile devices or other machines on your network

```
http://192.168.1.184:5678
```

Replace `192.168.1.184` with your actual local IP address.

**Get your IP:**
```bash
hostname -I
```

---

## 📋 Complete List of Local Services

Your system has these local hostnames configured:

| Service | Local URL | Direct Access |
|---------|-----------|---------------|
| **n8n Workflows** | http://nexus-n8n.local | http://localhost:5678 |
| **NEXUS App** | http://nexus-app.local | http://localhost:3000 |
| **Grafana** | http://nexus-grafana.local | http://localhost:3000 |
| **Prometheus** | http://nexus-prometheus.local | http://localhost:9090 |
| **Traefik** | http://nexus-traefik.local | http://localhost:8080 |

---

## 🚀 IMMEDIATE ACTION

**Right now, open one of these URLs:**

1. **Best option** (if local hostname works):
   ```
   http://nexus-n8n.local
   ```

2. **Fallback option** (if hostname doesn't work):
   ```
   http://localhost:5678
   ```

3. **On another device:**
   ```
   http://YOUR-LOCAL-IP:5678
   ```

---

## ✅ What You Should See

After opening n8n locally:

1. You should see the n8n dashboard/login page
2. Go to **Workflows** tab
3. You should see **30 total workflows**:
   - 12 existing workflows
   - **18 GOD-MODE workflows** ✅ (newly imported)
4. All 18 should show green "Active" status

---

## 🔧 Troubleshooting

### "Can't connect to nexus-n8n.local"

**Solution 1:** Use direct port access
```
http://localhost:5678
```

**Solution 2:** Check if /etc/hosts is correct
```bash
grep nexus-n8n /etc/hosts
```

Should output:
```
127.0.0.1  nexus-n8n.local
```

### "Connection refused on localhost:5678"

**Solution:** Check if n8n container is running
```bash
docker compose ps n8n
```

Should show n8n as "Up"

If not running:
```bash
docker compose up -d n8n
```

### "Port 5678 already in use"

**Solution:** Find what's using it
```bash
lsof -i :5678
```

Then either stop that process or use a different port in docker-compose.yml

---

## 💡 Why Local Access Works Better

- ✅ No internet required
- ✅ No DNS routing issues
- ✅ Faster response times
- ✅ Works even if external DuckDNS is down
- ✅ More secure (internal network only)

---

## 📝 Summary

**USE THIS FROM NOW ON:**
```
http://nexus-n8n.local
```

**Fallback if needed:**
```
http://localhost:5678
```

Both will give you full access to all 18 imported GOD-MODE workflows! 🎉

---

*Last Updated: March 2, 2026*
