#!/usr/bin/env python3
"""
Update ALL workflow instances with correct Gemini model
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

print(f"\n[2] Found {len(workflows)} total workflows")
print("   Looking for Audit Bot workflows...\n")

updated_count = 0

for wf in workflows:
    if "Audit" in wf.get("name") or "audit" in wf.get("name").lower():
        workflow_id = wf.get("id")
        workflow_name = wf.get("name")
        
        print(f"→ {workflow_name}")
        
        # Get workflow details
        details_response = session.get(f"{N8N_URL}/rest/workflows/{workflow_id}", headers=headers)
        workflow = details_response.json().get("data", {})
        
        nodes = workflow.get("nodes", [])
        
        # Check if it has a Gemini node
        gemini_node = None
        for node in nodes:
            if "gemini" in node.get("type", "").lower() or "Gemini" in node.get("name", ""):
                gemini_node = node
                break
        
        if gemini_node:
            old_url = gemini_node["parameters"].get("url", "")
            
            # Update to latest model
            new_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={{ $env.GEMINI_API_KEY }}"
            gemini_node["parameters"]["url"] = new_url
            
            # Update workflow
            update_response = session.patch(
                f"{N8N_URL}/rest/workflows/{workflow_id}",
                json=workflow,
                headers=headers
            )
            
            if update_response.status_code in [200, 201]:
                print(f"  ✅ Updated to gemini-2.5-flash")
                updated_count += 1
            else:
                print(f"  ❌ Update failed")
        else:
            print(f"  ⊘  No Gemini node found")

print("\n" + "="*70)
print(f"✅ UPDATED {updated_count} WORKFLOW(S)")
print("="*70)
print(f"""
✅ All Audit workflows updated to use:
   Model: gemini-2.5-flash (latest available)
   API: v1beta

🚀 Test now:
   http://localhost:5678/workflow → Execute workflow
""")
