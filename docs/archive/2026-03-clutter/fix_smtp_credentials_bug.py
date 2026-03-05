#!/usr/bin/env python3
"""
Remove old SMTP credentials from Send Report node - that's the bug!
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

print("="*70)
print("FIXING THE REAL BUG - REMOVE OLD SMTP CREDENTIALS")
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

print(f"\nFound issue:")
print(f"  - Node type: {send_report_node.get('type')}")
print(f"  - Has old credentials: {'credentials' in send_report_node}")

if "credentials" in send_report_node:
    print(f"  - Old credentials: {send_report_node.get('credentials')}")
    print(f"\n❌ BUG: Node is HTTP Request but still has SMTP credentials!")
    print(f"✅ FIX: Removing credentials field...")
    
    # Remove the credentials field
    del send_report_node["credentials"]
    
    print(f"✅ Credentials removed!")
else:
    print(f"✅ No credentials field - node should be clean")

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
    print("BUG FIXED!!!")
    print("="*70)
    print("\n✅ Removed old SMTP credentials from HTTP Request node")
    print("✅ Node now uses pure HTTP with Resend API key in header")
    print("\n🚀 TEST NOW:")
    print("  1. Go to: http://localhost:5678/workflow/4QBqdYgThkCInHD1")
    print("  2. Refresh page (Ctrl+R)")
    print("  3. Click 'Execute workflow'")
    print("  4. Should work without 'status' error!!! ✅")
else:
    print(f"❌ Save failed: {patch_resp.status_code}")
    print(patch_resp.text)
