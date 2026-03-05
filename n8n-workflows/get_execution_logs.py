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

r = s.get(f"{N8N_URL}/rest/executions?limit=10", headers=h)
res = r.json()
execs = res.get("data", []) if isinstance(res, dict) else res

for e in execs:
    eid = e.get("id")
    name = e.get("workflowName")
    status = e.get("status")
    print(f"ID: {eid}, Workflow: {name}, Status: {status}")
    if status == "failed":
        r2 = s.get(f"{N8N_URL}/rest/executions/{eid}", headers=h)
        details = r2.json().get("data", {})
        print(json.dumps(details.get("resultData", {}).get("error", {}), indent=2))
