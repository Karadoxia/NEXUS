#!/usr/bin/env python3
"""
Execute workflow and get detailed error information
"""
import requests
import json
import sys
import time
from pathlib import Path

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
print("EXECUTING WORKFLOW AND CAPTURING ERROR")
print("="*70)

# Login
print("\n[1] Logging in...")
login_resp = session.post(
    f"{N8N_URL}/rest/login",
    json={"emailOrLdapLoginId": EMAIL, "password": PASSWORD},
    headers=headers
)

if login_resp.status_code != 200:
    print(f"❌ Login failed")
    sys.exit(1)

print("✅ Logged in")

workflow_id = "4QBqdYgThkCInHD1"

# Get all executions before
print("\n[2] Checking current executions...")
exec_before = session.get(f"{N8N_URL}/rest/executions?workflowId={workflow_id}&limit=1", headers=headers).json()
print(f"Before: {type(exec_before)}")

# Try to trigger through manual trigger
print("\n[3] Trying to trigger through manual trigger (via worker)...")

# Get the workflow first
wf_resp = session.get(f"{N8N_URL}/rest/workflows/{workflow_id}", headers=headers)
wf = wf_resp.json().get("data", {})

# Find the manual trigger node
manual_node = None
for node in wf.get("nodes", []):
    if "Manual" in node.get("name"):
        manual_node = node
        break

if manual_node:
    print(f"✅ Found manual trigger: {manual_node.get('name')}")
    node_id = manual_node.get("id")
    
    # Try to trigger it
    print(f"\n[4] Executing workflow...")
    
    # Try a simpler approach - just post to the rest api with proper format
    exec_payload = {
        "workflowData": {
            "id": workflow_id,
            "name": wf.get("name"),
            "nodes": wf.get("nodes"),
            "connections": wf.get("connections"),
            "active": wf.get("active"),
            "settings": wf.get("settings")
        }
    }
    
    exec_resp = session.post(
        f"{N8N_URL}/rest/workflows/{workflow_id}/test",
        headers=headers,
        json={}
    )
    
    print(f"Response status: {exec_resp.status_code}")
    print(f"Response: {exec_resp.text[:300]}")

# Wait and then check executions
print("\n[5] Waiting for execution...")
time.sleep(3)

exec_after = session.get(f"{N8N_URL}/rest/executions?workflowId={workflow_id}&limit=10", headers=headers).json()

print(f"\n[6] Fetching execution results...")

if isinstance(exec_after, dict) and "data" in exec_after:
    exec_list = exec_after.get("data", {})
    print(f"Executions: {type(exec_list)}")
    
    if isinstance(exec_list, dict):
        # It's a dict, check for results
        for key, val in list(exec_list.items())[:3]:
            print(f"\n → {key}: {type(val)}")
            if isinstance(val, dict):
                print(f"   Status: {val.get('status')}")
                
                if "data" in val and "resultData" in val["data"]:
                    result = val["data"]["resultData"]
                    
                    if "runData" in result:
                        run_data = result["runData"]
                        
                        for node_name, node_results in run_data.items():
                            if isinstance(node_results, list) and node_results:
                                first = node_results[0]
                                
                                if "error" in first:
                                    error = first["error"]
                                    print(f"\n   ❌ Node '{node_name}' ERROR:")
                                    print(f"      Message: {error.get('message')}")
                                    if "description" in error:
                                        print(f"      Description: {error.get('description')}")
                                    
                                    # Print full error for inspection
                                    print(f"\n      Full Error Object:")
                                    print(json.dumps(error, indent=8))

print("\n" + "="*70)
print("SUMMARY")
print("="*70)

# Also try to get the gemini node and show its exact config
print("\n[7] Checking Gemini node configuration...")

gemini_node = None
for node in wf.get("nodes", []):
    if "Gemini" in node.get("name"):
        gemini_node = node
        break

if gemini_node:
    print(f"\n✓ Gemini Node: {gemini_node.get('name')}")
    params = gemini_node.get("parameters", {})
    
    print(f"  URL: {params.get('url', 'NOT SET')[:80]}...")
    
    if "jsonBody" in params:
        body = params.get("jsonBody")
        if isinstance(body, dict):
            contents = body.get("contents", [])
            if contents:
                print(f"  Contents[0] keys: {list(contents[0].keys())}")
                print(f"  Has 'role': {'role' in contents[0]}")
                if 'role' in contents[0]:
                    print(f"  Role value: {contents[0]['role']}")
        else:
            print(f"  Body type: {type(body)}")
    
    elif "body" in params:
        body_str = params.get("body")
        print(f"  Body (string): {body_str[:80]}...")

print("\n🚀 Test STATUS: Check the error message above")
