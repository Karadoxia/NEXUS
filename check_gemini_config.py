#!/usr/bin/env python3
"""
Check EXACT Gemini node configuration in n8n
"""
import requests
import json
import sys

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
login_response = session.post(
    f"{N8N_URL}/rest/login",
    json={"emailOrLdapLoginId": EMAIL, "password": PASSWORD},
    headers=headers
)

if login_response.status_code != 200:
    print(f"❌ Login failed")
    sys.exit(1)

print("✅ Logged in")

# Get workflows
workflows_response = session.get(f"{N8N_URL}/rest/workflows", headers=headers)
workflows = workflows_response.json().get("data", [])

target_workflow = None
for wf in workflows:
    if "Full Site Audit Bot" in wf.get("name"):
        target_workflow = wf
        break

if not target_workflow:
    print("❌ Workflow not found")
    sys.exit(1)

workflow_id = target_workflow.get("id")
print(f"✅ Found workflow: {target_workflow.get('name')}")

# Get workflow details
print(f"\n[2] Fetching workflow details...")
details_response = session.get(f"{N8N_URL}/rest/workflows/{workflow_id}", headers=headers)
workflow = details_response.json().get("data", {})

nodes = workflow.get("nodes", [])

# Find Gemini node
gemini_node = None
for node in nodes:
    if "Gemini" in node.get("name"):
        gemini_node = node
        break

if not gemini_node:
    print("❌ Gemini node not found")
    sys.exit(1)

print(f"✅ Found Gemini node: {gemini_node.get('name')}")
print(f"   Node ID: {gemini_node.get('id')}")
print(f"   Node Type: {gemini_node.get('type')}")

print(f"\n[3] EXACT NODE PARAMETERS:")
print("="*70)

params = gemini_node.get("parameters", {})
for key, value in params.items():
    if key == "body":
        print(f"\n{key}:")
        try:
            body_obj = json.loads(value)
            print(json.dumps(body_obj, indent=2))
        except:
            print(f"  (raw) {value[:200]}...")
    else:
        print(f"{key}: {value}")

print("\n[4] CHECKING FOR ISSUES:")
print("="*70)

# Check URL
url = params.get("url", "")
print(f"\nURL: {url}")

if "gemini-2.5-flash" in url:
    print("✅ Using correct model: gemini-2.5-flash")
elif "gemini-2-0-flash" in url or "gemini-1.5-flash" in url:
    print("❌ Using OLD model - needs update!")
else:
    print("⚠️  Unknown model in URL")

# Check method
method = params.get("method", "")
if method == "POST":
    print(f"✅ Using POST method")
else:
    print(f"❌ Wrong method: {method}")

# Check headers
headers_param = params.get("sendHeaders", None)
print(f"\nSending headers: {headers_param}")

# Check authentication
use_auth = params.get("useAuth", "")
print(f"Using authentication: {use_auth}")

# Try one more simple test with Python directly
print(f"\n[5] TESTING API CALL:")
print("="*70)

import requests
from pathlib import Path

gemini_key = None
for path in ["/home/redbend/Desktop/Local-Projects/NEXUS-V2/000-MyNotes/APIs/GEMINI-API"]:
    if Path(path).exists():
        with open(path, 'r') as f:
            content = f.read().strip()
            if content.startswith("AIza"):
                gemini_key = content.split('\n')[0].strip()
                break

if gemini_key:
    print(f"API Key found: {gemini_key[:20]}...")
    
    # Extract the exact URL from n8n node
    test_url = url.replace("{{ $env.GEMINI_API_KEY }}", gemini_key)
    
    # Parse body
    try:
        body_obj = json.loads(params.get("body", "{}"))
    except:
        body_obj = {}
    
    print(f"\nTesting URL: {test_url[:80]}...")
    print(f"Body: {json.dumps(body_obj, indent=2)[:300]}...\n")
    
    try:
        test_response = requests.post(
            test_url,
            json=body_obj,
            headers={"Content-Type": "application/json"},
            timeout=20
        )
        
        print(f"Response Status: {test_response.status_code}")
        
        if test_response.status_code == 200:
            print("✅ API CALL SUCCEEDED!")
            result = test_response.json()
            if 'candidates' in result and result['candidates']:
                text = result['candidates'][0]['content']['parts'][0]['text']
                print(f"Response preview: {text[:100]}...")
        else:
            print(f"❌ API CALL FAILED")
            print(f"Error response:")
            print(test_response.text[:500])
    except Exception as e:
        print(f"❌ Exception: {e}")
else:
    print("❌ API key not found")

print("\n" + "="*70)
