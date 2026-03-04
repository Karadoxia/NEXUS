#!/usr/bin/env python3
"""
EXECUTE the workflow and capture the ACTUAL error
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

print("="*70)
print("EXECUTING WORKFLOW AND CAPTURING ACTUAL ERROR")
print("="*70)

print("\n[1] Logging in...")
login_response = session.post(
    f"{N8N_URL}/rest/login",
    json={"emailOrLdapLoginId": EMAIL, "password": PASSWORD},
    headers=headers
)

if login_response.status_code != 200:
    print(f"❌ Login failed: {login_response.text}")
    sys.exit(1)

print("✅ Logged in")

# Target workflow ID
workflow_id = "4QBqdYgThkCInHD1"

print(f"\n[2] Executing workflow: {workflow_id}")
print("-"*70)

# Execute the workflow
execute_response = session.post(
    f"{N8N_URL}/rest/workflows/{workflow_id}/run",
    headers=headers,
    json={}
)

print(f"Execution request status: {execute_response.status_code}")
print(f"Response: {execute_response.text[:500]}")

if execute_response.status_code not in [200, 201]:
    print(f"\n❌ Execution request failed!")
    sys.exit(1)

# Get execution ID
exec_data = execute_response.json()
execution_id = exec_data.get("id")
print(f"\n✅ Workflow triggered")
print(f"Execution ID: {execution_id}")

# Wait for execution to complete
print(f"\n[3] Waiting for execution to complete...")
time.sleep(3)

# Get execution results
print(f"[4] Fetching execution results...")
execution_response = session.get(
    f"{N8N_URL}/rest/executions/{execution_id}",
    headers=headers
)

if execution_response.status_code == 200:
    execution = execution_response.json().get("data", {})
    
    print(f"\nExecution Status: {execution.get('status')}")
    print(f"Finished: {execution.get('stoppedAt', 'Still running...')}")
    
    # Get the results/errors
    nodes_data = execution.get("data", {})
    
    print(f"\n[5] NODE EXECUTION RESULTS:")
    print("-"*70)
    
    if "resultData" in execution:
        result_data = execution.get("resultData", {})
        
        # Show what happened in each node
        if "runData" in result_data:
            run_data = result_data.get("runData", {})
            
            for node_name, node_results in run_data.items():
                print(f"\n→ Node: {node_name}")
                
                if isinstance(node_results, list):
                    for idx, result in enumerate(node_results):
                        if "error" in result:
                            print(f"  ❌ EXECUTION {idx} - ERROR!")
                            error = result.get("error")
                            print(f"     Name: {error.get('name')}")
                            print(f"     Message: {error.get('message')}")
                            if "cause" in error:
                                print(f"     Cause: {error.get('cause')}")
                            if "description" in error:
                                print(f"     Description: {error.get('description')}")
                            print(f"     Full Error Object:")
                            print(json.dumps(error, indent=6))
                        elif "data" in result:
                            data = result.get("data")
                            if isinstance(data, list) and data:
                                print(f"  ✅ Success - {len(data)} items")
                            else:
                                print(f"  ✅ Success")
                        else:
                            print(f"  ? Unknown result type")
        else:
            print(json.dumps(result_data, indent=2)[:1000])
    
    # Full execution data
    print(f"\n[6] FULL EXECUTION DATA:")
    print("-"*70)
    print(json.dumps(execution, indent=2)[:2000])
    
else:
    print(f"❌ Could not fetch execution: {execution_response.status_code}")
    print(execution_response.text)

print("\n" + "="*70)
