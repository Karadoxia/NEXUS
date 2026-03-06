#!/usr/bin/env python3
"""
Debug - get the exact Send Report node configuration and workflow structure
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
print("WORKFLOW STRUCTURE AND NODE CONNECTIONS")
print("="*70)

print("\nNodes in workflow:")
for idx, node in enumerate(wf_data.get("nodes", [])):
    print(f"\n{idx}. {node.get('name')} (Type: {node.get('type')})")
    node_type = node.get('type', '')
    if 'httpRequest' in node_type or 'emailSend' in node_type:
        params = node.get('parameters', {})
        print(f"   URL: {params.get('url', 'N/A')}")
        print(f"   Method: {params.get('method', 'N/A')}")

print("\n" + "="*70)
print("SEND REPORT NODE FULL CONFIG")
print("="*70)

send_report_node = None
for node in wf_data.get("nodes", []):
    if node.get("name") == "Send Report":
        send_report_node = node
        break

if send_report_node:
    print(json.dumps(send_report_node, indent=2))
else:
    print("❌ Send Report node not found!")

print("\n" + "="*70)
print("CONNECTIONS")
print("="*70)
connections = wf_data.get("connections", {})
print(json.dumps(connections, indent=2))

print("\n" + "="*70)
print("ANALYSIS")
print("="*70)
print("\n⚠️ Error: 'Cannot read properties of undefined (reading 'status')'")
print("This suggests:")
print("  1. Response is not being handled properly")
print("  2. Node configuration might need 'Continue on Fail' or response handling")
print("  3. The next node might be expecting .status property")
