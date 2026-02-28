#!/usr/bin/env python3
"""
NEXUS n8n Automation Setup
==========================
Creates credentials + imports all 5 automation workflows via n8n REST API.

Workflows created:
  1. Infrastructure Health Monitor  — every 5 min, alerts on failures
  2. Daily Business Report          — 9 AM, orders/revenue/uptime summary
  3. GitHub CI/CD Pipeline          — push to main → deploy → health check
  4. Scheduled Database Backup      — 2 AM, pg_dump + compress + cleanup
  5. E-commerce Order Notifications — webhook → Telegram + email admin alert

Usage:
  python3 n8n-workflows/setup.py

Requirements:
  pip3 install requests python-dotenv
"""

import json
import os
import sys
import uuid
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

# ──────────────────────────────────────────────────────────
# Config
# ──────────────────────────────────────────────────────────
N8N_URL   = "http://localhost"
N8N_HOST  = "nexus-n8n.local"
EMAIL     = "caspertech92@gmail.com"
PASSWORD  = "C@sper@22032011"

ROOT = Path(__file__).parent.parent
ENV  = dotenv_values(ROOT / ".env")

TELEGRAM_CHAT_ID  = ENV.get("TELEGRAM_CHAT_ID", "")
TELEGRAM_BOT_TOKEN = ENV.get("TELEGRAM_BOT_TOKEN", "")
DB_PASSWORD        = ENV.get("DB_PASSWORD", "")
REDIS_PASSWORD     = ENV.get("REDIS_PASSWORD", "")

GREEN = "\033[0;32m"; YELLOW = "\033[1;33m"; RED = "\033[0;31m"
CYAN  = "\033[0;36m"; NC    = "\033[0m"
ok   = lambda m: print(f"{GREEN}[✓]{NC} {m}")
warn = lambda m: print(f"{YELLOW}[!]{NC} {m}")
fail = lambda m: print(f"{RED}[✗]{NC} {m}")
info = lambda m: print(f"{CYAN}[i]{NC} {m}")

def h(extra=None):
    h = {"Content-Type": "application/json", "Host": N8N_HOST}
    if extra: h.update(extra)
    return h

# ──────────────────────────────────────────────────────────
# Auth
# ──────────────────────────────────────────────────────────
def login(s):
    r = s.post(f"{N8N_URL}/rest/login",
               json={"emailOrLdapLoginId": EMAIL, "password": PASSWORD},
               headers=h())
    if r.status_code != 200:
        fail(f"Login failed ({r.status_code}): {r.text[:200]}")
        sys.exit(1)
    ok("Logged in to n8n")

# ──────────────────────────────────────────────────────────
# Credentials
# ──────────────────────────────────────────────────────────
def upsert_credential(s, name, cred_type, data):
    """Create credential if it doesn't exist, update if it does."""
    existing = s.get(f"{N8N_URL}/rest/credentials", headers=h()).json()
    for cred in existing.get("data", []):
        if cred.get("name") == name:
            ok(f"Credential already exists: {name}")
            return cred["id"]
    r = s.post(f"{N8N_URL}/rest/credentials",
               json={"name": name, "type": cred_type, "data": data},
               headers=h())
    if r.status_code in [200, 201]:
        cid = r.json().get("data", r.json()).get("id", "?")
        ok(f"Created credential: {name} (id={cid})")
        return cid
    warn(f"Could not create credential '{name}': {r.text[:200]}")
    return None

def setup_credentials(s):
    print("\n▶  Setting up credentials…")
    creds = {}

    # Telegram
    if TELEGRAM_BOT_TOKEN and not TELEGRAM_BOT_TOKEN.startswith("123456"):
        creds["telegram"] = upsert_credential(s,
            "NEXUS Telegram Bot", "telegramApi",
            {"accessToken": TELEGRAM_BOT_TOKEN})
    else:
        warn("TELEGRAM_BOT_TOKEN not set in .env — Telegram alerts will need manual credential config")

    # Postgres
    if DB_PASSWORD and not DB_PASSWORD.startswith("your_"):
        creds["postgres"] = upsert_credential(s,
            "NEXUS Postgres", "postgres",
            {"host": "postgres", "port": 5432,
             "database": "nexus_v2", "user": "nexus",
             "password": DB_PASSWORD, "ssl": "disable"})
    else:
        warn("DB_PASSWORD not set in .env — Postgres queries will need manual credential config")

    # SSH (placeholder — user must configure manually)
    info("SSH credential: configure manually in n8n → Settings → Credentials → New → SSH")

    return creds

# ──────────────────────────────────────────────────────────
# Helper — build node dict
# ──────────────────────────────────────────────────────────
def node(name, ntype, params, pos, version=None, cred_type=None, cred_id=None):
    n = {
        "id":          str(uuid.uuid4()),
        "name":        name,
        "type":        ntype,
        "typeVersion": version or 1,
        "position":    pos,
        "parameters":  params,
    }
    if cred_type and cred_id:
        n["credentials"] = {cred_type: {"id": cred_id, "name": name}}
    return n

def conn(src, dst, src_out=0, dst_in=0):
    return (src, dst, src_out, dst_in)

def build_connections(conns):
    """conns: list of (src_name, dst_name, out_index, in_index)"""
    c = {}
    for src, dst, out_idx, in_idx in conns:
        if src not in c:
            c[src] = {"main": []}
        while len(c[src]["main"]) <= out_idx:
            c[src]["main"].append([])
        c[src]["main"][out_idx].append({"node": dst, "type": "main", "index": in_idx})
    return c

# ──────────────────────────────────────────────────────────
# WORKFLOW 1 — Infrastructure Health Monitor
# ──────────────────────────────────────────────────────────
def wf_health_monitor(creds):
    tg_id = creds.get("telegram")

    CHECK_CODE = """
// Checks all NEXUS services by container name (Docker internal DNS)
// Returns: { checks, failed, allOk, report }
const SERVICES = [
  { name: 'NEXUS App',     url: 'http://nexus_app:3030/api/health' },
  { name: 'Grafana',       url: 'http://grafana:3000/api/health' },
  { name: 'Prometheus',    url: 'http://prometheus:9090/-/healthy' },
  { name: 'Loki',          url: 'http://loki:3100/ready' },
  { name: 'Uptime Kuma',   url: 'http://uptime_kuma:3001/' },
  { name: 'WireGuard',     url: 'http://wireguard:51821/' },
  { name: 'VaultWarden',   url: 'http://vaultwarden:80/alive' },
  { name: 'Nginx PM',      url: 'http://nginx_proxy_manager:81/' },
];

const results = await Promise.allSettled(
  SERVICES.map(async (svc) => {
    const t0 = Date.now();
    try {
      const res = await fetch(svc.url, {
        signal: AbortSignal.timeout(6000),
        redirect: 'follow',
      });
      return { ...svc, status: res.status, ok: res.ok, ms: Date.now() - t0 };
    } catch (e) {
      return { ...svc, status: 0, ok: false, ms: Date.now() - t0, error: String(e.message) };
    }
  })
);

const checks = results.map(r => r.status === 'fulfilled' ? r.value : { ...r.reason, ok: false });
const failed = checks.filter(c => !c.ok);
const allOk  = failed.length === 0;

const statusLine = checks.map(c =>
  c.ok ? `✅ ${c.name} (${c.ms}ms)` : `❌ ${c.name} — HTTP ${c.status}${c.error ? ': '+c.error : ''}`
).join('\\n');

const report = allOk
  ? `✅ All ${checks.length} NEXUS services are healthy`
  : `🚨 ${failed.length}/${checks.length} services DOWN\\n\\n${statusLine}`;

return [{ json: { checks, failed, allOk, report, checkedAt: new Date().toISOString() } }];
"""

    ALERT_MSG = ("🚨 *NEXUS Infrastructure Alert*\n\n"
                 "={{ $json.report }}\n\n"
                 "🕐 {{ $json.checkedAt }}\n"
                 "📊 Dashboard: http://nexus-uptime.local")

    nodes = [
        node("Every 5 Minutes", "n8n-nodes-base.scheduleTrigger",
             {"rule": {"interval": [{"field": "minutes", "minutesInterval": 5}]}},
             [240, 300], version=1.2),

        node("Check All Services", "n8n-nodes-base.code",
             {"jsCode": CHECK_CODE},
             [500, 300], version=2),

        node("Any Down?", "n8n-nodes-base.if",
             {"conditions": {"options": {"caseSensitive": True, "typeValidation": "loose"},
                             "combinator": "and",
                             "conditions": [{"leftValue": "={{ $json.allOk }}",
                                            "rightValue": False,
                                            "operator": {"type": "boolean", "operation": "equal"}}]}},
             [740, 300], version=2.2),

        node("Telegram Alert", "n8n-nodes-base.telegram",
             {"resource": "message", "operation": "sendMessage",
              "chatId": f"={{{{{' $env.TELEGRAM_CHAT_ID '}}}}}" if not TELEGRAM_CHAT_ID else TELEGRAM_CHAT_ID,
              "text": ALERT_MSG, "additionalFields": {"parse_mode": "Markdown"}},
             [980, 200], version=1.2,
             cred_type="telegramApi", cred_id=tg_id),

        node("Already Healthy", "n8n-nodes-base.noOp", {}, [980, 400]),
    ]

    return {
        "name": "NEXUS — Infrastructure Health Monitor",
        "active": True,
        "nodes": nodes,
        "connections": build_connections([
            conn("Every 5 Minutes",  "Check All Services", 0, 0),
            conn("Check All Services", "Any Down?",        0, 0),
            conn("Any Down?",        "Telegram Alert",     0, 0),  # true branch
            conn("Any Down?",        "Already Healthy",    1, 0),  # false branch
        ]),
        "settings": {"executionOrder": "v1"},
    }

# ──────────────────────────────────────────────────────────
# WORKFLOW 2 — Daily Business Report
# ──────────────────────────────────────────────────────────
def wf_daily_report(creds):
    pg_id = creds.get("postgres")
    tg_id = creds.get("telegram")

    FORMAT_CODE = """
const orders  = $('Orders Today').first().json;
const weekly  = $('Orders This Week').first().json;
const monthly = $('Orders This Month').first().json;
const top     = $('Top Products Today').all().map(r => r.json);

const fmt = (n) => Number(n || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

const topList = top.slice(0,5)
  .map((p, i) => `  ${i+1}. ${p.name} — ${p.qty} sold / $${fmt(p.revenue)}`)
  .join('\\n') || '  No data';

const today = new Date().toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

const report = `📊 *NEXUS Daily Business Report*
📅 ${today}

*Today*
  Orders: ${orders.count || 0}
  Revenue: $${fmt(orders.revenue)}
  Avg. Order: $${fmt((orders.revenue||0) / Math.max(orders.count||1, 1))}

*This Week*
  Orders: ${weekly.count || 0}
  Revenue: $${fmt(weekly.revenue)}

*This Month*
  Orders: ${monthly.count || 0}
  Revenue: $${fmt(monthly.revenue)}

*🏆 Top Products Today*
${topList}

_Powered by NEXUS — http://nexus-app.local_`;

return [{ json: { report } }];
"""

    nodes = [
        node("9 AM Daily", "n8n-nodes-base.scheduleTrigger",
             {"rule": {"interval": [{"field": "cronExpression", "expression": "0 9 * * *"}]}},
             [240, 300], version=1.2),

        node("Orders Today", "n8n-nodes-base.postgres",
             {"operation": "executeQuery",
              "query": ("SELECT COUNT(*) AS count, COALESCE(SUM(total_amount),0) AS revenue "
                        "FROM orders WHERE created_at >= CURRENT_DATE"),
              "options": {}},
             [500, 160], version=2.5,
             cred_type="postgres", cred_id=pg_id),

        node("Orders This Week", "n8n-nodes-base.postgres",
             {"operation": "executeQuery",
              "query": ("SELECT COUNT(*) AS count, COALESCE(SUM(total_amount),0) AS revenue "
                        "FROM orders WHERE created_at >= date_trunc('week', CURRENT_DATE)"),
              "options": {}},
             [500, 300], version=2.5,
             cred_type="postgres", cred_id=pg_id),

        node("Orders This Month", "n8n-nodes-base.postgres",
             {"operation": "executeQuery",
              "query": ("SELECT COUNT(*) AS count, COALESCE(SUM(total_amount),0) AS revenue "
                        "FROM orders WHERE created_at >= date_trunc('month', CURRENT_DATE)"),
              "options": {}},
             [500, 440], version=2.5,
             cred_type="postgres", cred_id=pg_id),

        node("Top Products Today", "n8n-nodes-base.postgres",
             {"operation": "executeQuery",
              "query": ("SELECT p.name, SUM(oi.quantity) AS qty, "
                        "SUM(oi.quantity * oi.unit_price) AS revenue "
                        "FROM order_items oi JOIN products p ON p.id = oi.product_id "
                        "JOIN orders o ON o.id = oi.order_id "
                        "WHERE o.created_at >= CURRENT_DATE "
                        "GROUP BY p.name ORDER BY revenue DESC LIMIT 5"),
              "options": {}},
             [500, 580], version=2.5,
             cred_type="postgres", cred_id=pg_id),

        node("Format Report", "n8n-nodes-base.code",
             {"jsCode": FORMAT_CODE, "mode": "runOnceForAllItems"},
             [760, 300], version=2),

        node("Send Report", "n8n-nodes-base.telegram",
             {"resource": "message", "operation": "sendMessage",
              "chatId": TELEGRAM_CHAT_ID or "={{ $env.TELEGRAM_CHAT_ID }}",
              "text": "={{ $json.report }}",
              "additionalFields": {"parse_mode": "Markdown"}},
             [1000, 300], version=1.2,
             cred_type="telegramApi", cred_id=tg_id),
    ]

    return {
        "name": "NEXUS — Daily Business Report",
        "active": True,
        "nodes": nodes,
        "connections": build_connections([
            conn("9 AM Daily",       "Orders Today",       0, 0),
            conn("9 AM Daily",       "Orders This Week",   0, 0),
            conn("9 AM Daily",       "Orders This Month",  0, 0),
            conn("9 AM Daily",       "Top Products Today", 0, 0),
            conn("Orders Today",     "Format Report",      0, 0),
            conn("Orders This Week", "Format Report",      0, 1),
            conn("Orders This Month","Format Report",      0, 2),
            conn("Top Products Today","Format Report",     0, 3),
            conn("Format Report",    "Send Report",        0, 0),
        ]),
        "settings": {"executionOrder": "v1"},
    }

# ──────────────────────────────────────────────────────────
# WORKFLOW 3 — GitHub CI/CD Pipeline
# ──────────────────────────────────────────────────────────
def wf_cicd(creds):
    tg_id = creds.get("telegram")

    PARSE_PUSH = """
// Parse GitHub push webhook payload
const body = $json.body;
const ref   = body.ref || '';
const branch = ref.replace('refs/heads/', '');
const repo   = body.repository?.full_name || 'unknown';
const pusher = body.pusher?.name || 'unknown';
const commits = (body.commits || []).slice(0, 3).map(c => `  • ${c.message.split('\\n')[0]} (${c.id?.slice(0,7)})`).join('\\n');
const isMain = branch === 'main';

return [{ json: { branch, repo, pusher, commits, isMain, ref } }];
"""

    DEPLOY_SCRIPT = """#!/bin/bash
set -euo pipefail
cd /home/redbend/Desktop/Local-Projects/NEXUS-V2
echo "[$(date)] Pulling latest code..."
git pull origin main
echo "[$(date)] Rebuilding nexus-app..."
docker compose up -d --build --no-deps nexus-app
echo "[$(date)] Deploy complete"
"""

    SUCCESS_MSG = ("✅ *NEXUS Deployed Successfully*\n\n"
                   "🌿 Branch: `{{ $('Parse Push').first().json.branch }}`\n"
                   "👤 Pushed by: {{ $('Parse Push').first().json.pusher }}\n"
                   "📝 Commits:\n{{ $('Parse Push').first().json.commits }}\n\n"
                   "🏥 Health: OK ✓\n"
                   "🔗 http://nexus-app.local")

    FAIL_MSG = ("❌ *NEXUS Deploy FAILED*\n\n"
                "🌿 Branch: `{{ $('Parse Push').first().json.branch }}`\n"
                "👤 Pushed by: {{ $('Parse Push').first().json.pusher }}\n\n"
                "💥 Health check failed after deploy!\n"
                "🔧 Check logs: `docker logs nexus_app`")

    nodes = [
        node("GitHub Push", "n8n-nodes-base.webhook",
             {"httpMethod": "POST", "path": "github-push",
              "responseMode": "onReceived", "responseData": "noData",
              "options": {}},
             [240, 300], version=2),

        node("Parse Push", "n8n-nodes-base.code",
             {"jsCode": PARSE_PUSH},
             [480, 300], version=2),

        node("Is Main Branch?", "n8n-nodes-base.if",
             {"conditions": {"options": {"caseSensitive": True, "typeValidation": "loose"},
                             "combinator": "and",
                             "conditions": [{"leftValue": "={{ $json.isMain }}",
                                            "rightValue": True,
                                            "operator": {"type": "boolean", "operation": "equal"}}]}},
             [720, 300], version=2.2),

        node("Notify: Starting Deploy", "n8n-nodes-base.telegram",
             {"resource": "message", "operation": "sendMessage",
              "chatId": TELEGRAM_CHAT_ID or "={{ $env.TELEGRAM_CHAT_ID }}",
              "text": ("🚀 *Deploying NEXUS…*\n"
                       "Branch: `{{ $json.branch }}`\n"
                       "By: {{ $json.pusher }}"),
              "additionalFields": {"parse_mode": "Markdown"}},
             [960, 200], version=1.2,
             cred_type="telegramApi", cred_id=tg_id),

        node("SSH: Deploy", "n8n-nodes-base.ssh",
             {"resource": "command", "operation": "executeCommand",
              "command": DEPLOY_SCRIPT},
             [1200, 200], version=1),

        node("Wait 30s", "n8n-nodes-base.wait",
             {"amount": 30, "unit": "seconds"},
             [1440, 200], version=1.1),

        node("Health Check", "n8n-nodes-base.httpRequest",
             {"method": "GET", "url": "http://nexus_app:3030/api/health",
              "options": {"timeout": 10000, "response": {"response": {"fullResponse": False}}}},
             [1680, 200], version=4.2),

        node("Deploy OK?", "n8n-nodes-base.if",
             {"conditions": {"options": {"caseSensitive": True, "typeValidation": "loose"},
                             "combinator": "and",
                             "conditions": [{"leftValue": "={{ $response.statusCode }}",
                                            "rightValue": 200,
                                            "operator": {"type": "number", "operation": "equal"}}]}},
             [1900, 200], version=2.2),

        node("Notify: Success", "n8n-nodes-base.telegram",
             {"resource": "message", "operation": "sendMessage",
              "chatId": TELEGRAM_CHAT_ID or "={{ $env.TELEGRAM_CHAT_ID }}",
              "text": SUCCESS_MSG,
              "additionalFields": {"parse_mode": "Markdown"}},
             [2140, 140], version=1.2,
             cred_type="telegramApi", cred_id=tg_id),

        node("Notify: Failed", "n8n-nodes-base.telegram",
             {"resource": "message", "operation": "sendMessage",
              "chatId": TELEGRAM_CHAT_ID or "={{ $env.TELEGRAM_CHAT_ID }}",
              "text": FAIL_MSG,
              "additionalFields": {"parse_mode": "Markdown"}},
             [2140, 280], version=1.2,
             cred_type="telegramApi", cred_id=tg_id),

        node("Skip (Not Main)", "n8n-nodes-base.noOp", {}, [960, 400]),
    ]

    return {
        "name": "NEXUS — GitHub CI/CD Pipeline",
        "active": True,
        "nodes": nodes,
        "connections": build_connections([
            conn("GitHub Push",          "Parse Push",             0, 0),
            conn("Parse Push",           "Is Main Branch?",        0, 0),
            conn("Is Main Branch?",      "Notify: Starting Deploy",0, 0),  # true
            conn("Is Main Branch?",      "Skip (Not Main)",        1, 0),  # false
            conn("Notify: Starting Deploy", "SSH: Deploy",         0, 0),
            conn("SSH: Deploy",          "Wait 30s",               0, 0),
            conn("Wait 30s",             "Health Check",           0, 0),
            conn("Health Check",         "Deploy OK?",             0, 0),
            conn("Deploy OK?",           "Notify: Success",        0, 0),  # true
            conn("Deploy OK?",           "Notify: Failed",         1, 0),  # false
        ]),
        "settings": {"executionOrder": "v1"},
        "meta": {
            "webhookUrl": f"{N8N_URL}/webhook/github-push",
            "note": ("⚠ Configure:\n"
                     "1. SSH credential: Settings → Credentials → SSH → add host key\n"
                     "2. GitHub webhook: repo Settings → Webhooks → add URL above\n"
                     "3. GitHub webhook secret: add to Code node for HMAC verification")
        },
    }

# ──────────────────────────────────────────────────────────
# WORKFLOW 4 — Scheduled Database Backup
# ──────────────────────────────────────────────────────────
def wf_db_backup(creds):
    tg_id = creds.get("telegram")

    BACKUP_CMD = (
        "TIMESTAMP=$(date +%Y%m%d_%H%M%S) && "
        "BACKUP_DIR=/var/backups/nexus && "
        "mkdir -p $BACKUP_DIR && "
        "docker exec nexus_postgres pg_dump -U nexus nexus_v2 | gzip > $BACKUP_DIR/nexus_v2_$TIMESTAMP.sql.gz && "
        "echo \"Backup: $BACKUP_DIR/nexus_v2_$TIMESTAMP.sql.gz\" && "
        "ls -lh $BACKUP_DIR/nexus_v2_$TIMESTAMP.sql.gz"
    )

    CLEANUP_CMD = (
        "find /var/backups/nexus -name '*.sql.gz' -mtime +7 -delete && "
        "echo \"Cleanup done. Remaining:\" && "
        "ls -lh /var/backups/nexus/*.sql.gz 2>/dev/null | tail -5 || echo 'No old files'"
    )

    nodes = [
        node("2 AM Daily", "n8n-nodes-base.scheduleTrigger",
             {"rule": {"interval": [{"field": "cronExpression", "expression": "0 2 * * *"}]}},
             [240, 300], version=1.2),

        node("SSH: pg_dump", "n8n-nodes-base.ssh",
             {"resource": "command", "operation": "executeCommand", "command": BACKUP_CMD},
             [480, 300], version=1),

        node("SSH: Cleanup Old Backups", "n8n-nodes-base.ssh",
             {"resource": "command", "operation": "executeCommand", "command": CLEANUP_CMD},
             [720, 300], version=1),

        node("Backup OK?", "n8n-nodes-base.if",
             {"conditions": {"options": {"caseSensitive": True, "typeValidation": "loose"},
                             "combinator": "and",
                             "conditions": [{"leftValue": "={{ $json.exitCode }}",
                                            "rightValue": 0,
                                            "operator": {"type": "number", "operation": "equal"}}]}},
             [960, 300], version=2.2),

        node("Notify: Backup OK", "n8n-nodes-base.telegram",
             {"resource": "message", "operation": "sendMessage",
              "chatId": TELEGRAM_CHAT_ID or "={{ $env.TELEGRAM_CHAT_ID }}",
              "text": ("💾 *NEXUS Database Backup Complete*\n\n"
                       "✅ pg_dump → nexus_v2 backed up\n"
                       "📁 Path: /var/backups/nexus/\n"
                       "🗑 Cleaned backups older than 7 days\n"
                       "🕑 {{ new Date().toISOString() }}"),
              "additionalFields": {"parse_mode": "Markdown"}},
             [1200, 200], version=1.2,
             cred_type="telegramApi", cred_id=tg_id),

        node("Notify: Backup Failed", "n8n-nodes-base.telegram",
             {"resource": "message", "operation": "sendMessage",
              "chatId": TELEGRAM_CHAT_ID or "={{ $env.TELEGRAM_CHAT_ID }}",
              "text": ("❌ *NEXUS Backup FAILED*\n\n"
                       "Exit code: {{ $json.exitCode }}\n"
                       "Error: {{ $json.stderr }}\n"
                       "🔧 Check postgres container is running"),
              "additionalFields": {"parse_mode": "Markdown"}},
             [1200, 380], version=1.2,
             cred_type="telegramApi", cred_id=tg_id),
    ]

    return {
        "name": "NEXUS — Scheduled Database Backup",
        "active": True,
        "nodes": nodes,
        "connections": build_connections([
            conn("2 AM Daily",               "SSH: pg_dump",              0, 0),
            conn("SSH: pg_dump",             "SSH: Cleanup Old Backups",  0, 0),
            conn("SSH: Cleanup Old Backups", "Backup OK?",                0, 0),
            conn("Backup OK?",               "Notify: Backup OK",         0, 0),
            conn("Backup OK?",               "Notify: Backup Failed",     1, 0),
        ]),
        "settings": {"executionOrder": "v1"},
    }

# ──────────────────────────────────────────────────────────
# WORKFLOW 5 — E-commerce Order Notifications
# ──────────────────────────────────────────────────────────
def wf_order_notifications(creds):
    tg_id = creds.get("telegram")

    FORMAT_CODE = """
// Format order notification from NEXUS webhook payload
// POST body: { id, customer, email, items, total, status, shippingAddress }
const o = $json.body || $json;

const itemList = (o.items || [])
  .map(i => `  • ${i.name} ×${i.quantity} — $${Number(i.price * i.quantity).toFixed(2)}`)
  .join('\\n') || '  (no items)';

const addr = o.shippingAddress
  ? `${o.shippingAddress.street}, ${o.shippingAddress.city}`
  : 'N/A';

return [{
  json: {
    orderId:   o.id || '???',
    customer:  o.customer || o.name || 'Anonymous',
    email:     o.email || '',
    total:     Number(o.total || o.totalAmount || 0).toFixed(2),
    status:    o.status || 'pending',
    items:     o.items || [],
    itemList,
    address:   addr,
    orderUrl:  `http://nexus-app.local/admin/orders/${o.id}`,
  }
}];
"""

    nodes = [
        node("New Order Webhook", "n8n-nodes-base.webhook",
             {"httpMethod": "POST", "path": "new-order",
              "responseMode": "responseNode",
              "options": {"rawBody": True}},
             [240, 300], version=2),

        node("Format Order", "n8n-nodes-base.code",
             {"jsCode": FORMAT_CODE},
             [480, 300], version=2),

        node("Notify Admin (Telegram)", "n8n-nodes-base.telegram",
             {"resource": "message", "operation": "sendMessage",
              "chatId": TELEGRAM_CHAT_ID or "={{ $env.TELEGRAM_CHAT_ID }}",
              "text": ("🛒 *New Order Received!*\n\n"
                       "📦 Order #{{ $json.orderId }}\n"
                       "👤 {{ $json.customer }} ({{ $json.email }})\n"
                       "💰 Total: *${{ $json.total }}*\n"
                       "📍 {{ $json.address }}\n\n"
                       "*Items:*\n{{ $json.itemList }}\n\n"
                       "🔗 {{ $json.orderUrl }}"),
              "additionalFields": {"parse_mode": "Markdown"}},
             [720, 200], version=1.2,
             cred_type="telegramApi", cred_id=tg_id),

        node("Respond 200 OK", "n8n-nodes-base.respondToWebhook",
             {"respondWith": "json",
              "responseBody": '{"received": true, "orderId": "={{ $json.orderId }}"}',
              "options": {"responseCode": 200}},
             [720, 400], version=1.1),
    ]

    return {
        "name": "NEXUS — Order Notifications",
        "active": True,
        "nodes": nodes,
        "connections": build_connections([
            conn("New Order Webhook", "Format Order",               0, 0),
            conn("Format Order",     "Notify Admin (Telegram)",     0, 0),
            conn("Format Order",     "Respond 200 OK",              0, 0),
        ]),
        "settings": {"executionOrder": "v1"},
        "meta": {
            "note": ("POST to http://nexus-n8n.local/webhook/new-order\n"
                     "from your NEXUS app when a new order is created.\n"
                     "Body: { id, customer, email, items, total, status, shippingAddress }")
        },
    }

# ──────────────────────────────────────────────────────────
# Main
# ──────────────────────────────────────────────────────────
def create_workflow(s, wf_def):
    payload = {k: v for k, v in wf_def.items() if k != "meta"}
    r = s.post(f"{N8N_URL}/rest/workflows",
               json=payload, headers=h())
    return r

def main():
    print(f"\n{'═'*52}")
    print("  NEXUS n8n Automation Setup")
    print(f"{'═'*52}\n")

    s = requests.Session()
    login(s)

    creds = setup_credentials(s)

    workflows = [
        ("Health Monitor",        wf_health_monitor),
        ("Daily Business Report", wf_daily_report),
        ("GitHub CI/CD Pipeline", wf_cicd),
        ("Database Backup",       wf_db_backup),
        ("Order Notifications",   wf_order_notifications),
    ]

    print("\n▶  Creating workflows…")
    created = []
    for label, factory in workflows:
        try:
            wf_def = factory(creds)
            r = create_workflow(s, wf_def)
            if r.status_code in [200, 201]:
                data = r.json().get("data", r.json())
                wid = data.get("id", "?")
                ok(f"{wf_def['name']} (id={wid})")
                created.append((wf_def["name"], wid, wf_def.get("meta", {})))
            else:
                fail(f"{label}: {r.status_code} — {r.text[:300]}")
        except Exception as e:
            fail(f"{label}: {e}")

    print(f"\n{'═'*52}")
    print(f"  ✅ Created {len(created)}/5 workflows\n")
    print("  Access n8n: http://nexus-n8n.local\n")

    print("  ⚙  REQUIRED MANUAL STEPS:")
    print("  ─────────────────────────────────────────────")
    if not TELEGRAM_BOT_TOKEN or TELEGRAM_BOT_TOKEN.startswith("123456"):
        print("  1. Telegram: Settings → Credentials → NEXUS Telegram Bot")
        print("     Add your BOT_TOKEN and update TELEGRAM_CHAT_ID in .env")
    if not DB_PASSWORD or DB_PASSWORD.startswith("your_"):
        print("  2. Postgres: Settings → Credentials → NEXUS Postgres")
        print("     Add your DB_PASSWORD")
    print("  3. SSH (for CI/CD + Backup): Settings → Credentials → New → SSH")
    print("     Host: 172.17.0.1 (Docker host gateway), User: your Linux user")
    print("     Auth: Private Key (generate: ssh-keygen, add pub key to ~/.ssh/authorized_keys)")
    print("  4. GitHub webhook:")
    print("     URL: http://nexus-n8n.local/webhook/github-push")
    print("     Content-Type: application/json, Events: Push")
    print(f"{'═'*52}\n")

if __name__ == "__main__":
    main()
