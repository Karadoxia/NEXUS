#!/usr/bin/env python3
"""
Check workflow structure and try alternate execution method
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

# Get the workflow
workflow_id = "4QBqdYgThkCInHD1"

print(f"\n[2] Fetching workflow: {workflow_id}")
details_response = session.get(f"{N8N_URL}/rest/workflows/{workflow_id}", headers=headers)
workflow = details_response.json().get("data", {})

print(f"Name: {workflow.get('name')}")
print(f"Active: {workflow.get('active')}")
print(f"Has start node: {bool(workflow.get('nodes'))}")

nodes = workflow.get("nodes", [])
print(f"\nNodes ({len(nodes)} total):")
for node in nodes:
    node_type = node.get("type", "")
    node_name = node.get("name", "")
    print(f"  - {node_name} ({node_type})")

# Check for manual trigger or cron
has_trigger = False
trigger_node = None
for node in nodes:
    if "trigger" in node.get("type", "").lower() or "cron" in node.get("type", "").lower():
        has_trigger = True
        trigger_node = node
        print(f"\n✅ Found trigger: {node.get('name')}")

if not has_trigger:
    print(f"\n⚠️  No trigger node found!")
    print("   Workflows need a trigger (cron, manual, webhook, etc.)")
    
    # Try to add a manual trigger or check if we can execute directly
    print("\n   Trying direct execution with webhook parameters...")

# Try execution with webhook style
print("\n[3] Trying alternate execution method...")

# Method 1: Direct execution
print("\n→ Method 1: POST /workflows/{id}/run")
exec_resp = session.post(
    f"{N8N_URL}/rest/workflows/{workflow_id}/run",
    headers=headers,
    json={}
)
print(f"   Status: {exec_resp.status_code}")
if exec_resp.status_code != 200:
    print(f"   Error: {exec_resp.text[:300]}")

# Method 2: Check if there's a test webhook
print("\n→ Method 2: Looking for webhook test endpoint...")
webhook_resp = session.get(f"{N8N_URL}/rest/workflows/{workflow_id}", headers=headers)
wf_data = webhook_resp.json().get("data", {})

print(f"   Webhook path: {wf_data.get('webhookPath', 'Not found')}")

# Method 3: Manually trigger through the cron node
print("\n→ Method 3: Check cron node configuration...")
if trigger_node:
    params = trigger_node.get("parameters", {})
    print(f"   Cron expression: {params.get('cronExpression', 'Not set')}")
    
    # The issue might be that cron nodes don't execute immediately
    print("   Note: Cron nodes run on schedule, not manually")

print("\n" + "="*70)
print("""
ISSUE FOUND:
The workflow has a CRON trigger, so it won't execute manually!

The workflow is set to run on a schedule (Sunday 3am UTC).
To test it manually, we need to:

Option A: Add a manual trigger to the workflow
Option B: Execute it via webhook if one exists  
Option C: Check the workflow error logs directly

Let me check the most recent execution logs...
""")

# Get recent executions
print("\n[4] Checking recent execution logs...")
exec_list_resp = session.get(
    f"{N8N_URL}/rest/executions?workflowId={workflow_id}&limit=5",
    headers=headers
)

if exec_list_resp.status_code == 200:
    exec_list = exec_list_resp.json()
    print(f"Recent executions found: {type(exec_list)}")
    
    if isinstance(exec_list, dict) and "data" in exec_list:
        execs = exec_list.get("data", [])
        print(f"Count: {len(execs) if isinstance(execs, list) else 'unknown'}")
        
        if isinstance(execs, list) and execs:
            recent = execs[0]
            print(f"\nMost recent execution:")
            print(f"  Status: {recent.get('status') if isinstance(recent, dict) else recent}")
