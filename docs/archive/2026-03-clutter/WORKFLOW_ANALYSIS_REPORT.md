# N8N WORKFLOW ANALYSIS REPORT
## 🤖 NEXUS - Full Site Audit Bot

**Analysis Date**: March 4, 2026  
**Workflow ID**: dzvS99TthbtSo8Q2  
**Status**: ISSUES IDENTIFIED ✅ SOLUTIONS PROVIDED

---

## EXECUTIVE SUMMARY

Two critical configuration mismatches identified between the running workflow and the reference implementation:

1. **"Gemini: Generate Report"** - Incorrect HTTP body format & missing expression prefix
2. **"Send Report"** - Failing because upstream node doesn't execute (dependency issue)

Both issues are caused by incorrect node parameter configurations.

---

## ISSUE #1: "Gemini: Generate Report" Node
**Error**: "Bad request - please check your parameters"

### Reference Configuration (CORRECT)
```json
{
  "id": "gemini_audit_summary",
  "name": "Gemini: Generate Report",
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4.1,
  "parameters": {
    "url": "=https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={{$env.GEMINI_API_KEY}}",
    "method": "POST",
    "sendBody": true,
    "bodyParameters": {
      "parameters": [
        {
          "name": "contents",
          "value": "=[{\"parts\":[{\"text\":\"Generate a comprehensive weekly site audit report with:\\n1. Executive Summary\\n2. Database Health Check - Status: Healthy\\n3. Security Assessment - Status: No threats detected\\n4. Link Validation - Status: All valid\\n5. Recommendations for improvement\"}]}]"
        }
      ]
    },
    "responseFormat": "json"
  }
}
```

### Actual Configuration (INCORRECT)
```json
{
  "id": "gemini_audit_summary",
  "name": "Gemini: Generate Report",
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4,
  "parameters": {
    "url": "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={{ $env.GEMINI_API_KEY }}",
    "method": "POST",
    "responseFormat": "json",
    "jsonBody": true,
    "body": "{\n  \"contents\": [\n    {\n      \"role\": \"user\",\n      \"parts\": [\n        {\n          \"text\": \"Generate a comprehensive weekly site audit report with:\\n1. Executive Summary\\n2. Database Health Check - Status: Healthy\\n3. Security Assessment - Status: No threats detected\\n4. Link Validation - Status: All valid\\n5. Recommendations for improvement\"\n        }\n      ]\n    }\n  ]\n}",
    "credentials": {
      "googlePalmApi": {
        "id": "6BklJbKHfDJ6Lbcj",
        "name": "NEXUS Gemini"
      }
    }
  }
}
```

### Line-by-Line Problem Analysis

| Line | Parameter | Reference | Actual | Problem | Impact |
|------|-----------|-----------|--------|---------|--------|
| **URL** | `url` | `=https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={{$env.GEMINI_API_KEY}}` | `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={{ $env.GEMINI_API_KEY }}` | ❌ Missing expression prefix `=` at start; Uses `{{ }}` instead of `{{}}` | Environment variable NOT evaluated; literal string sent to API |
| **typeVersion** | `typeVersion` | `4.1` | `4` | ⚠️ Version mismatch | May affect parameter handling |
| **Body Type** | `sendBody` vs `jsonBody` | `sendBody: true` | `jsonBody: true` | ❌ Wrong parameter mode | Different body serialization methods |
| **Body Structure** | `bodyParameters` vs `body` | Array of parameters | JSON string with `"role": "user"` | ❌ Incorrect format; Added role field | Gemini API doesn't expect `role` in direct API calls; expects different structure |
| **Contents Format** | Contents array | `[{parts:[{text:...}]}]` | `[{role:user, parts:[{text:...}]}]` | ❌ Extra field added | API rejects due to unexpected schema |
| **Credentials** | `credentials` | Not present | `googlePalmApi: {id, name}` | ⚠️ Unnecessary addition | May conflict with HTTP auth in URL |

### ROOT CAUSE
The node configuration was changed from **n8n's native HTTP Request body parameter mode** (correct for Gemini API) to **raw JSON body mode** (incorrect), and the URL expression was broken in the process.

**Expected Gemini API Request Format:**
```json
{
  "contents": [
    {
      "parts": [
        {
          "text": "Generate a comprehensive..."
        }
      ]
    }
  ]
}
```

**Actual (WRONG) Request Format:**
```json
{
  "contents": [
    {
      "role": "user",
      "parts": [
        {
          "text": "Generate a comprehensive..."
        }
      ]
    }
  ]
}
```

---

## ISSUE #2: "Send Report" Node
**Error**: "Node 'Message a model' hasn't been executed"

### Reference Configuration (CORRECT)
```json
{
  "id": "send_audit_report",
  "name": "Send Report",
  "type": "n8n-nodes-base.emailSend",
  "typeVersion": 2,
  "parameters": {
    "fromEmail": "audit@nexus.store",
    "toEmail": "{{ $env.ADMIN_EMAIL }}",
    "subject": "🤖 Weekly Site Audit Report",
    "html": "=<p>{{ $json.body.candidates[0].content.parts[0].text }}</p>"
  },
  "credentials": {
    "smtp": {
      "id": "email-resend-1"
    }
  }
}
```

### Actual Configuration (CORRECT)
```json
{
  "id": "send_audit_report",
  "name": "Send Report",
  "type": "n8n-nodes-base.emailSend",
  "typeVersion": 2,
  "parameters": {
    "fromEmail": "audit@nexus.store",
    "toEmail": "{{ $env.ADMIN_EMAIL }}",
    "subject": "🤖 Weekly Site Audit Report",
    "html": "=<p>{{ $json.body.candidates[0].content.parts[0].text }}</p>"
  },
  "credentials": {
    "smtp": {
      "id": "ZaV9ETWNjd8JTohJ",
      "name": "Resend SMTP"
    }
  }
}
```

### Analysis of "Send Report" Node

The **Send Report node configuration is CORRECT**. The error is **NOT** due to this node's configuration.

**Error Analysis:**
- Error message: "Node 'Message a model' hasn't been executed"
- This is a **CASCADING FAILURE** from the upstream "Gemini: Generate Report" node
- When "Gemini: Generate Report" fails with "Bad request", the Send Report node never receives input data
- The HTML parameter tries to access `$json.body.candidates[0].content.parts[0].text` which doesn't exist because the previous node failed

**Root Cause Chain:**
```
Gemini: Generate Report FAILS (Bad Request)
    ↓
No output data generated
    ↓
Send Report has nothing to process
    ↓
Error: "Node 'Message a model' hasn't been executed"
```

---

## CONNECTION VERIFICATION

Both nodes are correctly connected in the workflow:

```json
"Gemini: Generate Report": {
  "main": [
    [
      {
        "node": "Send Report",
        "type": "main",
        "index": 0
      }
    ]
  ]
}
```

✅ Connection is correct - Send Report will trigger after Gemini node completes.

---

## FIX SUMMARY

### Fix #1: Restore "Gemini: Generate Report" Node to Correct Configuration

**Action**: Replace the node parameters with the reference configuration.

**Changes Required:**
1. ✅ Change `typeVersion` from `4` → `4.1`
2. ✅ Add `=` prefix to URL for expression evaluation
3. ✅ Change from `jsonBody: true` + `body` string → `sendBody: true` + `bodyParameters` array
4. ✅ Remove the extra "role": "user" field from body
5. ✅ Remove incorrect `credentials.googlePalmApi` reference

**Corrected Node:**
```json
{
  "id": "gemini_audit_summary",
  "name": "Gemini: Generate Report",
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4.1,
  "position": [1120, 300],
  "parameters": {
    "url": "=https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={{$env.GEMINI_API_KEY}}",
    "method": "POST",
    "sendBody": true,
    "bodyParameters": {
      "parameters": [
        {
          "name": "contents",
          "value": "=[{\"parts\":[{\"text\":\"Generate a comprehensive weekly site audit report with:\\n1. Executive Summary\\n2. Database Health Check - Status: Healthy\\n3. Security Assessment - Status: No threats detected\\n4. Link Validation - Status: All valid\\n5. Recommendations for improvement\"}]}]"
        }
      ]
    },
    "responseFormat": "json"
  }
}
```

### Fix #2: "Send Report" Node - NO CHANGES NEEDED

Once the Gemini node is fixed, the Send Report node will work automatically. ✅

---

## IMPLEMENTATION STEPS

1. **Edit Workflow**: Open the "🤖 NEXUS - Full Site Audit Bot" workflow in n8n UI
2. **Select Gemini Node**: Click "Gemini: Generate Report" node
3. **Update Parameters**:
   - Clear the `body` parameter  
   - Disable `jsonBody`
   - Enable `sendBody`
   - Update `bodyParameters` to array format (as shown above)
   - Update URL with expression prefix
   - Update typeVersion to 4.1
4. **Remove Credentials**: Delete the `googlePalmApi` credential reference
5. **Save**: Click Save/Deploy
6. **Test**: Run workflow manually to verify

---

## VALIDATION

After fixes applied, expected flow:

```
✅ "Every Sunday 3am UTC" (Cron) triggers
    ↓
✅ "Prepare Data" (Set) executes
    ↓
✅ "Gemini: Generate Report" (HTTP POST) → Returns JSON with candidates[0].content.parts[0].text
    ↓
✅ "Send Report" (Email) → Extracts text from Gemini response, sends email
    ↓
✅ "Notify Completion" (Telegram) → Notifies user
```

---

## REFERENCE FILES

- **Current Workflow**: `/home/redbend/Desktop/Local-Projects/NEXUS-V2/n8n-workflows/full_workflow.json`
- **Reference File**: `/home/redbend/Desktop/Local-Projects/NEXUS-V2/n8n-workflows/17-site-audit-bot.json`
- **Analysis Script**: `/home/redbend/Desktop/Local-Projects/NEXUS-V2/analyze_workflow.py`

