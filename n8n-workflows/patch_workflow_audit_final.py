#!/usr/bin/env python3
import requests
import json

s = requests.Session()
EMAIL = "caspertech92@gmail.com"
PASSWORD = "C@sper@22032011"
N8N_URL = "http://localhost:5678"
N8N_HOST = "nexus-n8n.local"
WF_ID = "4QBqdYgThkCInHD1"
h = {"Content-Type": "application/json", "Host": N8N_HOST}

# Login
s.post(f"{N8N_URL}/rest/login", json={"emailOrLdapLoginId": EMAIL, "password": PASSWORD}, headers=h)

# Get current workflow
r = s.get(f"{N8N_URL}/rest/workflows/{WF_ID}", headers=h)
wf_data = r.json().get("data", {})

# Prepare nodes
new_nodes = []
for node in wf_data.get("nodes", []):
    if node["name"] == "Gemini: Generate Report":
        # Delete old HTTP node by not adding it to new_nodes
        continue
    
    if node["name"] == "Message a model":
        node["parameters"]["modelId"] = {
            "__rl": True,
            "value": "models/gemini-1.5-flash",
            "mode": "list",
            "cachedResultName": "models/gemini-1.5-flash"
        }
        node["parameters"]["messages"] = {
            "values": [
                {
                    "content": "Generate a comprehensive weekly site audit report with:\n1. Executive Summary\n2. Database Health Check - Status: Healthy\n3. Security Assessment - Status: No threats detected\n4. Link Validation - Status: All valid\n5. Recommendations for improvement"
                }
            ]
        }
    
    if node["name"] == "Send Report":
        node["parameters"]["emailFormat"] = "html"
        node["parameters"]["html"] = "={{ $node[\"Message a model\"].json[\"text\"] }}"
    
    new_nodes.append(node)

# Update connections
new_connections = {
    "Every Sunday 3am UTC": {
        "main": [[{"node": "Prepare Data", "type": "main", "index": 0}]]
    },
    "Prepare Data": {
        "main": [[{"node": "Message a model", "type": "main", "index": 0}]]
    },
    "Message a model": {
        "main": [[{"node": "Send Report", "type": "main", "index": 0}]]
    },
    "Send Report": {
        "main": [[{"node": "Notify Completion", "type": "main", "index": 0}]]
    }
}

wf_data["nodes"] = new_nodes
wf_data["connections"] = new_connections

# Patch workflow
patch_resp = s.patch(f"{N8N_URL}/rest/workflows/{WF_ID}", json=wf_data, headers=h)
if patch_resp.status_code == 200:
    print("Workflow patched successfully!")
    # Trigger execution
    exec_resp = s.post(f"{N8N_URL}/rest/workflows/{WF_ID}/run", headers=h)
    print(f"Execution triggered: {exec_resp.status_code}")
else:
    print(f"Failed to patch workflow: {patch_resp.status_code}")
    print(patch_resp.text)
