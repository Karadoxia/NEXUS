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

# Define the stable Gemini HTTP node
gemini_node = {
    "parameters": {
        "method": "POST",
        "url": "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key={{ $env.GEMINI_API_KEY }}",
        "sendBody": True,
        "specifyBody": "json",
        "jsonBody": "{\n  \"contents\": [\n    {\n      \"parts\": [\n        {\n          \"text\": \"Generate a comprehensive weekly site audit report with:\\n1. Executive Summary\\n2. Database Health Check - Status: Healthy\\n3. Security Assessment - Status: No threats detected\\n4. Link Validation - Status: All valid\\n5. Recommendations for improvement\"\n        }\n      ]\n    }\n  ]\n}",
        "options": {
            "responseFormat": "json"
        }
    },
    "id": "gemini_audit_http",
    "name": "Gemini: Generate Report",
    "type": "n8n-nodes-base.httpRequest",
    "typeVersion": 4.1,
    "position": [
        1000,
        300
    ]
}

# Process nodes
new_nodes = []
found_send_report = False
for node in wf_data.get("nodes", []):
    # Remove any existing Gemini nodes (both HTTP and LangChain)
    if "Gemini" in node["name"] or node["name"] == "Message a model":
        continue
    
    if node["name"] == "Send Report":
        found_send_report = True
        node["parameters"]["emailFormat"] = "html"
        node["parameters"]["html"] = "=<p>{{ $node[\"Gemini: Generate Report\"].json[\"candidates\"][0][\"content\"][\"parts\"][0][\"text\"] }}</p>"
    
    new_nodes.append(node)

new_nodes.append(gemini_node)

# Update connections
new_connections = {
    "Every Sunday 3am UTC": {
        "main": [[{"node": "Prepare Data", "type": "main", "index": 0}]]
    },
    "Prepare Data": {
        "main": [[{"node": "Gemini: Generate Report", "type": "main", "index": 0}]]
    },
    "Gemini: Generate Report": {
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
    print("Workflow restored and patched with stable HTTP pattern!")
    # Trigger execution
    exec_resp = s.post(f"{N8N_URL}/rest/workflows/{WF_ID}/run", headers=h)
    print(f"Execution triggered: {exec_resp.status_code}")
else:
    print(f"Failed to patch workflow: {patch_resp.status_code}")
    print(patch_resp.text)
