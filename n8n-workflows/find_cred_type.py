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
r = s.get(f"{N8N_URL}/rest/credentials-schema", headers=h)
schemas = r.json()

for schema in schemas:
    name = schema.get("name", "")
    display_name = schema.get("displayName", "")
    if "gemini" in name.lower() or "google" in name.lower() or "gemini" in display_name.lower():
        print(f"Name: {name}, DisplayName: {display_name}")
