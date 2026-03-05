#!/usr/bin/env python3
import requests
import json

s = requests.Session()
EMAIL = "caspertech92@gmail.com"
PASSWORD = "C@sper@22032011"
N8N_URL = "http://localhost:5678"
N8N_HOST = "nexus-n8n.local"
h = {"Content-Type": "application/json", "Host": N8N_HOST}

s.post(f"{N8N_URL}/rest/login", json={"emailOrLdapLoginId": EMAIL, "password": PASSWORD}, headers=h)

r = s.get(f"{N8N_URL}/rest/workflows", headers=h)
workflows = r.json().get("data", [])

all_data = []
for wf in workflows:
    wid = wf.get("id")
    r2 = s.get(f"{N8N_URL}/rest/workflows/{wid}", headers=h)
    details = r2.json().get("data", {})
    all_data.append({
        "name": wf.get("name"),
        "nodes": [{"name": n.get("name"), "type": n.get("type"), "credentials": n.get("credentials")} for n in details.get("nodes", [])]
    })

with open("workflows_dump.json", "w") as f:
    json.dump(all_data, f, indent=2)
print("Dumped to workflows_dump.json")
