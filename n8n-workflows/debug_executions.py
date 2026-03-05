#!/usr/bin/env python3
import requests
import json

s = requests.Session()
EMAIL = "caspertech92@gmail.com"
PASSWORD = "C@sper@22032011"
N8N_URL = "http://localhost:5678"
N8N_HOST = "nexus-n8n.local"
h = {"Content-Type": "application/json", "Host": N8N_HOST}

# Login
s.post(f"{N8N_URL}/rest/login", json={"emailOrLdapLoginId": EMAIL, "password": PASSWORD}, headers=h)

# Get recent executions
r = s.get(f"{N8N_URL}/rest/executions?limit=5", headers=h)
res = r.json()
executions = res.get("data", {}).get("results", [])

for exe in executions:
    exe_id = exe.get('id')
    status = exe.get('status')
    print(f"ID: {exe_id}, Status: {status}")
    if status == 'error':
        r2 = s.get(f"{N8N_URL}/rest/executions/{exe_id}", headers=h)
        print(f"Details for {exe_id}:")
        print(json.dumps(r2.json(), indent=2)[:2000])
