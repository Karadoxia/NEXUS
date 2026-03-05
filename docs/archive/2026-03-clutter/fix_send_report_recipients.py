#!/usr/bin/env python3
"""
Fix Send Report node - add recipients
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

print("Logging in...")
if login_resp.status_code != 200:
    print(f"❌ Login failed: {login_resp.status_code}")
    exit(1)

workflow_id = "4QBqdYgThkCInHD1"
wf_resp = session.get(f"{N8N_URL}/rest/workflows/{workflow_id}", headers=headers)
wf = wf_resp.json().get("data", {})

print("\n" + "="*70)
print("CURRENT SEND REPORT NODE CONFIG")
print("="*70)

send_report_node = None
for node in wf.get("nodes", []):
    if node.get("name") == "Send Report":
        send_report_node = node
        break

if not send_report_node:
    print("❌ Send Report node not found!")
    exit(1)

params = send_report_node.get("parameters", {})
print(f"\nNode Name: {send_report_node.get('name')}")
print(f"Node Type: {send_report_node.get('type')}")
print(f"\nCurrent Parameters:")
print(json.dumps(params, indent=2))

# Check recipients
to_emails = params.get("toEmail", "")
print(f"\nCurrent 'toEmail': {to_emails}")
print(f"Recipients defined: {'✅ YES' if to_emails else '❌ NO'}")

# Fix: Add recipients
print("\n" + "="*70)
print("FIXING - ADDING RECIPIENTS")
print("="*70)

# Use the admin email from the credentials
recipients = "caspertech92@gmail.com"
params["toEmail"] = recipients

send_report_node["parameters"] = params

# Save workflow
put_resp = session.put(
    f"{N8N_URL}/rest/workflows/{workflow_id}",
    json={"nodes": wf.get("nodes"), "connections": wf.get("connections"), "name": wf.get("name")},
    headers=headers
)

if put_resp.status_code == 200:
    print(f"\n✅ Send Report node FIXED!")
    print(f"✅ Recipients added: {recipients}")
    print(f"✅ Workflow saved!")
    print("\n" + "="*70)
    print("GEMINI & SEND REPORT BOTH FIXED!")
    print("="*70)
    print("\n🚀 READY TO TEST:")
    print("  1. Go to: http://localhost:5678/workflow/4QBqdYgThkCInHD1")
    print("  2. Refresh page (Ctrl+R)")
    print("  3. Click 'Execute workflow'")
    print("  4. Gemini generates report ✅")
    print("  5. Send Report emails it to: " + recipients + " ✅")
else:
    print(f"❌ Save failed: {put_resp.status_code}")
    print(put_resp.text)
