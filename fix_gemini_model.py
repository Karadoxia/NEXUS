#!/usr/bin/env python3
"""
Fix the Gemini API URL with correct model
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

target_workflow = None
for wf in workflows:
    if "Full Site Audit Bot" in wf.get("name"):
        target_workflow = wf
        break

if not target_workflow:
    print("❌ Workflow not found")
    sys.exit(1)

workflow_id = target_workflow.get("id")
print(f"✅ Found workflow ID: {workflow_id}")

# Get workflow details
print("\n[2] Fetching workflow...")
details_response = session.get(f"{N8N_URL}/rest/workflows/{workflow_id}", headers=headers)
workflow = details_response.json().get("data", {})

nodes = workflow.get("nodes", [])

# Find and fix the Gemini node
print("\n[3] Fixing Gemini node URL...")
gemini_node = None
for node in nodes:
    if "Gemini" in node.get("name"):
        gemini_node = node
        break

if gemini_node:
    old_url = gemini_node["parameters"].get("url", "")
    print(f"   Old URL: {old_url[:80]}...")
    
    # CORRECT URL with working model
    new_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={{ $env.GEMINI_API_KEY }}"
    
    gemini_node["parameters"]["url"] = new_url
    
    print(f"   New URL: {new_url[:80]}...")
    print("✅ Updated Gemini node URL")
else:
    print("❌ Gemini node not found")
    sys.exit(1)

# Update workflow
print("\n[4] Updating workflow...")
update_response = session.patch(
    f"{N8N_URL}/rest/workflows/{workflow_id}",
    json=workflow,
    headers=headers
)

if update_response.status_code in [200, 201]:
    print("✅ Workflow updated!")
else:
    print(f"❌ Update failed: {update_response.status_code}")
    print(f"   Response: {update_response.text[:200]}")
    sys.exit(1)

print("\n" + "="*70)
print("✅ FIX APPLIED!")
print("="*70)
print("""
Changed:
  Model: gemini-2.0-flash → gemini-2.5-flash (latest available)
  API: v1 → v1beta (required for latest models)

🚀 Test the workflow now:
  1. Go to: http://localhost:5678/workflow
  2. Click "Full Site Audit Bot"
  3. Click "Execute workflow"
  4. Watch for the green check on Gemini node
""")
