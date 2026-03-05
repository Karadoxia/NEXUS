# NEXUS-V2 Disaster Recovery Runbook v1.0

**Date Created:** 2025-03-05  
**Last Updated:** 2025-03-05  
**Document Owner:** Infrastructure Team  
**Status:** ACTIVE

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [RTO/RPO Targets](#rtorpo-targets)
3. [Incident Classification](#incident-classification)
4. [Diagnosis Procedures](#diagnosis-procedures)
5. [Recovery Procedures](#recovery-procedures)
6. [Testing & Validation](#testing--validation)
7. [Contact & Escalation](#contact--escalation)

---

## Overview

### Purpose
Complete disaster recovery procedures for NEXUS-V2 infrastructure across:
- Source code repositories
- PostgreSQL databases (3 instances)
- Redis cache
- Docker volumes (Grafana, Prometheus, Loki, etc.)
- TLS certificates (Let's Encrypt)

### Scope
- **IN:** Total NEXUS-V2 infrastructure recovery
- **OUT:** Application-level data recovery (beyond backup scope), source control history beyond 30 days

### Critical Assets
| Asset | Backup Frequency | Storage | Off-Site | Version |
|-------|------------------|---------|----------|---------|
| Source Code | 30 min | /mnt/Data_Disk | Daily | Latest |
| PostgreSQL | 30 min | /mnt/Data_Disk | Daily | Latest |
| Docker Volumes | 30 min | /mnt/Data_Disk | Daily | Latest |
| TLS Certs | 30 min | /mnt/Data_Disk | Daily | Latest |
| Config Files | 30 min | docker-compose.yml | Daily | Versioned |

---

## RTO/RPO Targets

### Recovery Time Objective (RTO)
**Target: < 30 minutes from incident detection to service availability**

| Scenario | RTO | Notes |
|----------|-----|-------|
| Single container failure | 2 min | Auto-restart via restart policy |
| Database connection loss | 5 min | Docker restart + health check |
| Volume corruption | 15 min | Volume restore from backup |
| Host failure (new hardware) | 30 min | Full restore_nexus.sh execution |
| Complete data loss | 45 min | Source + DB + volume restore |

### Recovery Point Objective (RPO)
**Target: < 30 minutes of data loss**

Backup Schedule:
- **Local backups:** Every 30 minutes to `/mnt/Data_Disk/Nexus-BCKP/`
- **Off-site sync:** Every 24 hours (daily) to S3/Backblaze
- **Maximum data loss:** 30 minutes (time since last backup)
- **Cron configuration:**
  ```bash
  # Local backup every 30 min
  0,30 * * * * /home/redbend/Desktop/Local-Projects/NEXUS-V2/backup_nexus.sh

  # Off-site backup daily at 2 AM
  0 2 * * * ENABLE_OFFSITE=1 /home/redbend/Desktop/Local-Projects/NEXUS-V2/backup_nexus.sh
  ```

---

## Incident Classification

### Severity Levels

#### 🔴 CRITICAL (P1) - Activate Full DR
All of these:
- Complete infrastructure unavailability
- Multiple core services (app + DB + cache) down
- User-facing APIs returning 5xx errors
- Data inaccessible for > 5 minutes

**Procedure:** Activate full restore_nexus.sh

---

#### 🟡 HIGH (P2) - Partial Restoration
One or more:
- Single database instance down (others operational)
- API responding but performance degraded (>2s latency)
- Monitoring/logging unavailable (service runs, visibility lost)
- One Docker volume corrupted

**Procedure:** Service-specific restore (see Recovery Procedures)

---

#### 🟢 MEDIUM (P3) - Isolated Component Failure
- Single container crashed (auto-restart successful)
- Cache miss/Redis performance degradation
- Certificate renewal delayed (< 14 days to expiry)
- Non-critical exporter offline

**Procedure:** Monitor, troubleshoot, manual restart if needed

---

## Diagnosis Procedures

### Step 1: Assess Current State (5 minutes)

**Execute:**
```bash
cd /home/redbend/Desktop/Local-Projects/NEXUS-V2

# Check docker-compose status
docker compose ps

# Count healthy vs total services
docker compose ps --format json | jq '.[] | .State' | sort | uniq -c

# Check recent error logs
docker compose logs --tail=100 | grep -i error

# System resources
docker stats --no-stream | head -20
```

**Determine:**
- [ ] How many services are failing?
- [ ] Is the failure affecting user-facing APIs (nexus-app)?
- [ ] Are databases responding?
- [ ] Is it a resource exhaustion issue (OOM, disk full)?

### Step 2: Identify Failure Root Cause (5-15 minutes)

**Command:**
```bash
# Check specific service logs
docker compose logs <service_name> --tail=50

# Check Docker disk usage
docker system df

# Check host disk
df -h /mnt

# Check PostgreSQL connections
docker compose exec -T postgres psql -U postgres -c "SELECT count(*) FROM pg_stat_activity;"

# Check Redis
docker compose exec -T redis redis-cli info stats
```

**Root Cause Matrix:**

| Symptom | Cause | Action |
|---------|-------|--------|
| All services unhealthy | Host OS crashed / Reboot | `docker compose up -d` |
| One service in CrashLoop | Code error / Config | Check logs, rollback code |
| DB unresponsive | Connection limit | Restart postgres: `docker compose restart postgres` |
| Disk full | Logs/Docker bloat | `docker system prune`, `docker volume prune` |
| Latency spike | Resource exhaustion | `docker stats`, scale down non-essential services |
| Volume corruption | Hardware issue | **→ RESTORE** from backup |

---

## Recovery Procedures

### SCENARIO A: Single Service Failure (P3)

**Example:** Grafana container crashed

**Step 1: Restart Service (1 minute)**
```bash
docker compose restart grafana
docker compose logs grafana --tail=20
```

**Step 2: Verify (2 minutes)**
```bash
docker compose exec -T grafana curl http://localhost:3000/api/health
# Expect: {"status":"Ok"}
```

**If still failing:** Proceed to Volume Restoration (Scenario B)

---

### SCENARIO B: Volume Corruption or Data Loss (P2)

**Example:** PostgreSQL data corruption, Grafana dashboards lost

**Step 1: Identify Corrupt Volume (2 minutes)**
```bash
docker compose ps | grep postgres
# Verify it's in unhealthy state or can't write
docker compose exec -T postgres pg_isready -U postgres
# If hangs or errors: likely corruption
```

**Step 2: Restore Single Volume (10 minutes)**
```bash
# Locate latest backup
BACKUP_DIR=$(ls -td /mnt/Data_Disk/Nexus-BCKP/backup_* | head -1)

# Stop dependent services
docker compose stop postgres grafana prometheus

# Restore single volume
docker volume rm nexus_v2_postgres_data
docker volume create nexus_v2_postgres_data
docker run --rm -v "$BACKUP_DIR/docker-volume_postgres.tar.gz:/backup.tar.gz" \
  -v nexus_v2_postgres_data:/target alpine tar xzf /backup.tar.gz -C /target

# Start services
docker compose up -d postgres grafana prometheus

# Verify
docker compose logs postgres -f --until=30s
```

**Step 3: Health Check (5 minutes)**
```bash
docker compose exec -T postgres pg_isready -U postgres
# Expect: 3 (accepting connections)

docker compose logs postgres | grep "database system is ready"
# Expect: Success message
```

**If volume restore fails:** Proceed to Full Restoration (Scenario C)

---

### SCENARIO C: Complete Infrastructure Failure (P1)

**Example:** Host crashed, all volumes lost, need full rebuild

**⚠️ WARNING: This will overwrite all current data. Confirm with team lead.**

**Step 1: Pre-Restore Backup (2 minutes)**
```bash
# Back up current state (in case manual recovery needed)
docker compose ps > /tmp/service_state_preRestore.txt
docker volume ls > /tmp/volume_state_preRestore.txt
```

**Step 2: Run Automated Restoration (15-25 minutes)**
```bash
# Dry-run first (no changes)
bash /home/redbend/Desktop/Local-Projects/NEXUS-V2/restore_nexus.sh --dry-run

# Review output, then proceed with full restore
bash /home/redbend/Desktop/Local-Projects/NEXUS-V2/restore_nexus.sh --restore

# Monitor restoration
tail -f /var/log/nexus_restore_*.log

# Expected output:
#  ✓ Source code restored
#  ✓ Postgres (×3) restored
#  ✓ Volumes restored
#  ✓ Certificates restored
#  ✓ All services healthy
```

**Step 3: Verify Restoration (5 minutes)**
```bash
# Check all services running
docker compose ps | grep "Up"  # Should match all 30 services

# Verify data integrity
docker compose exec -T postgres psql -U postgres -c "SELECT count(*) FROM information_schema.tables WHERE table_schema='public';"
# Expect: High count (> 50 tables)

# Verify APIs responding
curl -s http://localhost:3030/api/health | jq .  # nexus-app
curl -s http://localhost:9090/api/v1/targets | jq '.data | length'  # prometheus

# Verify Grafana dashboards
curl -s http://localhost:3000/api/health | jq .
```

**Step 4: Notify Team (2 minutes)**
```bash
# Send Telegram notification
curl -X POST https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage \
  -d chat_id=${TELEGRAM_CHAT_ID} \
  -d text="✅ NEXUS-V2 restored from backup at $(date). All services healthy."
```

---

### SCENARIO D: Off-Site Disaster Recovery (Lost Local Backup)

**If `/mnt/Data_Disk/` is inaccessible or corrupted:**

**Step 1: Retrieve Backup from S3/Backblaze**
```bash
# If using AWS S3
aws s3 cp s3://backups-nexus-v2/nexus-v2/latest/ \
  /tmp/nexus_recovery/ --recursive

# If using Backblaze via rclone
rclone copy b2:nexus-v2/latest /tmp/nexus_recovery/

# Verify download
du -sh /tmp/nexus_recovery/
# Expect: ~5-10GB (depending on data size)
```

**Step 2: Run Restoration from Off-Site Backup**
```bash
bash /home/redbend/Desktop/Local-Projects/NEXUS-V2/restore_nexus.sh \
  --restore \
  --backup-dir /tmp/nexus_recovery/backup_YYYY-MM-DD_HH-MM-SS

# Monitor as in Scenario C, Step 2
```

---

## Testing & Validation

### Monthly Disaster Recovery Drill (REQUIRED)

**Schedule:** First Friday of each month, 2:00-3:00 AM (off-hours)

**Procedure:**
```bash
# 1. Alert team (automated Slack/Telegram)
# 2. Take snapshot of current Prometheus metrics
docker compose exec -T prometheus \
  curl http://localhost:9090/api/v1/query?query=up | jq > /tmp/metrics_pre_test.json

# 3. Run dry-run restoration
bash /home/redbend/Desktop/Local-Projects/NEXUS-V2/restore_nexus.sh --dry-run

# 4. Verify dry-run output (should complete without errors)
# 5. Compare metrics pre/post
# 6. Document results in RECOVERY_TEST_LOG.md
# 7. Alert team: DR drill complete, no actual changes made
```

**Success Criteria:**
- [ ] Dry-run completes without errors
- [ ] No actual data changes
- [ ] All 30 services verified healthy
- [ ] Restoration would take < 30 minutes (from log output)

**Document:**
- Time taken for each phase
- Any errors or failures
- Corrective actions needed
- Officer signature

---

### Automated Health Checks

**Schedule:** Every 6 hours (production monitoring)

```bash
# Non-destructive health check
bash /home/redbend/Desktop/Local-Projects/NEXUS-V2/restore_nexus.sh --health-check

# Checks performed:
#  - Docker Compose config validity
#  - All 30 services running
#  - Database connectivity
#  - Redis connectivity
#  - API endpoints responsive
#  - Certificate expiry (> 7 days)
```

---

## Contact & Escalation

### On-Call Rotation

| Shift | Person | Phone | Email |
|-------|--------|-------|-------|
| 9-5 M-F | Casper Tech | +1-XXX-XXX-XXXX | caspertech92@gmail.com |
| 5-9 PM | On-Call #1 | TBD | TBD |
| 9 PM-9 AM | On-Call #2 | TBD | TBD |
| Weekends | Manager On-Duty | TBD | TBD |

### Escalation Path

1. **Incident Detection (Auto-Alert)**
   - Prometheus fires alert → Telegram bot notifies
   - Alert includes: Service name, severity, remediation link

2. **P3 (Medium) - Auto-Restart**
   - Docker's restart policy auto-recovers
   - Alert team, no escalation required

3. **P2 (High) - Manual Intervention**
   - Page on-call engineer
   - Execute Scenario B procedures (volume restore)
   - Time limit: 15 minutes to restore service

4. **P1 (Critical) - Full Escalation**
   - Wake manager & team lead
   - Authorize data restoration (Scenario C)
   - Assemble incident response team
   - Time limit: 5 minutes to start, 30 minutes to restore

### Communication Template

**Team Alert (Slack/Email):**
```
🚨 INCIDENT: NEXUS-V2 Service Degradation

Severity: [P1/P2/P3]
Affected Service: [Service Name]
Start Time: [HH:MM UTC]
Status: [INVESTIGATING / RESTORING / RESOLVED]

Action:
[Scenario-specific procedure]

ETA Recovery: [Time]

Details:
[root cause + brief context]

Updates: #nexus-incidents Slack channel
```

**Resolution Notification:**
```
✅ RESOLVED: NEXUS-V2 Service Restored

Severity: [P1/P2/P3]
Incident Time: [Duration]
Root Cause: [Brief explanation]
Data Loss: [None / < 30 min]
Recovery Method: [Automatic / Manual / Restore from Backup]

Post-Incident:  RCA + fixes due by [Date]
```

---

## Verification Checklist

**After any recovery procedure, verify:**

- [ ] All 30 services in `docker compose ps` show "Up"
- [ ] Prometheus targets healthy: `curl http://localhost:9090/api/v1/targets`
- [ ] Grafana dashboards loading: `curl http://localhost:3000/api/health`
- [ ] PostgreSQL databases accessible:
  ```bash
  docker compose exec -T postgres psql -l
  # Expect: nexus_v2, nexus_ai, nexus_infra, n8n databases listed
  ```
- [ ] Redis responding: `docker compose exec -T redis redis-cli ping`
- [ ] App API healthy: `curl http://localhost:3030/api/health`
- [ ] TLS certificates valid: `curl https://app.nexus-io.duckdns.org/ -vI | grep certificate`
- [ ] No data loss: Compare record counts in DBs pre/post restore
- [ ] Alert metrics normal: `curl http://localhost:9090/api/v1/alerts`

---

## Appendix A: Backup File Locations

```
/mnt/Data_Disk/Nexus-BCKP/
├── backup_2025-03-05_14-00-00/
│   ├── source/                          # Full source code
│   ├── docker-volume_postgres.tar.gz    # Database 1
│   ├── docker-volume_postgres-ai.tar.gz # Database 2
│   ├── docker-volume_postgres-infra.tar.gz # Database 3
│   ├── docker-volume_grafana.tar.gz     # Grafana dashboards
│   ├── docker-volume_prometheus.tar.gz  # Prometheus metrics
│   ├── docker-volume_loki.tar.gz        # Loki logs
│   ├── postgres_nexus_v2.sql.gz         # Database dump
│   ├── postgres_nexus_ai.sql.gz         # Database dump
│   ├── postgres_nexus_infra.sql.gz      # Database dump
│   ├── letsencrypt.tar.gz               # TLS certificates
│   ├── n8n-workflows.tar.gz             # N8N definitions
│   ├── MANIFEST.txt                     # Recovery procedures
│   └── *.md5                            # Checksums
├── backup_2025-03-05_13-30-00/
├── ...
└── backup.log  # Backup execution log
```

**Retention Policy:** Backups older than 30 days auto-deleted

---

## Appendix B: Automated Testing Script

**File:** `test_disaster_recovery.sh` (run monthly)

```bash
#!/bin/bash
# Monthly DR test - validates restoration capability without actual changes

DATE=$(date +%Y-%m-%d)
LOG_FILE="/var/log/nexus_dr_test_${DATE}.log"

echo "Starting DR Drill at $(date)" > "$LOG_FILE"

# Find latest backup
BACKUP=$(ls -td /mnt/Data_Disk/Nexus-BCKP/backup_* | head -1)
echo "Testing with backup: $BACKUP" >> "$LOG_FILE"

# Dry-run restoration
bash /home/redbend/Desktop/Local-Projects/NEXUS-V2/restore_nexus.sh --dry-run >> "$LOG_FILE" 2>&1

if [ $? -eq 0 ]; then
  echo "✅ DR Drill PASSED: $(date)" >> "$LOG_FILE"
  # Send success notification
  curl -X POST https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage \
    -d chat_id=${TELEGRAM_CHAT_ID} \
    -d text="✅ DR Drill $(date +%Y-%m-%d): PASSED - Restoration verified"
else
  echo "❌ DR Drill FAILED: $(date)" >> "$LOG_FILE"
  # Send failure alert
  curl -X POST https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage \
    -d chat_id=${TELEGRAM_CHAT_ID} \
    -d text="❌ DR Drill FAILED - Check $LOG_FILE"
fi

cat "$LOG_FILE"
```

---

## Version History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-03-05 | 1.0 | Initial runbook | Infrastructure Team |

---

**PRINTED: $(date)**

⚠️ **This is a CRITICAL document. Keep current and test monthly.**
