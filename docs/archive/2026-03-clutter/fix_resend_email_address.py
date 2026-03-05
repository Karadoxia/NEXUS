#!/usr/bin/env python3
"""
Fix Send Report - use correct Resend testing email address
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
print("FIXING SEND REPORT - CORRECT RESEND EMAIL ADDRESS")
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

print(f"\n⚠️ Issue: Resend only allows sending to caspertech78@gmail.com in test mode")
print(f"✅ Solution: Change 'to' email to the correct address\n")

# Update the body with correct email
new_body = {
    "from": "onboarding@resend.dev",
    "to": "caspertech78@gmail.com",  # Correct test email
    "subject": "🤖 Weekly Site Audit Report",
    "html": "={{ $json.body.candidates[0].content.parts[0].text }}"
}

send_report_node["parameters"]["body"] = json.dumps(new_body)

print("✅ Updated Send Report node:")
print(f"   - From: onboarding@resend.dev")
print(f"   - To: caspertech78@gmail.com (Resend testing email)")
print(f"   - Subject: 🤖 Weekly Site Audit Report")

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
    print("RESEND EMAIL FIX COMPLETE!")
    print("="*70)
    print("\n🚀 TEST NOW:")
    print("  1. Go to: http://localhost:5678/workflow/4QBqdYgThkCInHD1")
    print("  2. Refresh page (Ctrl+R)")
    print("  3. Click 'Execute workflow'")
    print("  4. Email will be sent to caspertech78@gmail.com ✅")
else:
    print(f"❌ Save failed: {patch_resp.status_code}")
    print(patch_resp.text)
