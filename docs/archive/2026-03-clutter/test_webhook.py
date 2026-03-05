#!/usr/bin/env python3
"""
Try executing through webhook URL instead of API
"""
import requests
import json
import sys

EMAIL = "caspertech92@gmail.com"
PASSWORD = "C@sper@22032011"
N8N_URL = "http://localhost:5678"
N8N_HOST = "nexus-n8n.local"

session = requests.Session()
headers_auth = {
    "Content-Type": "application/json",
    "Host": N8N_HOST
}

print("[1] Logging in...")
login_response = session.post(
    f"{N8N_URL}/rest/login",
    json={"emailOrLdapLoginId": EMAIL, "password": PASSWORD},
    headers=headers_auth
)

if login_response.status_code != 200:
    print(f"❌ Login failed")
    sys.exit(1)

print("✅ Logged in")

workflow_id = "4QBqdYgThkCInHD1"

print(f"\n[2] Checking for webhook URL...")
details_response = session.get(f"{N8N_URL}/rest/workflows/{workflow_id}", headers=headers_auth)
workflow = details_response.json().get("data", {})

webhook_path = workflow.get("webhookPath")
print(f"Webhook path: {webhook_path}")

if webhook_path:
    webhook_url = f"{N8N_URL}{webhook_path}"
    print(f"Webhook URL: {webhook_url}")
    
    print(f"\n[3] Testing webhook execution...")
    webhook_resp = requests.post(webhook_url, json={})
    
    print(f"Status: {webhook_resp.status_code}")
    if webhook_resp.status_code == 200:
        print("✅ Webhook response:")
        print(webhook_resp.text[:500])
    else:
        print(f"⚠️  Non-200 response:")
        print(webhook_resp.text[:300])
else:
    print("⚠️  No webhook path - workflow may not have webhook trigger")
    
print("\n" + "="*70)
print("""
Since the API has a bug, let's test manually through the UI:

🚀 Go to: http://localhost:5678/workflow/4QBqdYgThkCInHD1

You should see:
  1. A "Manual Test" node on the left
  2. A blue "Execute workflow" button
  3. Click the button to execute
  4. Watch the nodes turn green/red

If you see the "Bad request" error on Gemini node,
send me the FULL error message text (copy it exactly).
""")
