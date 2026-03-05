#!/usr/bin/env python3
"""
Fix workflow connections properly
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

print(f"\n[2] Fetching workflow...")
details_response = session.get(f"{N8N_URL}/rest/workflows/{workflow_id}", headers=headers)
workflow = details_response.json().get("data", {})

nodes = workflow.get("nodes", [])
connections = workflow.get("connections", {})

print(f"Nodes: {[n.get('name') for n in nodes]}")
print(f"\nCurrent connections:")
for source, targets in connections.items():
    print(f"  {source}:")
    if "main" in targets:
        for idx, connections_list in enumerate(targets["main"]):
            for conn in connections_list:
                print(f"    → {conn.get('node')} (output {idx})")

# Check the manual trigger
manual_node = None
for node in nodes:
    if "Manual Test" in node.get("name"):
        manual_node = node
        print(f"\n✅ Found manual trigger: {node.get('name')} (ID: {node.get('id')})")

# Recreate connections properly
print(f"\n[3] Fixing connections...")

# Make sure Manual Test connects to Prepare Data
if "Manual Test" in connections:
    del connections["Manual Test"]

connections["Manual Test"] = {
    "main": [
        [
            {
                "node": "Prepare Data",
                "type": "main",
                "index": 0
            }
        ]
    ]
}

print(f"✅ Manual Test → Prepare Data")

# Verify other connections
if "Prepare Data" not in connections:
    connections["Prepare Data"] = {
        "main": [
            [
                {
                    "node": "Gemini: Generate Report",
                    "type": "main",
                    "index": 0
                }
            ]
        ]
    }
    print(f"✅ Prepare Data → Gemini: Generate Report")

if "Gemini: Generate Report" not in connections:
    connections["Gemini: Generate Report"] = {
        "main": [
            [
                {
                    "node": "Send Report",
                    "type": "main",
                    "index": 0
                }
            ]
        ]
    }
    print(f"✅ Gemini: Generate Report → Send Report")

if "Send Report" not in connections:
    connections["Send Report"] = {
        "main": [
            [
                {
                    "node": "Notify Completion",
                    "type": "main",
                    "index": 0
                }
            ]
        ]
    }
    print(f"✅ Send Report → Notify Completion")

# Remove cron from connections if it's the only thing there
if "Every Sunday 3am UTC" in connections:
    print(f"   Keeping cron connection (for scheduled runs)")

workflow["connections"] = connections

print(f"\n[4] Saving workflow...")
update_response = session.patch(
    f"{N8N_URL}/rest/workflows/{workflow_id}",
    json=workflow,
    headers=headers
)

if update_response.status_code in [200, 201]:
    print(f"✅ Workflow saved!")
else:
    print(f"❌ Update failed: {update_response.status_code}")
    print(update_response.text[:300])

print("\n" + "="*70)
print("""
🚀 Workflow connections fixed!

Now test manually:
  1. http://localhost:5678/workflow/4QBqdYgThkCInHD1
  2. Refresh the page
  3. Click "Execute workflow"
""")
