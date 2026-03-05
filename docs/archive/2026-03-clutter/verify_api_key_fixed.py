#!/usr/bin/env python3
"""
Verify the API key is now in the URL
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

login_resp = session.post(
    f"{N8N_URL}/rest/login",
    json={"emailOrLdapLoginId": EMAIL, "password": PASSWORD},
    headers=headers
)

workflow_id = "4QBqdYgThkCInHD1"
wf_resp = session.get(f"{N8N_URL}/rest/workflows/{workflow_id}", headers=headers)
wf = wf_resp.json().get("data", {})

gemini_node = None
for node in wf.get("nodes", []):
    if "Gemini" in node.get("name"):
        gemini_node = node
        break

url = gemini_node.get("parameters", {}).get("url", "")

print("="*70)
print("VERIFICATION - API KEY FIXED")
print("="*70)
print(f"\nGemini Node URL:")
print(f"{url}\n")

if "AIza" in url:
    print("✅ API key is EMBEDDED in URL")
    print(f"✅ Ready to execute!")
    print("\n🚀 TEST NOW:")
    print("  1. Go to: http://localhost:5678/workflow/4QBqdYgThkCInHD1")
    print("  2. Refresh page (Ctrl+R)")
    print("  3. Click 'Execute workflow'")
    print("  4. Watch Gemini node execute ✅")
else:
    print("❌ API key NOT found in URL")
    print("❌ Still using placeholder")

print("\n" + "="*70)
