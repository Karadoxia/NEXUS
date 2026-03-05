#!/usr/bin/env python3
"""
Check credentials configuration for both Send Report and Notify Completion nodes
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
wf_resp = session.get(f"{N8N_URL}/rest/workflows/{workflow_id}", headers=headers)
wf_data = wf_resp.json().get("data", {})

print("="*70)
print("CHECKING NODE CREDENTIALS")
print("="*70)

# Check all nodes
for node in wf_data.get("nodes", []):
    node_name = node.get("name", "")
    node_type = node.get("type", "")
    credentials = node.get("credentials", {})
    
    if node_name in ["Send Report", "Notify Completion"]:
        print(f"\n{node_name}:")
        print(f"  Type: {node_type}")
        print(f"  Has credentials: {bool(credentials)}")
        
        if credentials:
            print(f"  Credentials:")
            for cred_type, cred_id_dict in credentials.items():
                cred_id = cred_id_dict.get("id", "")
                cred_name = cred_id_dict.get("name", "")
                print(f"    - {cred_type}: {cred_name} (ID: {cred_id})")
        
        # Check parameters
        params = node.get("parameters", {})
        
        if node_name == "Send Report":
            print(f"\n  Parameters check:")
            print(f"    - URL: {params.get('url', 'NOT SET')}")
            print(f"    - Method: {params.get('method', 'NOT SET')}")
            print(f"    - Authentication: {params.get('authentication', 'NOT SET')}")
            headers_config = params.get("headerParametersUI", {}).get("parameter", [])
            if headers_config:
                print(f"    - Has Authorization header: YES")
            else:
                print(f"    - Has Authorization header: NO")
                
        elif node_name == "Notify Completion":
            print(f"\n  Parameters check:")
            print(f"    - chatId: {params.get('chatId', 'NOT SET')}")

print("\n" + "="*70)
print("ISSUE ANALYSIS")
print("="*70)

print("\nPossible issues:")
print("1. Send Report: HTTP node trying to use old credentials (remove them)")
print("2. Notify Completion: Using old Telegram credential (using direct chat ID instead)")
print("\n✅ Solution: Make sure nodes don't have old credentials attached")
