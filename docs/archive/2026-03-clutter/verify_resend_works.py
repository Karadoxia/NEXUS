#!/usr/bin/env python3
"""
Verify Resend API works with correct email address
"""
import requests
import json

RESEND_API_KEY = "re_C51jKwtZ_DeLcpK5JcX6mEp7YmD4ecDk6"

print("="*70)
print("TESTING RESEND API WITH CORRECT EMAIL")
print("="*70)

payload = {
    "from": "onboarding@resend.dev",
    "to": "caspertech78@gmail.com",  # Correct email
    "subject": "🤖 Weekly Site Audit Report",
    "html": "<h1>Audit Report</h1><p>This is a test report.</p>"
}

headers = {
    "Authorization": f"Bearer {RESEND_API_KEY}",
    "Content-Type": "application/json"
}

print(f"\nRequest:")
print(f"  To: caspertech78@gmail.com")
print(f"  Subject: 🤖 Weekly Site Audit Report")

response = requests.post(
    "https://api.resend.com/emails",
    json=payload,
    headers=headers
)

print(f"\nResponse:")
print(f"  Status: {response.status_code}")
print(f"  Body: {json.dumps(response.json(), indent=2)}")

if response.status_code == 200:
    print(f"\n✅ API WORKS! Email sent successfully")
    print(f"✅ Email ID: {response.json().get('id')}")
    print(f"\n✅ The HTTP node in n8n should also return 200")
    print(f"✅ This means the workflow should succeed")
else:
    print(f"\n❌ API returned {response.status_code}")
    print(f"Error: {response.json().get('message', 'Unknown error')}")
