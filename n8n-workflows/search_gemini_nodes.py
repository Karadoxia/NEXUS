#!/usr/bin/env python3
import requests

s = requests.Session()
EMAIL = "caspertech92@gmail.com"
PASSWORD = "C@sper@22032011"
N8N_URL = "http://localhost:5678"
N8N_HOST = "nexus-n8n.local"
h = {"Content-Type": "application/json", "Host": N8N_HOST}

s.post(f"{N8N_URL}/rest/login", json={"emailOrLdapLoginId": EMAIL, "password": PASSWORD}, headers=h)

r = s.get(f"{N8N_URL}/rest/workflows", headers=h)
workflows = r.json().get("data", [])

for wf in workflows:
    wid = wf.get("id")
    r2 = s.get(f"{N8N_URL}/rest/workflows/{wid}", headers=h)
    details = r2.json().get("data", {})
    nodes = details.get("nodes", [])
    for node in nodes:
        ntype = node.get("type", "").lower()
        if "gemini" in ntype or "google" in ntype:
            print(f"Workflow: {wf.get('name')}")
            print(f"  Node: {node.get('name')}")
            print(f"  Type: {node.get('type')}")
            print(f"  Credentials: {node.get('credentials')}")
