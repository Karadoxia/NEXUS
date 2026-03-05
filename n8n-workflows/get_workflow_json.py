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

target_id = "4QBqdYgThkCInHD1"

if target_id:
    print(f"Fetching workflow ID: {target_id}")
    r2 = s.get(f"{N8N_URL}/rest/workflows/{target_id}", headers=h)
    with open("full_workflow.json", "w") as f:
        json.dump(r2.json().get("data", {}), f, indent=2)
    print("Saved to full_workflow.json")
else:
    print("Workflow not found")
