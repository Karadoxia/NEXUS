#!/usr/bin/env python3
"""
Fix n8n credentials — creates Telegram + Postgres credentials and
patches all existing workflows that reference them so they stop
showing 'Node does not have any credentials set'.

Usage:
  python3 n8n-workflows/fix_credentials.py
"""

import sys, json, os
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

N8N_URL   = "http://localhost"
N8N_HOST  = "nexus-n8n.local"
EMAIL     = "caspertech92@gmail.com"
PASSWORD  = "C@sper@22032011"

TG_TOKEN     = ENV.get("TELEGRAM_BOT_TOKEN", "")
TG_CHAT_ID   = ENV.get("TELEGRAM_CHAT_ID", "")
DB_PASS      = ENV.get("DB_PASSWORD", "")
KUMA_API_KEY = ENV.get("UPTIME_KUMA_API_KEY", "")

GREEN = "\033[0;32m"; YELLOW = "\033[1;33m"; RED = "\033[0;31m"
CYAN  = "\033[0;36m"; NC    = "\033[0m"
ok   = lambda m: print(f"{GREEN}[✓]{NC} {m}")
warn = lambda m: print(f"{YELLOW}[!]{NC} {m}")
fail = lambda m: print(f"{RED}[✗]{NC} {m}")
info = lambda m: print(f"{CYAN}[i]{NC} {m}")

def h():
    return {"Content-Type": "application/json", "Host": N8N_HOST}

def login():
    s = requests.Session()
    r = s.post(f"{N8N_URL}/rest/login",
               json={"emailOrLdapLoginId": EMAIL, "password": PASSWORD},
               headers=h())
    if r.status_code != 200:
        fail(f"Login failed ({r.status_code}): {r.text[:200]}")
        sys.exit(1)
    ok("Logged in to n8n")
    return s

def list_credentials(s):
    r = s.get(f"{N8N_URL}/rest/credentials", headers=h())
    return r.json().get("data", [])

def delete_credential(s, cid):
    r = s.delete(f"{N8N_URL}/rest/credentials/{cid}", headers=h())
    return r.status_code in [200, 204]

def create_credential(s, name, ctype, data):
    # Delete existing with same name first to avoid duplicates
    existing = list_credentials(s)
    for c in existing:
        if c.get("name") == name:
            delete_credential(s, c["id"])
            info(f"Replaced existing credential: {name}")

    r = s.post(f"{N8N_URL}/rest/credentials",
               json={"name": name, "type": ctype, "data": data},
               headers=h())
    if r.status_code in [200, 201]:
        d = r.json().get("data", r.json())
        cid = d.get("id", "?")
        ok(f"Created credential: {name}  (id={cid})")
        return cid
    fail(f"Failed to create '{name}': {r.status_code} — {r.text[:300]}")
    return None

def list_workflows(s):
    r = s.get(f"{N8N_URL}/rest/workflows", headers=h())
    return r.json().get("data", [])

def get_workflow(s, wid):
    r = s.get(f"{N8N_URL}/rest/workflows/{wid}", headers=h())
    return r.json().get("data", r.json())

def update_workflow(s, wid, payload):
    r = s.patch(f"{N8N_URL}/rest/workflows/{wid}",
                json=payload, headers=h())
    return r.status_code in [200, 201]

def patch_workflow_credentials(s, wid, cred_map):
    """
    cred_map: { "credentialType": {"id": "xxx", "name": "yyy"} }
    Patches every node in the workflow that uses one of those credential types.
    """
    wf = get_workflow(s, wid)
    nodes = wf.get("nodes", [])
    patched = 0
    for node in nodes:
        node_creds = node.get("credentials", {})
        for ctype, cinfo in cred_map.items():
            if ctype in node_creds or _node_needs_cred(node, ctype):
                node["credentials"] = node.get("credentials", {})
                node["credentials"][ctype] = cinfo
                patched += 1
    if patched:
        wf["nodes"] = nodes
        if update_workflow(s, wid, wf):
            ok(f"  Patched workflow '{wf.get('name')}' — {patched} node(s) updated")
        else:
            warn(f"  Could not save workflow '{wf.get('name')}'")
    return patched

def _node_needs_cred(node, ctype):
    """Heuristic: does this node type require this credential type?"""
    TYPE_MAP = {
        "telegramApi":  ["n8n-nodes-base.telegram"],
        "postgres":     ["n8n-nodes-base.postgres"],
        "ssh":          ["n8n-nodes-base.ssh"],
        "httpBasicAuth":["n8n-nodes-base.httpRequest"],
    }
    return node.get("type") in TYPE_MAP.get(ctype, [])

# ──────────────────────────────────────────────────────────
def main():
    print(f"\n{'═'*56}")
    print("  NEXUS n8n — Fix Credentials")
    print(f"{'═'*56}\n")

    s = login()
    created = {}

    # ── 1. Telegram ────────────────────────────────────────
    print("\n▶  Telegram credential")
    if TG_TOKEN and not TG_TOKEN.startswith("123456"):
        cid = create_credential(s, "NEXUS Telegram Bot", "telegramApi",
                                {"accessToken": TG_TOKEN})
        if cid:
            created["telegramApi"] = {"id": cid, "name": "NEXUS Telegram Bot"}
    else:
        warn("TELEGRAM_BOT_TOKEN is still placeholder — skipped")

    # ── 2. Postgres ────────────────────────────────────────
    print("\n▶  Postgres credential")
    if DB_PASS:
        cid = create_credential(s, "NEXUS Postgres", "postgres", {
            "host": "postgres",
            "port": 5432,
            "database": "nexus_v2",
            "user": "nexus",
            "password": DB_PASS,
            "ssl": "disable",
        })
        if cid:
            created["postgres"] = {"id": cid, "name": "NEXUS Postgres"}
    else:
        warn("DB_PASSWORD not set in .env — skipped")

    # ── 3. Uptime Kuma (HTTP Header Auth) ──────────────────
    print("\n▶  Uptime Kuma HTTP credential")
    if KUMA_API_KEY:
        cid = create_credential(s, "NEXUS Uptime Kuma", "httpHeaderAuth", {
            "name": "Authorization",
            "value": f"Bearer {KUMA_API_KEY}",
        })
        if cid:
            created["httpHeaderAuth"] = {"id": cid, "name": "NEXUS Uptime Kuma"}
    else:
        warn("UPTIME_KUMA_API_KEY not set — skipped")

    # ── 4. Patch all existing workflows ────────────────────
    if created:
        print("\n▶  Patching existing workflows with new credentials…")
        workflows = list_workflows(s)
        info(f"Found {len(workflows)} workflow(s)")
        for wf in workflows:
            patch_workflow_credentials(s, wf["id"], created)

    # ── 5. Summary ─────────────────────────────────────────
    print(f"\n{'═'*56}")
    print(f"  ✅ Created {len(created)} credential(s): {', '.join(created.keys())}\n")
    print("  ⚠  STILL NEEDS MANUAL SETUP:")
    print("  ─────────────────────────────────────────────────")
    print("  SSH credential (for CI/CD + Backup workflows):")
    print("    n8n → Settings → Credentials → New → SSH")
    print("    Host: 172.17.0.1  |  User: redbend (your Linux user)")
    print("    Auth: Private Key")
    print("    → Generate key:")
    print("      ssh-keygen -t ed25519 -C 'n8n-deploy'")
    print("      cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys")
    print("      cat ~/.ssh/id_ed25519  (paste as Private Key in n8n)")
    print(f"{'═'*56}\n")

if __name__ == "__main__":
    main()
