# GEMINI API PAYLOAD ANALYSIS

## The Problem: API Request Mismatch

---

## CURRENT (BROKEN) REQUEST

### What n8n is currently sending to Gemini API:

```http
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={{ $env.GEMINI_API_KEY }}

Content-Type: application/json

{
  "contents": [
    {
      "role": "user",
      "parts": [
        {
          "text": "Generate a comprehensive weekly site audit report with:\n1. Executive Summary\n2. Database Health Check - Status: Healthy\n3. Security Assessment - Status: No threats detected\n4. Link Validation - Status: All valid\n5. Recommendations for improvement"
        }
      ]
    }
  ]
}
```

### Gemini API Response (ERROR):

```json
{
  "error": {
    "code": 400,
    "message": "Bad request - please check your parameters"
  }
}
```

### Why It Fails:

1. **URL Parameter Problem**: `key={{ $env.GEMINI_API_KEY }}`
   - n8n literally sends the string `{{ $env.GEMINI_API_KEY }}`
   - Gemini API receives: `...?key={{ $env.GEMINI_API_KEY }}`
   - API cannot authenticate, rejects with "Bad request"
   - **Root cause**: Missing `=` prefix in URL for expression evaluation

2. **Schema Problem**: The `"role": "user"` field
   - For direct API calls (non-conversation mode), Gemini doesn't expect this field
   - This is from Chat API pattern, not suitable for direct generateContent
   - API validates schema and rejects the request

---

## EXPECTED (CORRECT) REQUEST

### What n8n should send to Gemini API:

```http
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyD...xxxxxxxxxxxxx

Content-Type: application/json

{
  "contents": [
    {
      "parts": [
        {
          "text": "Generate a comprehensive weekly site audit report with:\n1. Executive Summary\n2. Database Health Check - Status: Healthy\n3. Security Assessment - Status: No threats detected\n4. Link Validation - Status: All valid\n5. Recommendations for improvement"
        }
      ]
    }
  ]
}
```

### Gemini API Response (SUCCESS):

```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "# Weekly Site Audit Report\n\n## Executive Summary\nComprehensive analysis of the NEXUS platform indicates strong overall health and security posture...\n\n## Database Health Check\n**Status**: Healthy ✅\n- All database connections responsive\n- Query performance within acceptable parameters\n- Backup status: Current\n...\n## Recommendations\n1. Monitor disk space on primary database\n2. Review API rate limiting policies\n3. Update security headers...",
            "cite_metadata": {
              "citations": []
            }
          }
        ],
        "role": "model",
        "finish_reason": "STOP",
        "safety_ratings": [
          {
            "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            "probability": "NEGLIGIBLE",
            "blocked": false
          },
          {
            "category": "HARM_CATEGORY_HATE_SPEECH",
            "probability": "NEGLIGIBLE",
            "blocked": false
          },
          {
            "category": "HARM_CATEGORY_HARASSMENT",
            "probability": "NEGLIGIBLE",
            "blocked": false
          },
          {
            "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
            "probability": "NEGLIGIBLE",
            "blocked": false
          }
        ]
      },
      "finish_reason": "STOP"
    }
  ],
  "usage_metadata": {
    "prompt_tokens": 87,
    "candidates_tokens": 542,
    "total_tokens": 629
  }
}
```

### Why It Works:

1. **URL Parameter is Correct**: `key=AIzaSyD...xxxxxxxxxxxxx`
   - `=` prefix in n8n config tells it to evaluate expression
   - `$env.GEMINI_API_KEY` gets resolved to actual API key
   - Gemini API receives valid authentication credential
   - **Result**: Request authenticated successfully

2. **Schema is Correct**: Only `parts` field, no `role`
   - Matches Gemini 1.5 direct API schema
   - API validates, accepts, and processes the request
   - **Result**: Model generates comprehensive response

---

## HOW THE FIX CHANGES THE REQUEST

### URL Fix

**Before** (in n8n node config):
```
url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={{ $env.GEMINI_API_KEY }}"
```
⚠️  Without `=` prefix, n8n treats it as literal text, not a template expression

**After** (in n8n node config):
```
url: "=https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={{$env.GEMINI_API_KEY}}"
```
✅ With `=` prefix, n8n evaluates expression and substitutes actual API key

### Body Format Fix

**Before** (using jsonBody mode):
```
jsonBody: true,
body: "{\n  \"contents\": [\n    {\n      \"role\": \"user\",\n      \"parts\": [...]\n    }\n  ]\n}"
```
❌ Creates request with extra `"role": "user"` field that Gemini rejects

**After** (using sendBody + bodyParameters mode):
```
sendBody: true,
bodyParameters: {
  "parameters": [
    {
      "name": "contents",
      "value": "=[{\"parts\":[{\"text\":\"...\"}]}]"
    }
  ]
}
```
✅ n8n properly constructs request body without extra fields

---

## HOW SEND REPORT NODE USES THE RESPONSE

### Current Flow (BROKEN)

```
Gemini Response (ERROR):
{
  "error": {
    "code": 400,
    "message": "Bad request - please check your parameters"
  }
}

Send Report tries to access:
html: "=<p>{{ $json.body.candidates[0].content.parts[0].text }}</p>"

Problem: $json.body is NOT "candidates[0]..."
It's "error: {...}"

Result: $json.body.candidates is undefined
Error: "Node 'Message a model' hasn't been executed"
```

### Expected Flow (CORRECT)

```
Gemini Response (SUCCESS):
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "# Weekly Site Audit Report\n\n## Executive Summary\n..."
          }
        ]
      }
    }
  ],
  "usage_metadata": {...}
}

Send Report accesses:
html: "=<p>{{ $json.body.candidates[0].content.parts[0].text }}</p>"

Result: $json.body.candidates[0].content.parts[0].text 
= "# Weekly Site Audit Report\n\n## Executive Summary\n..."

Email body:
<p># Weekly Site Audit Report

## Executive Summary
...</p>

Status: ✅ EMAIL SENT SUCCESSFULLY
```

---

## DEBUGGING THE API RESPONSE

### To see the actual response, add a debug node:

1. **After Gemini node**, add a "Debug" node
2. Configure it to output:
   ```json
   {
     "full_response": "{{ $json }}",
     "has_candidates": "{{ $json.candidates ? 'yes' : 'no' }}",
     "has_error": "{{ $json.error ? 'yes' : 'no' }}",
     "status_code": "{{ $response.statusCode }}"
   }
   ```
3. Run workflow and check debug output

### Expected output (after fix):
```json
{
  "full_response": {
    "candidates": [{"content": {"parts": [...]}}, ...],
    "usage_metadata": {...}
  },
  "has_candidates": "yes",
  "has_error": "no",
  "status_code": 200
}
```

### Current output (before fix):
```json
{
  "full_response": {
    "error": {"code": 400, "message": "Bad request - please check your parameters"}
  },
  "has_candidates": "no",
  "has_error": "yes",
  "status_code": 400
}
```

---

## GEMINI 1.5 API SPECIFICATION

### Correct Request Format for generateContent

```
Endpoint: POST /v1beta/models/{model}:generateContent
Query Parameters:
  - key: Your API key (REQUIRED for authentication)

Request Body:
{
  "contents": [
    {
      "parts": [
        {
          "text": "Your prompt here"
        }
      ]
    }
  ],
  "generationConfig": {
    "temperature": 0.7,
    "topP": 0.9,
    "topK": 40,
    "maxOutputTokens": 2048
  },
  "safetySettings": [
    {
      "category": "HARM_CATEGORY_HARASSMENT",
      "threshold": "BLOCK_ONLY_HIGH"
    }
  ]
}

Response:
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "Generated response text"
          }
        ],
        "role": "model"
      },
      "finish_reason": "STOP",
      "safety_ratings": [...]
    }
  ],
  "usage_metadata": {
    "prompt_tokens": 123,
    "candidates_tokens": 456,
    "total_tokens": 579
  }
}
```

**Key Points**:
- API key goes in query parameter: `?key=xxx`
- Request body has `contents` as array
- Each content has `parts` with text
- Response has `candidates` array
- Each candidate has `content.parts[0].text`
- Response includes `usage_metadata` for token accounting

---

## EMAILS SENT AFTER FIX

### Email #1: To ADMIN_EMAIL (from Send Report node)

```
From: audit@nexus.store
To: [ADMIN_EMAIL env variable]
Subject: 🤖 Weekly Site Audit Report

Body HTML:
<p>
# Weekly Site Audit Report

## Executive Summary
Comprehensive analysis of the NEXUS platform...

## Database Health Check
**Status**: Healthy ✅
...
</p>
```

### Email #2: Telegram Notification (from Notify Completion node)

```
Chat ID: [TELEGRAM_CHAT_ID env variable]
Message: ✅ Weekly site audit completed
          Check email for full report
```

---

## SUMMARY

| Question | Answer |
|----------|--------|
| **What's wrong with the URL?** | Missing `=` prefix so `$env.GEMINI_API_KEY` isn't evaluated |
| **What's wrong with the body?** | Contains invalid `"role": "user"` field for direct API calls |
| **Why does Gemini reject it?** | Invalid schema - API validates incoming requests strictly |
| **Why can't Send Report run?** | Upstream Gemini node fails, no response data to use |
| **How do we fix it?** | Update Gemini node config to use correct parameter format |
| **Will Send Report work after?** | Yes, automatically - it waits for upstream node to complete |

