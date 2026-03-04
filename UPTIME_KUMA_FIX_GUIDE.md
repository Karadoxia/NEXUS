# 🔴 UPTIME KUMA MONITOR FIX GUIDE

## 📊 Current Issues & Solutions

### ✅ WORKING MONITORS (Keep as-is)
- **Prometheus** (99.07%) - `http://prometheus:9090`
- **Grafana** (98.59%) - `http://grafana:3000`  
- **Traefik** (99.8%) - `http://traefik:8080/ping`

### ❌ BROKEN MONITORS (Need fixes)

---

## 🔧 MONITOR CONFIGURATION FIXES

### 1. **Loki** (Currently: 0%)
**Problem:** Returns HTTP 404 on root path  
**Fix:** Update endpoint to `/loki/api/v1/status`
```
Name: Loki
Type: HTTP
URL: http://loki:3100/loki/api/v1/status
Interval: 60
Max Retries: 3
```

---

### 2. **PostgreSQL Exporter** (NEW - Missing)
**Problem:** Not configured in Uptime Kuma  
**Solution:** Add new HTTP monitor
```
Name: PostgreSQL Exporter
Type: HTTP
URL: http://postgres_exporter:9187
Interval: 60
Max Retries: 3
Description: Primary DB metrics exporter
```

---

### 3. **PostgreSQL AI Exporter** (NEW - Missing)
**Solution:** Add new HTTP monitor
```
Name: PostgreSQL AI Exporter
Type: HTTP
URL: http://postgres_ai_exporter:9187
Interval: 60
Max Retries: 3
Description: AI database metrics exporter
```

---

### 4. **PostgreSQL Infra Exporter** (NEW - Missing)
**Solution:** Add new HTTP monitor
```
Name: PostgreSQL Infra Exporter  
Type: HTTP
URL: http://postgres_infra_exporter:9187
Interval: 60
Max Retries: 3
Description: Infrastructure database metrics exporter
```

---

### 5. **Redis Exporter** (Currently: 0%, Unknown Monitor Type)
**Problem:** Configured as wrong type  
**Fix:** Change from database monitor to HTTP monitor
```
Name: Redis Exporter
Type: HTTP
URL: http://redis_exporter:9121
Interval: 60
Max Retries: 3
Description: Redis cache metrics exporter
```

---

### 6. **PostgreSQL** (Currently: 0%, Unknown Monitor Type)
**Problem:** Wrong monitor type, need HTTP not database  
**Fix:** Change to HTTP monitor for health check
```
Name: PostgreSQL
Type: HTTP
URL: http://postgres:5432
Interval: 60
Max Retries: 3
Description: Primary database service health
```

---

### 7. **CrowdSec** (Currently: 0%, DNS Error)
**Problem:** Cannot find service via DNS ("getaddrinfo ENOTFOUND crowdsec")  
**Status:** Service crashes on startup  
**Action:** REMOVE from Uptime Kuma (not operational)

---

### 8. **Falco** (Currently: 0%, DNS Error)  
**Problem:** Cannot find service via DNS ("getaddrinfo ENOTFOUND falco")  
**Status:** Service crashes on startup  
**Action:** REMOVE from Uptime Kuma (not operational)

---

### 9. **Nginx Proxy Manager** (Currently: 0%, DNS Error)
**Problem:** Cannot find service via DNS ("getaddrinfo ENOTFOUND npm")  
**Solution:** Change DNS to service name on proxy network
```
Name: Nginx Proxy Manager
Type: HTTP
URL: http://nginx-proxy-manager:81
Interval: 60
Max Retries: 3
Description: NPM admin interface health check
```

---

### 10. **Vaultwarden** (Currently: 0%, Connection Refused)
**Problem:** Port 8080 wrong, actual port is 80 on internal network  
**Fix:** Update endpoint
```
Name: Vaultwarden
Type: HTTP
URL: http://vaultwarden:80
Interval: 60
Max Retries: 3
Description: Secrets manager service
```

---

## ➕ MISSING MONITORS TO ADD

### Core Infrastructure
```
Name: NEXUS App
Type: HTTP
URL: http://nexus-app:3030/admin
Interval: 60
Max Retries: 3
Description: Next.js frontend application

Name: N8N Automation
Type: HTTP
URL: http://n8n:5678
Interval: 60
Max Retries: 3
Description: Workflow automation engine

Name: cAdvisor
Type: HTTP  
URL: http://cadvisor:8080
Interval: 60
Max Retries: 3
Description: Container metrics collection

Name: Node Exporter
Type: HTTP
URL: http://node_exporter:9100
Interval: 60
Max Retries: 3
Description: Host system metrics
```

### Admin Tools
```
Name: Portainer
Type: HTTP
URL: http://portainer:9000/api/status
Interval: 60
Max Retries: 3
Description: Container management UI

Name: Uptime Kuma
Type: HTTP
URL: http://uptime-kuma:3001
Interval: 60
Max Retries: 3
Description: This monitoring system
```

---

## 📋 COMPLETE MONITOR LIST (AFTER FIXES)

✅ **18 Total Monitors** (All services with Prometheus metrics)

### Infrastructure (5)
- ✅ Prometheus
- ✅ Grafana
- ✅ Traefik
- ✅ Loki (after fix)
- Node Exporter

### Database Exporters (4)
- ✅ PostgreSQL Exporter (NEW)
- ✅ PostgreSQL AI Exporter (NEW)
- ✅ PostgreSQL Infra Exporter (NEW)
- ✅ Redis Exporter (after fix)

### Container Services (4)
- NEXUS App (NEW)
- N8N Automation (NEW)
- cAdvisor (NEW)
- Node Exporter (NEW)

### Database Services (2)
- PostgreSQL (after fix)
- Redis (after fix)

### Admin Tools (3)
- Vaultwarden (after fix)
- Nginx Proxy Manager (after fix)
- Portainer (NEW)
- Uptime Kuma (NEW)

---

## 🛠️ How to Apply Fixes in UI

1. **Go to:** http://127.0.0.1:3001
2. **Click:** Settings → Monitors (or Dashboard → Edit)
3. **For each broken monitor:**
   - Click the monitor
   - Update the URL/settings per table above
   - Click Save
4. **For NEW monitors:**
   - Click "+ Add Monitor"
   - Fill in details from list above
   - Click Save

---

## 🌐 Network Context Summary

**Exporters Network Change:**
- Originally: Internal network ONLY (Prometheus on proxy couldn't reach them via DNS)
- Now: Internal + Proxy networks (Both Prometheus & Uptime Kuma can reach via DNS)

**Service DNS Names (on proxy network):**
- prometheus, grafana, traefik, loki
- postgres_exporter, postgres_ai_exporter, postgres_infra_exporter  
- redis_exporter
- nexus-app, n8n, cadvisor, node_exporter
- uptime-kuma, portainer, nginx-proxy-manager, vaultwarden

---

## ✨ Expected Results After Fixes

```
Uptime Kuma Status Page:
├── Up: 18
├── Down: 0
├── Maintenance: 0
└── Unknown: 0

Services monitored:
✅ All database exporters (Prometheus, PostgreSQL x3, Redis)
✅ All infrastructure (Prometheus, Grafana, Traefik, Loki)
✅ All containers (NEXUS App, N8N, cAdvisor, Node)
✅ All admin tools (Portainer, Nginx PM, Vaultwarden, Uptime Kuma)
```
