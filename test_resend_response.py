#!/usr/bin/env python3
"""
Test Resend API call with exact params from workflow to debug response
"""
import requests
import json

RESEND_API_KEY = "re_C51jKwtZ_DeLcpK5JcX6mEp7YmD4ecDk6"

print("="*70)
print("TESTING RESEND API RESPONSE STRUCTURE")
print("="*70)

payload = {
    "from": "onboarding@resend.dev",
    "to": "caspertech92@gmail.com",
    "subject": "🤖 Weekly Site Audit Report",
    "html": "<p>Test report content here</p>"
}

headers = {
    "Authorization": f"Bearer {RESEND_API_KEY}",
    "Content-Type": "application/json"
}

print(f"\nRequest:")
print(f"  URL: https://api.resend.com/emails")
print(f"  Method: POST")
print(f"  Auth: Bearer token")
print(f"  Body: {json.dumps(payload, indent=2)}")

response = requests.post(
    "https://api.resend.com/emails",
    json=payload,
    headers=headers
)

print(f"\n" + "="*70)
print(f"RESPONSE")
print(f"="*70)
print(f"Status Code: {response.status_code}")
print(f"Status: {response.reason}")
print(f"Headers: {dict(response.headers)}")
print(f"\nBody:")
print(json.dumps(response.json(), indent=2))

print(f"\n" + "="*70)
print("WHAT N8N HTTP NODE WILL RETURN:")
print("="*70)
print(f"""
The n8n HTTP Request node will return (simplified):
{{
  "status": {response.status_code},
  "statusText": "{response.reason}",
  "headers": {{ ... }},
  "body": {json.dumps(response.json())}
}}

✅ If status is 200, the node succeeds
❌ If anything goes wrong, the node fails
""")

# Check if body has expected properties
resp_json = response.json()
if response.status_code == 200:
    print("\n✅ API response is 200 OK")
    print(f"✅ Response has these keys: {list(resp_json.keys())}")
    if "id" in resp_json:
        print(f"✅ Email ID: {resp_json['id']}")
        print("\n✅ This response should work fine in n8n!")
elif response.status_code == 403:
    print("\n❌ API returned 403 - domain not verified")
    print(f"Error: {resp_json.get('message', 'Unknown error')}")
else:
    print(f"\n❌ API returned {response.status_code}")
