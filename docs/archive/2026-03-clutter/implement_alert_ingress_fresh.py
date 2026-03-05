#!/usr/bin/env python3
"""Set up unified alert ingestion system in N8N - FRESH INSTALL VERSION"""
import requests
import json
import uuid
import sys

EMAIL='caspertech92@gmail.com'
PASSWORD='C@sper@22032011'
URL='http://localhost:5678'
HOST='nexus-n8n.local'
RESEND_API_KEY='re_C51jKwtZ_DeLcpK5JcX6mEp7YmD4ecDk6'
TELEGRAM_CRED_ID='M6RSYbbNfAzdDfMM'
TELEGRAM_CRED_NAME='@Nexusto_bot Token'
CHAT_ID='6899339578'

def main():
    s=requests.Session()
    h={'Content-Type':'application/json','Host':HOST}

    # Login
    login=s.post(f'{URL}/rest/login', json={'emailOrLdapLoginId':EMAIL,'password':PASSWORD}, headers=h, timeout=20)
    if login.status_code != 200:
        print(f'✗ Login failed {login.status_code}')
        sys.exit(1)
    print("✓ Admin authenticated")
    
    # Get or create default project
    projects = s.get(f'{URL}/rest/projects', headers=h, timeout=20).json()['data']
    if not projects:
        # Create default project
        proj = s.post(f'{URL}/rest/projects', json={'name': 'Default', 'type': 'personal'}, headers=h, timeout=20)
        project_id = proj.json()['data']['id']
        print(f"✓ Created default project: {project_id}")
    else:
        project_id = projects[0]['id']
        print(f"✓ Using existing project: {project_id}")
    
    # Create the Unified Alert Ingress webhook workflow
    ingress_wf = {
        "name": "🚨 NEXUS - Unified Alert Ingress",
        "nodes": [
            {
                "id": "webhook_trigger",
                "name": "Webhook",
                "type": "n8n-nodes-base.webhook",
                "typeVersion": 1,
                "position": [240, 300],
                "webhookId": str(uuid.uuid4()),
                "parameters": {
                    "path": "system-alert-ingress",
                    "httpMethod": "POST",
                    "responseMode": "onReceived"
                }
            },
            {
                "id": "normalize_alert",
                "name": "Normalize Alert",
                "type": "n8n-nodes-base.code",
                "typeVersion": 1,
                "position": [440, 300],
                "parameters": {
                    "language": "javaScript",
                    "jsCode": """
// Normalize alerts from various sources
const payload = $input.first().json.body || {};
const normalized = {
  source: payload.source || 'unknown',
  severity: payload.severity || 'info',
  message: payload.message || JSON.stringify(payload),
  timestamp: new Date().toISOString(),
  context: payload
};
return [{ json: normalized }];
"""
                }
            },
            {
                "id": "send_telegram",
                "name": "Send Telegram",
                "type": "n8n-nodes-base.telegram",
                "typeVersion": 1,
                "position": [640, 150],
                "parameters": {
                    "authentication": "botToken",
                    "botToken": TELEGRAM_CRED_ID,
                    "chatId": CHAT_ID,
                    "text": "🚨 {{$node.Normalize Alert.json.source}} [{{$node.Normalize Alert.json.severity.toUpperCase()}}]\\n\\n{{$node.Normalize Alert.json.message}}\\n\\n⏰ {{$node.Normalize Alert.json.timestamp}}"
                }
            },
            {
                "id": "send_email",
                "name": "Send Email",
                "type": "n8n-nodes-base.http",
                "typeVersion": 3,
                "position": [640, 350],
                "parameters": {
                    "url": "https://api.resend.com/emails",
                    "method": "POST",
                    "headerParameters": {
                        "parameters": [
                            {"name": "Authorization", "value": f"Bearer {RESEND_API_KEY}"}
                        ]
                    },
                    "bodyParameters": {
                        "parameters": [
                            {"name": "to", "value": "admin@nexus-io.local"},
                            {"name": "from", "value": "alerts@nexus-io.local"},
                            {"name": "subject", "value": "[{{$node.Normalize Alert.json.severity.toUpperCase()}}] {{$node.Normalize Alert.json.source}}"},
                            {"name": "html", "value": "<h2>{{$node.Normalize Alert.json.source}}</h2><p><strong>Severity:</strong> {{$node.Normalize Alert.json.severity}}</p><p>{{$node.Normalize Alert.json.message}}</p><p><em>{{$node.Normalize Alert.json.timestamp}}</em></p>"}
                        ]
                    }
                }
            }
        ],
        "connections": {
            "Webhook": {
                "main": [[{"node": "Normalize Alert", "type": "main", "index": 0}]]
            },
            "Normalize Alert": {
                "main": [
                    [
                        {"node": "Send Telegram", "type": "main", "index": 0},
                        {"node": "Send Email", "type": "main", "index": 0}
                    ]
                ]
            }
        },
        "active": False,
        "nodeDistance": 100,
        "pinData": {}
    }
    
    # Create the workflow
    wf_resp = s.post(f'{URL}/rest/workflows', json={**ingress_wf, 'projectId': project_id}, headers=h, timeout=30)
    if wf_resp.status_code not in [200, 201]:
        print(f'✗ Workflow creation failed {wf_resp.status_code}: {wf_resp.text[:200]}')
        sys.exit(1)
    
    wf_id = wf_resp.json()['data']['id']
    print(f"✓ Unified Alert Ingress workflow created: {wf_id}")
    
    # Activate the workflow
    activate = s.patch(f'{URL}/rest/workflows/{wf_id}', json={"active": True}, headers=h, timeout=20)
    if activate.status_code == 200:
        print(f"✓ Workflow activated")
    
    print("\n" + "="*60)
    print("ALERT SYSTEM SETUP COMPLETE")
    print("="*60)
    print(f"\n🔗 Webhook URL:")
    print(f"   POST https://n8n.nexus-io.duckdns.org/webhook/system-alert-ingress")
    print(f"\n📝 Test payload:")
    print(json.dumps({
        "source": "Test Alert",
        "severity": "warning",
        "message": "This is a test alert from the unified ingress system"
    }, indent=2))
    print(f"\n📤 Alert destinations:")
    print(f"   • Telegram: Chat {CHAT_ID}")
    print(f"   • Email: admin@nexus-io.local")
    print(f"\n💡 To integrate sources:")
    print(f"   1. Create webhook triggers in source workflows")
    print(f"   2. POST to the webhook URL with above payload format")
    print(f"   3. Alerts will auto-normalize and deliver to all destinations")

if __name__ == '__main__':
    main()
