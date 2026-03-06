#!/usr/bin/env python3
"""
Test each node in the workflow one by one to identify exact errors
"""
import requests
import json
import sys
from pprint import pprint

EMAIL = "caspertech92@gmail.com"
PASSWORD = "C@sper@22032011"
N8N_URL = "http://localhost:5678"
N8N_HOST = "nexus-n8n.local"

session = requests.Session()
headers = {
    "Content-Type": "application/json",
    "Host": N8N_HOST
}

# Login
print("=" * 70)
print("[STEP 1] LOGGING IN")
print("=" * 70)
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
print("\n" + "=" * 70)
print("[STEP 2] FINDING WORKFLOW")
print("=" * 70)
workflows_response = session.get(f"{N8N_URL}/rest/workflows", headers=headers)
workflows = workflows_response.json().get("data", [])

target_workflow = None
for wf in workflows:
    if "Full Site Audit Bot" in wf.get("name"):
        target_workflow = wf
        break

if not target_workflow:
    print("❌ Workflow not found. Available workflows:")
    for wf in workflows:
        print(f"  - {wf.get('name')}")
    sys.exit(1)

workflow_id = target_workflow.get("id")
print(f"✅ Found: {target_workflow.get('name')}")
print(f"   ID: {workflow_id}")

# Get workflow details
print("\n" + "=" * 70)
print("[STEP 3] FETCHING WORKFLOW STRUCTURE")
print("=" * 70)
details_response = session.get(f"{N8N_URL}/rest/workflows/{workflow_id}", headers=headers)
workflow = details_response.json().get("data", {})

nodes = workflow.get("nodes", [])
print(f"✅ Found {len(nodes)} nodes:")
for node in nodes:
    print(f"   - {node.get('name')} (type: {node.get('type')})")

# Get execution history to see actual errors
print("\n" + "=" * 70)
print("[STEP 4] CHECKING RECENT EXECUTIONS")
print("=" * 70)
executions_response = session.get(f"{N8N_URL}/rest/executions?workflowId={workflow_id}&limit=5", headers=headers)
executions_response_data = executions_response.json()

# Check if data is a list or dict
if isinstance(executions_response_data, dict):
    executions_data = executions_response_data.get("data", [])
else:
    executions_data = executions_response_data

if not executions_data:
    print("⚠️  No execution history found")
else:
    exec_list = list(executions_data) if isinstance(executions_data, (list, dict)) else [executions_data]
    print(f"Found {len(exec_list)} executions")
    for exec_idx, execution in enumerate(exec_list[:3]):
        if isinstance(execution, dict):
            print(f"\n→ Execution {exec_idx + 1}:")
            print(f"  Status: {execution.get('status')}")
            print(f"  Started: {execution.get('startedAt')}")
            print(f"  Finished: {execution.get('stoppedAt')}")
            if execution.get('status') == 'error':
                print(f"  ⚠️ ERROR DETECTED!")

# Test each node individually
print("\n" + "=" * 70)
print("[STEP 5] TESTING NODES ONE-BY-ONE")
print("=" * 70)

node_tests = {
    "Every Sunday 3am UTC": "Cron trigger node",
    "Prepare Data": "Set variable node",
    "Gemini: Generate Report": "HTTP Request to Gemini API",
    "Send Report": "Email via SMTP",
    "Notify Completion": "Telegram notification"
}

for node_name in node_tests.keys():
    node = next((n for n in nodes if n.get("name") == node_name), None)
    
    print(f"\n→ Testing: {node_name}")
    print(f"  {node_tests[node_name]}")
    
    if not node:
        print(f"  ❌ Node not found!")
        continue
    
    print(f"  Type: {node.get('type')}")
    print(f"  ID: {node.get('id')}")
    
    params = node.get('parameters', {})
    creds = node.get('credentials', {})
    
    # Show relevant parameters based on node type
    if node.get('type') == 'n8n-nodes-base.httpRequest':
        print(f"  URL: {params.get('url')}")
        print(f"  Method: {params.get('method')}")
        print(f"  Credentials: {creds}")
        
        # Check if environment variables are present
        if "$env" in str(params):
            print(f"  ⚠️ Uses environment variables - check if they're set!")
            
    elif node.get('type') == 'n8n-nodes-base.emailSend':
        print(f"  From: {params.get('fromEmail')}")
        print(f"  To: {params.get('toEmail')}")
        print(f"  Subject: {params.get('subject')}")
        print(f"  HTML preview: {params.get('html', '')[:80]}...")
        print(f"  Credentials: {list(creds.keys())}")
        
    elif node.get('type') == 'n8n-nodes-base.telegram':
        print(f"  Chat ID: {params.get('chatId')}")
        print(f"  Text: {params.get('text', '')[:80]}...")
        print(f"  Credentials: {creds}")
        
    elif node.get('type') == 'n8n-nodes-base.set':
        print(f"  Variables to set: {list(params.get('values', {}).keys())}")

# Check environment variables
print("\n" + "=" * 70)
print("[STEP 6] ENVIRONMENT VARIABLES CHECK")
print("=" * 70)
env_check = session.get(f"{N8N_URL}/rest/workflows/{workflow_id}?includeEnvVariables=true", headers=headers)
env_data = env_check.json().get("data", {})

print("Checking if workflow has access to environment variables...")
# The variables are typically used in expressions, let's check them
print("\nLooking for $env references in nodes:")
found_env_vars = set()
for node in nodes:
    node_str = json.dumps(node)
    if "$env" in node_str:
        # Extract env var names
        import re
        matches = re.findall(r'\$env\.(\w+)', node_str)
        for match in matches:
            found_env_vars.add(match)
            print(f"  - {match}")

if not found_env_vars:
    print("  No environment variables found in nodes")

# Try to get credentials info
print("\n" + "=" * 70)
print("[STEP 7] CREDENTIALS VERIFICATION")
print("=" * 70)
creds_response = session.get(f"{N8N_URL}/rest/credentials", headers=headers)
all_creds = creds_response.json().get("data", [])

print(f"Available credentials ({len(all_creds)} total):")
for cred in all_creds:
    print(f"  - {cred.get('name')} (ID: {cred.get('id')}, Type: {cred.get('type')})")

# Map node credentials
print("\nNode credential mappings:")
for node in nodes:
    creds = node.get('credentials', {})
    if creds:
        print(f"\n  {node.get('name')}:")
        for cred_type, cred_info in creds.items():
            cred_id = cred_info.get('id')
            cred_name = cred_info.get('name')
            matched = next((c for c in all_creds if c.get('id') == cred_id), None)
            if matched:
                print(f"    ✅ {cred_type}: {cred_name} (exists)")
            else:
                print(f"    ❌ {cred_type}: {cred_name} (NOT FOUND - ID: {cred_id})")

print("\n" + "=" * 70)
print("DIAGNOSTIC SUMMARY")
print("=" * 70)
print("""
Check the following:

1. Is n8n running? (docker ps)
2. Are environment variables set in .env?
   - GEMINI_API_KEY
   - ADMIN_EMAIL
   - TELEGRAM_CHAT_ID

3. Do credentials exist in n8n?
   - NEXUS Gemini (Gemini API)
   - Resend SMTP (Email)
   - NEXUS Telegram Bot
   
4. What's the exact error? Check n8n UI:
   - http://localhost:5678/workflow
   - Click on the workflow
   - Click "Execute workflow"
   - Check the red error indicators
   
5. Next step: Run the actual workflow test through the UI
   and send me the EXACT error message from the node
""")
