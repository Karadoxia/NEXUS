#!/usr/bin/env python3
"""
Check what credentials actually exist and what the real errors are
"""
import requests
import json

EMAIL = "caspertech92@gmail.com"
PASSWORD = "C@sper@22032011"
N8N_URL = "http://localhost:5678"
N8N_HOST = "nexus-n8n.local"

session = requests.Session()
headers = {
    "Content-Type": "application/json",
    "Host": N8N_HOST
}

try:
    # Login
    login_resp = session.post(
        f"{N8N_URL}/rest/login",
        json={"emailOrLdapLoginId": EMAIL, "password": PASSWORD},
        headers=headers,
        timeout=10
    )
    
    print("="*70)
    print("CHECKING AVAILABLE CREDENTIALS")
    print("="*70)
    
    # Get credentials
    creds_resp = session.get(f"{N8N_URL}/rest/credentials", headers=headers, timeout=10)
    credentials = creds_resp.json()
    
    print(f"\nAvailable credentials:")
    if isinstance(credentials, dict) and "data" in credentials:
        creds_list = credentials.get("data", [])
    else:
        creds_list = credentials if isinstance(credentials, list) else []
    
    for cred in creds_list:
        cred_id = cred.get("id", "")
        cred_name = cred.get("name", "")
        cred_type = cred.get("type", "")
        print(f"  - {cred_name} (ID: {cred_id}, Type: {cred_type})")
    
    print("\n" + "="*70)
    print("LOOKING FOR TELEGRAM CREDENTIAL")
    print("="*70)
    
    telegram_cred = None
    for cred in creds_list:
        if "telegram" in cred.get("type", "").lower() or "telegram" in cred.get("name", "").lower():
            telegram_cred = cred
            print(f"\n✅ Found Telegram credential:")
            print(f"  Name: {cred.get('name')}")
            print(f"  ID: {cred.get('id')}")
            print(f"  Type: {cred.get('type')}")
            break
    
    if not telegram_cred:
        print(f"\n❌ NO TELEGRAM CREDENTIAL FOUND!")
        print(f"The credential ID 'P1JqNmgOzQhedrUg' doesn't exist")
        print(f"Available credentials are:")
        for cred in creds_list:
            print(f"  - {cred.get('name')} ({cred.get('id')})")

except Exception as e:
    print(f"❌ Error: {str(e)}")
    import traceback
    traceback.print_exc()
