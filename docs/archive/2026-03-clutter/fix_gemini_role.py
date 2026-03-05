#!/usr/bin/env python3
"""
Fix the Gemini API body by adding 'role' field
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

# Get ALL workflows
workflows_response = session.get(f"{N8N_URL}/rest/workflows", headers=headers)
workflows = workflows_response.json().get("data", [])

print(f"\n[2] Found {len(workflows)} workflows")
print("   Looking for Gemini nodes...\n")

updated_count = 0

for wf in workflows:
    workflow_id = wf.get("id")
    workflow_name = wf.get("name")
    
    # Get workflow details
    details_response = session.get(f"{N8N_URL}/rest/workflows/{workflow_id}", headers=headers)
    workflow = details_response.json().get("data", {})
    
    nodes = workflow.get("nodes", [])
    
    # Find HTTP request nodes to Gemini
    for node in nodes:
        if node.get("type") == "n8n-nodes-base.httpRequest" and "Gemini" in node.get("name", ""):
            print(f"→ {workflow_name} - {node.get('name')}")
            
            params = node.get("parameters", {})
            
            # Get the body
            try:
                json_body = params.get("jsonBody")
                
                if not json_body:
                    print(f"  ⚠️  No jsonBody found")
                    continue
                
                contents = json_body.get("contents", [])
                
                # Add role to each content
                for content in contents:
                    if "role" not in content:
                        content["role"] = "user"
                        print(f"  ✅ Added 'role: user' to contents")
                
                # Update the node
                params["jsonBody"] = json_body
                
            except Exception as e:
                print(f"  ❌ Error: {e}")
                continue
            
            # Update workflow
            update_response = session.patch(
                f"{N8N_URL}/rest/workflows/{workflow_id}",
                json=workflow,
                headers=headers
            )
            
            if update_response.status_code in [200, 201]:
                print(f"  ✅ Updated workflow")
                updated_count += 1
            else:
                print(f"  ❌ Update failed: {update_response.status_code}")

print("\n" + "="*70)
print(f"✅ FIXED {updated_count} GEMINI NODE(S)")
print("="*70)
print("""
Fix applied:
  Added "role": "user" to the API request body
  
This was causing the "Bad request" error because:
  ❌ OLD: {"contents": [{"parts": [...]}]}
  ✅ NEW: {"contents": [{"role": "user", "parts": [...]}]}

🚀 Test now:
  1. http://localhost:5678/workflow
  2. Click "Full Site Audit Bot"
  3. Click "Execute workflow"
  
The Gemini node should now succeed!
""")
