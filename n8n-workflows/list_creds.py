#!/usr/bin/env python3
import requests

s = requests.Session()
EMAIL = "caspertech92@gmail.com"
PASSWORD = "C@sper@22032011"
N8N_URL = "http://localhost:5678"
N8N_HOST = "nexus-n8n.local"
h = {"Content-Type": "application/json", "Host": N8N_HOST}

s.post(f"{N8N_URL}/rest/login", json={"emailOrLdapLoginId": EMAIL, "password": PASSWORD}, headers=h)

r = s.get(f"{N8N_URL}/rest/credentials", headers=h)
creds = r.json().get("data", [])

for c in creds:
    print(f"Name: {c.get('name')}, Type: {c.get('type')}")
