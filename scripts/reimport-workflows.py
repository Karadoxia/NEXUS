#!/usr/bin/env python3
"""
Re-import all 18 NEXUS workflows via n8n API with proper credential wiring.
- Replaces httpRequest Gemini calls with native @n8n/n8n-nodes-langchain.googleGemini nodes
- Fixes Telegram, Postgres, SMTP credentials
- Stubs out nexus-rust-service and Traefik API nodes
- Converts cron → scheduleTrigger for n8n 2.x
- Adds missing Postgres DB health node to workflow 17 (Site Audit Bot)
"""

import json, os, sys, requests, copy, re

N8N_BASE = "http://localhost:5678"
N8N_KEY  = open(os.path.join(os.path.dirname(__file__), "../app/n8n-API")).read().strip()
WF_DIR   = os.path.join(os.path.dirname(__file__), "../n8n-workflows")

HEADERS = {
    "X-N8N-API-KEY": N8N_KEY,
    "Content-Type":  "application/json",
}

# Real credential IDs from the DB
CREDS = {
    "telegram":      {"id": "pGeHN7VAVk0WOQ9T",                     "name": "NEXUS Telegram Bot"},
    "smtp":          {"id": "33b7ac23-7009-48fc-8613-27b16ea0cfae", "name": "Resend SMTP"},
    "postgres":      {"id": "2e8af825-264e-4e68-a777-a5eb9476dcb6", "name": "NEXUS Postgres v2"},
    "googlePalmApi": {"id": "nWyfkJKrsblZS5tz",                     "name": "Google Gemini(PaLM) Api account"},
}

GEMINI_MODEL = "models/gemini-2.5-flash"
TELEGRAM_CHAT_ID = "={{ $env.TELEGRAM_CHAT_ID }}"


def make_gemini_node(node_id, name, prompt_text, position):
    """
    Create a native n8n Gemini node (text/message operation).
    Uses @n8n/n8n-nodes-langchain.googleGemini which is the correct built-in node.
    """
    return {
        "id": node_id,
        "name": name,
        "type": "@n8n/n8n-nodes-langchain.googleGemini",
        "typeVersion": 1.1,
        "position": position,
        "parameters": {
            "resource": "text",
            "operation": "message",
            "modelId": {
                "__rl": True,
                "value": GEMINI_MODEL,
                "mode": "id",
            },
            "messages": {
                "values": [
                    {
                        "content": prompt_text,
                        "role": "user",
                    }
                ]
            },
            "simplify": True,
            "jsonOutput": False,
        },
        "credentials": {
            "googlePalmApi": CREDS["googlePalmApi"],
        },
    }


def make_telegram_node(node_id, name, text, position):
    """Create a properly wired Telegram notification node."""
    return {
        "id": node_id,
        "name": name,
        "type": "n8n-nodes-base.telegram",
        "typeVersion": 1.2,
        "position": position,
        "parameters": {
            "chatId": "={{ $env.TELEGRAM_CHAT_ID }}",
            "text": text,
            "additionalFields": {},
        },
        "credentials": {
            "telegramApi": CREDS["telegram"],
        },
    }


def make_postgres_query_node(node_id, name, query, position):
    """Create a Postgres executeQuery node."""
    return {
        "id": node_id,
        "name": name,
        "type": "n8n-nodes-base.postgres",
        "typeVersion": 2.5,
        "position": position,
        "parameters": {
            "operation": "executeQuery",
            "query": query,
            "options": {},
        },
        "credentials": {
            "postgres": CREDS["postgres"],
        },
    }


# ─── Gemini prompt extractions ─────────────────────────────────────────────
# Map node names (lowercased) → prompt text, so we preserve the intent of each
# existing httpRequest Gemini node and replace it with the native node.
GEMINI_PROMPTS = {
    # Workflow 01
    "gemini personal thank you": (
        "=Write a warm, personal 2-sentence thank-you message for customer "
        "{{ $('Update Order → Paid').item.json.customerName || 'Valued Customer' }} "
        "who just placed order #{{ $('Update Order → Paid').item.json.id }}. "
        "Be friendly and brand-aligned with NEXUS store."
    ),
    # Workflow 02
    "gemini recovery email": (
        "=Write a compelling abandoned cart recovery email for {{ $json.name || 'there' }} "
        "who left items in their cart worth ${{ $json.total || '0' }}. "
        "Include the recovery code RECOVER20 for 20% off. Keep it under 150 words, warm and persuasive."
    ),
    # Workflow 03
    "gemini summary": (
        "=You are NEXUS store AI analyst. Write an executive daily sales report summary.\n"
        "Revenue today: ${{ $json.revenue || 0 }}\n"
        "Orders: {{ $json.orderCount || 0 }}\n"
        "New customers: {{ $json.newCustomers || 0 }}\n"
        "Provide: 1) Key insights 2) Trends 3) Recommendations. "
        "Keep it under 200 words, professional tone."
    ),
    # Workflow 05
    "gemini intent classifier": (
        "=Classify this customer support message into exactly ONE category: "
        "refund, fraud, shipping, product, or other.\n"
        "Message: {{ $json.body.message || $json.message }}\n"
        "Respond with ONLY the category word, nothing else."
    ),
    # Workflow 06
    "gemini upsell copy": (
        "=Write a 4-line upsell email body for {{ $json[0].name || 'Valued Customer' }} "
        "who just purchased {{ $json[0].productName || 'a product' }}. "
        "Suggest a complementary product and offer discount code UPSELL15 for 15% off. "
        "Be enthusiastic and concise."
    ),
    # Workflow 08
    "gemini: generate email": (
        "=Write a professional supplier restock request email for product: {{ $json.name }}\n"
        "SKU: {{ $json.sku || 'N/A' }}\n"
        "Current stock: {{ $json.stock || 0 }} units\n"
        "Minimum stock threshold: {{ $json.minStock || 10 }} units\n"
        "Request urgent restocking. Keep it formal and under 100 words."
    ),
    # Workflow 09
    "gemini: analyze sentiment": (
        "=Analyze the sentiment of this product review and return valid JSON only.\n"
        "Review: {{ $json.review || $json.body.review }}\n"
        "Return: {\"sentiment\": \"positive|neutral|negative\", \"score\": 0-100, "
        "\"key_points\": [\"point1\", \"point2\"]}"
    ),
    # Workflow 10
    "gemini: analyze performance": (
        "=You are a performance analyst. Analyze these Prometheus metrics:\n"
        "{{ JSON.stringify($json) }}\n"
        "Identify any slow endpoints (>500ms), high error rates, or anomalies. "
        "Return a brief report with: 1) Status (ok/degraded/critical) 2) Issues found "
        "3) Recommendations. If any endpoint is slow, include the word 'slow' in your response."
    ),
    # Workflow 11
    "generate newsletter": (
        "=Generate a personalized weekly newsletter for NEXUS store customer {{ $json.name || 'Subscriber' }}.\n"
        "Their interests: {{ $json.categories || 'general shopping' }}\n"
        "Include: 1) Weekly highlights 2) Featured products 3) Exclusive tip. "
        "Keep it engaging, under 200 words. Use friendly tone."
    ),
    # Workflow 13
    "gemini: generate seo": (
        "=Generate SEO metadata for this product:\n"
        "Name: {{ $json.name }}\n"
        "Description: {{ $json.description || '' }}\n"
        "Category: {{ $json.category || '' }}\n"
        "Return valid JSON: {\"metaTitle\": \"max 60 chars\", \"metaDescription\": \"max 160 chars\", "
        "\"keywords\": [\"kw1\",\"kw2\",\"kw3\",\"kw4\",\"kw5\"]}"
    ),
    # Workflow 15
    "gemini: generate copy": (
        "=Write an engaging social media post for this featured product:\n"
        "Name: {{ $json.name }}\n"
        "Price: ${{ $json.price }}\n"
        "Category: {{ $json.category || '' }}\n"
        "Max 280 characters. Include 2-3 relevant emojis and 3-4 hashtags. "
        "Make it exciting and shareable."
    ),
    # Workflow 16
    "gemini: predict churn": (
        "=Analyze this customer's churn risk and return valid JSON only.\n"
        "Days since last order: {{ $json.daysSinceLastOrder || 90 }}\n"
        "Total orders: {{ $json.totalOrders || 1 }}\n"
        "Total spent: ${{ $json.totalSpent || 0 }}\n"
        "Account age (days): {{ $json.accountAgeDays || 30 }}\n"
        "Return: {\"churnRisk\": 0-100, \"reason\": \"brief reason\", "
        "\"recommendation\": \"action to take\"}"
    ),
    # Workflow 17
    "gemini: generate report": (
        "=Generate a comprehensive weekly site audit report for NEXUS e-commerce platform.\n"
        "Database Status: {{ $json.db_status || 'Healthy' }}\n"
        "Active Users (7d): {{ $json.active_users || 'N/A' }}\n"
        "New Orders (7d): {{ $json.new_orders || 'N/A' }}\n"
        "Total Revenue (7d): ${{ $json.revenue_7d || '0' }}\n"
        "Include:\n"
        "1. Executive Summary\n"
        "2. Database Health Assessment\n"
        "3. Business Metrics Review\n"
        "4. Security Status\n"
        "5. Top 3 Recommendations for this week\n"
        "Keep it professional, under 400 words."
    ),
}


def extract_gemini_prompt(node):
    """
    Try to extract the prompt from an existing httpRequest Gemini node.
    Falls back to a generic prompt using the node's name.
    """
    name_lower = node.get("name", "").lower().strip()
    if name_lower in GEMINI_PROMPTS:
        return GEMINI_PROMPTS[name_lower]

    # Try to extract from existing body
    params = node.get("parameters", {})
    body_str = params.get("body", "") or params.get("bodyParametersJson", "")
    if body_str:
        try:
            body = json.loads(body_str) if isinstance(body_str, str) else body_str
            parts = body.get("contents", [{}])[0].get("parts", [{}])
            if parts and "text" in parts[0]:
                return parts[0]["text"]
        except Exception:
            pass

    return f"You are a helpful AI assistant for NEXUS e-commerce platform. Complete this task professionally."


def is_gemini_httprequest(node):
    """Check if a node is an httpRequest calling the Gemini API."""
    if node.get("type") != "n8n-nodes-base.httpRequest":
        return False
    url = str(node.get("parameters", {}).get("url", ""))
    return "generativelanguage.googleapis.com" in url


def fix_gemini_nodes(nodes):
    """Replace httpRequest Gemini nodes with the native @n8n/n8n-nodes-langchain.googleGemini node."""
    result = []
    for node in nodes:
        if is_gemini_httprequest(node):
            prompt = extract_gemini_prompt(node)
            native = make_gemini_node(
                node_id=node.get("id", f"gemini_{len(result)}"),
                name=node.get("name", "Gemini AI"),
                prompt_text=prompt,
                position=node.get("position", [800, 300]),
            )
            result.append(native)
        else:
            result.append(node)
    return result


def fix_telegram_nodes(nodes):
    """Ensure all Telegram nodes use the correct credential and typeVersion.
    Also replace any $env.TELEGRAM_CHAT_ID template with the actual value at import
    time, because the runtime may not evaluate it correctly."""
    for node in nodes:
        if node.get("type") == "n8n-nodes-base.telegram":
            node["typeVersion"] = 1.2
            # Always wire the correct credential
            node["credentials"] = {"telegramApi": CREDS["telegram"]}
            # Resolve chatId template immediately if env var available
            params = node.get("parameters", {})
            chat = params.get("chatId", "")
            if chat and "$env.TELEGRAM_CHAT_ID" in chat:
                real = os.environ.get("TELEGRAM_CHAT_ID")
                if real:
                    params["chatId"] = real
            # if still blank, fall back to environment substitution string
            if not params.get("chatId"):
                params["chatId"] = "={{ $env.TELEGRAM_CHAT_ID }}"
            node["parameters"] = params
    return nodes


def fix_postgres_nodes(nodes):
    """Ensure all Postgres nodes use the correct credential and typeVersion."""
    for node in nodes:
        if node.get("type") == "n8n-nodes-base.postgres":
            node["typeVersion"] = 2.5
            node["credentials"] = {"postgres": CREDS["postgres"]}
            # Ensure options field exists
            params = node.get("parameters", {})
            if "options" not in params:
                params["options"] = {}
                node["parameters"] = params
    return nodes


def fix_smtp_nodes(nodes):
    """Ensure all emailSend nodes use the correct SMTP credential and have a valid toEmail/html/text."""
    for node in nodes:
        if node.get("type") == "n8n-nodes-base.emailSend":
            node["typeVersion"] = 2
            node["credentials"] = {"smtp": CREDS["smtp"]}
            params = node.get("parameters", {})
            # Replace $env.ADMIN_EMAIL with literal email (n8n container may not have it set)
            to = params.get("toEmail", "")
            if "$env.ADMIN_EMAIL" in str(to) or not to:
                params["toEmail"] = "caspertech78@gmail.com"
            # ensure there is at least something to send
            html_val = params.get("html", "")
            if (not html_val or "{{" in html_val) and not params.get("text"):
                # either no html or dynamic expression which might resolve empty
                params["text"] = "Please see attached report or login to the admin panel for details."
            # avoid unverified from-addresses
            from_email = params.get("fromEmail", "")
            # substitute unverified domains with DEFAULT_FROM_EMAIL fallback
            default_addr = os.environ.get("DEFAULT_FROM_EMAIL", "no-reply@resend.dev")
            if "@nexus.store" in from_email or "@nexus.io" in from_email:
                params["fromEmail"] = default_addr
            node["parameters"] = params
    return nodes


def fix_rust_nodes(nodes):
    """Replace nexus-rust-service calls with Code node stubs."""
    for node in nodes:
        if node.get("type") != "n8n-nodes-base.httpRequest":
            continue
        params = node.get("parameters", {})
        url = str(params.get("url", ""))
        if "nexus-rust-service" not in url:
            continue
        service_path = url.split(":8080")[-1] if ":8080" in url else "/unknown"
        node["type"] = "n8n-nodes-base.code"
        node["typeVersion"] = 2
        node["parameters"] = {
            "jsCode": (
                f"// Stub for nexus-rust-service{service_path}\n"
                "// Rust service not running — returns safe defaults\n"
                "return [{ json: { status: 'ok', score: 10, severity: 10, "
                f"riskScore: 10, message: 'rust-service-stub', path: '{service_path}' "
                "} }];"
            )
        }
        node.pop("credentials", None)
    return nodes


def fix_traefik_api_nodes(nodes):
    """Replace Traefik API calls with Code node stubs."""
    for node in nodes:
        if node.get("type") != "n8n-nodes-base.httpRequest":
            continue
        url = str(node.get("parameters", {}).get("url", ""))
        if "traefik:8080/api" not in url:
            continue
        node["type"] = "n8n-nodes-base.code"
        node["typeVersion"] = 2
        node["parameters"] = {
            "jsCode": (
                "// Traefik API not available in this setup.\n"
                "// IP blocking skipped.\n"
                "return [{ json: { status: 'skipped', reason: 'traefik-api-not-available' } }];"
            )
        }
        node.pop("credentials", None)
    return nodes


def fix_cron_nodes(nodes):
    """Convert legacy cron nodes to scheduleTrigger for n8n 2.x."""
    for node in nodes:
        if node.get("type") != "n8n-nodes-base.cron":
            continue
        expr = node.get("parameters", {}).get("cronExpression", "0 * * * *")
        node["type"] = "n8n-nodes-base.scheduleTrigger"
        node["typeVersion"] = 1.2
        node["parameters"] = {
            "rule": {
                "interval": [{"field": "cronExpression", "expression": expr}]
            }
        }
    return nodes


def patch_site_audit_bot(wf_data):
    """
    Workflow 17: Add a Postgres DB health-check node between 'Prepare Data'
    and 'Gemini: Generate Report' as requested.
    """
    if "Site Audit Bot" not in wf_data.get("name", ""):
        return wf_data

    nodes = wf_data.get("nodes", [])
    connections = wf_data.get("connections", {})

    # Check if DB health node already exists
    if any(n.get("id") == "db_health_check" for n in nodes):
        return wf_data

    # Build the DB health node
    db_health_node = make_postgres_query_node(
        node_id="db_health_check",
        name="DB Health Check",
        query=(
            "SELECT\n"
            "  (SELECT COUNT(*) FROM \"Order\" WHERE date > NOW() - INTERVAL '7 days') AS new_orders,\n"
            "  (SELECT COUNT(*) FROM \"User\"  WHERE \"createdAt\" > NOW() - INTERVAL '7 days') AS active_users,\n"
            "  (SELECT COALESCE(SUM(total), 0) FROM \"Order\" WHERE status = 'paid' AND date > NOW() - INTERVAL '7 days') AS revenue_7d,\n"
            "  'Healthy' AS db_status"
        ),
        position=[680, 300],
    )
    nodes.append(db_health_node)

    # Rewire: Prepare Data → DB Health Check → Gemini: Generate Report
    if "Prepare Data" in connections:
        connections["Prepare Data"]["main"] = [[{"node": "DB Health Check", "type": "main", "index": 0}]]
    connections["DB Health Check"] = {
        "main": [[{"node": "Gemini: Generate Report", "type": "main", "index": 0}]]
    }

    wf_data["nodes"] = nodes
    wf_data["connections"] = connections
    return wf_data


def strip_unknown_fields(nodes):
    """Remove fields that n8n API rejects (e.g. trigger, notesInFlow)."""
    for node in nodes:
        for field in ["trigger", "notesInFlow", "notes"]:
            node.pop(field, None)
    return nodes


def build_workflow_payload(wf_data):
    """Build the final API payload from a workflow JSON file."""
    wf_data = patch_site_audit_bot(wf_data)

    nodes = copy.deepcopy(wf_data.get("nodes", []))

    # Order matters: Gemini first (converts httpRequest → native node),
    # then credentials, rust stubs, traefik stubs, cron fix, cleanup
    nodes = fix_gemini_nodes(nodes)
    nodes = fix_telegram_nodes(nodes)
    nodes = fix_postgres_nodes(nodes)
    nodes = fix_smtp_nodes(nodes)
    nodes = fix_rust_nodes(nodes)
    nodes = fix_traefik_api_nodes(nodes)
    nodes = fix_cron_nodes(nodes)
    nodes = strip_unknown_fields(nodes)

    # build payload for POST; n8n's workflow API treats the 'active'
    # property as read‑only, so we drop it here.  Activation is handled
    # separately after creation via a direct database update if the JSON
    # requested it.
    return {
        "name":        wf_data.get("name", "Unnamed"),
        "nodes":       nodes,
        "connections": wf_data.get("connections", {}),
        "settings":    wf_data.get("settings", {"executionOrder": "v1"}),
    }


def delete_all_existing():
    """Delete all existing workflows via API."""
    r = requests.get(f"{N8N_BASE}/api/v1/workflows?limit=100", headers=HEADERS)
    workflows = r.json().get("data", [])
    for wf in workflows:
        wid = wf["id"]
        dr = requests.delete(f"{N8N_BASE}/api/v1/workflows/{wid}", headers=HEADERS)
        print(f"  Deleted: {wf['name']} ({wid}) → {dr.status_code}")


def import_workflow(filepath):
    """Import a single workflow file."""
    with open(filepath) as f:
        wf_data = json.load(f)

    payload = build_workflow_payload(wf_data)
    r = requests.post(f"{N8N_BASE}/api/v1/workflows", headers=HEADERS, json=payload)

    if r.status_code in (200, 201):
        wf = r.json()
        node_count = len(payload["nodes"])
        wid = wf.get('id')
        print(f"  ✅ {wf.get('name')} (id={wid}, nodes={node_count})")
        # if original JSON requested activation, bump the database record now
        if wf_data.get('active'):
            import subprocess, shlex, os
            sql = f"UPDATE workflow_entity SET active = true WHERE id = '{wid}';"
            subprocess.run([
                "docker", "compose", "exec", "-T", "postgres",
                "psql", "-U", "nexus", "-d", "n8n", "-c", sql
            ], cwd=os.path.join(os.path.dirname(__file__), ".."))
            print(f"    activated workflow {wid}")
        return wid
    else:
        print(f"  ❌ {wf_data.get('name')} → {r.status_code}: {r.text[:300]}")
        return None


def fix_shared_workflow():
    """Make sure all workflows appear in the n8n UI (shared_workflow table)."""
    import subprocess
    sql = """
    INSERT INTO shared_workflow ("workflowId", "projectId", role, "createdAt", "updatedAt")
    SELECT w.id, p.id, 'workflow:owner', NOW(), NOW()
    FROM workflow_entity w
    CROSS JOIN project p
    WHERE p.type = 'personal'
    ON CONFLICT DO NOTHING;
    """
    result = subprocess.run(
        ["docker", "compose", "exec", "-T", "postgres",
         "psql", "-U", "nexus", "-d", "n8n", "-c", sql],
        capture_output=True, text=True,
        cwd=os.path.join(os.path.dirname(__file__), "..")
    )
    print(f"  shared_workflow: {result.stdout.strip()} {result.stderr.strip()[:80]}")


def main():
    print("=== NEXUS Workflow Re-Importer v2 ===\n")
    print(f"  Gemini model : {GEMINI_MODEL}")
    print(f"  Gemini cred  : {CREDS['googlePalmApi']['id']}")
    print(f"  Telegram cred: {CREDS['telegram']['id']}")
    print(f"  Postgres cred: {CREDS['postgres']['id']}")
    print()

    # 1. Delete existing
    print("Step 1: Deleting existing workflows...")
    delete_all_existing()

    # 2. Import all JSON files
    print("\nStep 2: Importing workflows...")
    files = sorted([f for f in os.listdir(WF_DIR) if f.endswith(".json")])
    imported = 0
    for fname in files:
        fpath = os.path.join(WF_DIR, fname)
        wid = import_workflow(fpath)
        if wid:
            imported += 1

    print(f"\n  Imported {imported}/{len(files)} workflows")

    # 3. Fix shared_workflow visibility
    print("\nStep 3: Fixing shared_workflow visibility...")
    fix_shared_workflow()

    print(f"\n✅ Done. Open http://nexus-n8n.local/home/workflows")


if __name__ == "__main__":
    main()
