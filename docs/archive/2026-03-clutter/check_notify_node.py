#!/usr/bin/env python3
"""
Check Notify Completion node - it's probably looking for .status from Send Report
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
print("CHECKING NOTIFY COMPLETION NODE")
print("="*70)

notify_node = None
for node in wf_data.get("nodes", []):
    if "Notify" in node.get("name") or "Telegram" in node.get("type"):
        notify_node = node
        break

if notify_node:
    print("\nFound Notify node:")
    print(f"  Name: {notify_node.get('name')}")
    print(f"  Type: {notify_node.get('type')}")
    print(f"\nFull configuration:")
    print(json.dumps(notify_node, indent=2))
    
    # Check if it references .status from previous node
    node_str = json.dumps(notify_node)
    if "status" in node_str.lower():
        print("\n⚠️ Node references 'status' property!")
        print("❌ This is the bug! The Telegram node is looking for .status")
        print("   But HTTP Request returns different structure")
else:
    print("❌ Notify node not found!")
    print("\nAll nodes:")
    for node in wf_data.get("nodes", []):
        print(f"  - {node.get('name')} ({node.get('type')})")
