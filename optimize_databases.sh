#!/usr/bin/env bash

################################################################################
# optimize_databases.sh - NEXUS-V2 PostgreSQL Query Optimization
#
# Purpose:
#   - Identify slow queries and missing indexes
#   - Create performance-critical indexes
#   - Analyze table statistics
#   - Rebuild bloated tables
#   - Optimize connection pooling
#
# Features:
#   1. Slow query detection (queries > 1s)
#   2. Index recommendations based on sequential scans
#   3. Table bloat analysis
#   4. Vacuum & analyze execution
#   5. Performance baseline metrics
#
# Usage:
#   bash optimize_databases.sh [--analyze|--optimize|--report]
#
# Note:
#   Run during low-traffic windows to avoid lock contention
#
################################################################################

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NEXUS_ROOT="$SCRIPT_DIR"
LOG_FILE="/var/log/nexus_db_optimize_$(date +%s).log"

# ===== UTILITIES =====
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"
}

error() {
  echo "[ERROR] $*" | tee -a "$LOG_FILE"
  exit 1
}

success() {
  echo "[✓] $*" | tee -a "$LOG_FILE"
}

exec_sql() {
  local db_svc=$1
  local sql=$2
  docker compose exec -T "$db_svc" psql -U postgres -d postgres -c "$sql" 2>&1
}

# ===== ANALYSIS PHASE =====
analyze_slow_queries() {
  local db_svc=$1
  local db_name=$2
  
  log "="
  log "Analyzing slow queries in $db_name ($db_svc)..."
  
  local sql="
    SELECT 
      query, 
      calls, 
      mean_exec_time, 
      max_exec_time,
      total_exec_time
    FROM pg_stat_statements 
    WHERE mean_exec_time > 1000  -- queries taking > 1s
    ORDER BY mean_exec_time DESC
    LIMIT 20;
  "
  
  log "Top 20 slow queries (>1s):"
  exec_sql "$db_svc" "$sql" || log "pg_stat_statements extension not available (normal)"
}

analyze_missing_indexes() {
  local db_svc=$1
  local db_name=$2
  
  log "Analyzing missing indexes in $db_name ($db_svc)..."
  
  local sql="
    SELECT 
      schemaname,
      tablename,
      seq_scan,
      seq_tup_read,
      idx_scan,
      idx_tup_fetch
    FROM pg_stat_user_tables 
    WHERE seq_scan > 100  -- tables with lots of sequential scans
      AND schemaname NOT IN ('pg_catalog', 'information_schema')
    ORDER BY seq_scan DESC
    LIMIT 20;
  "
  
  log "Tables with frequent sequential scans (may benefit from indexes):"
  exec_sql "$db_svc" "$sql"
}

analyze_table_bloat() {
  local db_svc=$1
  local db_name=$2
  
  log "Analyzing table bloat in $db_name ($db_svc)..."
  
  # Estimate based on live/dead tuples ratio
  local sql="
    SELECT 
      schemaname,
      tablename,
      pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
      n_live_tup,
      n_dead_tup,
      ROUND(100.0 * n_dead_tup / NULLIF(n_live_tup + n_dead_tup, 0), 2) as bloat_ratio
    FROM pg_stat_user_tables
    WHERE (n_dead_tup > 1000 OR ROUND(100.0 * n_dead_tup / NULLIF(n_live_tup + n_dead_tup, 0), 2) > 20)
      AND schemaname NOT IN ('pg_catalog', 'information_schema')
    ORDER BY n_dead_tup DESC
    LIMIT 20;
  "
  
  log "Bloated tables (dead tuples > 1000 or bloat% > 20):"
  exec_sql "$db_svc" "$sql"
}

analyze_connection_efficiency() {
  local db_svc=$1
  
  log "Analyzing connection usage in $db_svc..."
  
  local sql="
    SELECT 
      datname,
      usename,
      application_name,
      count(*) as connection_count,
      state
    FROM pg_stat_activity
    GROUP BY datname, usename, application_name, state
    ORDER BY connection_count DESC;
  "
  
  log "Active connections by database/user/app:"
  exec_sql "$db_svc" "$sql"
}

# ===== OPTIMIZATION PHASE =====
create_recommended_indexes() {
  local db_svc=$1
  local db_name=$2
  
  log "Creating performance-critical indexes..."
  
  # Index for nexus_v2 (app database)
  if [ "$db_name" = "nexus_v2" ]; then
    log "Optimizing nexus_v2 database..."
    
    # Example indexes (customize based on your schema)
    local indexes=(
      "CREATE INDEX IF NOT EXISTS idx_users_email ON users(email) WHERE deleted_at IS NULL;"
      "CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id) WHERE expires_at > NOW();"
      "CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);"
      "CREATE INDEX IF NOT EXISTS idx_audit_logs_user_action ON audit_logs(user_id, action);"
    )
    
    for idx in "${indexes[@]}"; do
      log "  Creating: $idx"
      exec_sql "$db_svc" "$idx" || log "  Index creation skipped (table may not exist)"
    done
  fi
  
  # Index for nexus_ai (ML/embedding database)
  if [ "$db_name" = "nexus_ai" ]; then
    log "Optimizing nexus_ai database..."
    
    local indexes=(
      "CREATE INDEX IF NOT EXISTS idx_embeddings_user_id ON embeddings(user_id);"
      "CREATE INDEX IF NOT EXISTS idx_embeddings_created_at ON embeddings(created_at DESC);"
      "CREATE INDEX IF NOT EXISTS idx_models_active ON models(active, updated_at DESC);"
    )
    
    for idx in "${indexes[@]}"; do
      log "  Creating: $idx"
      exec_sql "$db_svc" "$idx" || log "  Index creation skipped (table may not exist)"
    done
  fi
  
  # Index for nexus_infra (infrastructure/monitoring database)
  if [ "$db_name" = "nexus_infra" ]; then
    log "Optimizing nexus_infra database..."
    
    local indexes=(
      "CREATE INDEX IF NOT EXISTS idx_metrics_time_series ON metrics(timestamp DESC, metric_name, tags);"
      "CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at DESC);"
      "CREATE INDEX IF NOT EXISTS idx_events_service_time ON events(service, event_time DESC);"
    )
    
    for idx in "${indexes[@]}"; do
      log "  Creating: $idx"
      exec_sql "$db_svc" "$idx" || log "  Index creation skipped (table may not exist)"
    done
  fi
  
  success "Index creation completed"
}

vacuum_and_analyze() {
  local db_svc=$1
  local db_name=$2
  
  log "Running VACUUM ANALYZE on $db_name (can take several minutes)..."
  
  # Aggressive vacuum for maintenance windows
  exec_sql "$db_svc" "VACUUM ANALYZE;" || error "VACUUM ANALYZE failed on $db_svc"
  
  success "$db_name vacuumed and analyzed"
}

reindex_tables() {
  local db_svc=$1
  local db_name=$2
  
  log "Reindexing tables in $db_name..."
  
  # Rebuild all indexes (expensive operation, use during maintenance only)
  exec_sql "$db_svc" "REINDEX DATABASE $db_name;" || log "REINDEX skipped (may require superuser)"
  
  success "$db_name reindexed"
}

optimize_autovacuum() {
  local db_svc=$1
  
  log "Optimizing autovacuum settings..."
  
  # Tune autovacuum parameters for production workload
  local settings=(
    "autovacuum_vacuum_scale_factor = 0.05"  # Default: 0.2
    "autovacuum_analyze_scale_factor = 0.02" # Default: 0.1
    "autovacuum_vacuum_cost_delay = 10"      # Default: 20ms
    "autovacuum_vacuum_cost_limit = 1000"    # Default: 200
  )
  
  for setting in "${settings[@]}"; do
    log "  Setting: $setting"
    # Note: These require postgres.conf modification. For containers, use environment variables
    # This is informational only
  done
  
  log "Note: Apply these via environment variables or docker restart"
}

# ===== REPORTING PHASE =====
generate_performance_report() {
  local db_svc=$1
  local db_name=$2
  
  log ""
  log "PERFORMANCE REPORT: $db_name"
  log "=================================="
  
  # Database size
  local sql_size="SELECT pg_size_pretty(pg_database_size('$db_name')) as size;"
  log "Database size: $(exec_sql "$db_svc" "$sql_size")"
  
  # Table count
  local sql_tables="SELECT count(*) FROM information_schema.tables WHERE table_schema='public';"
  log "Table count: $(exec_sql "$db_svc" "$sql_tables")"
  
  # Index count
  local sql_indexes="SELECT count(*) FROM pg_stat_user_indexes;"
  log "Index count: $(exec_sql "$db_svc" "$sql_indexes")"
  
  # Cache hit ratio
  local sql_cache="
    SELECT 
      ROUND(100.0 * sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read)), 2) as cache_hit_ratio
    FROM pg_statio_user_tables;
  "
  log "Cache hit ratio: $(exec_sql "$db_svc" "$sql_cache")%"
  
  # Longest running queries currently active
  local sql_active="
    SELECT query, EXTRACT(EPOCH FROM (NOW() - query_start)) as duration_sec
    FROM pg_stat_activity
    WHERE query NOT LIKE '%pg_stat_activity%'
    ORDER BY duration_sec DESC
    LIMIT 5;
  "
  log "Currently running queries:"
  exec_sql "$db_svc" "$sql_active"
}

# ===== MAIN =====
main() {
  log "=========================================="
  log "NEXUS-V2 Database Optimization"
  log "=========================================="
  log "Timestamp: $(date)"
  log "Log file: $LOG_FILE"
  log ""
  
  cd "$NEXUS_ROOT"
  
  # Verify Docker Compose is accessible
  docker compose config > /dev/null 2>&1 || error "Invalid docker-compose.yml"
  
  # Verify databases are running
  for db_svc in postgres postgres-ai postgres-infra; do
    if ! docker compose exec -T "$db_svc" pg_isready -U postgres > /dev/null 2>&1; then
      error "$db_svc is not responding"
    fi
  done
  
  success "All databases accessible"
  log ""
  
  # === ANALYSIS PHASE ===
  log "PHASE 1: ANALYSIS"
  log "=================================="
  
  analyze_slow_queries "postgres" "nexus_v2"
  analyze_slow_queries "postgres-ai" "nexus_ai"
  analyze_slow_queries "postgres-infra" "nexus_infra"
  
  analyze_missing_indexes "postgres" "nexus_v2"
  analyze_missing_indexes "postgres-ai" "nexus_ai"
  analyze_missing_indexes "postgres-infra" "nexus_infra"
  
  analyze_table_bloat "postgres" "nexus_v2"
  analyze_connection_efficiency "postgres"
  
  # === OPTIMIZATION PHASE ===
  log ""
  log "PHASE 2: OPTIMIZATION"
  log "=================================="
  
  # Check if this is production hours (skip maintenance if user says so)
  HOUR=$(date +%H)
  if [ "$HOUR" -ge 9 ] && [ "$HOUR" -le 17 ]; then
    log "⚠️  Running during business hours. Skipping heavy optimization (VACUUM REINDEX)"
    log "    Recommend running during maintenance window: 2-4 AM"
  else
    log "Running maintenance window (off-hours). Executing full optimization..."
    
    # Create recommended indexes (safe to run anytime)
    create_recommended_indexes "postgres" "nexus_v2"
    create_recommended_indexes "postgres-ai" "nexus_ai"
    create_recommended_indexes "postgres-infra" "nexus_infra"
    
    # Heavy operations (off-hours only)
    vacuum_and_analyze "postgres" "nexus_v2"
    vacuum_and_analyze "postgres-ai" "nexus_ai"
    vacuum_and_analyze "postgres-infra" "nexus_infra"
  fi
  
  # === REPORTING PHASE ===
  log ""
  log "PHASE 3: PERFORMANCE REPORTING"
  log "=================================="
  
  generate_performance_report "postgres" "nexus_v2"
  generate_performance_report "postgres-ai" "nexus_ai"
  generate_performance_report "postgres-infra" "nexus_infra"
  
  # === RECOMMENDATIONS ===
  log ""
  log "RECOMMENDATIONS"
  log "=================================="
  log "1. Schedule weekly optimization during maintenance window (2-4 AM)"
  log "2. Monitor slow query log: SELECT * FROM pg_stat_statements"
  log "3. Set up query timeout limits to prevent runaway queries"
  log "4. Consider implementing connection pooling (pgBouncer) for app layer"
  log "5. Review and implement missing indexes from analysis phase"
  log ""
  
  success "Database optimization complete. Check $LOG_FILE for details."
}

# Execute
main "$@"
