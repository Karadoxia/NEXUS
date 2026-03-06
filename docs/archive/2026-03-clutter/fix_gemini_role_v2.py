#!/usr/bin/env python3
"""
Fix Gemini body - handle different data types
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
print("   Checking for 'Full Site Audit Bot'...\n")

updated_count = 0

for wf in workflows:
    if "Full Site Audit Bot" not in wf.get("name"):
        continue
    
    workflow_id = wf.get("id")
    workflow_name = wf.get("name")
    
    print(f"→ {workflow_name} (ID: {workflow_id})")
    
    # Get workflow details
    details_response = session.get(f"{N8N_URL}/rest/workflows/{workflow_id}", headers=headers)
    workflow = details_response.json().get("data", {})
    
    nodes = workflow.get("nodes", [])
    
    # Find Gemini node
    for node in nodes:
        if "Gemini" in node.get("name", ""):
            print(f"  Found: {node.get('name')}")
            
            params = node.get("parameters", {})
            
            # Show current body
            print(f"  Current body type: {type(params.get('jsonBody'))}")
            current_body = params.get("jsonBody")
            
            if isinstance(current_body, dict):
                # It's a dict, just add role
                print(f"  Body is dict")
                contents = current_body.get("contents", [])
                for content in contents:
                    if "role" not in content:
                        content["role"] = "user"
                        print(f"    ✅ Added 'role: user'")
                
                params["jsonBody"] = current_body
                
            elif isinstance(current_body, str):
                # It's a string, parse it
                print(f"  Body is string, parsing...")
                try:
                    body_obj = json.loads(current_body)
                    contents = body_obj.get("contents", [])
                    for content in contents:
                        if "role" not in content:
                            content["role"] = "user"
                            print(f"    ✅ Added 'role: user'")
                    
                    params["jsonBody"] = body_obj
                except:
                    print(f"    ❌ Could not parse string as JSON")
                    continue
                    
            elif current_body is True or current_body is False:
                # It's a boolean - need to check if body is in "body" field
                print(f"  Body is boolean ({current_body})")
                
                # Check for "body" field instead
                if "body" in params:
                    body_str = params["body"]
                    print(f"    Found 'body' field instead: {type(body_str)}")
                    
                    try:
                        body_obj = json.loads(body_str)
                        contents = body_obj.get("contents", [])
                        for content in contents:
                            if "role" not in content:
                                content["role"] = "user"
                                print(f"    ✅ Added 'role: user'")
                        
                        params["body"] = json.dumps(body_obj)
                        params["jsonBody"] = body_obj  # Also set this
                    except:
                        print(f"    ❌ Could not parse body")
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
print(f"✅ FIXED {updated_count} WORKFLOW(S)")
print("="*70)
print("""
Fix: Added "role": "user" to Gemini API request body

🚀 Test now:
  1. http://localhost:5678/workflow
  2. Click "Full Site Audit Bot"
  3. Click "Execute workflow"
  4. Gemini node should now succeed!
""")
