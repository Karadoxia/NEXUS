#!/bin/bash

echo "🔍 GEMINI API UPDATE VERIFICATION"
echo "=================================="
echo ""

ERRORS=0
WARNINGS=0

# Check 1: All workflows use correct Gemini endpoint
echo "✓ Checking API endpoints..."
for file in n8n-workflows/{01,02,03,05,06,08,09,10,11,13,15,16,17}-*.json; do
  if ! grep -q "generativelanguage.googleapis.com/v1beta" "$file"; then
    echo "  ❌ $file: Missing correct Gemini endpoint"
    ((ERRORS++))
  fi
done

# Check 2: No old Groq IDs remain
echo "✓ Checking for legacy Groq IDs..."
if grep -r '"id": "groq[^_]' n8n-workflows/*.json 2>/dev/null | grep -v "backup"; then
  echo "  ⚠️  Found legacy Groq IDs (not critical, only naming)"
  ((WARNINGS++))
fi

# Check 3: Verify safe navigation in email templates
echo "✓ Checking response parsing..."
if grep -q '\$response\?' n8n-workflows/17-site-audit-bot.json; then
  echo "  ✓ Safe navigation operators present"
else
  echo "  ⚠️  Missing safe navigation in audit bot"
  ((WARNINGS++))
fi

# Check 4: API key usage
echo "✓ Checking API key references..."
if grep -q '\$env.GEMINI_API_KEY' n8n-workflows/*.json; then
  COUNT=$(grep -c '\$env.GEMINI_API_KEY' n8n-workflows/*.json)
  echo "  ✓ Found GEMINI_API_KEY in $COUNT node configurations"
else
  echo "  ❌ GEMINI_API_KEY not found in workflows"
  ((ERRORS++))
fi

# Check 5: Backup verification
echo "✓ Checking backup..."
if [ -d "n8n-workflows-backup" ] && [ $(ls n8n-workflows-backup/*.json 2>/dev/null | wc -l) -gt 10 ]; then
  echo "  ✓ Backup directory exists with $(ls n8n-workflows-backup/*.json | wc -l) files"
else
  echo "  ⚠️  Backup directory missing or incomplete"
  ((WARNINGS++))
fi

echo ""
echo "=================================="
echo "Summary:"
echo "  Errors: $ERRORS"
echo "  Warnings: $WARNINGS"

if [ $ERRORS -eq 0 ]; then
  echo "  ✅ All critical checks passed!"
  exit 0
else
  echo "  ❌ Some issues found"
  exit 1
fi
