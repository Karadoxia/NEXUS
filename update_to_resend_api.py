#!/usr/bin/env python3
"""
Update Send Report node to use Resend API directly
"""
import requests
import json

EMAIL = "caspertech92@gmail.com"
PASSWORD = "C@sper@22032011"
N8N_URL = "http://localhost:5678"
N8N_HOST = "nexus-n8n.local"

session = requests.Session()
headers = {
    "Content-Type": "application/json",
    "Host": N8N_HOST
}

# Login
login_resp = session.post(
    f"{N8N_URL}/rest/login",
    json={"emailOrLdapLoginId": EMAIL, "password": PASSWORD},
    headers=headers
)

workflow_id = "4QBqdYgThkCInHD1"

# Get workflow
wf_resp = session.get(f"{N8N_URL}/rest/workflows/{workflow_id}", headers=headers)
wf_data = wf_resp.json().get("data", {})

RESEND_API_KEY = "re_C51jKwtZ_DeLcpK5JcX6mEp7YmD4ecDk6"

print("="*70)
print("UPDATING SEND REPORT NODE TO USE RESEND API")
print("="*70)

# Find and modify Send Report node
send_report_node = None
node_index = -1

for idx, node in enumerate(wf_data.get("nodes", [])):
    if node.get("name") == "Send Report":
        send_report_node = node
        node_index = idx
        break

if send_report_node is None:
    print("❌ Send Report node not found!")
    exit(1)

print(f"\nFound Send Report node at index {node_index}")
print(f"Current type: {send_report_node.get('type')}")

# Get the position to place new node nearby
old_position = send_report_node.get("position", [100, 300])
new_position = [old_position[0], old_position[1]]

# Update the node to use HTTP Request with Resend API
send_report_node["type"] = "n8n-nodes-base.httpRequest"
send_report_node["parameters"] = {
    "url": "https://api.resend.com/emails",
    "method": "POST",
    "authentication": "generic",
    "genericAuthType": "httpHeaderAuth",
    "headerParametersUI": {
        "parameter": [
            {
                "name": "Authorization",
                "value": f"Bearer {RESEND_API_KEY}"
            }
        ]
    },
    "bodyParametersUI": {
        "parameter": [
            {
                "name": "from",
                "value": "audit@nexus.store"
            },
            {
                "name": "to",
                "value": "caspertech92@gmail.com"
            },
            {
                "name": "subject",
                "value": "🤖 Weekly Site Audit Report"
            },
            {
                "name": "html",
                "value": "={{ $json.body.candidates[0].content.parts[0].text }}"
            }
        ]
    },
    "contentType": "application/json",
    "options": {}
}

print(f"\n✅ Updated node type to: n8n-nodes-base.httpRequest")
print(f"✅ Configured Resend API endpoint")
print(f"✅ Set Authorization header with Resend API key")
print(f"✅ Configured body parameters:")
print(f"   - from: audit@nexus.store")
print(f"   - to: caspertech92@gmail.com")
print(f"   - subject: 🤖 Weekly Site Audit Report")
print(f"   - html: Report data from Gemini")

# Save workflow
patch_resp = session.patch(
    f"{N8N_URL}/rest/workflows/{workflow_id}",
    json={
        "nodes": wf_data.get("nodes", []),
        "connections": wf_data.get("connections", {})
    },
    headers=headers
)

if patch_resp.status_code in [200, 204]:
    print(f"\n✅ Workflow saved! (Status: {patch_resp.status_code})")
    print("\n" + "="*70)
    print("RESEND API INTEGRATION COMPLETE!")
    print("="*70)
    print("\n✅ Send Report node now uses Resend API")
    print("✅ API Key: Embedded in Authorization header")
    print("✅ Ready for production email delivery")
    print("\n🚀 READY TO TEST:")
    print("  1. Go to: http://localhost:5678/workflow/4QBqdYgThkCInHD1")
    print("  2. Refresh page (Ctrl+R)")
    print("  3. Click 'Execute workflow'")
    print("  4. Email will be sent via Resend API ✅")
else:
    print(f"❌ Save failed: {patch_resp.status_code}")
    print(patch_resp.text)
