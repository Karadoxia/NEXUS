#!/usr/bin/env python3
"""
Get EXACT node parameters and test them exactly as n8n would send them
"""
import requests
import json
import sys
from pathlib import Path

EMAIL = "caspertech92@gmail.com"
PASSWORD = "C@sper@22032011"
N8N_URL = "http://localhost:5678"
N8N_HOST = "nexus-n8n.local"

session = requests.Session()
headers = {
    "Content-Type": "application/json",
    "Host": N8N_HOST
}

print("[1] Logging in...")
login_resp = session.post(
    f"{N8N_URL}/rest/login",
    json={"emailOrLdapLoginId": EMAIL, "password": PASSWORD},
    headers=headers
)

if login_resp.status_code != 200:
    print(f"❌ Login failed")
    sys.exit(1)

print("✅ Logged in")

workflow_id = "4QBqdYgThkCInHD1"

# Get workflow
wf_resp = session.get(f"{N8N_URL}/rest/workflows/{workflow_id}", headers=headers)
wf = wf_resp.json().get("data", {})

# Find Gemini node
gemini_node = None
for node in wf.get("nodes", []):
    if "Gemini" in node.get("name"):
        gemini_node = node
        break

if not gemini_node:
    print("❌ Gemini node not found")
    sys.exit(1)

print(f"\n[2] GEMINI NODE PARAMETERS:")
print("="*70)

params = gemini_node.get("parameters", {})

# Show all parameters
for key, value in params.items():
    if key == "body" or key == "jsonBody":
        print(f"\n{key} (type: {type(value).__name__}):")
        if isinstance(value, dict):
            print(json.dumps(value, indent=2))
        elif isinstance(value, str):
            try:
                parsed = json.loads(value)
                print(json.dumps(parsed, indent=2))
            except:
                print(f"  {value[:200]}...")
    else:
        val_str = str(value)[:100] if value else "None"
        print(f"{key}: {val_str}")

# Get API key
gemini_key = None
for path in ["/home/redbend/Desktop/Local-Projects/NEXUS-V2/000-MyNotes/APIs/GEMINI-API"]:
    if Path(path).exists():
        with open(path, 'r') as f:
            content = f.read().strip()
            if content.startswith("AIza"):
                gemini_key = content.split('\n')[0].strip()
                break

if not gemini_key:
    print("\n❌ API key not found")
    sys.exit(1)

print(f"\n[3] TESTING WITH EXACT PARAMETERS:")
print("="*70)

# Get the exact URL from the node
url = params.get("url", "")
if "$env.GEMINI_API_KEY" in url:
    url = url.replace("{{ $env.GEMINI_API_KEY }}", gemini_key)
    print(f"URL (with key): {url[:80]}...")
else:
    print(f"URL: {url}")

# Get the body
test_body = None
if "jsonBody" in params:
    test_body = params.get("jsonBody")
    print(f"Body source: jsonBody (type: {type(test_body).__name__})")
elif "body" in params:
    body_str = params.get("body")
    print(f"Body source: body string")
    try:
        test_body = json.loads(body_str)
    except:
        test_body = {"error": "Could not parse body"}

print(f"\nBody structure:")
print(json.dumps(test_body, indent=2)[:400])

# Check body validity
if isinstance(test_body, dict) and "contents" in test_body:
    contents = test_body["contents"]
    if contents and isinstance(contents[0], dict):
        print(f"\nContents[0] keys: {list(contents[0].keys())}")
        if "role" in contents[0]:
            print(f"✅ Has 'role': {contents[0]['role']}")
        else:
            print(f"❌ MISSING 'role' field!")
        if "parts" in contents[0]:
            print(f"✅ Has 'parts'")
        else:
            print(f"❌ MISSING 'parts' field!")

# Test the API call
print(f"\n[4] TESTING API CALL:")
print("-"*70)

try:
    api_response = requests.post(
        url,
        json=test_body,
        headers={"Content-Type": "application/json"},
        timeout=30
    )
    
    print(f"Status: {api_response.status_code}")
    
    if api_response.status_code == 200:
        print("✅ API CALL SUCCESS!")
        result = api_response.json()
        if 'candidates' in result:
            text = result['candidates'][0]['content']['parts'][0]['text']
            print(f"\nReport generated (first 300 chars):")
            print(text[:300])
    else:
        print(f"❌ API CALL FAILED!")
        try:
            error = api_response.json()
            print(json.dumps(error, indent=2))
        except:
            print(api_response.text[:300])
            
except Exception as e:
    print(f"❌ Error: {e}")

print("\n" + "="*70)
print("NEXT: If API test succeeded above but n8n fails,")
print("the problem is in how n8n sends the request.")
print("="*70)
