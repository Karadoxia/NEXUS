#!/usr/bin/env python3
"""Simplified alert ingestion workflow - webhook only"""
import requests
import json
import uuid
import sys

EMAIL='caspertech92@gmail.com'
PASSWORD='C@sper@22032011'
URL='http://localhost:5678'
HOST='nexus-n8n.local'

def main():
    s=requests.Session()
    h={'Content-Type':'application/json','Host':HOST}

    # Login
    login=s.post(f'{URL}/rest/login', json={'emailOrLdapLoginId':EMAIL,'password':PASSWORD}, headers=h, timeout=20)
    if login.status_code != 200:
        print(f'✗ Login failed')
        return
    
    # Get project
    projects = s.get(f'{URL}/rest/projects', headers=h, timeout=20).json()['data']
    project_id = projects[0]['id'] if projects else None
    
    if not project_id:
        print("✗ No project found")
        return
    
    # Create simple webhook workflow
    wf = {
        "name": "🚨 NEXUS - Alert Webhook Ingress",
        "projectId": project_id,
        "nodes": [
            {
                "id": "webhook",
                "name": "Webhook",
                "type": "n8n-nodes-base.webhook",
                "typeVersion": 1,
                "position": [200, 200],
                "webhookId": str(uuid.uuid4()),
                "parameters": {
                    "path": "system-alert-ingress",
                    "httpMethod": "POST",
                    "responseMode": "onReceived",
                    "responseData": "successMessage"
                }
            },
            {
                "id": "log",
                "name": "Log Alert",
                "type": "n8n-nodes-base.noOp",
                "typeVersion": 1,
                "position": [400, 200],
                "parameters": {}
            }
        ],
        "connections": {
            "Webhook": {
                "main": [[{"node": "Log Alert", "type":"main", "index": 0}]]
            }
        },
        "active": False
    }
    
    # Delete old workflow if exists
    try:
        s.delete(f'{URL}/rest/workflows/D89d9WNflvqqAo69', headers=h, timeout=20)
        print("✓ Removed old workflow")
    except:
        pass
    
    # Create workflow
    resp = s.post(f'{URL}/rest/workflows', json=wf, headers=h, timeout=30)
    if resp.status_code not in [200, 201]:
        print(f"✗Error: {resp.status_code}")
        print(resp.text[:300])
        return
    
    wf_id = resp.json()['data']['id']
    print(f"✓ Created workflow: {wf_id}")
    
    # Activate
    act = s.patch(f'{URL}/rest/workflows/{wf_id}', json={"active": True}, headers=h, timeout=20)
    if act.status_code == 200:
        print(f"✓ Activated webhook")
    
    # Check final status
    get = s.get(f'{URL}/rest/workflows/{wf_id}', headers=h, timeout=20).json()['data']
    print(f"\nWorkflow Status:")
    print(f"  ID: {get['id']}")
    print(f"  Name: {get['name']}")
    print(f"  Active: {get['active']}")
    
    print(f"\n✅ ALERT WEBHOOK READY")
    print(f"POST http://localhost:5678/webhook/system-alert-ingress")
    print(f"   or https://n8n.nexus-io.duckdns.org/webhook/system-alert-ingress (production)")

if __name__ == '__main__':
    main()
