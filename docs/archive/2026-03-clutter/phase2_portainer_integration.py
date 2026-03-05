#!/usr/bin/env python3
"""
Phase 2: Portainer Monitoring Integration
- Adds Portainer health monitor to Uptime Kuma
- Validates Prometheus scrape configuration
- Creates Grafana dashboard for container metrics
"""

import requests
import json
import sys
import time
from typing import Dict, Any, Optional

# Configuration
PORTAINER_URL = "http://portainer:9000"
PORTAINER_LOCAL_URL = "http://nexus-portainer.local:9000"
UPTIME_KUMA_URL = "http://uptime_kuma:3001"
UPTIME_KUMA_LOCAL = "http://nexus-uptime.local"
GRAFANA_URL = "http://grafana:3000"
GRAFANA_LOCAL = "http://nexus-grafana.local"
PROMETHEUS_URL = "http://prometheus:9090"
PROMETHEUS_LOCAL = "http://nexus-prometheus.local"

# Credentials
UPTIME_KUMA_USERNAME = "caspertech92@gmail.com"
UPTIME_KUMA_PASSWORD = "C@sper@22032011"
GRAFANA_USERNAME = "admin"
GRAFANA_PASSWORD = "C@sper@22032011"

# Uptime Kuma monitor configuration
PORTAINER_MONITOR_CONFIG = {
    "type": "http",
    "name": "Portainer Status",
    "description": "Portainer container management API health",
    "url": f"{PORTAINER_LOCAL_URL}/api/status",
    "method": "GET",
    "timeout": 10,
    "interval": 60,  # Check every 60 seconds
    "retryInterval": 60,
    "maxretries": 2,
    "expectedValue": "",
    "valueType": "status-code",
    "statusPageIndex": 0,
    "notificationIDList": {},
    "tags": ["infrastructure", "container-management"],
    "active": True,
}

# Grafana dashboard for Portainer
PORTAINER_DASHBOARD = {
    "dashboard": {
        "title": "Portainer Container Metrics",
        "description": "Container management platform health and metrics",
        "tags": ["containers", "infrastructure", "portainer"],
        "refresh": "30s",
        "time": {"from": "now-6h", "to": "now"},
        "timezone": "browser",
        "schemaVersion": 37,
        "version": 0,
        "uid": "portainer-metrics",
        "panels": [
            {
                "id": 1,
                "title": "Portainer Service Status",
                "type": "stat",
                "gridPos": {"h": 4, "w": 6, "x": 0, "y": 0},
                "targets": [
                    {
                        "expr": 'up{job="portainer"}',
                        "refId": "A",
                        "legendFormat": "Up",
                    }
                ],
                "options": {
                    "colorMode": "background",
                    "graphMode": "none",
                    "justifyMode": "center",
                    "orientation": "auto",
                    "textMode": "auto",
                    "thresholds": {
                        "mode": "absolute",
                        "steps": [
                            {"color": "red", "value": None},
                            {"color": "green", "value": 1},
                        ]
                    },
                },
            },
            {
                "id": 2,
                "title": "Portainer Scrape Duration",
                "type": "graph",
                "gridPos": {"h": 4, "w": 6, "x": 6, "y": 0},
                "targets": [
                    {
                        "expr": 'scrape_duration_seconds{job="portainer"}',
                        "refId": "A",
                        "legendFormat": "Scrape Duration (s)",
                    }
                ],
            },
            {
                "id": 3,
                "title": "Live Prometheus Targets",
                "type": "table",
                "gridPos": {"h": 8, "w": 12, "x": 0, "y": 4},
                "targets": [
                    {
                        "format": "table",
                        "instant": True,
                        "refId": "A",
                        "expr": 'up',
                        "legendFormat": "",
                    }
                ],
                "transformations": [
                    {
                        "id": "organize",
                        "options": {
                            "excludeByName": {},
                            "indexByName": {},
                            "renameByName": {
                                "Time": "Timestamp",
                            },
                        },
                    }
                ],
            },
        ],
        "refresh": "30s",
        "templating": {
            "list": [
                {
                    "name": "interval",
                    "type": "interval",
                    "current": {"text": "1m", "value": "1m"},
                    "options": [
                        {"text": "30s", "value": "30s"},
                        {"text": "1m", "value": "1m"},
                        {"text": "5m", "value": "5m"},
                        {"text": "10m", "value": "10m"},
                    ],
                }
            ]
        },
    }
}



def validate_endpoint(url: str, endpoint: str = "", timeout: int = 10) -> bool:
    """Validate that an endpoint is accessible and responding"""
    try:
        full_url = f"{url}{endpoint}"
        response = requests.get(full_url, timeout=timeout)
        print(f"✅ {full_url} → HTTP {response.status_code}")
        return response.status_code < 400
    except Exception as e:
        print(f"❌ {url}{endpoint} → {type(e).__name__}: {e}")
        return False


def get_uptime_kuma_auth_token() -> Optional[str]:
    """Authenticate with Uptime Kuma and get session token"""
    try:
        # Note: Uptime Kuma uses cookie-based auth; requests will handle this
        login_url = f"{UPTIME_KUMA_URL}/api/auth/login"
        payload = {
            "username": UPTIME_KUMA_USERNAME,
            "password": UPTIME_KUMA_PASSWORD,
        }
        response = requests.post(login_url, json=payload, timeout=10)
        response.raise_for_status()
        data = response.json()
        if data.get("ok"):
            print(f"✅ Uptime Kuma authentication successful")
            return response.cookies
        else:
            print(f"❌ Uptime Kuma auth failed: {data.get('msg', 'unknown error')}")
            return None
    except Exception as e:
        print(f"❌ Uptime Kuma login error: {type(e).__name__}: {e}")
        return None


def add_uptime_monitor(cookies) -> bool:
    """Add Portainer health monitor to Uptime Kuma"""
    try:
        # Check if monitor already exists
        monitors_url = f"{UPTIME_KUMA_URL}/api/monitor"
        monitors_resp = requests.get(monitors_url, cookies=cookies, timeout=10)
        monitors_resp.raise_for_status()
        monitors = monitors_resp.json().get("monitors", [])

        portainer_exists = any(
            m.get("name") == PORTAINER_MONITOR_CONFIG["name"] for m in monitors
        )
        if portainer_exists:
            print(f"✅ Portainer monitor already exists in Uptime Kuma")
            return True

        # Add new monitor
        add_url = f"{UPTIME_KUMA_URL}/api/monitor/add"
        add_resp = requests.post(
            add_url, json=PORTAINER_MONITOR_CONFIG, cookies=cookies, timeout=10
        )
        add_resp.raise_for_status()
        data = add_resp.json()
        if data.get("ok"):
            print(f"✅ Portainer monitor added to Uptime Kuma (ID: {data.get('monitorID')})")
            return True
        else:
            print(f"❌ Failed to add monitor: {data.get('msg', 'unknown error')}")
            return False
    except Exception as e:
        print(f"❌ Uptime Kuma monitor creation error: {type(e).__name__}: {e}")
        return False


def create_grafana_dashboard() -> bool:
    """Create Grafana dashboard for Portainer metrics"""
    try:
        # Grafana API uses basic auth
        auth = (GRAFANA_USERNAME, GRAFANA_PASSWORD)
        url = f"{GRAFANA_URL}/api/dashboards/db"

        response = requests.post(
            url, json=PORTAINER_DASHBOARD, auth=auth, timeout=10
        )
        response.raise_for_status()
        data = response.json()
        if data.get("id"):
            print(
                f"✅ Grafana dashboard created (ID: {data.get('id')}, Slug: {data.get('slug')})"
            )
            return True
        else:
            print(f"⚠️  Dashboard response: {data}")
            return True  # Don't fail if it already exists
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 412:
            print(f"✅ Grafana dashboard already exists (skipping)")
            return True
        else:
            print(f"❌ Grafana dashboard error: HTTP {e.response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Grafana dashboard creation error: {type(e).__name__}: {e}")
        return False


def validate_prometheus_scrape() -> bool:
    """Validate that Prometheus has Portainer scrape job configured"""
    try:
        targets_url = f"{PROMETHEUS_URL}/api/v1/targets"
        response = requests.get(targets_url, timeout=10)
        response.raise_for_status()
        data = response.json()

        if data.get("status") != "success":
            print(f"❌ Prometheus targets query failed")
            return False

        targets = data.get("data", {}).get("activeTargets", [])
        portainer_targets = [
            t for t in targets if t.get("labels", {}).get("job") == "portainer"
        ]

        if not portainer_targets:
            print(f"⚠️  Portainer scrape job not found in Prometheus")
            return False

        up_count = sum(1 for t in portainer_targets if t.get("health") == "up")
        print(f"✅ Prometheus scrape job 'portainer': {up_count}/{len(portainer_targets)} UP")
        return up_count > 0
    except Exception as e:
        print(f"❌ Prometheus validation error: {type(e).__name__}: {e}")
        return False


def main():
    """Main integration workflow"""
    print("\n" + "=" * 70)
    print("PHASE 2: PORTAINER INTEGRATION - Monitoring & Health Checks")
    print("=" * 70 + "\n")

    # Step 1: Validate endpoints
    print("📋 Step 1: Validating endpoint accessibility...")
    print("-" * 70)
    endpoints_valid = True
    endpoints_valid &= validate_endpoint(PORTAINER_URL, "/api/status")
    endpoints_valid &= validate_endpoint(UPTIME_KUMA_URL, "/")
    endpoints_valid &= validate_endpoint(GRAFANA_URL, "/")
    endpoints_valid &= validate_endpoint(PROMETHEUS_URL, "/")

    if not endpoints_valid:
        print(
            "\n⚠️  Some endpoints not accessible. This may be expected in CI/test environment."
        )
    print()

    # Step 2: Uptime Kuma monitor
    print("📋 Step 2: Adding Portainer monitor to Uptime Kuma...")
    print("-" * 70)
    cookies = get_uptime_kuma_auth_token()
    if cookies:
        uptime_success = add_uptime_monitor(cookies)
    else:
        print("⚠️  Skipping Uptime Kuma monitor (auth failed)")
        uptime_success = False
    print()

    # Step 3: Grafana dashboard
    print("📋 Step 3: Creating Grafana dashboard for Portainer...")
    print("-" * 70)
    grafana_success = create_grafana_dashboard()
    print()

    # Step 4: Prometheus validation
    print("📋 Step 4: Validating Prometheus scrape configuration...")
    print("-" * 70)
    prometheus_success = validate_prometheus_scrape()
    print()

    # Summary
    print("=" * 70)
    print("INTEGRATION SUMMARY")
    print("=" * 70)
    results = {
        "Portainer Endpoint": "✅" if endpoints_valid else "⚠️",
        "Uptime Kuma Monitor": "✅" if uptime_success else "❌",
        "Grafana Dashboard": "✅" if grafana_success else "❌",
        "Prometheus Scrape": "✅" if prometheus_success else "⚠️",
    }

    for name, status in results.items():
        print(f"{status} {name}")

    print("\n🔗 Access URLs (local):")
    print(f"  • Portainer:        {PORTAINER_LOCAL_URL}")
    print(f"  • Uptime Kuma:      {UPTIME_KUMA_LOCAL}")
    print(f"  • Grafana:          {GRAFANA_LOCAL}")
    print(f"  • Prometheus:       {PROMETHEUS_LOCAL}")
    print()

    all_success = uptime_success and grafana_success
    if all_success:
        print("✅ Phase 2 integration complete!")
        return 0
    else:
        print("⚠️  Phase 2 integration partially complete (see warnings above)")
        return 1


if __name__ == "__main__":
    sys.exit(main())
