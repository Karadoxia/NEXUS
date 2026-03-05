#!/usr/bin/env python3
"""
Test Resend API authorization with the exact key we're using
"""
import requests
import json

RESEND_API_KEY = "re_C51jKwtZ_DeLcpK5JcX6mEp7YmD4ecDk6"

print("="*70)
print("TESTING RESEND API AUTHORIZATION")
print("="*70)

# Test 1: Direct API call
print("\n1. Testing direct Resend API call...")
payload = {
    "from": "onboarding@resend.dev",
    "to": "caspertech78@gmail.com",
    "subject": "Test",
    "html": "<p>Test</p>"
}

headers = {
    "Authorization": f"Bearer {RESEND_API_KEY}",
    "Content-Type": "application/json"
}

response = requests.post(
    "https://api.resend.com/emails",
    json=payload,
    headers=headers
)

print(f"   Status: {response.status_code}")
if response.status_code == 200:
    print(f"   ✅ API key is VALID")
    print(f"   ✅ Response: {response.json()}")
elif response.status_code == 401 or response.status_code == 403:
    print(f"   ❌ Authorization failed!")
    print(f"   Error: {response.json()}")
else:
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.json()}")

# Test 2: Check if API key format is correct
print(f"\n2. Checking API key format...")
print(f"   Key: {RESEND_API_KEY}")
print(f"   Starts with 're_': {RESEND_API_KEY.startswith('re_')}")
print(f"   Length: {len(RESEND_API_KEY)}")

if RESEND_API_KEY.startswith('re_') and len(RESEND_API_KEY) > 10:
    print(f"   ✅ Key format looks valid")
else:
    print(f"   ❌ Key format might be invalid")

# Test 3: Check n8n node configuration
print(f"\n3. Checking n8n Send Report node...")

EMAIL = "caspertech92@gmail.com"
PASSWORD = "C@sper@22032011"
N8N_URL = "http://localhost:5678"
N8N_HOST = "nexus-n8n.local"

session = requests.Session()
n8n_headers = {
    "Content-Type": "application/json",
    "Host": N8N_HOST
}

# Login
login_resp = session.post(
    f"{N8N_URL}/rest/login",
    json={"emailOrLdapLoginId": EMAIL, "password": PASSWORD},
    headers=n8n_headers
)

workflow_id = "4QBqdYgThkCInHD1"
wf_resp = session.get(f"{N8N_URL}/rest/workflows/{workflow_id}", headers=n8n_headers)
wf_data = wf_resp.json().get("data", {})

send_report_node = None
for node in wf_data.get("nodes", []):
    if node.get("name") == "Send Report":
        send_report_node = node
        break

if send_report_node:
    params = send_report_node.get("parameters", {})
    headers_config = params.get("headerParametersUI", {}).get("parameter", [])
    
    for header in headers_config:
        if header.get("name") == "Authorization":
            auth_header = header.get("value", "")
            print(f"   Authorization header: {auth_header}")
            if RESEND_API_KEY in auth_header:
                print(f"   ✅ API key is in node configuration")
            else:
                print(f"   ❌ API key mismatch!")
else:
    print(f"   ❌ Send Report node not found!")

print("\n" + "="*70)
