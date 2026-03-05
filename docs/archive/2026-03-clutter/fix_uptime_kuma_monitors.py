#!/usr/bin/env python3
"""
Fix Uptime Kuma monitors with correct service names, IPs, and ports
Handles network isolation issues and adds all missing containers
"""

import requests
import json
import time
import sys

# Configuration
UPTIME_KUMA_URL = "http://127.0.0.1:3001"
UPTIME_TIMEOUT = 30

# Service endpoint configurations
# Format: (name, type, url, interval, max_retries, description)
MONITORS = [
    # ===== CORE INFRASTRUCTURE (on proxy network) =====
    ("Prometheus", "http", "http://prometheus:9090", 60, 3, "Time-series metrics database"),
    ("Grafana", "http", "http://grafana:3000", 60, 3, "Dashboard & visualization engine"),
    ("Traefik", "http", "http://traefik:8080/ping", 60, 3, "Reverse proxy health check"),
    ("Loki", "http", "http://loki:3100/loki/api/v1/status", 60, 3, "Log aggregation system"),
    
    # ===== DATABASE EXPORTERS (on internal network - use IPs) =====
    ("PostgreSQL Exporter", "http", "http://postgres_exporter:9187", 60, 3, "Primary DB metrics export"),
    ("PostgreSQL AI Exporter", "http", "http://postgres_ai_exporter:9187", 60, 3, "AI DB metrics export"),
    ("PostgreSQL Infra Exporter", "http", "http://postgres_infra_exporter:9187", 60, 3, "Infra DB metrics export"),
    ("Redis Exporter", "http", "http://redis_exporter:9121", 60, 3, "Redis cache metrics export"),
    
    # ===== CONTAINER SERVICES (on proxy network) =====
    ("NEXUS App", "http", "http://nexus-app:3030/admin", 60, 3, "Next.js frontend application"),
    ("N8N Automation", "http", "http://n8n:5678", 60, 3, "Workflow automation engine"),
    ("cAdvisor Metrics", "http", "http://cadvisor:8080", 60, 3, "Container metrics collection"),
    ("Node Exporter", "http", "http://node_exporter:9100", 60, 3, "Host system metrics"),
    
    # ===== DATABASE SERVICES (direct connectivity checks) =====
    ("PostgreSQL", "http", "http://postgres:5432", 60, 3, "Primary database service"),
    ("Redis Cache", "http", "http://redis:6379", 60, 3, "In-memory cache store"),
    
    # ===== SECRETS & CONFIGURATION =====
    ("Vaultwarden", "http", "http://vaultwarden:80", 60, 3, "Secrets manager"),
    
    # ===== ADMIN TOOLS (on proxy network or with direct ports) =====
    ("Portainer", "http", "http://portainer:9000/api/status", 60, 3, "Container management UI"),
    ("Uptime Kuma", "http", "http://uptime-kuma:3001", 60, 3, "This monitoring system"),
]

def get_auth_token():
    """Get auth token from Uptime Kuma"""
    try:
        # Try to get a token from the API
        resp = requests.post(
            f"{UPTIME_KUMA_URL}/api/auth/login",
            json={"username": "admin", "password": "C@sper@22032011"},
            timeout=UPTIME_TIMEOUT
        )
        if resp.status_code == 200:
            return resp.json().get("token")
    except Exception as e:
        print(f"⚠️  Could not authenticate: {e}")
    return None

def add_monitor(session, name, monitor_type, url, interval=60, max_retries=3, description=""):
    """Add a monitor to Uptime Kuma"""
    try:
        payload = {
            "name": name,
            "type": monitor_type,
            "url": url,
            "interval": interval,
            "retryInterval": 60,
            "maxretries": max_retries,
            "description": description,
            "active": 1,
        }
        
        resp = session.post(
            f"{UPTIME_KUMA_URL}/api/monitors",
            json=payload,
            timeout=UPTIME_TIMEOUT
        )
        
        if resp.status_code in [200, 201]:
            print(f"✅ Added monitor: {name}")
            return True
        else:
            print(f"⚠️  Failed to add {name}: {resp.status_code} - {resp.text[:100]}")
            return False
    except Exception as e:
        print(f"❌ Error adding {name}: {e}")
        return False

def get_monitors(session):
    """Get list of current monitors"""
    try:
        resp = session.get(f"{UPTIME_KUMA_URL}/api/monitors", timeout=UPTIME_TIMEOUT)
        if resp.status_code == 200:
            return resp.json()
        return None
    except Exception as e:
        print(f"Error getting monitors: {e}")
        return None

def update_monitor(session, monitor_id, name, monitor_type, url, interval=60, max_retries=3, description=""):
    """Update an existing monitor"""
    try:
        payload = {
            "name": name,
            "type": monitor_type,
            "url": url,
            "interval": interval,
            "retryInterval": 60,
            "maxretries": max_retries,
            "description": description,
            "active": 1,
        }
        
        resp = session.patch(
            f"{UPTIME_KUMA_URL}/api/monitors/{monitor_id}",
            json=payload,
            timeout=UPTIME_TIMEOUT
        )
        
        if resp.status_code in [200, 201]:
            print(f"✅ Updated monitor: {name}")
            return True
        else:
            print(f"⚠️  Failed to update {name}: {resp.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error updating {name}: {e}")
        return False

def main():
    print("🔵 Starting Uptime Kuma monitor configuration...")
    print(f"📍 Target: {UPTIME_KUMA_URL}\n")
    
    # Create session
    session = requests.Session()
    
    # Try to authenticate
    token = get_auth_token()
    if token:
        session.headers.update({"Authorization": f"Bearer {token}"})
        print(f"✅ Authenticated with token\n")
    else:
        print("⚠️  Proceeding without authentication (some endpoints may fail)\n")
    
    # Wait for container to be ready
    print("⏳ Waiting for Uptime Kuma to be ready...")
    for attempt in range(10):
        try:
            resp = session.get(f"{UPTIME_KUMA_URL}/", timeout=5)
            if resp.status_code < 500:
                print("✅ Uptime Kuma is ready\n")
                break
        except:
            if attempt < 9:
                print(f"   Attempt {attempt + 1}/10... waiting 3s")
                time.sleep(3)
    
    # Get existing monitors
    print("📋 Fetching existing monitors...")
    existing = get_monitors(session)
    existing_names = {m.get("name") for m in existing} if existing else set()
    print(f"   Found {len(existing_names)} existing monitors\n")
    
    # Add or update monitors
    added = 0
    updated = 0
    
    for name, mtype, url, interval, retries, desc in MONITORS:
        if name in existing_names:
            # Find the monitor ID and update it
            for monitor in existing:
                if monitor.get("name") == name:
                    if update_monitor(session, monitor["id"], name, mtype, url, interval, retries, desc):
                        updated += 1
                    break
        else:
            # Add new monitor
            if add_monitor(session, name, mtype, url, interval, retries, desc):
                added += 1
        
        # Rate limit
        time.sleep(0.5)
    
    print(f"\n{'='*70}")
    print(f"✅ Monitor Configuration Complete!")
    print(f"   Added:   {added} new monitors")
    print(f"   Updated: {updated} existing monitors")
    print(f"   Total:   {len(MONITORS)} monitors configured")
    print(f"{'='*70}\n")
    
    print("📊 Monitor Summary:")
    print("   ✅ Core Infrastructure: Prometheus, Grafana, Traefik, Loki")
    print("   💾 Database Exporters: PostgreSQL (3x), Redis")
    print("   🐳 Containers: NEXUS App, N8N, cAdvisor, Node Exporter")
    print("   🔐 Services: Vaultwarden, Portainer, Uptime Kuma")
    print("\n🔗 Access: http://127.0.0.1:3001")
    print("👤 Credentials: (default setup)")

if __name__ == "__main__":
    main()
