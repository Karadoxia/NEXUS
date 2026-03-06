#!/bin/bash
# Quick Commands Reference for LDAP & Identity Services
# Save this for easy access to common commands

# ============================================
# SERVICE MANAGEMENT
# ============================================

# Start all identity services
start_identity() {
    docker compose -p nexus-v2 up -d lldap keycloak semaphore
}

# Stop all identity services
stop_identity() {
    docker stop nexus-lldap nexus-keycloak nexus-semaphore
}

# Restart all identity services
restart_identity() {
    docker restart nexus-lldap nexus-keycloak nexus-semaphore
}

# Check status
status() {
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "NAME|lldap|keycloak|semaphore"
}

# ============================================
# LOGS
# ============================================

# View LLDAP logs
logs_lldap() {
    docker logs nexus-lldap --tail ${1:-50} -f
}

# View Keycloak logs
logs_keycloak() {
    docker logs nexus-keycloak --tail ${1:-50} -f
}

# View Semaphore logs
logs_semaphore() {
    docker logs nexus-semaphore --tail ${1:-50} -f
}

# View all identity logs
logs_all() {
    echo "=== LLDAP ===" && docker logs nexus-lldap --tail 20
    echo -e "\n=== Keycloak ===" && docker logs nexus-keycloak --tail 20
    echo -e "\n=== Semaphore ===" && docker logs nexus-semaphore --tail 20
}

# ============================================
# DATABASE
# ============================================

# Connect to semaphore database
db_semaphore() {
    docker exec -it nexus-postgres psql -U semaphore -d semaphore
}

# Connect to keycloak database
db_keycloak() {
    docker exec -it nexus-postgres psql -U keycloak -d keycloak
}

# List all databases
db_list() {
    docker exec nexus-postgres psql -U nexus -d postgres -c "\l"
}

# Check database sizes
db_sizes() {
    docker exec nexus-postgres psql -U nexus -d postgres -c "SELECT datname, pg_size_pretty(pg_database_size(datname)) FROM pg_database WHERE datname IN ('semaphore', 'keycloak');"
}

# ============================================
# HEALTH CHECKS
# ============================================

# Check LLDAP health
health_lldap() {
    curl -f http://localhost:17170 && echo "✓ LLDAP is responding" || echo "✗ LLDAP is not responding"
}

# Check Keycloak health
health_keycloak() {
    curl -f http://localhost:8180/health/ready && echo "✓ Keycloak is ready" || echo "✗ Keycloak is not ready"
}

# Check all services
health_all() {
    echo "LLDAP:"
    docker inspect nexus-lldap --format='  Status: {{.State.Status}} | Health: {{.State.Health.Status}}'
    
    echo "Keycloak:"
    docker inspect nexus-keycloak --format='  Status: {{.State.Status}} | Health: {{.State.Health.Status}}'
    
    echo "Semaphore:"
    docker inspect nexus-semaphore --format='  Status: {{.State.Status}}'
}

# ============================================
# QUICK FIXES
# ============================================

# Fix Semaphore database permissions
fix_semaphore_db() {
    docker exec nexus-postgres psql -U nexus -d semaphore << 'EOF'
ALTER SCHEMA public OWNER TO semaphore;
GRANT ALL ON SCHEMA public TO semaphore;
GRANT CREATE ON SCHEMA public TO semaphore;
EOF
    docker restart nexus-semaphore
    echo "✓ Fixed semaphore database permissions and restarted"
}

# Fix Keycloak database permissions
fix_keycloak_db() {
    docker exec nexus-postgres psql -U nexus -d keycloak << 'EOF'
ALTER SCHEMA public OWNER TO keycloak;
GRANT ALL ON SCHEMA public TO keycloak;
GRANT CREATE ON SCHEMA public TO keycloak;
EOF
    docker restart nexus-keycloak
    echo "✓ Fixed keycloak database permissions and restarted"
}

# Full reset and restart (WARNING: DESTRUCTIVE)
full_reset() {
    read -p "This will delete all LDAP data and restart services. Continue? (yes/no): " confirm
    if [ "$confirm" = "yes" ]; then
        docker stop nexus-lldap nexus-keycloak nexus-semaphore
        docker rm nexus-lldap nexus-keycloak nexus-semaphore
        docker volume rm nexus-v2_lldap-data nexus-v2_semaphore-data 2>/dev/null || true
        ./fix_identity_services.sh
    else
        echo "Cancelled"
    fi
}

# ============================================
# INFORMATION
# ============================================

# Show service URLs
urls() {
    echo "Service URLs:"
    echo "  LLDAP:     http://localhost:17170"
    echo "  Keycloak:  http://localhost:8180"
    echo "  Semaphore: http://localhost:3001"
    echo ""
    echo "LDAP Connection:"
    echo "  Host: lldap"
    echo "  Port: 3890"
    echo "  Base DN: dc=nexus-io,dc=org"
}

# Show environment variables
env_vars() {
    echo "LDAP Configuration:"
    grep -E "LLDAP_|LDAP_" .env | grep -v "^#"
    echo ""
    echo "Database:"
    grep "DB_PASSWORD" .env | head -1
    echo ""
    echo "Admin Emails:"
    grep "ADMIN_EMAIL" .env | grep -v "^#"
}

# ============================================
# USAGE
# ============================================

show_help() {
    cat << 'HELP'
Identity Services Quick Reference
==================================

Service Management:
  start_identity          - Start all identity services
  stop_identity           - Stop all identity services
  restart_identity        - Restart all identity services
  status                  - Show current status

Logs:
  logs_lldap [lines]      - View LLDAP logs (default: 50 lines)
  logs_keycloak [lines]   - View Keycloak logs
  logs_semaphore [lines]  - View Semaphore logs
  logs_all                - View all identity service logs

Database:
  db_semaphore            - Connect to semaphore database
  db_keycloak             - Connect to keycloak database
  db_list                 - List all databases
  db_sizes                - Show database sizes

Health Checks:
  health_lldap            - Check LLDAP health
  health_keycloak         - Check Keycloak health
  health_all              - Check all services

Quick Fixes:
  fix_semaphore_db        - Fix Semaphore database permissions
  fix_keycloak_db         - Fix Keycloak database permissions
  full_reset              - Complete reset (DESTRUCTIVE!)

Information:
  urls                    - Show service URLs
  env_vars                - Show environment variables
  show_help               - Show this help

Usage:
  source ./quick_commands.sh
  <command>

Example:
  source ./quick_commands.sh
  status
  logs_lldap 100
  health_all
HELP
}

# ============================================
# AUTO-EXECUTE
# ============================================

# If script is sourced, show help
if [ "${BASH_SOURCE[0]}" != "${0}" ]; then
    echo "Identity Services Quick Commands loaded!"
    echo "Type 'show_help' for available commands"
else
    # If run directly, show help
    show_help
fi
