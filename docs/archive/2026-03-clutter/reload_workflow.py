#!/usr/bin/env python3
"""
Force workflow reload and activate it
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

for wf in workflows:
    if "Full Site Audit Bot" not in wf.get("name"):
        continue
    
    workflow_id = wf.get("id")
    workflow_name = wf.get("name")
    
    print(f"\n→ {workflow_name} (ID: {workflow_id})")
    
    # Get latest version
    details_response = session.get(f"{N8N_URL}/rest/workflows/{workflow_id}", headers=headers)
    workflow = details_response.json().get("data", {})
    
    print(f"  Current status: {workflow.get('active')}")
    
    # Deactivate and reactivate to force reload
    print(f"  [Step 1] Deactivating...")
    deactivate_response = session.patch(
        f"{N8N_URL}/rest/workflows/{workflow_id}",
        json={"active": False},
        headers=headers
    )
    
    if deactivate_response.status_code in [200, 201]:
        print(f"  ✅ Deactivated")
    else:
        print(f"  ⚠️  Deactivate status: {deactivate_response.status_code}")
    
    print(f"  [Step 2] Reactivating...")
    activate_response = session.patch(
        f"{N8N_URL}/rest/workflows/{workflow_id}",
        json={"active": True},
        headers=headers
    )
    
    if activate_response.status_code in [200, 201]:
        print(f"  ✅ Reactivated")
    else:
        print(f"  ⚠️  Activate status: {activate_response.status_code}")

print("\n" + "="*70)
print("""
✅ Workflows have been refreshed!

🚀 Now test the workflow:
   1. Go to: http://localhost:5678/workflow
   2. SELECT "Full Site Audit Bot"
   3. Click "Execute workflow" button
   4. Watch for the result

The Gemini node should now work without "Bad request" error!
""")
print("="*70)
