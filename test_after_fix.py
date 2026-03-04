#!/usr/bin/env python3
"""
Test workflow execution now that manual trigger is added
"""
import requests
import json
import sys
import time

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

print(f"\n[2] Executing workflow: {workflow_id}")
print("-"*70)

# Execute workflow
execute_response = session.post(
    f"{N8N_URL}/rest/workflows/{workflow_id}/run",
    headers=headers,
    json={}
)

print(f"Execution request status: {execute_response.status_code}")

if execute_response.status_code == 200:
    print("✅ Workflow execution started!")
    exec_data = execute_response.json()
    print(f"Response: {json.dumps(exec_data, indent=2)[:500]}")
    
    execution_id = exec_data.get("id")
    
    if execution_id:
        print(f"\nExecution ID: {execution_id}")
        print("\nWaiting 5 seconds for execution to complete...")
        time.sleep(5)
        
        # Get results
        print(f"\n[3] Fetching results...")
        exec_resp = session.get(f"{N8N_URL}/rest/executions/{execution_id}", headers=headers)
        
        if exec_resp.status_code == 200:
            execution = exec_resp.json().get("data", {})
            status = execution.get("status")
            
            print(f"Status: {status}")
            
            if status == "success":
                print("✅ WORKFLOW COMPLETED SUCCESSFULLY!")
            elif status == "error":
                print("❌ Workflow had errors:")
                
                # Extract error details
                result_data = execution.get("data", {})
                run_data = result_data.get("resultData", {}).get("runData", {})
                
                for node_name, results in run_data.items():
                    if isinstance(results, list):
                        for result in results:
                            if "error" in result:
                                print(f"\n  Node: {node_name}")
                                print(f"  Error: {result['error'].get('message')}")
                print("\n" + json.dumps(run_data, indent=2)[:1000])
            else:
                print(f"Status: {status} (still running...)")
        else:
            print(f"❌ Could not fetch execution: {exec_resp.status_code}")
    
else:
    print(f"❌ Execution failed: {execute_response.status_code}")
    print(execute_response.text)

print("\n" + "="*70)
print("""
🚀 WORKFLOW TEST COMPLETE

Next steps:
  1. Go to: http://localhost:5678/workflow/4QBqdYgThkCInHD1
  2. Refresh the page (Ctrl+R or Cmd+R)
  3. Click "Execute workflow" button
  4. Watch the nodes execute and see the results
""")
