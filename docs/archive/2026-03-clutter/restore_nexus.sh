#!/bin/bash

################################################################################
# restore_nexus.sh - NEXUS-V2 Automated Disaster Recovery & Full Restoration
#
# Purpose:
#   Complete restoration of NEXUS-V2 from backup in case of:
#   - Complete infrastructure failure
#   - Corrupted Docker volumes/database
#   - Ransomware attack requiring bare-metal recovery
#   - Planned migration to new hardware
#
# Targets:
#   1. Restore source code from backup
#   2. Restore Docker volumes (postgres, grafana, loki, redis, etc.)
#   3. Restore PostgreSQL database dumps to fresh instances
#   4. Restore TLS certificates (Let's Encrypt)
#   5. Verify all services boot correctly
#   6. Run health checks
#
# Pre-requisites:
#   - Docker & Docker Compose installed
#   - Backup files accessible at: /mnt/Data_Disk/Nexus-BCKP/
#   - Sufficient disk space (2x backup size minimum)
#   - Network connectivity to pull images during restore
#
# Usage:
#   1. Dry-run (no changes):   bash restore_nexus.sh --dry-run
#   2. Full restore:           bash restore_nexus.sh --restore
#   3. Restore from specific:  bash restore_nexus.sh --restore --backup-dir /path/to/backup_2025-03-05_14-30-00
#   4. Health check only:      bash restore_nexus.sh --health-check
#
# RTO/RPO Targets:
#   - Recovery Time Objective (RTO): < 30 minutes from backup to full service
#   - Recovery Point Objective (RPO): < 30 minutes (backup frequency)
#
################################################################################

set -e

# === CONFIGURATION ===
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BACKUP_ROOT="/mnt/Data_Disk/Nexus-BCKP"
NEXUS_ROOT="$SCRIPT_DIR"
DRY_RUN=false
HEALTH_CHECK_ONLY=false
SPECIFIC_BACKUP=""
LOG_FILE="/var/log/nexus_restore_$(date +%s).log"

# HighAvailability settings
MAX_RESTORE_RETRY=3
HEALTH_CHECK_TIMEOUT=300  # 5 minutes
HEALTH_CHECK_INTERVAL=10  # 10 seconds

# === UTILS ===
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"
}

error() {
  echo "[ERROR] $*" | tee -a "$LOG_FILE"
  exit 1
}

warn() {
  echo "[WARN] $*" | tee -a "$LOG_FILE"
}

success() {
  echo "[✓] $*" | tee -a "$LOG_FILE"
}

confirm() {
  local prompt="$1"
  local response
  read -p "$prompt (yes/no): " response
  [[ "$response" == "yes" ]]
}

# === ARGUMENT PARSING ===
while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run)
      DRY_RUN=true
      log "Running in DRY-RUN mode (no changes will be made)"
      shift
      ;;
    --restore)
      DRY_RUN=false
      shift
      ;;
    --health-check)
      HEALTH_CHECK_ONLY=true
      shift
      ;;
    --backup-dir)
      SPECIFIC_BACKUP="$2"
      shift 2
      ;;
    *)
      error "Unknown argument: $1"
      ;;
  esac
done

# === PHASE 0: VALIDATION ===
log "========================================"
log "NEXUS-V2 DISASTER RECOVERY - Starting"
log "========================================"
log "Timestamp: $(date)"
log "Log file: $LOG_FILE"

# Find latest backup
if [ -z "$SPECIFIC_BACKUP" ]; then
  LATEST_BACKUP=$(find "$BACKUP_ROOT" -maxdepth 1 -name "backup_*" -type d -printf '%T@ %p\n' | sort -rn | head -1 | cut -d' ' -f2-)
  if [ -z "$LATEST_BACKUP" ]; then
    error "No backups found in $BACKUP_ROOT"
  fi
  BACKUP_DIR="$LATEST_BACKUP"
else
  BACKUP_DIR="$SPECIFIC_BACKUP"
fi

log "Using backup: $BACKUP_DIR"
[ -d "$BACKUP_DIR" ] || error "Backup directory not found: $BACKUP_DIR"

# Verify critical backup files exist
log "Verifying backup integrity..."
required_files=("source/docker-compose.yml" "postgres_nexus_v2.sql.gz" "letsencrypt.tar.gz" "MANIFEST.txt")
for file in "${required_files[@]}"; do
  if [ -f "$BACKUP_DIR/$file" ]; then
    success "Found: $file"
  else
    warn "Missing: $file (may affect restoration)"
  fi
done

# Check disk space
BACKUP_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)
AVAILABLE=$(df "$NEXUS_ROOT" | awk 'NR==2 {print $4}')
log "Backup size: $BACKUP_SIZE"
log "Available disk space: ~$((AVAILABLE/1024))MB"

if [ "$AVAILABLE" -lt 2000000 ]; then  # < 2GB free
  error "Insufficient disk space. Need at least 2GB free."
fi

# === HEALTH CHECK MODE ===
if [ "$HEALTH_CHECK_ONLY" = true ]; then
  log "Running health checks only..."
  
  log "Checking Docker Compose stack..."
  cd "$NEXUS_ROOT"
  docker compose config > /dev/null 2>&1 || error "Invalid docker-compose.yml"
  
  log "Checking service statuses..."
  docker compose ps --format "table {{.Service}}\t{{.Status}}" || warn "Could not fetch service status"
  
  log "Checking database connections..."
  for db_svc in postgres postgres-ai postgres-infra; do
    if docker compose exec -T "$db_svc" pg_isready -U postgres > /dev/null 2>&1; then
      success "$db_svc is accessible"
    else
      warn "$db_svc is not responding"
    fi
  done
  
  success "Health check complete. See log: $LOG_FILE"
  exit 0
fi

# === DRY RUN CONFIRMATION ===
if [ "$DRY_RUN" = false ]; then
  log ""
  log "⚠️  WARNING: This will restore NEXUS-V2 from backup."
  log "   All current data will be overwritten."
  log "   This operation requires downtime."
  log ""
  confirm "Do you want to proceed with full restoration?" || error "Restoration cancelled"
fi

# === PHASE 1: STOP EXISTING STACK ===
log ""
log "PHASE 1: Stopping existing Docker Compose stack..."
cd "$NEXUS_ROOT"

if docker compose ps 2>/dev/null | grep -q "running"; then
  if [ "$DRY_RUN" = false ]; then
    docker compose down --remove-orphans || warn "Some services failed to stop gracefully"
    sleep 5
    success "Stack stopped"
  else
    log "[DRY-RUN] Would stop all services"
  fi
else
  log "No running services to stop"
fi

# === PHASE 2: RESTORE SOURCE CODE ===
log ""
log "PHASE 2: Restoring source code..."
if [ "$DRY_RUN" = false ]; then
  # Backup current source first
  if [ -d "$NEXUS_ROOT/.git" ]; then
    log "Creating source backup before restore..."
    tar czf "/mnt/Data_Disk/Nexus-BCKP/source_backup_pre_restore_$(date +%s).tar.gz" \
      --exclude=.git --exclude=.env --exclude=node_modules \
      -C "$NEXUS_ROOT" . 2>/dev/null || warn "Source backup failed (non-critical)"
  fi
  
  # Restore from backup
  log "Extracting source from backup..."
  rsync -av --delete "$BACKUP_DIR/source/" "$NEXUS_ROOT/" \
    --exclude=.git --exclude=.env --exclude=node_modules || error "Source restore failed"
  success "Source code restored"
else
  log "[DRY-RUN] Would restore source code from $BACKUP_DIR/source/"
fi

# === PHASE 3: RESTORE DOCKER VOLUMES ===
log ""
log "PHASE 3: Restoring Docker volumes..."
VOLUMES=(
  "nexus_v2_postgres_data:postgres"
  "nexus_ai_postgres_data:postgres-ai"
  "nexus_infra_postgres_data:postgres-infra"
  "grafana-data:grafana"
  "prometheus-data:prometheus"
  "loki-data:loki"
  "alertmanager-data:alertmanager"
  "n8n-data:n8n"
  "uptime-data:uptime-kuma"
  "vw-data:vaultwarden"
  "portainer_data:portainer"
  "redis-data:redis"
)

for vol_spec in "${VOLUMES[@]}"; do
  IFS=':' read -r vol_name vol_label <<< "$vol_spec"
  tar_file="$BACKUP_DIR/docker-volume_${vol_label}.tar.gz"
  
  if [ -f "$tar_file" ]; then
    if [ "$DRY_RUN" = false ]; then
      log "Restoring volume: $vol_name"
      
      # Remove old volume
      docker volume rm "$vol_name" 2>/dev/null || true
      
      # Create fresh volume
      docker volume create "$vol_name" || error "Failed to create volume $vol_name"
      
      # Extract backup into volume
      docker run --rm -v "$tar_file:/backup.tar.gz" -v "$vol_name:/target" \
        alpine tar xzf /backup.tar.gz -C /target || error "Failed to restore volume $vol_name"
      
      success "Restored: $vol_name"
    else
      log "[DRY-RUN] Would restore $vol_name from $tar_file"
    fi
  else
    warn "Volume backup not found: $tar_file (skipping)"
  fi
done

# === PHASE 4: RESTORE DATABASES ===
log ""
log "PHASE 4: Restoring PostgreSQL databases..."
if [ "$DRY_RUN" = false ]; then
  # Bring up postgres services only
  log "Starting PostgreSQL services..."
  docker compose up -d postgres postgres-ai postgres-infra || error "Failed to start Postgres services"
  
  # Wait for databases to be ready
  log "Waiting for databases to be ready..."
  sleep 10
  for db_svc in postgres postgres-ai postgres-infra; do
    retries=30
    while ! docker compose exec -T "$db_svc" pg_isready -U postgres > /dev/null 2>&1; do
      retries=$((retries - 1))
      if [ $retries -eq 0 ]; then
        error "$db_svc failed to start"
      fi
      sleep 2
    done
    success "$db_svc ready"
  done
  
  # Restore databases
  databases=("nexus_v2:postgres" "nexus_hr:postgres" "nexus_ai:postgres-ai" "nexus_infra:postgres-infra" "n8n:postgres-infra")
  for db_spec in "${databases[@]}"; do
    IFS=':' read -r db_name db_svc <<< "$db_spec"
    dump_file="$BACKUP_DIR/postgres_${db_name}.sql.gz"
    
    if [ -f "$dump_file" ]; then
      log "Restoring database: $db_name"
      gunzip -c "$dump_file" | docker compose exec -T "$db_svc" psql -U postgres -d postgres || error "Failed to restore $db_name"
      success "Restored: $db_name"
    else
      warn "Database dump not found: $dump_file (skipping)"
    fi
  done
else
  log "[DRY-RUN] Would restore PostgreSQL databases from dumps"
fi

# === PHASE 5: RESTORE CERTIFICATES ===
log ""
log "PHASE 5: Restoring TLS certificates..."
if [ -f "$BACKUP_DIR/letsencrypt.tar.gz" ]; then
  if [ "$DRY_RUN" = false ]; then
    log "Extracting Let's Encrypt certificates..."
    tar xzf "$BACKUP_DIR/letsencrypt.tar.gz" -C "$NEXUS_ROOT/" || error "Failed to restore certificates"
    success "Certificates restored"
  else
    log "[DRY-RUN] Would restore certificates from $BACKUP_DIR/letsencrypt.tar.gz"
  fi
else
  warn "Certificate backup not found (Traefik will auto-generate)"
fi

# === PHASE 6: BRING UP FULL STACK ===
log ""
log "PHASE 6: Starting full Docker Compose stack..."
if [ "$DRY_RUN" = false ]; then
  cd "$NEXUS_ROOT"
  docker compose up -d || error "Failed to start Docker Compose stack"
  success "Docker Compose stack started"
  
  # Wait for services to stabilize
  log "Waiting for services to stabilize (${HEALTH_CHECK_TIMEOUT}s timeout)..."
  start_time=$(date +%s)
  timeout=$((start_time + HEALTH_CHECK_TIMEOUT))
  healthy=0
  total_services=$(docker compose config --services | wc -l)
  
  while [ $(date +%s) -lt $timeout ]; do
    healthy=$(docker compose ps --format json | jq -r '.[] | select(.State=="running") | .Service' | wc -l)
    log "  Services healthy: $healthy/$total_services"
    
    if [ "$healthy" -eq "$total_services" ]; then
      success "All services stable"
      break
    fi
    sleep $HEALTH_CHECK_INTERVAL
  done
  
  if [ "$healthy" -ne "$total_services" ]; then
    warn "Not all services are healthy yet. Check logs with: docker compose logs"
  fi
else
  log "[DRY-RUN] Would start full Docker Compose stack"
fi

# === PHASE 7: HEALTH CHECKS ===
log ""
log "PHASE 7: Running post-restore health checks..."
if [ "$DRY_RUN" = false ]; then
  # Check Postgres
  for db_svc in postgres postgres-ai postgres-infra; do
    if docker compose exec -T "$db_svc" pg_isready -U postgres > /dev/null 2>&1; then
      success "$db_svc is accessible"
    else
      error "$db_svc failed health check"
    fi
  done
  
  # Check Redis
  if docker compose exec -T redis redis-cli ping > /dev/null 2>&1; then
    success "redis is accessible"
  else
    warn "redis failed ping test"
  fi
  
  # Check app endpoint
  if docker compose exec -T nexus-app curl -s http://localhost:3030/api/health > /dev/null 2>&1; then
    success "nexus-app /api/health is responding"
  else
    warn "nexus-app health endpoint not responding yet (may take a moment)"
  fi
  
  # Check Prometheus targets
  if docker compose exec -T prometheus curl -s http://localhost:9090/api/v1/targets > /dev/null 2>&1; then
    success "prometheus is accessible"
  else
    warn "prometheus not responding yet"
  fi
else
  log "[DRY-RUN] Would run comprehensive health checks"
fi

# === FINAL REPORT ===
log ""
log "========================================"
log "NEXUS-V2 RESTORATION COMPLETE"
log "========================================"
log "Timestamp: $(date)"
log "Backup used: $BACKUP_DIR"
log "Log file: $LOG_FILE"
log ""
log "NEXT STEPS:"
log "1. Monitor services: docker compose logs -f (in background)"
log "2. Check app health: curl http://localhost:3030/api/health"
log "3. Verify data: Log into Grafana/Prometheus/app"
log "4. Run tests: ./scripts/e2e-tests.sh (if available)"
log "5. Alert team: Send notification that restoration is complete"
log ""

if [ "$DRY_RUN" = true ]; then
  log "📋 This was a DRY-RUN. No changes were made."
  log "Run without --dry-run flag to execute restoration."
else
  success "✅ Restoration process complete. Check services with: docker compose ps"
fi

# === OPTIONAL: VERIFY BACKUP INTEGRITY ===
log ""
log "Verifying backup checksums..."
cd "$BACKUP_DIR"
if command -v md5sum > /dev/null 2>&1; then
  if [ -f "*.md5" ]; then
    md5sum -c *.md5 > /dev/null 2>&1 && success "All backup files verified" || warn "Some backup files failed checksum verification"
  fi
fi

exit 0
