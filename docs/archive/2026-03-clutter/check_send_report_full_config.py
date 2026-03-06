#!/usr/bin/env python3
"""
Check if Send Report node has 'continue on error' or other settings that might be causing issues
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
print("SEND REPORT NODE - FULL DETAILED CONFIG")
print("="*70)

send_report_node = None
for node in wf_data.get("nodes", []):
    if node.get("name") == "Send Report":
        send_report_node = node
        break

if send_report_node:
    print(json.dumps(send_report_node, indent=2))
    
    # Check specific fields
    print("\n" + "="*70)
    print("KEY FIELDS:")
    print("="*70)
    
    params = send_report_node.get("parameters", {})
    print(f"\nURL: {params.get('url')}")
    print(f"Method: {params.get('method')}")
    print(f"Authentication: {params.get('authentication')}")
    print(f"Continue on Fail: {send_report_node.get('continueOnFail', 'NOT SET')}")
    print(f"Execute Once: {send_report_node.get('executeOnce', 'NOT SET')}")
    print(f"Retry On Output: {send_report_node.get('retryOnOutput', 'NOT SET')}")
    print(f"Notice: {send_report_node.get('notice', {})}")
    
    # Check if there are any issues with response handling
    print(f"\nResponse Format: {params.get('responseFormat', 'NOT SET')}")
    print(f"Options: {params.get('options', {})}")
    
    print("\n" + "="*70)
    print("POTENTIAL ISSUES:")
    print("="*70)
    
    # The error happens when n8n tries to read 'status' from the response
    # This could be because:
    # 1. The response isn't being parsed correctly
    # 2. The node is set to "continue on fail" which might affect response
    # 3. Error handling in n8n is looking for .status when response is undefined
    
    print("\n⚠️ Error: Cannot read properties of undefined (reading 'status')")
    print("This means something is trying to access .status on undefined")
    print("\nPossible causes:")
    print("1. Response object is not properly formed")
    print("2. Response parsing is failing")
    print("3. The HTTP node's output format is broken")
    print("\n✅ Solution: Reset node configuration from scratch")
else:
    print("❌ Send Report node not found!")
