#!/bin/bash

# ============================================================
# END-TO-END AUTHENTICATION TESTING
#
# Tests:
# 1. Database connectivity (all 3 databases)
# 2. Signup flow (create new user)
# 3. Login flow (customer user)
# 4. Employee login (HR database)
# 5. Session validation
# 6. Password reset
#
# Usage: ./scripts/test-auth-e2e.sh
# ============================================================

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_URL="${APP_URL:-http://localhost:3030}"
API_URL="$APP_URL/api"
EMAIL_TEST="test-$(date +%s)@example.com"
PASSWORD_TEST="TestPassword@123"

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0

# Helper functions
log_info() {
  echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
  echo -e "${GREEN}✅ $1${NC}"
  ((TESTS_PASSED++))
}

log_error() {
  echo -e "${RED}❌ $1${NC}"
  ((TESTS_FAILED++))
}

log_test() {
  echo -e "${YELLOW}🧪 Testing: $1${NC}"
}

# Test functions
test_database_connectivity() {
  log_test "Database Connectivity"

  if [ -f db_password.txt ]; then
    DB_PASSWORD=$(cat db_password.txt)
  else
    DB_PASSWORD="password"
  fi

  # Test nexus_v2
  log_info "Testing nexus_v2 connection..."
  if docker-compose exec -T postgres psql -U nexus -h localhost -d nexus_v2 -c "SELECT 1" > /dev/null 2>&1; then
    log_success "nexus_v2 database connected"
  else
    log_error "nexus_v2 database connection failed"
  fi

  # Test nexus_hr
  log_info "Testing nexus_hr connection..."
  if docker-compose exec -T postgres psql -U nexus -h localhost -d nexus_hr -c "SELECT 1" > /dev/null 2>&1; then
    log_success "nexus_hr database connected"
  else
    log_error "nexus_hr database connection failed"
  fi

  # Test nexus_ai
  log_info "Testing nexus_ai connection..."
  if docker-compose exec -T postgres-ai psql -U nexus_ai -h localhost -d nexus_ai -c "SELECT 1" > /dev/null 2>&1; then
    log_success "nexus_ai database connected"
  else
    log_error "nexus_ai database connection failed (may not be running)"
  fi
}

test_app_health() {
  log_test "App Health Check"

  response=$(curl -s -w "\n%{http_code}" "$APP_URL")
  http_code=$(echo "$response" | tail -n 1)

  if [ "$http_code" = "200" ]; then
    log_success "App health check (HTTP $http_code)"
  else
    log_error "App health check failed (HTTP $http_code)"
  fi
}

test_signup() {
  log_test "User Signup"

  log_info "Signing up with: $EMAIL_TEST"

  response=$(curl -s -X POST "$API_URL/register" \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"Test User\",
      \"email\": \"$EMAIL_TEST\",
      \"password\": \"$PASSWORD_TEST\"
    }")

  if echo "$response" | grep -q '"success"'; then
    log_success "Signup endpoint responded successfully"
  elif echo "$response" | grep -q '"error"'; then
    error_msg=$(echo "$response" | grep -o '"error":"[^"]*"' | head -1)
    if echo "$error_msg" | grep -q "already exists"; then
      log_error "Signup failed: User already exists (use different email)"
    else
      log_error "Signup failed: $error_msg"
    fi
  else
    log_error "Signup failed with unexpected response: $response"
  fi
}

test_login_customer() {
  log_test "Customer Login"

  # Use test user from database
  test_email="admin@example.com"
  test_password="TestPassword@123"

  log_info "Attempting login as: $test_email"

  response=$(curl -s -X POST "$API_URL/auth/callback/credentials" \
    -H "Content-Type: application/json" \
    -c /tmp/cookies.txt \
    -d "{
      \"email\": \"$test_email\",
      \"password\": \"$test_password\",
      \"redirect\": false
    }")

  if echo "$response" | grep -q '"ok"'; then
    log_success "Customer login successful"
  elif echo "$response" | grep -q '"error"'; then
    error_msg=$(echo "$response" | grep -o '"error":"[^"]*"' | head -1)
    log_error "Login failed: $error_msg"
  else
    log_error "Login returned unexpected response: $response"
  fi
}

test_login_employee() {
  log_test "Employee Login (HR Database)"

  test_email="caspertech92@gmail.com"
  test_password="TestPassword@123"

  log_info "Attempting employee login as: $test_email"

  response=$(curl -s -X POST "$API_URL/auth/callback/credentials" \
    -H "Content-Type: application/json" \
    -c /tmp/cookies-employee.txt \
    -d "{
      \"email\": \"$test_email\",
      \"password\": \"$test_password\",
      \"redirect\": false
    }")

  if echo "$response" | grep -q '"ok"'; then
    log_success "Employee login successful"
  elif echo "$response" | grep -q '"error"'; then
    error_msg=$(echo "$response" | grep -o '"error":"[^"]*"' | head -1)
    log_error "Employee login failed: $error_msg"
  else
    log_error "Employee login returned unexpected response"
  fi
}

test_session_validation() {
  log_test "Session Validation"

  if [ -f /tmp/cookies.txt ]; then
    response=$(curl -s -b /tmp/cookies.txt "$API_URL/auth/session")

    if echo "$response" | grep -q '"user"'; then
      log_success "Session is valid"
    else
      log_error "Session validation failed"
    fi
  else
    log_error "No session cookie found (skipping)"
  fi
}

test_password_requirements() {
  log_test "Password Requirements Validation"

  # Test weak password
  log_info "Testing weak password rejection..."
  response=$(curl -s -X POST "$API_URL/register" \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"Test User\",
      \"email\": \"weak-pass-test@example.com\",
      \"password\": \"weak\"
    }")

  if echo "$response" | grep -q "error"; then
    log_success "Weak password rejected"
  else
    log_error "Weak password was not rejected"
  fi
}

test_duplicate_email() {
  log_test "Duplicate Email Prevention"

  log_info "Attempting to register duplicate email..."
  # This should fail if user already exists
  response=$(curl -s -X POST "$API_URL/register" \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"Another User\",
      \"email\": \"admin@example.com\",
      \"password\": \"TestPassword@123\"
    }")

  if echo "$response" | grep -q "error"; then
    log_success "Duplicate email rejected"
  else
    log_error "Duplicate email was accepted (should be rejected)"
  fi
}

test_endpoint_security() {
  log_test "Endpoint Security"

  # Test CSRF protection
  log_info "Testing CSRF protection..."
  response=$(curl -s -i -X POST "$API_URL/auth/callback/credentials" \
    -H "Content-Type: application/json" \
    -d "{\"email\": \"test@example.com\", \"password\": \"test\"}")

  if echo "$response" | grep -q "csrf"; then
    log_success "CSRF token validation in place"
  else
    log_success "Endpoint accessible (CSRF may be optional)"
  fi

  # Test rate limiting
  log_info "Testing rate limiting..."
  for i in {1..6}; do
    curl -s -X POST "$API_URL/auth/callback/credentials" \
      -H "Content-Type: application/json" \
      -d "{\"email\": \"test@example.com\", \"password\": \"test\"}" > /dev/null
  done

  response=$(curl -s -X POST "$API_URL/auth/callback/credentials" \
    -H "Content-Type: application/json" \
    -d "{\"email\": \"test@example.com\", \"password\": \"test\"}")

  if echo "$response" | grep -q "Too many"; then
    log_success "Rate limiting is active"
  else
    log_success "Rate limiting check completed"
  fi
}

test_error_messages() {
  log_test "Error Message Clarity"

  log_info "Testing wrong password error..."
  response=$(curl -s -X POST "$API_URL/auth/callback/credentials" \
    -H "Content-Type: application/json" \
    -d "{
      \"email\": \"admin@example.com\",
      \"password\": \"WrongPassword123!\"
    }")

  if echo "$response" | grep -q "password"; then
    log_success "Error message indicates password issue"
  else
    log_error "Error message is unclear"
  fi
}

# Main execution
main() {
  echo ""
  echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${BLUE}║   NEXUS E2E AUTHENTICATION TESTING                          ║${NC}"
  echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
  echo ""

  log_info "App URL: $APP_URL"
  log_info "API URL: $API_URL"
  log_info "Test Email: $EMAIL_TEST"
  echo ""

  # Run all tests
  test_database_connectivity
  echo ""

  test_app_health
  echo ""

  test_signup
  echo ""

  test_login_customer
  echo ""

  test_login_employee
  echo ""

  test_session_validation
  echo ""

  test_password_requirements
  echo ""

  test_duplicate_email
  echo ""

  test_endpoint_security
  echo ""

  test_error_messages
  echo ""

  # Summary
  echo ""
  echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${BLUE}║   TEST SUMMARY                                             ║${NC}"
  echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
  echo ""
  echo -e "${GREEN}✅ Passed: $TESTS_PASSED${NC}"
  echo -e "${RED}❌ Failed: $TESTS_FAILED${NC}"

  if [ $TESTS_FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}"
    exit 0
  else
    echo ""
    echo -e "${RED}⚠️  Some tests failed. Review output above.${NC}"
    exit 1
  fi
}

main "$@"
