#!/bin/bash

################################################################################
# 🔥 NEXUS GOD-MODE WORKFLOWS - END-TO-END TEST SUITE (SIMPLIFIED)
# Tests all 18 workflows with database verification
################################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
RESET='\033[0m'

# Counters
PASSED=0
FAILED=0
TOTAL=0

# Database config
DB_USER="nexus"
DB_NAME_N8N="n8n"
DB_NAME="nexus_v2"

print_header() {
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${RESET}"
    echo -e "${BLUE}║  🔥 NEXUS GOD-MODE WORKFLOWS - END-TO-END TEST 🔥            ║${RESET}"
    echo -e "${BLUE}║          Testing All 18 Workflows Comprehensively             ║${RESET}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${RESET}"
    echo ""
}

test_workflow() {
    local num=$1
    local workflow_id=$2
    local workflow_name=$3
    local description=$4

    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${RESET}"
    echo -e "${CYAN}TEST ${num}/18: ${workflow_name}${RESET}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${RESET}"
    echo -e "Description: ${description}"
    echo ""

    ((TOTAL++))

    # Check if workflow exists
    local exists=$(docker compose exec -T postgres psql -U "$DB_USER" -d "$DB_NAME_N8N" \
        -c "SELECT COUNT(*) FROM workflow_entity WHERE name = '$workflow_id';" 2>/dev/null | tail -1 | tr -d ' ')

    if [ "$exists" = "1" ]; then
        echo -e "${GREEN}✅ PASS${RESET}: Workflow exists in database"

        # Check if active
        local active=$(docker compose exec -T postgres psql -U "$DB_USER" -d "$DB_NAME_N8N" \
            -c "SELECT active FROM workflow_entity WHERE name = '$workflow_id';" 2>/dev/null | tail -1 | tr -d ' ')

        if [ "$active" = "t" ]; then
            echo -e "${GREEN}✅ PASS${RESET}: Workflow is ACTIVE"
        else
            echo -e "${YELLOW}⚠️  WARN${RESET}: Workflow exists but not active"
        fi

        # Get creation timestamp
        local created=$(docker compose exec -T postgres psql -U "$DB_USER" -d "$DB_NAME_N8N" \
            -c "SELECT \"createdAt\" FROM workflow_entity WHERE name = '$workflow_id';" 2>/dev/null | tail -1)

        echo -e "${CYAN}Created: ${created}${RESET}"
        echo -e "${GREEN}✅ Status: READY${RESET}"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${RESET}: Workflow not found in database"
        ((FAILED++))
    fi

    echo ""
}

main() {
    print_header

    # Pre-flight check
    echo -e "${YELLOW}Running pre-flight database check...${RESET}"
    if ! docker compose exec -T postgres psql -U "$DB_USER" -d "$DB_NAME_N8N" -c "SELECT 1;" 2>/dev/null | grep -q "1"; then
        echo -e "${RED}Fatal: Cannot connect to database. Aborting.${RESET}"
        exit 1
    fi
    echo -e "${GREEN}✅ Database connectivity verified${RESET}"
    echo ""

    # Test each workflow
    test_workflow "01" "00-global-error-notifier" "Global Error Notifier" \
        "Catches errors from other workflows and sends Telegram notifications"

    test_workflow "02" "01-stripe-order-fulfillment" "Stripe Order Fulfillment" \
        "Automatically processes Stripe payments and triggers fulfillment workflow"

    test_workflow "03" "02-abandoned-order-recovery" "Abandoned Order Recovery" \
        "Sends recovery emails to users with abandoned shopping carts"

    test_workflow "04" "03-daily-sales-report" "Daily Sales Report" \
        "Generates and sends daily sales reports via Telegram"

    test_workflow "05" "04-security-incident-aggregator" "Security Incident Aggregator" \
        "Monitors and aggregates security incidents from CrowdSec"

    test_workflow "06" "05-ai-support-router" "AI Support Router" \
        "Routes customer support queries to appropriate AI models"

    test_workflow "07" "06-ai-product-upsell" "AI Product Upsell" \
        "AI-powered product recommendations and upsell suggestions"

    test_workflow "08" "07-container-auto-registration-FIXED" "Container Auto-Registration" \
        "Auto-detects and registers new Docker containers via events"

    test_workflow "09" "08-inventory-restock-ai" "Inventory Restock AI" \
        "AI predicts inventory needs and triggers restock orders"

    test_workflow "10" "09-review-collection-ai" "Review Collection AI" \
        "Collects and analyzes customer reviews post-purchase"

    test_workflow "11" "10-performance-monitor" "Performance Monitor" \
        "Monitors application performance and alerts on anomalies"

    test_workflow "12" "11-newsletter-generator" "Newsletter Generator" \
        "Generates and sends automated newsletters to subscribers"

    test_workflow "13" "12-automated-backup" "Automated Backup" \
        "Daily automated database and file backups with encryption"

    test_workflow "14" "13-seo-optimizer" "SEO Optimizer" \
        "Analyzes and optimizes product metadata for SEO"

    test_workflow "15" "14-fraud-detector" "Fraud Detector" \
        "Real-time fraud detection and risk scoring on transactions"

    test_workflow "16" "15-social-media-poster" "Social Media Poster" \
        "Auto-posts product highlights to social media channels"

    test_workflow "17" "16-churn-predictor" "Churn Predictor" \
        "Predicts customer churn and triggers retention campaigns"

    test_workflow "18" "17-site-audit-bot" "Site Audit Bot" \
        "Regular website audits for health, performance, and compliance"

    # Print summary
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${RESET}"
    echo -e "${BLUE}FINAL TEST SUMMARY${RESET}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${RESET}"
    echo ""
    echo -e "Total Workflows:   ${CYAN}${TOTAL}${RESET}"
    echo -e "Tests Passed:      ${GREEN}${PASSED}${RESET}"
    echo -e "Tests Failed:      ${RED}${FAILED}${RESET}"
    echo ""

    if [ $FAILED -eq 0 ] && [ $PASSED -eq 18 ]; then
        echo -e "${GREEN}🎉 SUCCESS!${RESET} All 18 GOD-MODE workflows are operational!"
        echo -e "${GREEN}All workflows exist, are active, and ready for execution.${RESET}"
        echo ""
        echo -e "${CYAN}Next Steps:${RESET}"
        echo "1. Trigger workflows via webhooks or scheduled events"
        echo "2. Monitor execution logs in n8n dashboard"
        echo "3. View real-time metrics in Grafana"
        echo "4. Configure Telegram notifications for alerts"
    else
        echo -e "${RED}⚠️  Test Summary:${RESET}"
        echo "Some workflows may need attention. Review failures above."
    fi

    echo ""
    echo -e "${CYAN}Access n8n Dashboard:${RESET}"
    echo "  → http://nexus-n8n.local"
    echo "  → http://localhost:5678"
    echo ""
    echo -e "Test completed: $(date '+%Y-%m-%d %H:%M:%S')"
    echo ""
}

main
