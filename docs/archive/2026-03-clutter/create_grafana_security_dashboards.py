#!/usr/bin/env python3
import requests
import json

GRAFANA_URL = 'http://nexus-grafana.local'
GRAFANA_USER = 'admin'
GRAFANA_PASSWORD = 'C@sper@22032011'

def get_auth():
    return (GRAFANA_USER, GRAFANA_PASSWORD)

def create_dashboard(dashboard_json):
    """Create or update a dashboard in Grafana"""
    resp = requests.post(
        f'{GRAFANA_URL}/api/dashboards/db',
        json={'dashboard': dashboard_json, 'overwrite': True},
        auth=get_auth(),
        timeout=10
    )
    if resp.status_code in (200, 201):
        return resp.json().get('id')
    else:
        raise RuntimeError(f'Dashboard creation failed: {resp.status_code} {resp.text[:200]}')

# CrowdSec Dashboard
crowdsec_dashboard = {
    'title': '🛡️ CrowdSec Security',
    'timezone': 'browser',
    'panels': [
        {
            'id': 1,
            'title': 'Active Decisions',
            'targets': [{'expr': 'crowdsec_decisions_total', 'refId': 'A'}],
            'type': 'stat',
            'gridPos': {'h': 8, 'w': 12, 'x': 0, 'y': 0}
        },
        {
            'id': 2,
            'title': 'Ban Events (24h)',
            'targets': [{'expr': 'increase(crowdsec_decisions_total{type="ban"}[24h])', 'refId': 'A'}],
            'type': 'stat',
            'gridPos': {'h': 8, 'w': 12, 'x': 12, 'y': 0}
        },
        {
            'id': 3,
            'title': 'Alerts Triggered',
            'targets': [{'expr': 'crowdsec_alerts_total', 'refId': 'A'}],
            'type': 'graph',
            'gridPos': {'h': 8, 'w': 24, 'x': 0, 'y': 8}
        },
        {
            'id': 4,
            'title': 'Top Blocked IPs',
            'targets': [{'expr': 'topk(10, crowdsec_decisions_total{type="ban"})', 'refId': 'A'}],
            'type': 'table',
            'gridPos': {'h': 8, 'w': 24, 'x': 0, 'y': 16}
        }
    ]
}

# Falco Dashboard
falco_dashboard = {
    'title': '🔍 Falco Runtime Security',
    'timezone': 'browser',
    'panels': [
        {
            'id': 1,
            'title': 'Falco Alerts (tail)',
            'targets': [{'expr': '{job="falco"}', 'refId': 'A'}],
            'type': 'logs',
            'gridPos': {'h': 12, 'w': 24, 'x': 0, 'y': 0}
        },
        {
            'id': 2,
            'title': 'Alert Severity Distribution',
            'targets': [{'expr': '{job="falco"} | pattern `<_> <severity> <_>`', 'refId': 'A'}],
            'type': 'piechart',
            'gridPos': {'h': 8, 'w': 12, 'x': 0, 'y': 12}
        },
        {
            'id': 3,
            'title': 'System Calls Monitored',
            'targets': [{'expr': '{job="falco"} | pattern `syscall=<syscall>`', 'refId': 'A'}],
            'type': 'table',
            'gridPos': {'h': 8, 'w': 12, 'x': 12, 'y': 12}
        }
    ]
}

# Trivy Dashboard (Vulnerability Scanning)
trivy_dashboard = {
    'title': '🔐 Trivy Vulnerability Scan',
    'timezone': 'browser',
    'panels': [
        {
            'id': 1,
            'title': 'Scan Results (latest)',
            'targets': [{'expr': '{job="trivy"}', 'refId': 'A'}],
            'type': 'logs',
            'gridPos': {'h': 12, 'w': 24, 'x': 0, 'y': 0}
        },
        {
            'id': 2,
            'title': 'Vulnerability Severity',
            'targets': [{'expr': '{job="trivy"} | pattern `<severity>: <count>`', 'refId': 'A'}],
            'type': 'barchart',
            'gridPos': {'h': 8, 'w': 12, 'x': 0, 'y': 12}
        },
        {
            'id': 3,
            'title': 'Container Images Scanned',
            'targets': [{'expr': '{job="trivy"} | pattern `image=<image>`', 'refId': 'A'}],
            'type': 'table',
            'gridPos': {'h': 8, 'w': 12, 'x': 12, 'y': 12}
        }
    ]
}

# Combined Security Overview
overview_dashboard = {
    'title': '🚨 NEXUS Security Overview',
    'timezone': 'browser',
    'panels': [
        {
            'id': 1,
            'title': 'CrowdSec Active Bans',
            'targets': [{'expr': 'crowdsec_decisions_total{type="ban"}', 'refId': 'A'}],
            'type': 'stat',
            'gridPos': {'h': 6, 'w': 6, 'x': 0, 'y': 0}
        },
        {
            'id': 2,
            'title': 'Active Alerts (Falco)',
            'targets': [{'expr': '{job="falco"} | pattern `<_>`', 'refId': 'A'}],
            'type': 'stat',
            'gridPos': {'h': 6, 'w': 6, 'x': 6, 'y': 0}
        },
        {
            'id': 3,
            'title': 'Critical Vulnerabilities',
            'targets': [{'expr': '{job="trivy"} | pattern `CRITICAL: <count>`', 'refId': 'A'}],
            'type': 'stat',
            'gridPos': {'h': 6, 'w': 6, 'x': 12, 'y': 0}
        },
        {
            'id': 4,
            'title': 'System Health',
            'targets': [{'expr': 'up', 'refId': 'A'}],
            'type': 'stat',
            'gridPos': {'h': 6, 'w': 6, 'x': 18, 'y': 0}
        },
        {
            'id': 5,
            'title': 'Security Events Timeline',
            'targets': [
                {'expr': 'crowdsec_alerts_total', 'legendFormat': 'CrowdSec', 'refId': 'A'},
                {'expr': '{job="falco"}', 'legendFormat': 'Falco', 'refId': 'B'},
                {'expr': '{job="trivy"}', 'legendFormat': 'Trivy', 'refId': 'C'}
            ],
            'type': 'graph',
            'gridPos': {'h': 12, 'w': 24, 'x': 0, 'y': 6}
        }
    ]
}

def main():
    try:
        # Test connection
        r = requests.get(f'{GRAFANA_URL}/api/health', timeout=5)
        if r.status_code != 200:
            raise RuntimeError(f'Grafana unreachable: {r.status_code}')
        print('✅ Connected to Grafana')
        
        # Create dashboards
        dashboards = [
            ('🚨 NEXUS Security Overview', overview_dashboard),
            ('🛡️ CrowdSec Security', crowdsec_dashboard),
            ('🔍 Falco Runtime Security', falco_dashboard),
            ('🔐 Trivy Vulnerability Scan', trivy_dashboard),
        ]
        
        for name, dash in dashboards:
            try:
                dash_id = create_dashboard(dash)
                print(f'✅ Created dashboard: {name} (ID: {dash_id})')
            except Exception as e:
                print(f'⚠️  Failed to create {name}: {e}')
        
        print('\n🎉 Grafana dashboards created. Access at:')
        print(f'   http://nexus-grafana.local/d/ (+ dashboard UID)')
        
    except Exception as e:
        print(f'❌ Error: {e}')

if __name__ == '__main__':
    main()
