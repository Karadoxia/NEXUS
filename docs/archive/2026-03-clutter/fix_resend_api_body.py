#!/usr/bin/env python3
"""
Fix Send Report node - Resend API response handling
The issue is likely body format - Resend needs proper JSON, not form parameters
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
print("FIXING SEND REPORT NODE - RESEND API BODY FORMAT")
print("="*70)

# Find Send Report node
send_report_node = None
for node in wf_data.get("nodes", []):
    if node.get("name") == "Send Report":
        send_report_node = node
        break

if send_report_node is None:
    print("❌ Send Report node not found!")
    exit(1)

print(f"\nCurrent node configuration:")
print(json.dumps(send_report_node.get("parameters", {}), indent=2))

# The correct way to send data to Resend API is with a JSON body
# Not with bodyParametersUI
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
    "bodyType": "json",
    "body": json.dumps({
        "from": "audit@nexus.store",
        "to": "caspertech92@gmail.com",
        "subject": "🤖 Weekly Site Audit Report",
        "html": "={{ $json.body.candidates[0].content.parts[0].text }}"
    }),
    "options": {}
}

print(f"\n✅ Updated node parameters:")
print(f"   - Method: POST")
print(f"   - URL: https://api.resend.com/emails")
print(f"   - Auth: Bearer token in header")
print(f"   - Body type: JSON (not form parameters)")
print(f"   - Body includes: from, to, subject, html")

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
    print("RESEND API NODE FIXED!")
    print("="*70)
    print("\n✅ Using proper JSON body format for Resend API")
    print("✅ Bearer token authentication configured")
    print("\n🚀 TEST NOW:")
    print("  1. Go to: http://localhost:5678/workflow/4QBqdYgThkCInHD1")
    print("  2. Refresh page (Ctrl+R)")
    print("  3. Click 'Execute workflow'")
    print("  4. Should complete without 'status' errors ✅")
else:
    print(f"❌ Save failed: {patch_resp.status_code}")
    print(patch_resp.text)
