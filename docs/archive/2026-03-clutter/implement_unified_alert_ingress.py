#!/usr/bin/env python3
import requests
import json
import uuid

EMAIL='caspertech92@gmail.com'
PASSWORD='C@sper@22032011'
URL='http://localhost:5678'
HOST='nexus-n8n.local'
FULL_AUDIT_ID='4QBqdYgThkCInHD1'
RESEND_API_KEY='re_C51jKwtZ_DeLcpK5JcX6mEp7YmD4ecDk6'
TELEGRAM_CRED_ID='M6RSYbbNfAzdDfMM'
TELEGRAM_CRED_NAME='@Nexusto_bot Token'
CHAT_ID='6899339578'

SOURCE_WORKFLOWS={
    'LSeOJC8VuWOL4dp4':'🔥 NEXUS - Global Error Notifier',
    'wS7fV23QTcEyElD4':'🛡️ NEXUS - Security Incident Aggregator FULL',
    'JIYezWmylRm4V2nB':'📊 NEXUS - Performance Monitor + Auto-Optimize',
    'aiLY498cB2sjk9Nw':'🐳 NEXUS - Container Auto-Registration FIXED',
}


def main():
    s=requests.Session()
    h={'Content-Type':'application/json','Host':HOST}

    login=s.post(f'{URL}/rest/login', json={'emailOrLdapLoginId':EMAIL,'password':PASSWORD}, headers=h, timeout=20)
    if login.status_code != 200:
        raise RuntimeError(f'Login failed {login.status_code} {login.text[:200]}')

    # 1) Add webhook trigger to Full Site Audit
    wf=s.get(f'{URL}/rest/workflows/{FULL_AUDIT_ID}', headers=h, timeout=20).json()['data']
    nodes=wf['nodes']
    conns=wf.get('connections',{})

    if not any(n.get('name')=='Alert Trigger' for n in nodes):
        nodes.append({
            'parameters': {
                'httpMethod': 'POST',
                'path': 'nexus-alert-trigger',
                'responseMode': 'onReceived'
            },
            'id': 'alert_trigger_webhook',
            'name': 'Alert Trigger',
            'type': 'n8n-nodes-base.webhook',
            'typeVersion': 1,
            'position': [240, 480],
            'webhookId': str(uuid.uuid4())
        })

    conns.setdefault('Alert Trigger', {'main': []})
    conns['Alert Trigger']['main']=[[{'node':'Prepare Data','type':'main','index':0}]]

    save=s.patch(f'{URL}/rest/workflows/{FULL_AUDIT_ID}', json={'nodes':nodes,'connections':conns}, headers=h, timeout=20)
    if save.status_code not in (200,204):
        raise RuntimeError(f'Failed to patch full audit {save.status_code} {save.text[:250]}')
    print('✅ Full audit webhook trigger wired: /webhook/nexus-alert-trigger')

    # 2) Create or update Unified Alert Ingress workflow
    all_wf=s.get(f'{URL}/rest/workflows', headers=h, timeout=20).json().get('data',[])
    ingress=next((w for w in all_wf if w.get('name')=='🚨 NEXUS - Unified Alert Ingress'), None)

    ingress_nodes=[
      {
        'parameters': {'httpMethod':'POST','path':'system-alert-ingress','responseMode':'onReceived'},
        'id':'alert_ingress_webhook','name':'System Alert Ingress','type':'n8n-nodes-base.webhook','typeVersion':1,'position':[240,300],'webhookId':str(uuid.uuid4())
      },
      {
        'parameters': {
          'values': {
            'string': [
              {'name':'source','value':'={{ $json.source || $json.workflow || "unknown" }}'},
              {'name':'severity','value':'={{ $json.severity || "medium" }}'},
              {'name':'message','value':'={{ $json.message || $json.text || JSON.stringify($json) }}'}
            ]
          },
          'options': {}
        },
        'id':'normalize_alert','name':'Normalize Alert','type':'n8n-nodes-base.set','typeVersion':2,'position':[460,300]
      },
      {
        'parameters': {
          'chatId': CHAT_ID,
          'text': '🚨 System Alert\\nSource: {{$json.source}}\\nSeverity: {{$json.severity}}\\n{{$json.message}}',
          'additionalFields': {}
        },
        'id':'telegram_alert','name':'Telegram Alert','type':'n8n-nodes-base.telegram','typeVersion':1,'position':[700,180],
        'credentials': {'telegramApi': {'id': TELEGRAM_CRED_ID, 'name': TELEGRAM_CRED_NAME}}
      },
      {
        'parameters': {
          'method':'POST','url':'https://api.resend.com/emails','sendHeaders':True,
          'headerParameters': {'parameters':[{'name':'Authorization','value':f'Bearer {RESEND_API_KEY}'},{'name':'Content-Type','value':'application/json'}]},
          'sendBody':True,'contentType':'json','specifyBody':'json',
          'jsonBody':'={{ { from: "onboarding@resend.dev", to: "caspertech78@gmail.com", subject: "🚨 NEXUS System Alert - " + $json.severity, html: "<h2>System Alert</h2><p><b>Source:</b> " + $json.source + "</p><p><b>Severity:</b> " + $json.severity + "</p><pre>" + $json.message + "</pre>" } }}'
        },
        'id':'email_alert','name':'Email Alert','type':'n8n-nodes-base.httpRequest','typeVersion':4,'position':[700,300], 'continueOnFail':True
      },
      {
        'parameters': {
          'method':'POST','url':'http://nexus-n8n.local:5678/webhook/nexus-alert-trigger',
          'sendBody':True,'contentType':'json','specifyBody':'json',
          'jsonBody':'={{ { source: $json.source, severity: $json.severity, message: $json.message, triggeredAt: $now } }}'
        },
        'id':'trigger_full_audit','name':'Trigger Full Audit','type':'n8n-nodes-base.httpRequest','typeVersion':4,'position':[700,420],'continueOnFail':True
      }
    ]

    ingress_connections={
      'System Alert Ingress': {'main': [[{'node':'Normalize Alert','type':'main','index':0}]]},
      'Normalize Alert': {'main': [[
          {'node':'Telegram Alert','type':'main','index':0},
          {'node':'Email Alert','type':'main','index':0},
          {'node':'Trigger Full Audit','type':'main','index':0}
      ]]}
    }

    if ingress:
        wid=ingress['id']
        data=s.get(f'{URL}/rest/workflows/{wid}', headers=h, timeout=20).json()['data']
        upd=s.patch(f'{URL}/rest/workflows/{wid}', json={'nodes':ingress_nodes,'connections':ingress_connections,'settings':data.get('settings',{})}, headers=h, timeout=20)
        if upd.status_code not in (200,204):
            raise RuntimeError(f'Ingress update failed {upd.status_code} {upd.text[:200]}')
        ingress_id=wid
        print(f'✅ Updated ingress workflow {ingress_id}')
    else:
        create=s.post(f'{URL}/rest/workflows', json={'name':'🚨 NEXUS - Unified Alert Ingress','nodes':ingress_nodes,'connections':ingress_connections,'settings':{'executionOrder':'v1'}}, headers=h, timeout=20)
        if create.status_code not in (200,201):
            raise RuntimeError(f'Ingress create failed {create.status_code} {create.text[:200]}')
        ingress_id=create.json()['data']['id']
        print(f'✅ Created ingress workflow {ingress_id}')

    # 3) Wire each source workflow trigger to alert ingress
    for wid,wname in SOURCE_WORKFLOWS.items():
        r=s.get(f'{URL}/rest/workflows/{wid}', headers=h, timeout=20)
        if r.status_code!=200:
            print(f'⚠️ Skip {wid}: fetch {r.status_code}')
            continue
        w=r.json()['data']
        nodes=w.get('nodes',[])
        con=w.get('connections',{})

        trigger=next((n for n in nodes if n.get('type') in ('n8n-nodes-base.webhook','n8n-nodes-base.cron')), None)
        if not trigger:
            print(f'⚠️ Skip {wname}: no trigger found')
            continue

        forward_name='Forward to Alert Ingress'
        if not any(n.get('name')==forward_name for n in nodes):
            tpos=trigger.get('position',[240,300])
            nodes.append({
                'parameters': {
                    'method':'POST','url':'http://nexus-n8n.local:5678/webhook/system-alert-ingress',
                    'sendBody':True,'contentType':'json','specifyBody':'json',
                    'jsonBody': f'={{ {{ source: "{wname}", severity: "medium", message: "Alert event from {wname}", payload: $json }} }}'
                },
                'id': f'forward_ingress_{wid[:8]}',
                'name': forward_name,
                'type': 'n8n-nodes-base.httpRequest',
                'typeVersion': 4,
                'position': [tpos[0]+220, tpos[1]-140],
                'continueOnFail': True
            })

        tname=trigger.get('name')
        con.setdefault(tname, {'main':[[]]})
        if 'main' not in con[tname] or not con[tname]['main']:
            con[tname]['main']=[[]]
        branch=con[tname]['main'][0]
        if not any(x.get('node')==forward_name for x in branch):
            branch.append({'node':forward_name,'type':'main','index':0})

        sv=s.patch(f'{URL}/rest/workflows/{wid}', json={'nodes':nodes,'connections':con}, headers=h, timeout=20)
        if sv.status_code in (200,204):
            print(f'✅ Wired source -> ingress: {wname}')
        else:
            print(f'⚠️ Failed wiring {wname}: {sv.status_code} {sv.text[:120]}')

    # 4) Activate ingress and source workflows
    activate_ids=[ingress_id,*SOURCE_WORKFLOWS.keys()]
    for wid in activate_ids:
        a=s.patch(f'{URL}/rest/workflows/{wid}', json={'active': True}, headers=h, timeout=15)
        if a.status_code in (200,204):
            print('✅ Activated', wid)
        else:
            print('⚠️ Activation failed', wid, a.status_code, a.text[:120])

    print('\n🎉 Implementation complete: unified ingress + source forwarding + activation attempted.')


if __name__ == '__main__':
    main()
