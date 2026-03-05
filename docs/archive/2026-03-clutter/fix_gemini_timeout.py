#!/usr/bin/env python3
"""
Update Gemini node with safety settings and check n8n configuration
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

print("\n[2] Finding all workflows with Gemini nodes...")
updated = 0

for wf in workflows:
    workflow_id = wf.get("id")
    workflow_name = wf.get("name")
    
    # Get workflow details
    details_response = session.get(f"{N8N_URL}/rest/workflows/{workflow_id}", headers=headers)
    workflow = details_response.json().get("data", {})
    
    nodes = workflow.get("nodes", [])
    
    # Find Gemini nodes
    for node in nodes:
        if node.get("type") == "n8n-nodes-base.httpRequest" and "Gemini" in node.get("name", ""):
            print(f"\n→ {workflow_name} - {node.get('name')}")
            
            params = node.get("parameters", {})
            
            # Update parameters
            # 1. Add safety settings to body
            try:
                if "body" in params and isinstance(params["body"], str):
                    body_obj = json.loads(params["body"])
                else:
                    body_obj = {}
                
                # Add safety settings
                body_obj["safetySettings"] = [
                    {
                        "category": "HARM_CATEGORY_UNSPECIFIED",
                        "threshold": "HARM_BLOCK_THRESHOLD_UNSPECIFIED"
                    }
                ]
                
                params["body"] = json.dumps(body_obj)
                print(f"  ✅ Added safetySettings")
            except Exception as e:
                print(f"  ⚠️  Could not add safety settings: {e}")
            
            # 2. Increase timeout
            params["requestTimeout"] = 30  # 30 seconds
            print(f"  ✅ Set timeout to 30 seconds")
            
            # 3. Add skip SSL verification (sometimes helps)
            params["options"] = {}
            if "options" not in params:
                params["options"] = {}
            params["options"]["allowUnauthorizedCerts"] = False
            
            # Update workflow
            update_response = session.patch(
                f"{N8N_URL}/rest/workflows/{workflow_id}",
                json=workflow,
                headers=headers
            )
            
            if update_response.status_code in [200, 201]:
                print(f"  ✅ Updated n8n node")
                updated += 1
            else:
                print(f"  ❌ Update failed")

print("\n" + "="*70)
print(f"✅ UPDATED {updated} GEMINI NODE(S)")
print("="*70)
print("""
Changes made:
  1. Added safetySettings to API request
  2. Increased timeout to 30 seconds
  3. Configured HTTP options

🚀 Test now:
  1. http://localhost:5678/workflow
  2. Click "Full Site Audit Bot"
  3. Click "Execute workflow"
  
If still failing, the issue might be:
  ✗ API key is invalid/expired
  ✗ Google Cloud API not enabled
  ✗ Rate limited
  
Try: Open https://aistudio.google.com and test your API key there
""")
