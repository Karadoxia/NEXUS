#!/bin/bash

################################################################################
# backup_nexus.sh - NEXUS-V2 Comprehensive Backup & Replication
# 
# Backs up:
#   1. Source code (rsync)
#   2. Docker volumes (Postgres DBs, Redis, Grafana, Loki, Prometheus)
#   3. Let's Encrypt certificates (Traefik)
#   4. N8N workflows & configurations
#
# Replicates to:
#   1. Local backup disk (/mnt/Data_Disk/Nexus-BCKP/)
#   2. Off-site S3 (via AWS CLI or rclone) — optional
#   3. Verifies backup integrity — checksums
#
# Meant to be run every 30 minutes (local) or daily (off-site) via cron/systemd
#
# Requirements:
#   - Docker daemon access (for volume backup)
#   - rsync, gzip, md5sum
#   - (Optional) aws-cli or rclone for S3 sync
#
# Cron examples:
#   Local backup every 30 min:   0,30 * * * * /home/redbend/Desktop/Local-Projects/NEXUS-V2/backup_nexus.sh
#   Off-site daily at 2 AM:      0 2 * * * ENABLE_OFFSITE=1 /home/redbend/Desktop/Local-Projects/NEXUS-V2/backup_nexus.sh
################################################################################

set -e  # Exit on error

# === CONFIGURATION ===
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SRC="$SCRIPT_DIR/"
BACKUP_ROOT="/mnt/Data_Disk/Nexus-BCKP"
BACKUP_DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_DIR="$BACKUP_ROOT/backup_$BACKUP_DATE"
logfile="$BACKUP_ROOT/backup.log"
manifest="$BACKUP_DIR/MANIFEST.txt"

# Retention
RETENTION_DAYS=${RETENTION_DAYS:-30}
PUID=$(id -u)

# Off-site settings (optional)
ENABLE_OFFSITE=${ENABLE_OFFSITE:-0}
S3_BUCKET=${S3_BUCKET:-"backups-nexus-v2"}       # e.g., s3://backups-nexus-v2/
S3_REGION=${S3_REGION:-"us-east-1"}
RCLONE_REMOTE=${RCLONE_REMOTE:-"b2"}              # Backblaze via rclone (alternative to AWS)

# === UTILS ===
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$logfile"
}

error() {
  echo "[ERROR] $*" | tee -a "$logfile"
  exit 1
}

checksum_file() {
  local file=$1
  md5sum "$file" > "${file}.md5"
  echo "  ✓ Checksum: ${file}.md5"
}

# === MAIN ===
log "===== NEXUS-V2 BACKUP START ====="
mkdir -p "$BACKUP_DIR"

# 1. SOURCE CODE
log "Backing up source code..."
rsync -av --delete --quiet "$SRC" "$BACKUP_DIR/source/" >> "$logfile" 2>&1 || error "rsync failed"
log "  ✓ Source code backed up ($(du -sh "$BACKUP_DIR/source/" | cut -f1))"

# 2. DOCKER VOLUMES
log "Backing up Docker volumes..."
DOCKER_VOLUMES=(
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
  "wireguard-config:wireguard"
  "crowdsec-db:crowdsec"
)

for vol_spec in "${DOCKER_VOLUMES[@]}"; do
  IFS=':' read -r vol_name vol_label <<< "$vol_spec"
  
  if docker volume inspect "$vol_name" >/dev/null 2>&1; then
    tar_file="$BACKUP_DIR/docker-volume_${vol_label}.tar.gz"
    log "  → Volume: $vol_name → $tar_file"
    docker run --rm -v "$vol_name:/backup_data" -v "$BACKUP_DIR:/out" \
      alpine tar czf "/out/docker-volume_${vol_label}.tar.gz" -C /backup_data . 2>&1 || error "Failed to backup volume $vol_name"
    checksum_file "$tar_file"
  else
    log "  ⊘ Volume $vol_name not found (skipped)"
  fi
done
log "  ✓ Docker volumes backed up"

# 3. LET'S ENCRYPT CERTIFICATES
log "Backing up TLS certificates..."
if [ -d "$SRC/letsencrypt" ]; then
  tar czf "$BACKUP_DIR/letsencrypt.tar.gz" -C "$SRC" letsencrypt/ 2>/dev/null || error "Failed to backup letsencrypt"
  checksum_file "$BACKUP_DIR/letsencrypt.tar.gz"
  log "  ✓ Let's Encrypt certs backed up"
else
  log "  ⊘ letsencrypt dir not found (skipped)"
fi

# 4. DATABASE DUMPS (for portability - separate from volume backups)
log "Backing up database dumps..."
for db_name in "nexus_v2" "nexus_hr" "nexus_ai" "nexus_infra" "n8n"; do
  dump_file="$BACKUP_DIR/postgres_${db_name}.sql.gz"
  log "  → Database: $db_name → $dump_file"
  
  # Determine which Postgres host to connect to
  case $db_name in
    nexus_v2|nexus_hr)  pg_host="postgres" ;;
    nexus_ai)           pg_host="postgres-ai" ;;
    nexus_infra|n8n)    pg_host="postgres-infra" ;;
    *)                  pg_host="postgres" ;;
  esac
  
  docker exec -T "$pg_host" pg_dump -U "${db_name%_*}" "$db_name" 2>/dev/null | gzip > "$dump_file" || error "Failed to dump $db_name"
  checksum_file "$dump_file"
done
log "  ✓ Database dumps completed"

# 5. N8N WORKFLOWS (extra safety - also in postgres but good to have separate)
log "Backing up N8N workflows..."
if [ -d "$SRC/n8n-workflows" ]; then
  tar czf "$BACKUP_DIR/n8n-workflows.tar.gz" -C "$SRC" n8n-workflows/ 2>/dev/null || error "Failed to backup n8n-workflows"
  checksum_file "$BACKUP_DIR/n8n-workflows.tar.gz"
  log "  ✓ N8N workflows backed up"
fi

# 6. GENERATE MANIFEST
log "Generating backup manifest..."
cat > "$manifest" << EOF
NEXUS-V2 BACKUP MANIFEST
Generated: $(date)
Location: $BACKUP_DIR

CONTENTS:
- source/                     : Full source code
- docker-volume_*.tar.gz      : Docker volumes (databases, configs, data)
- postgres_*.sql.gz           : PostgreSQL database dumps
- letsencrypt.tar.gz          : TLS certificates
- n8n-workflows.tar.gz        : N8N workflow definitions
- *.md5                       : Checksums for integrity verification

RESTORE PROCEDURE:
1. Extract database dumps:    gunzip -c postgres_*.sql.gz | psql -U postgres
2. Restore volumes:           docker run -v backup:/data -v \<volume\>:/target alpine cp -r /data/* /target
3. Restore source:            rsync -av source/ /path/to/nexus-v2/
4. Restore certs:             tar xzf letsencrypt.tar.gz
5. Restart services:          docker compose up -d

Expected disk usage: $(du -sh "$BACKUP_DIR" | cut -f1)
File count: $(find "$BACKUP_DIR" -type f | wc -l)
EOF
log "  ✓ Manifest created"

# 7. BACKUP VERIFICATION
log "Verifying backup checksums..."
cd "$BACKUP_DIR" || error "Failed to cd to $BACKUP_DIR"
md5sum -c *.md5 >/dev/null 2>&1 && log "  ✓ All checksums verified" || error "Checksum verification failed"

# 8. OFF-SITE REPLICATION (optional, for daily backups)
if [ "$ENABLE_OFFSITE" = "1" ]; then
  log "Syncing to off-site storage..."
  
  # Option A: AWS S3 (requires aws-cli)
  if command -v aws >/dev/null 2>&1; then
    log "  → Uploading to S3: $S3_BUCKET"
    aws s3 sync "$BACKUP_DIR" "s3://$S3_BUCKET/nexus-v2/$BACKUP_DATE/" \
      --region "$S3_REGION" --sse AES256 --delete --region "$S3_REGION" 2>&1 | tail -5 >> "$logfile"
    log "  ✓ S3 sync completed"
  
  # Option B: Backblaze via rclone
  elif command -v rclone >/dev/null 2>&1; then
    log "  → Uploading to Backblaze via rclone: $RCLONE_REMOTE"
    rclone sync "$BACKUP_DIR" "$RCLONE_REMOTE:nexus-v2/$BACKUP_DATE/" --delete 2>&1 | tail -5 >> "$logfile"
    log "  ✓ Backblaze sync completed"
  else
    log "  ⚠ aws-cli and rclone not found. Skipping off-site sync."
  fi
fi

# 9. CLEANUP OLD BACKUPS
log "Pruning backups older than $RETENTION_DAYS days..."
find "$BACKUP_ROOT" -maxdepth 1 -name "backup_*" -type d -mtime +"$RETENTION_DAYS" -exec rm -rf {} \; 2>/dev/null
log "  ✓ Old backups pruned"

# 10. FINAL LOG
log "===== BACKUP COMPLETE ====="
log "  Location: $BACKUP_DIR"
log "  Size: $(du -sh "$BACKUP_DIR" | cut -f1)"
log "  Files: $(find "$BACKUP_DIR" -type f | wc -l)"
log ""  
echo "✅ Backup successful!" | tee -a "$logfile"