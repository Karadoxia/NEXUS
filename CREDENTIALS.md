# 🔐 NEXUS — Complete Credentials & Access Guide

**Generated:** 2026-03-01
**System:** NEXUS-V2 Infrastructure (Docker Compose)

## 📱 NEXUS App — Master Admin Account
- **Email:** caspertech92@gmail.com
- **Password:** C@sper@22032011
- **Role:** Admin (Master Owner)
- **Access:** http://nexus-app.local:3030 (LAN) or https://app.nexus-io.duckdns.org (Public)

## 🌐 All Services Summary

| Service | LAN URL | Public URL | Status |
|---|---|---|---|
| **NEXUS App** | http://nexus-app.local:3030 | https://app.nexus-io.duckdns.org | ✅ |
| **Grafana** | http://nexus-grafana.local | https://grafana.nexus-io.duckdns.org | ✅ |
| **Vaultwarden** | http://localhost:8080 | https://vault.nexus-io.duckdns.org | ✅ |
| **n8n** | http://nexus-n8n.local | https://n8n.nexus-io.duckdns.org | ✅ |
| **Uptime Kuma** | http://nexus-uptime.local | https://status.nexus-io.duckdns.org | ✅ |
| **Traefik** | http://nexus-traefik.local:8080 | Internal only | ✅ |
| **Prometheus** | http://nexus-prometheus.local:9090 | Internal only | ✅ |
| **NPM** | http://localhost:81 | https://npm.nexus-io.duckdns.org | ✅ |
| **WireGuard** | http://nexus-vpn.local | https://vpn.nexus-io.duckdns.org | ✅ |

## 🔑 Access Credentials (See .env for API Keys)

- **Grafana:** admin@example.com / adminpass
- **NPM:** admin@example.com / changeme
- **PostgreSQL:** nexus / (DB_PASSWORD from .env)
- **Redis:** (REDIS_PASSWORD from .env)
- **SSH (Backups):** redbend / redbend @ 172.25.0.1:22

## 💳 Payment Systems

- **Stripe:** Test mode configured (see .env for keys)
- **PayPal:** Not configured (placeholder values)

## 🚀 Quick Start

1. **Sign in to NEXUS:** caspertech92@gmail.com / C@sper@22032011
2. **Dashboard:** http://nexus-app.local:3030 (LAN)
3. **Monitoring:** http://nexus-grafana.local (Grafana)
4. **API Keys:** Stored in .env (gitignored)

## ⚠️ Important

- **Port Forwarding Required:** To access public URLs, forward ports 80/443 on your router to 192.168.1.184
- **DuckDNS Domain:** nexus-io.duckdns.org → 77.133.1.37 (public IP)
- **SSL Certificates:** Wildcard cert active (*.nexus-io.duckdns.org)

**All secrets are in .env (not tracked in git)**
