#!/bin/bash
# LDAP & Semaphore Diagnostic and Fix Script
# Created: March 5, 2026

set -e

echo "=========================================="
echo "🔍 NEXUS Identity Services Diagnostic"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2"
    fi
}

# Function to print info
print_info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

echo "1️⃣  Checking Docker Container Status..."
echo "----------------------------------------"
docker ps --format "table {{.Names}}\t{{.Status}}" | grep -E "NAME|lldap|semaphore|keycloak" || true
echo ""

echo "2️⃣  Checking LLDAP Status..."
echo "----------------------------------------"
LLDAP_STATUS=$(docker inspect nexus-lldap --format='{{.State.Status}}' 2>/dev/null || echo "not-found")
if [ "$LLDAP_STATUS" = "running" ]; then
    print_status 0 "LLDAP container is running"
    
    # Check health
    LLDAP_HEALTH=$(docker inspect nexus-lldap --format='{{.State.Health.Status}}' 2>/dev/null || echo "none")
    if [ "$LLDAP_HEALTH" = "healthy" ]; then
        print_status 0 "LLDAP is healthy"
    else
        print_status 1 "LLDAP health status: $LLDAP_HEALTH"
    fi
    
    # Show last logs
    echo ""
    print_info "Last 10 LLDAP log lines:"
    docker logs nexus-lldap --tail 10 2>&1 | sed 's/^/    /'
else
    print_status 1 "LLDAP is not running (status: $LLDAP_STATUS)"
fi
echo ""

echo "3️⃣  Checking Keycloak Status..."
echo "----------------------------------------"
KEYCLOAK_STATUS=$(docker inspect nexus-keycloak --format='{{.State.Status}}' 2>/dev/null || echo "not-found")
if [ "$KEYCLOAK_STATUS" = "running" ]; then
    print_status 0 "Keycloak container is running"
    
    # Check health
    KEYCLOAK_HEALTH=$(docker inspect nexus-keycloak --format='{{.State.Health.Status}}' 2>/dev/null || echo "none")
    if [ "$KEYCLOAK_HEALTH" = "healthy" ]; then
        print_status 0 "Keycloak is healthy"
    else
        print_status 1 "Keycloak health status: $KEYCLOAK_HEALTH"
    fi
else
    print_status 1 "Keycloak is not running (status: $KEYCLOAK_STATUS)"
fi
echo ""

echo "4️⃣  Checking Semaphore Status..."
echo "----------------------------------------"
SEMAPHORE_STATUS=$(docker inspect nexus-semaphore --format='{{.State.Status}}' 2>/dev/null || echo "not-found")
if [ "$SEMAPHORE_STATUS" = "running" ]; then
    print_status 0 "Semaphore container is running"
else
    print_status 1 "Semaphore is not running (status: $SEMAPHORE_STATUS)"
    
    # Show last error logs
    echo ""
    print_info "Last 20 Semaphore error log lines:"
    docker logs nexus-semaphore --tail 40 2>&1 | grep -iE "error|panic|failed|permission" | tail -20 | sed 's/^/    /' || echo "    No obvious errors found"
fi
echo ""

echo "5️⃣  Checking Database Connectivity..."
echo "----------------------------------------"

# Check if databases exist
print_info "Checking PostgreSQL databases..."
docker exec nexus-postgres psql -U nexus -d postgres -c "\l" 2>/dev/null | grep -E "semaphore|keycloak" | sed 's/^/    /' || print_status 1 "Could not list databases"
echo ""

# Check database users
print_info "Checking database users..."
docker exec nexus-postgres psql -U nexus -d postgres -c "SELECT usename, usecreatedb, usesuper FROM pg_user WHERE usename IN ('semaphore', 'keycloak');" 2>/dev/null | sed 's/^/    /' || print_status 1 "Could not list users"
echo ""

echo "6️⃣  Testing Database Connections..."
echo "----------------------------------------"

# Test semaphore connection
print_info "Testing semaphore database connection..."
if docker exec nexus-postgres psql -U semaphore -d semaphore -c "SELECT 1;" &>/dev/null; then
    print_status 0 "Semaphore can connect to its database"
else
    print_status 1 "Semaphore cannot connect to its database"
fi

# Test keycloak connection
print_info "Testing keycloak database connection..."
if docker exec nexus-postgres psql -U keycloak -d keycloak -c "SELECT 1;" &>/dev/null; then
    print_status 0 "Keycloak can connect to its database"
else
    print_status 1 "Keycloak cannot connect to its database"
fi
echo ""

echo "7️⃣  Checking Schema Permissions..."
echo "----------------------------------------"

# Check semaphore schema ownership
print_info "Semaphore schema permissions:"
docker exec nexus-postgres psql -U nexus -d semaphore -c "\dn+" 2>/dev/null | sed 's/^/    /' || print_status 1 "Could not check schema"
echo ""

# Check if semaphore can create tables
print_info "Testing semaphore create table permission..."
if docker exec nexus-postgres psql -U semaphore -d semaphore -c "CREATE TABLE IF NOT EXISTS test_permissions (id int); DROP TABLE test_permissions;" &>/dev/null; then
    print_status 0 "Semaphore has CREATE permission"
else
    print_status 1 "Semaphore lacks CREATE permission"
fi
echo ""

echo "=========================================="
echo "🔧 Running Automatic Fixes..."
echo "=========================================="
echo ""

echo "Fix 1: Ensuring database ownership..."
docker exec nexus-postgres psql -U nexus -d postgres << 'EOF'
ALTER DATABASE semaphore OWNER TO semaphore;
ALTER DATABASE keycloak OWNER TO keycloak;
EOF
print_status $? "Updated database ownership"
echo ""

echo "Fix 2: Granting schema permissions..."
docker exec nexus-postgres psql -U nexus -d semaphore << 'EOF'
GRANT ALL ON SCHEMA public TO semaphore;
GRANT CREATE ON SCHEMA public TO semaphore;
ALTER SCHEMA public OWNER TO semaphore;
EOF
print_status $? "Granted semaphore schema permissions"

docker exec nexus-postgres psql -U nexus -d keycloak << 'EOF'
GRANT ALL ON SCHEMA public TO keycloak;
GRANT CREATE ON SCHEMA public TO keycloak;
ALTER SCHEMA public OWNER TO keycloak;
EOF
print_status $? "Granted keycloak schema permissions"
echo ""

echo "Fix 3: Restarting services..."
docker restart nexus-semaphore nexus-keycloak
print_status $? "Restarted Semaphore and Keycloak"
echo ""

echo "Waiting 15 seconds for services to initialize..."
sleep 15
echo ""

echo "=========================================="
echo "📊 Final Status Check"
echo "=========================================="
echo ""

docker ps --format "table {{.Names}}\t{{.Status}}" | grep -E "NAME|lldap|semaphore|keycloak"
echo ""

# Check final semaphore status
SEMAPHORE_FINAL=$(docker inspect nexus-semaphore --format='{{.State.Status}}' 2>/dev/null)
if [ "$SEMAPHORE_FINAL" = "running" ]; then
    print_status 0 "Semaphore is now running!"
    echo ""
    print_info "Last 10 Semaphore logs:"
    docker logs nexus-semaphore --tail 10 2>&1 | sed 's/^/    /'
else
    print_status 1 "Semaphore is still having issues (status: $SEMAPHORE_FINAL)"
    echo ""
    print_info "Last 20 error lines:"
    docker logs nexus-semaphore 2>&1 | grep -iE "error|panic|failed" | tail -20 | sed 's/^/    /'
fi
echo ""

echo "=========================================="
echo "📋 Summary"
echo "=========================================="
echo ""
echo "LLDAP Status:      $(docker inspect nexus-lldap --format='{{.State.Status}}' 2>/dev/null || echo 'unknown')"
echo "Keycloak Status:   $(docker inspect nexus-keycloak --format='{{.State.Status}}' 2>/dev/null || echo 'unknown')"
echo "Semaphore Status:  $(docker inspect nexus-semaphore --format='{{.State.Status}}' 2>/dev/null || echo 'unknown')"
echo ""
echo "LDAP Base DN:      dc=nexus-io,dc=org"
echo "LDAP Web UI:       http://localhost:17170"
echo "Keycloak UI:       http://localhost:8180"
echo "Semaphore UI:      http://localhost:3001"
echo ""

if [ "$SEMAPHORE_FINAL" = "running" ]; then
    echo -e "${GREEN}✓ All identity services are operational!${NC}"
else
    echo -e "${YELLOW}⚠ Some services need additional debugging${NC}"
    echo ""
    echo "To view detailed logs:"
    echo "  docker logs nexus-semaphore --tail 100"
    echo "  docker logs nexus-keycloak --tail 100"
    echo "  docker logs nexus-lldap --tail 100"
fi
echo ""
echo "=========================================="
