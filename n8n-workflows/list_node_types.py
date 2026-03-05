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

# Get node types
r = s.get(f"{N8N_URL}/rest/node-types", headers=h)
types = r.json().get("data", [])

for t in types:
    name = t.get('name', '')
    if 'gemini' in name.lower() or 'google' in name.lower():
        print(f"Name: {name}, DisplayName: {t.get('displayName')}")
