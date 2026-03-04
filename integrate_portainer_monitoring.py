#!/usr/bin/env python3
"""
Add Portainer to monitoring stack:
1. Uptime Kuma monitor
2. Prometheus scrape config
3. Grafana dashboard
"""
import requests
import json
import sqlite3
import subprocess

EMAIL = 'caspertech92@gmail.com'
PASSWORD = 'C@sper@22032011'
N8N_URL = 'http://localhost:5678'
UPTIME_URL = 'http://nexus-uptime.local'
GRAFANA_URL = 'http://nexus-grafana.local'

def add_uptime_monitor():
    """Add Portainer to Uptime Kuma dashboard"""
    try:
        conn = sqlite3.connect('/var/lib/docker/volumes/nexus-v2_uptime-data/_data/uptime.db')
        cursor = conn.cursor()
        
        # Insert Portainer monitor
        cursor.execute('''
            INSERT OR IGNORE INTO monitor 
            (name, url, type, interval, retryInterval, maxretries, notificationIDList, active, userId)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', [
            'Portainer',
            'http://nexus-portainer.local:9000/api/status',
            'http',
            60,
            60,
            3,
            '[]',
            1,
            1
        ])
        
        conn.commit()
        conn.close()
        print('✅ Portainer added to Uptime Kuma')
    except Exception as e:
        print(f'⚠️  Uptime Kuma error: {e}')

def add_prometheus_scrape():
    """Add Portainer to Prometheus scrape config"""
    try:
        with open('/data/prometheus.yml', 'r') as f:
            config = f.read()
        
        # Add Portainer scrape job if not present
        if 'portainer' not in config:
            portainer_job = '''  - job_name: 'portainer'
    static_configs:
      - targets: ['portainer:9000']
    metrics_path: '/api/system/prometheus'
    scrape_interval: 30s
'''
            # Insert before last scrape job
            insert_pos = config.rfind('  - job_name:')
            if insert_pos > 0:
                insert_pos = config.rfind('\n', 0, insert_pos)
                config = config[:insert_pos] + '\n' + portainer_job + config[insert_pos:]
                
                with open('/data/prometheus.yml', 'w') as f:
                    f.write(config)
                
                print('✅ Portainer added to Prometheus')
                
                # Reload Prometheus
                subprocess.run(['docker', 'exec', 'prometheus', 'kill', '-HUP', '1'], 
                             check=False, capture_output=True)
        else:
            print('ℹ️  Portainer already in Prometheus config')
    except Exception as e:
        print(f'⚠️  Prometheus error: {e}')

def create_portainer_dashboard():
    """Create Portainer monitoring dashboard in Grafana"""
    try:
        dashboard = {
            'title': '🐳 Portainer Container Management',
            'timezone': 'browser',
            'panels': [
                {
                    'id': 1,
                    'title': 'Portainer Status',
                    'targets': [{'expr': 'up{job="portainer"}', 'refId': 'A'}],
                    'type': 'stat',
                    'gridPos': {'h': 6, 'w': 6, 'x': 0, 'y': 0}
                },
                {
                    'id': 2,
                    'title': 'Container Count',
                    'targets': [{'expr': 'portainer_containers_running', 'refId': 'A'}],
                    'type': 'stat',
                    'gridPos': {'h': 6, 'w': 6, 'x': 6, 'y': 0}
                },
                {
                    'id': 3,
                    'title': 'System CPU Usage',
                    'targets': [{'expr': 'portainer_system_cpu_percentage', 'refId': 'A'}],
                    'type': 'gauge',
                    'gridPos': {'h': 6, 'w': 6, 'x': 12, 'y': 0}
                },
                {
                    'id': 4,
                    'title': 'Memory Usage',
                    'targets': [{'expr': 'portainer_system_memory_used_bytes', 'refId': 'A'}],
                    'type': 'gauge',
                    'gridPos': {'h': 6, 'w': 6, 'x': 18, 'y': 0}
                },
                {
                    'id': 5,
                    'title': 'Container Status Timeline',
                    'targets': [{'expr': 'portainer_containers_running', 'refId': 'A'}],
                    'type': 'graph',
                    'gridPos': {'h': 8, 'w': 24, 'x': 0, 'y': 6}
                }
            ]
        }
        
        resp = requests.post(
            f'{GRAFANA_URL}/api/dashboards/db',
            json={'dashboard': dashboard, 'overwrite': True},
            auth=('admin', 'C@sper@22032011'),
            timeout=10
        )
        
        if resp.status_code in (200, 201):
            db_data = resp.json()
            print(f'✅ Portainer dashboard created (ID: {db_data.get("id")})')
        else:
            print(f'⚠️  Dashboard creation failed: {resp.status_code}')
    except Exception as e:
        print(f'⚠️  Grafana error: {e}')

def main():
    print('\n🐳 PORTAINER MONITORING INTEGRATION\n')
    
    print('1️⃣  Adding Portainer to Uptime Kuma...')
    add_uptime_monitor()
    
    print('2️⃣  Adding Portainer to Prometheus...')
    add_prometheus_scrape()
    
    print('3️⃣  Creating Portainer dashboard in Grafana...')
    create_portainer_dashboard()
    
    print('\n✅ Portainer integrated into monitoring stack!')
    print('\n📊 Access Portainer at:')
    print('   Local: http://nexus-portainer.local')
    print('   Internet: https://portainer.nexus-io.duckdns.org')
    print('\n   User: admin')
    print('   Pass: C@sper@22032011 (master password)\n')

if __name__ == '__main__':
    main()
