#!/usr/bin/env python3
"""
Fix the ACTUAL running workflow
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
    print(f"❌ Login failed: {login_response.text}")
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
print(f"   ID: {workflow_id}")

# Get workflow details
print("\n[2] Fetching workflow...")
details_response = session.get(f"{N8N_URL}/rest/workflows/{workflow_id}", headers=headers)
workflow = details_response.json().get("data", {})

nodes = workflow.get("nodes", [])
print(f"   Found {len(nodes)} nodes")

# Find and fix the Send Report node
print("\n[3] Fixing 'Send Report' node...")
send_node = None
for node in nodes:
    if node.get("name") == "Send Report":
        send_node = node
        break

if send_node:
    # CORRECT HTML: The Gemini node output is in the httpRequest response
    # The response structure for Gemini is: response.body.candidates[0].content.parts[0].text
    
    old_html = send_node["parameters"]["html"]
    print(f"   Old HTML: {old_html}")
    
    # Option 1: Direct response access from Gemini node
    new_html = "<p>{{ $json.body.candidates[0].content.parts[0].text }}</p>"
    
    send_node["parameters"]["html"] = new_html
    
    print(f"   New HTML: {new_html}")
    print("✅ Fixed Send Report node")
else:
    print("❌ Send Report node not found")
    sys.exit(1)

# Find and fix the Gemini node
print("\n[4] Fixing 'Gemini: Generate Report' node...")
gemini_node = None
for node in nodes:
    if "Gemini" in node.get("name"):
        gemini_node = node
        break

if gemini_node:
    print(f"   Node ID: {gemini_node.get('id')}")
    
    # Ensure proper URL
    url = gemini_node["parameters"].get("url", "")
    if "$env.GEMINI_API_KEY" not in url:
        print("   ⚠️ Warning: GEMINI_API_KEY not in URL")
    
    print("✅ Gemini node verified")
else:
    print("⚠️ No Gemini node found (might be OK if using different node name)")

# Update the workflow
print("\n[5] Updating workflow...")
update_response = session.patch(
    f"{N8N_URL}/rest/workflows/{workflow_id}",
    json=workflow,
    headers=headers
)

if update_response.status_code in [200, 201]:
    print("✅ Workflow updated!")
else:
    print(f"❌ Update failed: {update_response.status_code}")
    print(f"   Response: {update_response.text}")
    sys.exit(1)

print("\n" + "="*70)
print("✅ FIXES APPLIED!")
print("="*70)
print("""
✅ Changes made:
   1. Fixed Send Report HTML template
   2. Verified Gemini node configuration
   
🚀 NEXT: Go to http://localhost:5678/workflow and click the workflow
   Then click "Execute workflow" button to test

📋 Expected behavior:
   1. Cron trigger starts the workflow
   2. Prepare Data sets the audit_status
   3. Gemini node calls API and returns JSON response
   4. Send Report extracts text from response
   5. Telegram sends notification
   
❌ If still errors, look for:
   - Red error node in the workflow
   - Click the error node for details
   - Screenshot the error message
""")
