# QUICK REFERENCE: N8N AUDIT BOT WORKFLOW ISSUES & FIXES

**Workflow**: 🤖 NEXUS - Full Site Audit Bot  
**Workflow ID**: dzvS99TthbtSo8Q2  
**Analysis Date**: March 4, 2026

---

## PROBLEM SUMMARY

### ❌ Issue #1: "Gemini: Generate Report" Node
**Error**: `Bad request - please check your parameters`

**Root Cause**: 
- URL missing expression prefix `=`
- Wrong body format (jsonBody mode instead of bodyParameters mode)
- Request body includes invalid `"role": "user"` field
- Wrong typeVersion (4 instead of 4.1)

**Impact**: HTTP request to Gemini API fails, no response data

---

### ❌ Issue #2: "Send Report" Node  
**Error**: `Node 'Message a model' hasn't been executed`

**Root Cause**: 
- Not the node's fault - cascading failure from Issue #1
- When Gemini node fails, Send Report has no input to process
- Cannot extract `$json.body.candidates[0].content.parts[0].text`

**Impact**: Email never sent because upstream node failed

---

## THE FIX

### Quick Fix (Manual in UI)
**File**: `NODE_CONFIGURATION_DETAILED_COMPARISON.md` - Copy-paste the "Reference Configuration" for Gemini node

**Steps**:
1. Open n8n UI → Audit Bot workflow
2. Edit "Gemini: Generate Report" node
3. Replace all parameters with reference configuration from comparison document
4. Save & Test

### Automated Fix (Python Script)
**File**: `fix_audit_workflow.py`

**Usage**:
```bash
python /home/redbend/Desktop/Local-Projects/NEXUS-V2/fix_audit_workflow.py
```

**What it does**:
- Authenticates to n8n
- Finds the workflow
- Fixes the Gemini node parameters
- Updates the workflow via API
- Reports success/failure

---

## KEY CONFIG CHANGES

### Gemini Node: Before vs After

**BEFORE (Breaking)**:
```json
"typeVersion": 4,
"parameters": {
  "url": "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={{ $env.GEMINI_API_KEY }}",
  "jsonBody": true,
  "body": "{...\"role\": \"user\"...}",
  "credentials": {"googlePalmApi": {...}}
}
```

**AFTER (Fixed)**:
```json
"typeVersion": 4.1,
"parameters": {
  "url": "=https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={{$env.GEMINI_API_KEY}}",
  "sendBody": true,
  "bodyParameters": {
    "parameters": [{
      "name": "contents",
      "value": "=[{\"parts\":[{\"text\":\"Generate a comprehensive...\"}]}]"
    }]
  }
}
```

**Changes**: 5 edits needed
1. ✏️ typeVersion: 4 → 4.1
2. ✏️ URL: Add `=` prefix, remove spaces in `{{ }}`
3. ❌ Delete: jsonBody, body parameters
4. ✏️ Add: sendBody: true, bodyParameters array
5. ❌ Delete: credentials.googlePalmApi

---

## VALIDATION CHECKLIST

After applying the fix, verify:

- [ ] Gemini node URL starts with `=https://`
- [ ] Gemini node has `sendBody: true`
- [ ] Gemini node has `bodyParameters` as array (NOT `body` string)
- [ ] Gemini node bodyParameters contains only `{"name":"contents", "value":"=[{..."}]`
- [ ] Gemini node has NO `jsonBody` parameter
- [ ] Gemini node has NO `credentials.googlePalmApi` reference
- [ ] Send Report node has `html: "=<p>{{ $json.body.candidates[0].content.parts[0].text }}</p>"`
- [ ] Workflow connections are intact (Gemini → Send Report → Notify)

---

## TEST THE FIX

1. **Manual Trigger**:
   - Open workflow
   - Click "Execute" or manual trigger button
   - Monitor execution in real-time

2. **Expected Results**:
   ```
   ✅ Every Sunday 3am UTC → Runs successfully
   ✅ Prepare Data → Sets audit_status
   ✅ Gemini: Generate Report → Returns 200 with JSON response
   ✅ Send Report → Email sent to $env.ADMIN_EMAIL
   ✅ Notify Completion → Telegram message sent
   ```

3. **Check Outputs**:
   - Click each node's execution result
   - Verify JSON response from Gemini contains `candidates[0].content.parts[0].text`
   - Check email was received
   - Verify Telegram message was sent

---

## REFERENCE FILES

| File | Purpose |
|------|---------|
| `WORKFLOW_ANALYSIS_REPORT.md` | Full analysis with issues & root causes |
| `NODE_CONFIGURATION_DETAILED_COMPARISON.md` | Side-by-side JSON comparison |
| `fix_audit_workflow.py` | Automatic API-based fix script |
| `n8n-workflows/17-site-audit-bot.json` | Reference correct configuration |
| `n8n-workflows/full_workflow.json` | Current (broken) workflow dump |
| `analyze_workflow.py` | Analysis script to fetch & compare |

---

## TECHNICAL DETAILS

### The URL Problem
```
BROKEN:   https://...?key={{ $env.GEMINI_API_KEY }}
          ↑ No '=' prefix means literal string, not expression
          ↑ Spaces in {{ }} are preserved

CORRECT:  =https://...?key={{$env.GEMINI_API_KEY}}
          ↑ '=' prefix means evaluate as expression
          ↑ No spaces means clean variable substitution
```

### The Body Problem
```
BROKEN:   jsonBody: true, body: "{...\"role\":\"user\"...}"
          ↑ Raw JSON string with extra fields Gemini API doesn't expect

CORRECT:  sendBody: true, bodyParameters: {"parameters":[...]}
          ↑ n8n serializes parameters correctly for API
          ↑ No extra fields in request
```

### Why "Send Report" Fails
```
Gemini API receives: {...,"role":"user",...}
Gemini API responds: {"error": "Bad request - please check your parameters"}
Send node tries to access: $json.body.candidates[0]...
But $json.body contains ERROR, not candidates
Result: "Node 'Message a model' hasn't been executed"
```

---

## CREDENTIALS VERIFICATION

If you see credential-related errors after fix, verify:

1. **Gemini API Key**
   - Must be set as environment variable: `GEMINI_API_KEY`
   - Don't use credentials reference in HTTP node URL
   - API key scope: Google AI Platform / Generative Language

2. **Resend SMTP Credentials**
   - Credential ID in actual workflow: `ZaV9ETWNjd8JTohJ`
   - Must have: Email auth, SMTP server, API key
   - Send Report node should reference this credential

3. **Telegram Bot**
   - Token and Chat ID must be set in environment variables
   - `TELEGRAM_CHAT_ID` and bot token

---

## NEXT STEPS

**Short-term** (Today):
1. Apply fix using fix_audit_workflow.py or manual UI edits
2. Test workflow execution
3. Verify email and Telegram notifications

**Long-term** (Optional):
1. Add error handling to workflow
2. Add email retry logic
3. Add workflow version control to prevent future breakage
4. Set up n8n backup/export process

---

## SUPPORT

If fix doesn't work:
1. Check `WORKFLOW_ANALYSIS_REPORT.md` for detailed diagnostics
2. Review `NODE_CONFIGURATION_DETAILED_COMPARISON.md` for exact config requirements
3. Run `analyze_workflow.py` to get latest workflow state
4. Check n8n logs for additional error details
5. Verify environment variables are set correctly

