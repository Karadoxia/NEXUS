#!/usr/bin/env python3
import requests
import json
import sys

s = requests.Session()
EMAIL = "caspertech92@gmail.com"
PASSWORD = "C@sper@22032011"
N8N_URL = "http://localhost:5678"
N8N_HOST = "nexus-n8n.local"
h = {"Content-Type": "application/json", "Host": N8N_HOST}

s.post(f"{N8N_URL}/rest/login", json={"emailOrLdapLoginId": EMAIL, "password": PASSWORD}, headers=h)

# Get the NEXUS Gemini credential ID
creds = s.get(f"{N8N_URL}/rest/credentials", headers=h).json().get("data", [])
nexus_gemini_id = None
for c in creds:
    if c.get("name") == "NEXUS Gemini":
        nexus_gemini_id = c.get("id")
        break

if not nexus_gemini_id:
    print("NEXUS Gemini credential not found")
    sys.exit(1)

print(f"Found NEXUS Gemini ID: {nexus_gemini_id}")

r = s.get(f"{N8N_URL}/rest/workflows", headers=h)
workflows = r.json().get("data", [])

for wf in workflows:
    wid = wf.get("id")
    r2 = s.get(f"{N8N_URL}/rest/workflows/{wid}", headers=h)
    details = r2.json().get("data", {})
    nodes = details.get("nodes", [])
    patched = False
    for node in nodes:
        node_name = node.get("name", "").lower()
        node_type = node.get("type", "")
        if ("gemini" in node_name or "google" in node_name) and node_type == "n8n-nodes-base.httpRequest":
            node["credentials"] = node.get("credentials", {})
            node["credentials"]["googlePalmApi"] = {"id": nexus_gemini_id, "name": "NEXUS Gemini"}
            patched = True
            print(f"  Patching node '{node.get('name')}' in workflow '{wf.get('name')}'")
    
    if patched:
        r3 = s.patch(f"{N8N_URL}/rest/workflows/{wid}", json=details, headers=h)
        if r3.status_code in [200, 204]:
            print(f"Successfully updated workflow: {wf.get('name')}")
        else:
            print(f"Failed to update workflow: {wf.get('name')} - {r3.status_code}")
