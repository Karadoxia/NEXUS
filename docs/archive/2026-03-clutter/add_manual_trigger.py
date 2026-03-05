#!/usr/bin/env python3
"""
Add a manual trigger to the workflow so it can be tested
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

workflow_id = "4QBqdYgThkCInHD1"

print(f"\n[2] Fetching workflow: {workflow_id}")
details_response = session.get(f"{N8N_URL}/rest/workflows/{workflow_id}", headers=headers)
workflow = details_response.json().get("data", {})

nodes = workflow.get("nodes", [])
connections = workflow.get("connections", {})

print(f"Current nodes: {[n.get('name') for n in nodes]}")

# Check if manual trigger exists
has_manual = False
for node in nodes:
    if node.get("type") == "n8n-nodes-base.manualTrigger":
        has_manual = True
        print(f"✅ Manual trigger already exists: {node.get('name')}")
        break

if not has_manual:
    print(f"\n[3] Adding manual trigger node...")
    
    # Create manual trigger node
    manual_node = {
        "parameters": {},
        "id": "manual_trigger",
        "name": "Manual Test",
        "type": "n8n-nodes-base.manualTrigger",
        "typeVersion": 1,
        "position": [100, 100]
    }
    
    nodes.append(manual_node)
    
    # Find the first node that the cron connects to
    cron_node = None
    for node in nodes:
        if node.get("type") == "n8n-nodes-base.cron":
            cron_node = node
            break
    
    if cron_node:
        first_connection = None
        
        # Get what the cron connects to
        cron_name = cron_node.get("name")
        if cron_name in connections:
            cron_conns = connections.get(cron_name, {}).get("main", [])
            if cron_conns and cron_conns[0]:
                first_connection = cron_conns[0][0].get("node")
        
        print(f"Cron connects to: {first_connection}")
        
        # Connect manual trigger to the same node
        if first_connection:
            if "manual_trigger" not in connections:
                connections["Manual Test"] = {"main": [[{"node": first_connection, "type": "main", "index": 0}]]}
            
            print(f"✅ Connected Manual Test → {first_connection}")
    
    workflow["nodes"] = nodes
    workflow["connections"] = connections
    
    # Update workflow
    print(f"\n[4] Saving workflow...")
    update_response = session.patch(
        f"{N8N_URL}/rest/workflows/{workflow_id}",
        json=workflow,
        headers=headers
    )
    
    if update_response.status_code in [200, 201]:
        print(f"✅ Workflow updated!")
    else:
        print(f"❌ Update failed: {update_response.status_code}")
        print(update_response.text[:300])
        sys.exit(1)

print("\n" + "="*70)
print("""
✅ Manual trigger added!

🚀 Now test the workflow:
   1. Go to: http://localhost:5678/workflow/4QBqdYgThkCInHD1
   2. Click the "Manual Test" node (it should be first on the left)
   3. Click the blue "Execute workflow" button
   4. Watch the nodes execute
   
The workflow can now be tested manually!
""")
