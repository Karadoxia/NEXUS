#!/usr/bin/env python3
"""
Verify the n8n workflow has the correct body saved
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
    
    print(f"\n→ {workflow_name}")
    print(f"  ID: {workflow_id}")
    
    # Get workflow details
    details_response = session.get(f"{N8N_URL}/rest/workflows/{workflow_id}", headers=headers)
    workflow = details_response.json().get("data", {})
    
    nodes = workflow.get("nodes", [])
    
    # Find Gemini node
    for node in nodes:
        if "Gemini" in node.get("name", ""):
            print(f"  Node: {node.get('name')}")
            
            params = node.get("parameters", {})
            
            # Check the body
            if "jsonBody" in params:
                body = params.get("jsonBody")
                if isinstance(body, dict):
                    contents = body.get("contents", [])
                    if contents:
                        has_role = "role" in contents[0]
                        print(f"    ✅ Has 'role' field: {has_role}")
                        if has_role:
                            print(f"    Role value: {contents[0].get('role')}")
                        else:
                            print(f"    ❌ MISSING 'role' field - FIX NOT SAVED!")
                            
            elif "body" in params:
                body_str = params.get("body")
                try:
                    body_obj = json.loads(body_str)
                    contents = body_obj.get("contents", [])
                    if contents:
                        has_role = "role" in contents[0]
                        print(f"    ✅ Has 'role' field: {has_role}")
                        if has_role:
                            print(f"    Role value: {contents[0].get('role')}")
                        else:
                            print(f"    ❌ MISSING 'role' field - FIX NOT SAVED!")
                except:
                    print(f"    ⚠️  Could not parse body")

print("\n" + "="*70)
