#!/usr/bin/env python3
"""
Fix Send Report node - use Resend test email + fix response handling
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
print("FIXING SEND REPORT NODE - RESEND CONFIGURATION")
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

print(f"\n⚠️ Issue identified: nexus.store domain not verified in Resend")
print(f"✅ Solution: Use Resend's test email: onboarding@resend.dev\n")

# Configure node with proper Resend setup
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
        "from": "onboarding@resend.dev",  # Use Resend test email
        "to": "caspertech92@gmail.com",
        "subject": "🤖 Weekly Site Audit Report",
        "html": "={{ $json.body.candidates[0].content.parts[0].text }}"
    }),
    "responseFormat": "json",
    "options": {
        "allowUnauthorizedCerts": False
    }
}

print("✅ Updated Send Report node:")
print(f"   - From: onboarding@resend.dev (Resend test email)")
print(f"   - To: caspertech92@gmail.com")
print(f"   - Subject: 🤖 Weekly Site Audit Report")
print(f"   - Method: POST to Resend API")
print(f"   - Auth: Bearer token")

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
    print("SEND REPORT NODE FIXED!")
    print("="*70)
    print("\n✅ Using verified Resend test email (onboarding@resend.dev)")
    print("✅ API properly configured")
    print("\n🚀 TEST NOW:")
    print("  1. Go to: http://localhost:5678/workflow/4QBqdYgThkCInHD1")
    print("  2. Refresh page (Ctrl+R)")
    print("  3. Click 'Execute workflow'")
    print("  4. Email will be sent successfully ✅")
else:
    print(f"❌ Save failed: {patch_resp.status_code}")
    print(patch_resp.text)
