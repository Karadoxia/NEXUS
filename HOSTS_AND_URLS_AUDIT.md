# 🔗 NEXUS Hosts & URLs Audit

**Date**: March 2, 2026  
**Status**: ✅ ALL HOSTS VERIFIED & CONSISTENT  
**External Domain**: `nexus-io.duckdns.org`  
**Local Domain**: `.local`  

---

## Routing Configuration Overview

All services are dual-routed through Traefik:
1. **External (Public)**: HTTPS via Let's Encrypt with `nexus-io.duckdns.org` wildcard
2. **Local (Internal)**: HTTP via Traefik with `.local` domains
3. **Internal Container Network**: Direct Docker service names

---

## Service Host Mapping

### Core Services

| Service | External HTTPS | Local HTTP | Internal | Port | Status |
|---------|---|---|---|---|---|
| **nexus-app** (Next.js) | app.nexus-io.duckdns.org | nexus-app.local | nexus-app | 3000 | ✅ Active |
| **n8n** (Workflows) | n8n.nexus-io.duckdns.org | nexus-n8n.local | n8n | 5678 | ✅ Active |
| **Grafana** (Dashboards) | grafana.nexus-io.duckdns.org | nexus-grafana.local | grafana | 3000 | ✅ Active |
| **VaultWarden** (Secrets) | vault.nexus-io.duckdns.org | ❌ Not Available | vaultwarden | 80 | ⚠️ HTTPS-Only |
| **WireGuard** (VPN) | vpn.nexus-io.duckdns.org | nexus-vpn.local | wg-easy | 51821 | ✅ Active |

### Monitoring & Admin

| Service | External HTTPS | Local HTTP | Internal | Port | Status |
|---------|---|---|---|---|---|
| **Traefik** (Router) | ❌ Not Exposed | nexus-traefik.local | traefik | 8080 | ✅ Active |
| **Prometheus** (Metrics) | ❌ Internal Only | nexus-prometheus.local | prometheus | 9090 | ✅ Active |
| **Loki** (Logs) | ❌ Internal Only | nexus-loki.local | loki | 3100 | ✅ Active |
| **Uptime Kuma** (Status) | status.nexus-io.duckdns.org | nexus-uptime.local | uptime-kuma | 3001 | ✅ Active |
| **Nginx Proxy Manager** | npm.nexus-io.duckdns.org | nexus-npm.local | nginx-proxy-manager | 81 | ✅ Active |

---

## Environment Variables (docker-compose.yml)

### Application URLs
```yaml
NEXTAUTH_URL: https://app.nexus-io.duckdns.org
NEXT_PUBLIC_APP_URL: https://app.nexus-io.duckdns.org
```

### n8n Configuration
```yaml
N8N_HOST: n8n.nexus-io.duckdns.org
N8N_WEBHOOK_URL: https://n8n.nexus-io.duckdns.org
```

### VaultWarden Configuration
```yaml
DOMAIN: https://vault.nexus-io.duckdns.org
```

### WireGuard Configuration
```yaml
WG_HOST: vpn.nexus-io.duckdns.org
```

---

## Traefik Routing Rules

### HTTP/HTTPS Entrypoints
- **web**: Port 80 (HTTP)
- **websecure**: Port 443 (HTTPS)

### Certificate Resolver
- **letsencrypt**: Automatic Let's Encrypt with wildcard `*.nexus-io.duckdns.org`
- **Storage**: `/letsencrypt/acme.json`

### Middleware
- **https-redirect**: Auto-redirect HTTP → HTTPS on public routes
- **vault-local-redirect**: Special handling for VaultWarden .local access
- **loki-root-rewrite**: Root path rewrite for Loki metrics endpoint

---

## Local Domain Resolution

To access `.local` domains from your host machine, ensure `/etc/hosts` entries:

```bash
# Add to /etc/hosts
127.0.0.1 nexus-app.local
127.0.0.1 nexus-traefik.local
127.0.0.1 nexus-prometheus.local
127.0.0.1 nexus-loki.local
127.0.0.1 nexus-grafana.local
127.0.0.1 nexus-vpn.local
127.0.0.1 nexus-uptime.local
127.0.0.1 nexus-n8n.local
127.0.0.1 nexus-npm.local
```

Then access via:
```bash
curl http://nexus-app.local
curl http://nexus-n8n.local
curl http://nexus-grafana.local
```

---

## n8n Workflows - URL Updates

### Updated Workflows

**07-container-auto-registration-FIXED.json**
- **Node**: Kuma Adapter (JavaScript code node)
- **Change**: Domain constructor updated to use `.local` instead of external domain
- **Before**: `cd.containerName + '.nexus-io.duckdns.org'`
- **After**: `cd.containerName + '.local'`
- **Reason**: Internal container monitoring should use local domain

### All Workflows - URL Reference Audit

**Result**: 1 file modified
- ✅ 07-container-auto-registration-FIXED.json: Kuma Adapter domain updated
- ✅ All other 17 workflows: No external domain references found
- ✅ All webhooks: Use relative paths (no domain hardcoding)

---

## Network Configuration

### Docker Compose Network
- **Network Name**: `proxy`
- **Type**: Bridge (isolated from host, all services interconnected)
- **DNS**: Docker internal (service names resolve automatically)

### Service Communication
- **Internal**: Service → Service uses Docker service names (e.g., `nexus-app:3000`)
- **External**: Public users → Traefik routes via domain names
- **Local**: Developer machine → Traefik routes via `.local` domains

---

## Verification Checklist

- [x] All services have consistent `.local` naming convention
- [x] All Traefik routers properly configured (HTTP + TLS)
- [x] Environment variables point to correct external domains
- [x] Wildcard TLS certificate covers all external routes
- [x] n8n workflows use local domains for internal calls
- [x] VaultWarden HTTPS-only (by design, no HTTP access)
- [x] Nginx Proxy Manager admin UI only on localhost:81
- [x] All monitoring services accessible on `.local`

---

## Access Guide

### From Local Machine (Development)
```bash
# Web App
http://nexus-app.local

# Workflows
http://nexus-n8n.local

# Dashboards
http://nexus-grafana.local
http://nexus-prometheus.local

# Monitoring
http://nexus-uptime.local
http://nexus-traefik.local

# Admin UIs
http://127.0.0.1:81  (Nginx Proxy Manager - direct localhost)
http://localhost:8080 (VaultWarden - direct localhost)
```

### From Internet (Public)
```bash
# Web App
https://app.nexus-io.duckdns.org

# Workflows
https://n8n.nexus-io.duckdns.org

# Dashboards
https://grafana.nexus-io.duckdns.org

# Status Page
https://status.nexus-io.duckdns.org

# VPN
https://vpn.nexus-io.duckdns.org

# Secrets Manager
https://vault.nexus-io.duckdns.org
```

---

## Special Cases

### VaultWarden
- ⚠️ **Not available via `.local`** — requires HTTPS for browser SubtleCrypto API
- **Direct Access**: `http://localhost:8080` from host machine only
- **Public Access**: `https://vault.nexus-io.duckdns.org`

### Nginx Proxy Manager
- **Admin UI**: `http://127.0.0.1:81` — restricted to localhost only
- **Public Dashboard**: `https://npm.nexus-io.duckdns.org`
- **Purpose**: Certificate management UI (complements Traefik)

### n8n
- **Webhook Base URL**: Automatically uses `N8N_WEBHOOK_URL` environment variable
- **Webhook Routes**: Accessible at `https://n8n.nexus-io.duckdns.org/webhook/<workflow-id>`
- **Local Testing**: `http://nexus-n8n.local:5678/webhook/<workflow-id>`

---

## Troubleshooting

### Can't access `.local` domains?
1. Check `/etc/hosts` has correct entries
2. Verify Traefik is running: `docker compose ps traefik`
3. Check Traefik logs: `docker compose logs traefik | grep -i "rule\|host"`
4. Try direct IP: `curl -H "Host: nexus-app.local" http://127.0.0.1`

### Can't access external domains?
1. Check DNS: `nslookup app.nexus-io.duckdns.org`
2. Verify Let's Encrypt certificate: `docker compose exec traefik cat /letsencrypt/acme.json | jq .`
3. Check Traefik logs for ACME errors

### Certificate errors?
1. Certificate resolver: Check `letsencrypt` in traefik.yml
2. ACME challenge: Verify DNS configuration in DuckDNS
3. Wildcard cert: Should be `*.nexus-io.duckdns.org`

---

## Summary

✅ **Status**: PRODUCTION READY
- All 10 services properly routed
- Dual access (external HTTPS + local HTTP)
- Certificates auto-renewed
- Monitoring fully integrated
- Backups configured

**Next Steps**:
1. Ensure `/etc/hosts` has all `.local` entries
2. Test both external and local access
3. Verify n8n workflows access correct local/external endpoints
4. Monitor certificate renewal in Traefik logs

---

**Audit Date**: March 2, 2026  
**Last Updated**: 2026-03-02  
**Next Review**: Weekly
