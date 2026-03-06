#!/usr/bin/env python3
"""
Test Resend API directly to see actual response format
"""
import requests
import json

RESEND_API_KEY = "re_C51jKwtZ_DeLcpK5JcX6mEp7YmD4ecDk6"

print("="*70)
print("TESTING RESEND API DIRECTLY")
print("="*70)

# Test with simple HTML
payload = {
    "from": "audit@nexus.store",
    "to": "caspertech92@gmail.com",
    "subject": "Test Report",
    "html": "<h1>Test Report</h1><p>This is a test report from the workflow.</p>"
}

headers = {
    "Authorization": f"Bearer {RESEND_API_KEY}",
    "Content-Type": "application/json"
}

print("\nSending test email to Resend API...")
print(f"Payload: {json.dumps(payload, indent=2)}")

response = requests.post(
    "https://api.resend.com/emails",
    json=payload,
    headers=headers
)

print(f"\nStatus Code: {response.status_code}")
print(f"Response Headers: {dict(response.headers)}")
print(f"Response Body:")
print(json.dumps(response.json(), indent=2))

print("\n" + "="*70)
if response.status_code == 200:
    print("✅ Resend API works correctly!")
    print("\nResponse structure:")
    resp_json = response.json()
    print(json.dumps(resp_json, indent=2))
    if "id" in resp_json:
        print(f"✅ Email ID: {resp_json['id']}")
else:
    print(f"❌ API returned {response.status_code}")
    print("Error:", response.text)
