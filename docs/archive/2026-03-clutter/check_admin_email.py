#!/usr/bin/env python3
"""
Check ADMIN_EMAIL environment variable and fix if needed
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

# Get all environment variables
env_resp = session.get(f"{N8N_URL}/rest/variables", headers=headers)
env_data = env_resp.json()

print("="*70)
print("CHECKING ENVIRONMENT VARIABLES")
print("="*70)
print(f"\nStatus: {env_resp.status_code}")

if env_resp.status_code == 200:
    variables = env_data.get("data", [])
    print(f"Total variables: {len(variables)}\n")
    
    admin_email_found = False
    for var in variables:
        var_name = var.get("key", "")
        var_value = var.get("value", "")
        if "ADMIN" in var_name or "EMAIL" in var_name:
            print(f"  {var_name} = {var_value}")
            if "ADMIN_EMAIL" in var_name:
                admin_email_found = True
    
    if not admin_email_found:
        print("\n⚠️ ADMIN_EMAIL not found in environment variables!")
        print("This is the same issue as Gemini API key - placeholder not resolved.\n")
        print("Solution: Replace {{ $env.ADMIN_EMAIL }} with direct email address")
    else:
        print("\n✅ ADMIN_EMAIL found in environment variables")
else:
    print(f"❌ Failed to get variables: {env_resp.status_code}")

# Now try to check the actual credential being used
print("\n" + "="*70)
print("CHECKING SEND REPORT NODE CONFIGURATION")
print("="*70)

workflow_id = "4QBqdYgThkCInHD1"
wf_resp = session.get(f"{N8N_URL}/rest/workflows/{workflow_id}", headers=headers)
wf = wf_resp.json().get("data", {})

for node in wf.get("nodes", []):
    if node.get("name") == "Send Report":
        toEmail = node.get("parameters", {}).get("toEmail", "")
        print(f"\nCurrent toEmail value: {toEmail}")
        
        if "{{" in toEmail and "$env" in toEmail:
            print("\n⚠️ Using environment variable placeholder")
            print("This may not resolve in n8n email node")
            print("\nFIX: Replace with direct email address")
            print(f"Suggested: caspertech92@gmail.com")
        break
