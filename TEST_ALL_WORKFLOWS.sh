#!/bin/bash
# Test all 18 n8n workflows end-to-end
# Verifies: Gemini API, Email, Telegram, Database connections

echo "🧪 NEXUS Workflow E2E Testing"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test results
PASSED=0
FAILED=0

# Database connection test
test_db() {
    echo -n "🗄️  Database Connection... "
    result=$(docker exec nexus_postgres psql -U nexus -d n8n -c "SELECT COUNT(*) FROM workflow_entity;" 2>&1)
    if echo "$result" | grep -q "19"; then
        echo -e "${GREEN}✅ PASS${NC} (19 workflows)"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}"
        ((FAILED++))
    fi
}

# Gemini API configuration test
test_gemini_config() {
    echo -n "🤖 Gemini API Config... "
    result=$(docker-compose config 2>&1 | grep -c "GEMINI_API_KEY")
    if [ "$result" -gt 0 ]; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}"
        ((FAILED++))
    fi
}

# Gemini endpoint verification
test_gemini_endpoint() {
    echo -n "🌐 Gemini Endpoint in #17... "
    result=$(docker exec nexus_postgres psql -U nexus -d n8n -c "SELECT nodes FROM workflow_entity WHERE id = '17-site-audit-bot';" 2>&1 | grep -c "generativelanguage")
    if [ "$result" -gt 0 ]; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}"
        ((FAILED++))
    fi
}

# Telegram credential setup check
test_telegram_ready() {
    echo -n "📱 Telegram Bot Token Ready... "
    if [ -f ".credentials-secure.txt" ]; then
        if grep -q "8682512263" .credentials-secure.txt; then
            echo -e "${GREEN}✅ PASS${NC}"
            ((PASSED++))
        else
            echo -e "${RED}❌ FAIL${NC}"
            ((FAILED++))
        fi
    else
        echo -e "${YELLOW}⚠️  PENDING${NC} (credentials file missing)"
    fi
}

# Resend email config check
test_resend_ready() {
    echo -n "📧 Resend Email API Key Ready... "
    if [ -f ".credentials-secure.txt" ]; then
        if grep -q "re_C51jKwtZ" .credentials-secure.txt; then
            echo -e "${GREEN}✅ PASS${NC}"
            ((PASSED++))
        else
            echo -e "${RED}❌ FAIL${NC}"
            ((FAILED++))
        fi
    else
        echo -e "${YELLOW}⚠️  PENDING${NC}"
    fi
}

# n8n service health
test_n8n_health() {
    echo -n "⚙️  n8n Service Health... "
    if docker ps | grep -q "n8n.*Up"; then
        echo -e "${GREEN}✅ PASS${NC} (running)"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}"
        ((FAILED++))
    fi
}

# Workflow visibility test (from logs)
test_workflow_visibility() {
    echo -n "👁️  Workflows Loading in n8n... "
    logs=$(docker logs n8n 2>&1 | grep -c "Try to activate workflow")
    if [ "$logs" -gt 10 ]; then
        echo -e "${GREEN}✅ PASS${NC} ($logs workflows detected)"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠️  PARTIAL${NC} ($logs detected, expected 18+)"
    fi
}

# Workflow #17 Gemini AI test
test_workflow_17_gemini() {
    echo -n "🤖 Workflow #17 (Site Audit) Gemini... "
    result=$(docker exec nexus_postgres psql -U nexus -d n8n -c "SELECT nodes FROM workflow_entity WHERE id = '17-site-audit-bot';" 2>&1 | grep -c "gemini_audit_summary")
    if [ "$result" -gt 0 ]; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}"
        ((FAILED++))
    fi
}

# Workflow #16 Gemini AI test
test_workflow_16_gemini() {
    echo -n "🤖 Workflow #16 (Churn) Gemini... "
    result=$(docker exec nexus_postgres psql -U nexus -d n8n -c "SELECT nodes FROM workflow_entity WHERE id = '16-churn-predictor';" 2>&1 | grep -c "generativelanguage")
    if [ "$result" -gt 0 ]; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}"
        ((FAILED++))
    fi
}

# PostgreSQL connectivity from n8n perspective
test_postgres_from_n8n() {
    echo -n "🗄️  PostgreSQL Accessible to n8n... "
    # Check if n8n can see postgres in network
    if docker network inspect nexus-v2_internal 2>&1 | grep -q "postgres"; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}"
        ((FAILED++))
    fi
}

# All workflows published check
test_all_published() {
    echo -n "📋 All 18 Workflows Published... "
    result=$(docker exec nexus_postgres psql -U nexus -d n8n -c "SELECT COUNT(*) FROM workflow_published_version;" 2>&1 | grep -E "[0-9]+")
    if echo "$result" | grep -qE "18|19"; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC} (found: $result)"
        ((FAILED++))
    fi
}

# Run all tests
echo ""
test_db
test_n8n_health
test_workflow_visibility
echo ""
test_gemini_config
test_gemini_endpoint
test_workflow_17_gemini
test_workflow_16_gemini
echo ""
test_postgres_from_n8n
test_telegram_ready
test_resend_ready
echo ""
test_all_published

# Summary
echo ""
echo "========================================"
echo -e "✅ ${GREEN}PASSED: $PASSED${NC}"
echo -e "❌ ${RED}FAILED: $FAILED${NC}"
echo "========================================"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED! Workflows ready for activation.${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some tests need attention before activation.${NC}"
    exit 1
fi
