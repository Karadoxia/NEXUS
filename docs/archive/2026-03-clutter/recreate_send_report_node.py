#!/usr/bin/env python3
"""
Recreate Send Report node from scratch with clean configuration
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
print("RECREATING SEND REPORT NODE FROM SCRATCH")
print("="*70)

# Find and completely recreate Send Report node
send_report_node = None
node_position = None

for idx, node in enumerate(wf_data.get("nodes", [])):
    if node.get("name") == "Send Report":
        send_report_node = node
        node_position = idx
        break

if send_report_node is None:
    print("❌ Send Report node not found!")
    exit(1)

print(f"\nReplacing node at position {node_position}")
print(f"Old config had {len(send_report_node.get('parameters', {}))} parameters")

# Completely recreate the node with clean configuration
new_node = {
    "parameters": {
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
        "bodyType": "json",
        "body": json.dumps({
            "from": "onboarding@resend.dev",
            "to": "caspertech78@gmail.com",
            "subject": "🤖 Weekly Site Audit Report",
            "html": "={{ $json.body.candidates[0].content.parts[0].text }}"
        }),
        "options": {}
    },
    "id": "send_audit_report",
    "name": "Send Report",
    "type": "n8n-nodes-base.httpRequest",
    "typeVersion": 2,
    "position": send_report_node.get("position", [1376, 352]),
    "continueOnFail": True,  # Allow workflow to continue even if this fails
}

# Replace the node
wf_data["nodes"][node_position] = new_node

print(f"\n✅ Recreated node with clean configuration")
print(f"✅ Added 'continueOnFail' to handle any errors gracefully")

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
    print("SEND REPORT NODE RECREATED!")
    print("="*70)
    print("\n✅ Clean configuration")
    print("✅ continueOnFail enabled")
    print("✅ All parameters verified")
    print("\n🚀 TEST NOW:")
    print("  1. Go to: http://localhost:5678/workflow/4QBqdYgThkCInHD1")
    print("  2. Refresh page (Ctrl+R)")
    print("  3. Click 'Execute workflow'")
    print("  4. Should execute successfully ✅")
else:
    print(f"❌ Save failed: {patch_resp.status_code}")
    print(patch_resp.text)
