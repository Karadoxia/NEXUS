#!/usr/bin/env python3
"""
NEXUS Uptime Kuma Setup
=======================
Registers all service monitors in Uptime Kuma via its REST API.
Also sets up Telegram notification channel.

Usage:
  python3 n8n-workflows/setup_kuma.py
"""

import sys, os, time
from pathlib import Path

try:
    import requests
except ImportError:
    os.system("pip3 install requests -q")
    import requests

try:
    from dotenv import dotenv_values
except ImportError:
    os.system("pip3 install python-dotenv -q")
    from dotenv import dotenv_values

ROOT = Path(__file__).parent.parent
ENV  = dotenv_values(ROOT / ".env")

KUMA_URL   = "http://localhost"
KUMA_HOST  = "nexus-uptime.local"
API_KEY    = ENV.get("UPTIME_KUMA_API_KEY", "")
TG_TOKEN   = ENV.get("TELEGRAM_BOT_TOKEN", "")
TG_CHAT_ID = ENV.get("TELEGRAM_CHAT_ID", "")

GREEN = "\033[0;32m"; YELLOW = "\033[1;33m"; RED = "\033[0;31m"
CYAN  = "\033[0;36m"; NC    = "\033[0m"
ok   = lambda m: print(f"{GREEN}[✓]{NC} {m}")
warn = lambda m: print(f"{YELLOW}[!]{NC} {m}")
fail = lambda m: print(f"{RED}[✗]{NC} {m}")
info = lambda m: print(f"{CYAN}[i]{NC} {m}")

def h():
    hdrs = {"Content-Type": "application/json", "Host": KUMA_HOST}
    if API_KEY:
        hdrs["Authorization"] = f"Bearer {API_KEY}"
    return hdrs

def get(path):
    return requests.get(f"{KUMA_URL}{path}", headers=h())

def post(path, body):
    return requests.post(f"{KUMA_URL}{path}", json=body, headers=h())

# ──────────────────────────────────────────────────────────
# Monitors to create — internal Docker DNS urls where possible
# ──────────────────────────────────────────────────────────
MONITORS = [
    # HTTP monitors
    {"name": "NEXUS App",           "type": "http", "url": "http://nexus_app:3030/api/health",   "interval": 60},
    {"name": "Grafana",             "type": "http", "url": "http://grafana:3000/api/health",     "interval": 60},
    {"name": "Prometheus",          "type": "http", "url": "http://prometheus:9090/-/healthy",   "interval": 60},
    {"name": "Loki",                "type": "http", "url": "http://loki:3100/ready",             "interval": 60},
    {"name": "n8n",                 "type": "http", "url": "http://n8n:5678/healthz",            "interval": 60},
    {"name": "Traefik Dashboard",   "type": "http", "url": "http://traefik:8080/api/rawdata",    "interval": 60},
    {"name": "VaultWarden",         "type": "http", "url": "http://vaultwarden:80/alive",        "interval": 120},
    {"name": "WireGuard UI",        "type": "http", "url": "http://wireguard:51821/",            "interval": 120},
    {"name": "Nginx Proxy Mgr",     "type": "http", "url": "http://nginx_proxy_manager:81/",     "interval": 120},
    {"name": "Node Exporter",       "type": "http", "url": "http://node_exporter:9100/metrics",  "interval": 120},
    {"name": "CAdvisor",            "type": "http", "url": "http://cadvisor:8080/healthz",       "interval": 120},
    # TCP port monitors (internal services without HTTP)
    {"name": "PostgreSQL",          "type": "port", "hostname": "postgres",  "port": 5432,       "interval": 30},
    {"name": "Redis",               "type": "port", "hostname": "redis",     "port": 6379,       "interval": 30},
]

def list_monitors():
    r = get("/api/monitors")
    if r.status_code == 200:
        return r.json().get("monitors", [])
    return []

def monitor_exists(name, existing):
    return any(m.get("name") == name for m in existing)

def create_monitor(monitor, existing):
    if monitor_exists(monitor["name"], existing):
        info(f"  Already exists: {monitor['name']}")
        return True

    mtype = monitor["type"]

    if mtype == "http":
        body = {
            "type": "http",
            "name": monitor["name"],
            "url": monitor["url"],
            "interval": monitor.get("interval", 60),
            "retryInterval": 60,
            "maxretries": 3,
            "active": True,
            "upsideDown": False,
            "notificationIDList": {},
        }
    elif mtype == "port":
        body = {
            "type": "port",
            "name": monitor["name"],
            "hostname": monitor["hostname"],
            "port": monitor["port"],
            "interval": monitor.get("interval", 30),
            "retryInterval": 30,
            "maxretries": 3,
            "active": True,
            "notificationIDList": {},
        }
    else:
        warn(f"  Unknown type: {mtype}")
        return False

    r = post("/api/monitors", body)
    if r.status_code in [200, 201]:
        ok(f"  {monitor['name']}")
        return True
    fail(f"  {monitor['name']}: {r.status_code} — {r.text[:200]}")
    return False

def setup_telegram_notification():
    if not TG_TOKEN or TG_TOKEN.startswith("123456"):
        warn("Telegram token not set — skipping notification setup")
        return None

    # Check existing
    r = get("/api/notifications")
    if r.status_code == 200:
        for n in r.json().get("notifications", []):
            if "Telegram" in n.get("name", "") or "NEXUS" in n.get("name", ""):
                ok(f"Telegram notification already exists: {n['name']}")
                return n.get("id")

    body = {
        "name": "NEXUS Telegram",
        "type": "telegram",
        "isDefault": True,
        "applyExisting": True,
        "telegramBotToken": TG_TOKEN,
        "telegramChatID": TG_CHAT_ID,
    }
    r = post("/api/notifications", body)
    if r.status_code in [200, 201]:
        nid = r.json().get("id")
        ok(f"Telegram notification created (id={nid})")
        return nid
    warn(f"Could not create Telegram notification: {r.status_code} — {r.text[:200]}")
    return None

def main():
    print(f"\n{'═'*54}")
    print("  NEXUS — Uptime Kuma Setup")
    print(f"{'═'*54}\n")

    if not API_KEY:
        fail("UPTIME_KUMA_API_KEY not set in .env")
        sys.exit(1)

    # Test connectivity
    r = get("/api/monitors")
    if r.status_code == 401:
        fail("API key rejected (401) — verify UPTIME_KUMA_API_KEY in .env")
        sys.exit(1)
    if r.status_code != 200:
        fail(f"Cannot reach Uptime Kuma at {KUMA_URL} (via Host: {KUMA_HOST}): {r.status_code}")
        info("  Is the container running? docker ps | grep kuma")
        sys.exit(1)

    ok(f"Connected to Uptime Kuma  ({len(r.json().get('monitors',[]))} existing monitor(s))")

    # Telegram notification channel
    print("\n▶  Setting up Telegram notification…")
    setup_telegram_notification()

    # Monitors
    print("\n▶  Creating monitors…")
    existing = list_monitors()
    created = 0
    for m in MONITORS:
        if create_monitor(m, existing):
            created += 1
            time.sleep(0.3)   # gentle rate-limit

    print(f"\n{'═'*54}")
    print(f"  ✅ Done — {created}/{len(MONITORS)} monitors registered\n")
    print(f"  Dashboard: http://nexus-uptime.local\n")
    print(f"{'═'*54}\n")

if __name__ == "__main__":
    main()
