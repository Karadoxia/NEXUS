# DETAILED NODE CONFIGURATION COMPARISON
## Gemini: Generate Report & Send Report Nodes

---

## NODE 1: "Gemini: Generate Report"

### FULL REFERENCE CONFIGURATION (CORRECT)

```json
{
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
  },
  "id": "gemini_audit_summary",
  "name": "Gemini: Generate Report",
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4.1,
  "position": [1120, 300]
}
```

### FULL ACTUAL CONFIGURATION (INCORRECT)

```json
{
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
  },
  "id": "gemini_audit_summary",
  "name": "Gemini: Generate Report",
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4,
  "position": [1120, 300]
}
```

### SIDE-BY-SIDE PARAMETER COMPARISON

| Parameter | Reference (✅) | Actual (❌) | Status | Issue |
|-----------|------------------|-------------|--------|-------|
| **`typeVersion`** | `4.1` | `4` | ❌ MISMATCH | Version mismatch may affect parameter handling |
| **`url`** | `=https://generativelanguage...?key={{$env.GEMINI_API_KEY}}` | `https://generativelanguage...?key={{ $env.GEMINI_API_KEY }}` | ❌ MISMATCH | Missing `=` prefix; Extra spaces in `{{ }}` |
| **`method`** | `"POST"` | `"POST"` | ✅ MATCH | Same |
| **`sendBody`** | `true` | ❌ NOT PRESENT | ❌ MISSING | Should be `true` |
| **`jsonBody`** | ❌ NOT PRESENT | `true` | ❌ EXTRA | Should NOT be present |
| **`bodyParameters`** | ✅ PRESENT (array format) | ❌ NOT PRESENT | ❌ MISSING | Critical - defines request body structure |
| **`body`** | ❌ NOT PRESENT | ✅ PRESENT (string) | ❌ EXTRA | Should NOT be present |
| **`responseFormat`** | `"json"` | `"json"` | ✅ MATCH | Same |
| **`credentials`** | ❌ NOT PRESENT | ✅ PRESENT | ❌ EXTRA | Should NOT be present |

### REQUEST BODY STRUCTURE COMPARISON

#### Reference (CORRECT) - What Gemini API Expects:
```json
[
  {
    "parts": [
      {
        "text": "Generate a comprehensive weekly site audit report..."
      }
    ]
  }
]
```

**Why**: Gemini 1.5 API expects simple `contents` array with `parts` containing text.

#### Actual (WRONG) - What's Being Sent:
```json
[
  {
    "role": "user",
    "parts": [
      {
        "text": "Generate a comprehensive weekly site audit report..."
      }
    ]
  }
]
```

**Problem**: Extra `"role": "user"` field causes the API to return "Bad request - please check your parameters"

---

## NODE 2: "Send Report"

### FULL REFERENCE CONFIGURATION (CORRECT)

```json
{
  "parameters": {
    "fromEmail": "audit@nexus.store",
    "toEmail": "{{ $env.ADMIN_EMAIL }}",
    "subject": "🤖 Weekly Site Audit Report",
    "html": "=<p>{{ $json.body.candidates[0].content.parts[0].text }}</p>"
  },
  "id": "send_audit_report",
  "name": "Send Report",
  "type": "n8n-nodes-base.emailSend",
  "typeVersion": 2,
  "position": [1340, 300],
  "credentials": {
    "smtp": {
      "id": "email-resend-1"
    }
  }
}
```

### FULL ACTUAL CONFIGURATION (CORRECT)

```json
{
  "parameters": {
    "fromEmail": "audit@nexus.store",
    "toEmail": "{{ $env.ADMIN_EMAIL }}",
    "subject": "🤖 Weekly Site Audit Report",
    "html": "=<p>{{ $json.body.candidates[0].content.parts[0].text }}</p>"
  },
  "id": "send_audit_report",
  "name": "Send Report",
  "type": "n8n-nodes-base.emailSend",
  "typeVersion": 2,
  "position": [1340, 300],
  "credentials": {
    "smtp": {
      "id": "ZaV9ETWNjd8JTohJ",
      "name": "Resend SMTP"
    }
  }
}
```

### SIDE-BY-SIDE PARAMETER COMPARISON

| Parameter | Reference | Actual | Status | Note |
|-----------|-----------|--------|--------|------|
| **`type`** | `n8n-nodes-base.emailSend` | `n8n-nodes-base.emailSend` | ✅ MATCH | Same |
| **`typeVersion`** | `2` | `2` | ✅ MATCH | Same |
| **`fromEmail`** | `"audit@nexus.store"` | `"audit@nexus.store"` | ✅ MATCH | Same |
| **`toEmail`** | `"{{ $env.ADMIN_EMAIL }}"` | `"{{ $env.ADMIN_EMAIL }}"` | ✅ MATCH | Same |
| **`subject`** | `"🤖 Weekly Site Audit Report"` | `"🤖 Weekly Site Audit Report"` | ✅ MATCH | Same |
| **`html`** | `"=<p>{{ $json.body.candidates[0].content.parts[0].text }}</p>"` | `"=<p>{{ $json.body.candidates[0].content.parts[0].text }}</p>"` | ✅ MATCH | Same - references upstream Gemini node |
| **`credentials.smtp.id`** | `"email-resend-1"` | `"ZaV9ETWNjd8JTohJ"` | ⚠️ DIFFERENT IDs | Different credential object IDs - both valid |

### Analysis
✅ **Send Report node configuration is CORRECT.** 

The failure is **NOT** due to this node's configuration. It's a cascading failure from the upstream node.

---

## ROOT CAUSE: PARAMETER EVALUATION

### The URL Problem

**Reference URL (CORRECT):**
```
=https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={{$env.GEMINI_API_KEY}}
```

**Actual URL (BROKEN):**
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={{ $env.GEMINI_API_KEY }}
```

**Why it Matters:**
- The `=` prefix in n8n tells the system: "Evaluate this as an expression"
- Without `=`, the URL is treated as literal text
- `{{ }}` with spaces is treated differently than `{{}}` without spaces
- The broken URL sends the literal string `{{ $env.GEMINI_API_KEY }}` to the API
- The API receives: `...?key={{ $env.GEMINI_API_KEY }}` (literal string, not API key)
- Result: "Bad request" because API key parameter is malformed

---

## WORKFLOW EXECUTION FLOW

### Expected Flow (After Fix)

```
1. "Every Sunday 3am UTC" (Cron Trigger)
   └─ Executes on schedule
      ✅ Status: Successful

2. "Prepare Data" (Set Node)
   └─ Sets audit_status = "started"
      ✅ Status: Successful

3. "Gemini: Generate Report" (HTTP Request)
   ├─ URL: https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSy...
   ├─ Method: POST
   ├─ Body: {"contents": [{"parts": [{"text": "Generate a comprehensive..."}]}]}
   ├─ Response: {"candidates": [{"content": {"parts": [{"text": "...audit report..."}]}}]}
      ✅ Status: 200 OK
      ✅ $json.body.candidates[0].content.parts[0].text = "...audit report..."

4. "Send Report" (Email)
   ├─ From: audit@nexus.store  
   ├─ To: [ADMIN_EMAIL environment variable]
   ├─ Subject: "🤖 Weekly Site Audit Report"
   ├─ HTML Body: "<p>...audit report extracted from Gemini response...</p>"
      ✅ Status: Email sent successfully

5. "Notify Completion" (Telegram)
   ├─ Chat ID: [TELEGRAM_CHAT_ID environment variable]
   ├─ Message: "✅ Weekly site audit completed\nCheck email for full report"
      ✅ Status: Telegram message sent
```

### Current Flow (Before Fix)

```
1. "Every Sunday 3am UTC" (Cron Trigger)
   └─ Executes on schedule
      ✅ Status: Successful

2. "Prepare Data" (Set Node)
   └─ Sets audit_status = "started"
      ✅ Status: Successful

3. "Gemini: Generate Report" (HTTP Request)
   ├─ URL: https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={{ $env.GEMINI_API_KEY }}
   ├─ Method: POST
   ├─ Body: {"contents": [{"role": "user", "parts": [{"text": "Generate a comprehensive..."}]}]}
   ├─ Response: {"error": {"code": 400, "message": "Bad request - please check your parameters"}}
      ❌ Status: 400 Bad Request - STOPS HERE

4. "Send Report" (Email)
   ├─ Cannot execute - no input from previous node
   ├─ Error: "Node 'Message a model' hasn't been executed"
      ❌ Status: SKIPPED/FAILED

5. "Notify Completion" (Telegram)
   └─ Cannot execute - workflow stopped at step 3
      ❌ Status: SKIPPED
```

---

## SUMMARY OF CHANGES NEEDED

### Gemini Node Fixes (4 changes):

1. **URL Expression**
   - From: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={{ $env.GEMINI_API_KEY }}`
   - To: `=https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={{$env.GEMINI_API_KEY}}`

2. **Body Parameters Method**
   - Remove: `"jsonBody": true, "body": "..."`
   - Add: `"sendBody": true, "bodyParameters": {...}`

3. **Request Body Format**
   - Remove: `"role": "user"` field from contents
   - Keep: Only `"parts": [{"text": "..."}]`

4. **Type Version**
   - From: `4`
   - To: `4.1`

5. **Credentials**
   - Remove: `"credentials": {"googlePalmApi": {...}}`

### Send Report Node Fixes:
**NONE** - Configuration is correct. Will work once Gemini node is fixed.

