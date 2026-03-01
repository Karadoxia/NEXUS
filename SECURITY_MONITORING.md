# Security Monitoring & Alerting

Monitor your security infrastructure with Prometheus, Grafana, and n8n.

## Overview

```
┌─────────────────────────────────────────────────────────┐
│  Security Events                                        │
├─────────────────────────────────────────────────────────┤
│  ├─ SSH Failed Logins      → /var/log/auth.log          │
│  ├─ Fail2ban Bans          → /var/log/fail2ban.log      │
│  ├─ Traefik HTTP Errors    → /var/log/traefik/access.log│
│  ├─ CrowdSec Detections    → CrowdSec API               │
│  └─ Docker Events          → Docker daemon logs         │
│                                                         │
│         ↓                                               │
│                                                         │
│  Collection Layer                                       │
│  ├─ Prometheus scrapers                                │
│  ├─ Loki log aggregation                               │
│  ├─ n8n webhooks                                       │
│  └─ Syslog collectors                                  │
│                                                         │
│         ↓                                               │
│                                                         │
│  Storage Layer                                         │
│  ├─ Prometheus time-series DB                          │
│  ├─ Loki logs                                          │
│  └─ Alertmanager state                                 │
│                                                         │
│         ↓                                               │
│                                                         │
│  Visualization                                         │
│  ├─ Grafana dashboards                                 │
│  ├─ Alert notifications (Telegram)                     │
│  └─ Email alerts                                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 1. Monitor SSH Failed Logins

### Grafana Dashboard

1. Go to **Grafana** (http://grafana.nexus-io.duckdns.org)
2. Click **+** → **Create** → **Dashboard**
3. Click **Add Panel**
4. In Query, enter:

```promql
# Failed SSH attempts in last 24 hours
increase(node_systemd_unit_state{name="ssh.service",state="failed"}[24h])

# Or use Loki (logs, not metrics):
{job="auth-log"} | json | err="Failed password"
```

5. Save as "SSH Security Dashboard"

### Alert Rule

In Prometheus, add to `/etc/prometheus/prometheus.yml`:

```yaml
rule_files:
  - /etc/prometheus/rules/*.yml

# Then create /etc/prometheus/rules/ssh.yml:
groups:
  - name: ssh_security
    rules:
      - alert: HighSSHFailures
        expr: rate(node_exporter_ssh_failures_total[5m]) > 5
        for: 1m
        annotations:
          summary: "High SSH failed logins detected"
          description: "{{ $value }} attempts/second"
```

## 2. Monitor Fail2ban Bans

### Real-time Ban Monitoring

```bash
# Live Fail2ban logs
docker compose logs -f fail2ban | grep -E "Ban|Unban"

# Count bans in last hour
grep "Ban" /var/log/fail2ban.log | tail -100 | wc -l

# See banned IPs
sudo fail2ban-client status sshd | grep "Banned IP list"
```

### Prometheus Exporter

Add fail2ban exporter to `docker-compose.yml`:

```yaml
fail2ban-exporter:
  image: till/prometheus-fail2ban-exporter:latest
  container_name: fail2ban_exporter
  restart: unless-stopped
  networks:
    - internal
  volumes:
    - /var/lib/fail2ban:/var/lib/fail2ban:ro
  labels:
    - "traefik.enable=false"
```

### Grafana Dashboard for Fail2ban

```promql
# Banned IPs count
increase(fail2ban_banned_ips_total[1h])

# Ban rate (bans per minute)
rate(fail2ban_banned_ips_total[1m])

# Top jails with most bans
topk(5, increase(fail2ban_jail_bans_total[24h]))
```

## 3. Monitor Traefik Attacks

### HTTP Status Codes

```promql
# 401 Unauthorized (auth failures)
increase(traefik_entrypoint_requests_total{code="401"}[1h])

# 403 Forbidden (access denied)
increase(traefik_entrypoint_requests_total{code="403"}[1h])

# 5xx Server Errors
increase(traefik_entrypoint_requests_total{code=~"5.."}[1h])
```

### Grafana Panel

1. **Type:** Bar Gauge
2. **Query:**
```promql
increase(traefik_entrypoint_requests_total{code=~"4..|5.."}[1h])
```
3. **Alert threshold:** > 50 requests in 1 hour = suspicious

## 4. Monitor CrowdSec

### CrowdSec Metrics

```bash
# View CrowdSec decisions
docker compose exec crowdsec cscli decisions list

# See top IPs
docker compose exec crowdsec cscli decisions list | head -20

# Monitor in real-time
docker compose logs -f crowdsec | grep -E "Decision|Ban"
```

### Add to Prometheus

Create `/etc/crowdsec/acquis.d/prometheus.yml`:

```yaml
source: prometheus
listen_addr: 127.0.0.1:8080
metrics_path: /metrics
```

Then scrape in Prometheus:
```yaml
- job_name: 'crowdsec'
  static_configs:
    - targets: ['crowdsec:8080']
  metrics_path: '/metrics'
```

## 5. Alert to Telegram

### Setup n8n Workflow

1. Go to **n8n** (http://n8n.nexus-io.duckdns.org)
2. Create new workflow: "Security Alerts"
3. Add **Webhook** trigger (POST)
4. Configure trigger URL: `http://n8n:5678/webhook/security-alert`

5. Add **Telegram node**:
   - Account: Use your bot token & chat ID
   - Message: `⚠️ Security Alert: {{ $json.alert_type }}\n{{ $json.message }}`

6. Deploy webhook

### Send Alerts from Services

In Fail2ban config:
```ini
[DEFAULT]
action = %(action_mwl)s webhook

[set-webhook]
actionban = curl -s -X POST "http://n8n:5678/webhook/security-alert" \
  -H "Content-Type: application/json" \
  -d '{"alert_type":"SSH_BAN","ip":"%(ip)s","count":"%(attempts)d"}'
```

In Prometheus AlertManager:
```yaml
global:
  resolve_timeout: 5m
  slack_api_url: 'http://n8n:5678/webhook/prometheus-alert'
```

## 6. Dashboard Panels

### Security Overview Dashboard

Create in Grafana with these panels:

```
┌──────────────────────────────────────────────┐
│  🔒 NEXUS Security Monitoring                 │
├──────────────────────────────────────────────┤
│                                              │
│ SSH Failed Attempts | Fail2ban Bans          │
│ Last 1h: 12        | Active: 3              │
│                                              │
│ HTTP 401s (24h)    | HTTP 403s (24h)        │
│ 45 attempts        | 12 blocks              │
│                                              │
│ Traefik Errors     | CrowdSec Decisions     │
│ Last 1h: 2         | Last 24h: 8            │
│                                              │
│ Top Attack IPs         │ Active Bans         │
│ 203.0.113.45 (12x)     │ 203.0.113.45        │
│ 198.51.100.50 (8x)     │ 198.51.100.50       │
│ 192.0.2.33 (5x)        │ 192.0.2.33          │
│                                              │
└──────────────────────────────────────────────┘
```

### Panel Queries

**SSH Failures (24h):**
```promql
increase(node_exporter_ssh_auth_failures[24h])
```

**Fail2ban Active Bans:**
```promql
fail2ban_jail_active_bans{jail="sshd"}
```

**Traefik Errors:**
```promql
increase(traefik_entrypoint_requests_total{code=~"5.."}[24h])
```

**CrowdSec Recent:**
```promql
increase(crowdsec_decisions_active[24h])
```

## 7. Alerting Rules

### High Priority Alerts

```yaml
groups:
  - name: security_alerts
    interval: 30s
    rules:

      # SSH: 10+ failed attempts in 5 minutes
      - alert: SSHBruteForceAttempt
        expr: rate(node_exporter_ssh_auth_failures[5m]) > 2
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "SSH brute force detected"

      # Fail2ban: Ban rate abnormal
      - alert: FailbanHighBanRate
        expr: rate(fail2ban_banned_ips_total[5m]) > 1
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "High IP ban rate: {{ $value }}/sec"

      # HTTP: 401/403 spike
      - alert: AuthenticationAttack
        expr: increase(traefik_entrypoint_requests_total{code="401"}[5m]) > 20
        for: 1m
        labels:
          severity: warning
        annotations:
          summary: "Authentication attack detected"
```

## 8. Compliance Reporting

### Weekly Security Report

Create n8n workflow:

1. **Trigger:** Cron (every Monday 9 AM)
2. **Query:** Prometheus for last 7 days:
   ```promql
   increase(node_exporter_ssh_auth_failures[7d])
   increase(fail2ban_banned_ips_total[7d])
   increase(traefik_entrypoint_requests_total{code="401"}[7d])
   ```
3. **Format:** Email report
4. **Send to:** caspertech92@gmail.com

## Useful Commands

```bash
# Monitor all security events
tail -f /var/log/auth.log /var/log/fail2ban.log | grep -E "Failed|Ban"

# Count SSH failures by IP
grep "Failed password" /var/log/auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -rn

# See current fail2ban status
sudo fail2ban-client status sshd

# Export Fail2ban metrics
docker compose exec fail2ban-exporter curl localhost:8080/metrics | grep fail2ban

# Query Prometheus
curl "http://prometheus:9090/api/v1/query?query=rate(node_exporter_ssh_auth_failures[5m])"
```

## Links

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Dashboards](https://grafana.com/dashboards/)
- [Fail2ban Monitoring](https://www.fail2ban.org/wiki/index.php/Main_Page)
- [CrowdSec Metrics](https://docs.crowdsec.net/docs/observatory-tutorials/prometheus_monitoring/)

---

**Pro Tip:** Set up daily digest alerts instead of individual notifications to avoid alert fatigue.
