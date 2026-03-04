#!/usr/bin/env python3
import sys, json, os
from pathlib import Path
import requests
from dotenv import dotenv_values

ROOT = Path(__file__).parent.parent
ENV  = dotenv_values(ROOT / ".env")

N8N_URL   = "http://localhost:5678"
N8N_HOST  = "nexus-n8n.local"
EMAIL     = "caspertech92@gmail.com"
PASSWORD  = "C@sper@22032011"
GEMINI_KEY = ENV.get("GEMINI_API_KEY", "")

def h():
    return {"Content-Type": "application/json", "Host": N8N_HOST}

def login():
    s = requests.Session()
    r = s.post(f"{N8N_URL}/rest/login",
               json={"emailOrLdapLoginId": EMAIL, "password": PASSWORD},
               headers=h())
    if r.status_code != 200:
        print(f"Login failed ({r.status_code}): {r.text[:200]}")
        sys.exit(1)
    print("Logged in to n8n")
    return s

def list_credentials(s):
    r = s.get(f"{N8N_URL}/rest/credentials", headers=h())
    return r.json().get("data", [])

def delete_credential(s, cid):
    r = s.delete(f"{N8N_URL}/rest/credentials/{cid}", headers=h())
    return r.status_code in [200, 204]

def create_credential(s, name, ctype, data):
    existing = list_credentials(s)
    for c in existing:
        if c.get("name") == name:
            delete_credential(s, c["id"])
            print(f"Removed existing credential: {name}")

    r = s.post(f"{N8N_URL}/rest/credentials",
               json={"name": name, "type": ctype, "data": data},
               headers=h())
    if r.status_code in [200, 201]:
        d = r.json().get("data", r.json())
        print(f"Updated credential: {name} (id={d.get('id')})")
        return d.get("id")
    print(f"Failed to create '{name}': {r.status_code} - {r.text[:300]}")
    return None

def main():
    if not GEMINI_KEY:
        print("GEMINI_API_KEY not found in .env")
        sys.exit(1)
    
    s = login()
    # Update both existing ones and create a standard one
    create_credential(s, "Google Gemini(PaLM) Api account", "googlePalmApi", {"apiKey": GEMINI_KEY})
    create_credential(s, "Google Gemini(PaLM) Api account 2", "googlePalmApi", {"apiKey": GEMINI_KEY})
    create_credential(s, "NEXUS Gemini", "googlePalmApi", {"apiKey": GEMINI_KEY})

if __name__ == "__main__":
    main()
