
# 📊 NEXUS GOD-MODE MONITORING SETUP

## Grafana Dashboards

### 1. n8n Workflow Health Dashboard
```
Go to: https://grafana.nexus-io.duckdns.org
Login: admin / ${GRAFANA_PASS}

Create New Dashboard:
  - Panel: "Workflow Execution Rate"
    Query: rate(n8n_workflows_executed_total[5m])
  - Panel: "Workflow Failures"
    Query: rate(n8n_workflows_failed_total[5m])
  - Panel: "Average Execution Time"
    Query: avg(n8n_workflow_execution_duration_seconds)
```

### 2. Business Metrics Dashboard
```
Create New Dashboard:
  - Panel: "Revenue Impact"
    Query: SELECT SUM(total) FROM "Order" WHERE "createdAt" > NOW() - INTERVAL '1 month'
  - Panel: "Customer Retention"
    Query: SELECT COUNT(*) FROM "User" WHERE "lastLogin" > NOW() - INTERVAL '30 days'
  - Panel: "Fraud Detection Rate"
    Query: SELECT COUNT(*) FROM "Order" WHERE "fraudScore" > 75
```

### 3. LangSmith Tracing
```
Go to: https://smith.langchain.com
Login with your credentials

Monitor:
  - AI API costs per workflow
  - Response quality metrics
  - Prompt optimization opportunities
  - Execution latencies
```

## Loki Log Queries

### View all n8n logs
```
{job="n8n"}
```

### View workflow errors
```
{job="n8n"} | json | level="error"
```

### View specific workflow (e.g., inventory)
```
{job="n8n"} | json workflow="inventory-restock-ai"
```

### View Groq API errors
```
{job="n8n"} | json service="groq" | level="error"
```

## Real-Time Alerts (Telegram)

Alerts automatically sent to Telegram chat: ${TELEGRAM_CHAT_ID}

Configured for:
  - Workflow failures (critical)
  - High fraud scores (>80)
  - Negative reviews (sentiment analysis)
  - Performance degradation (>2s response time)
  - Backup failures
  - Database connection errors

## Key Metrics to Monitor

| Metric | Target | Action if Failed |
|--------|--------|------------------|
| Workflow success rate | >99% | Check Loki, restart workflow |
| Avg execution time | <5 min | Optimize query or batch size |
| Fraud false positives | <2% | Tune Rust fraud scoring |
| Newsletter open rate | >25% | Update email templates |
| Support bot resolution | >80% | Improve prompt, add training |
| LangSmith cost | <$100/month | Set usage alerts |

## Troubleshooting Playbook

### If workflow fails:
1. Check Telegram alert for error message
2. Go to Loki: {job="n8n"} | json workflow="<name>"
3. Look for last successful execution time
4. Review API rate limits (Groq, Gemini, Resend)
5. If API limit hit: implement queue mode retry

### If database connection fails:
1. Verify: docker compose ps postgres
2. Check pool size: SELECT COUNT(*) FROM pg_stat_activity
3. If maxed: restart postgres with larger pool
4. Review logs: docker logs postgres | tail -100

### If backup fails:
1. Check S3 credentials in .env
2. Verify Backblaze B2 credentials
3. Check disk space: df -h
4. Review backup logs in Loki

### If email not sending:
1. Verify Resend API key is valid
2. Check sender domain verification
3. Review bounce reports in Resend dashboard
4. Check Loki for SMTP errors

## Monthly Review Checklist

- [ ] Review workflow success rates in Grafana
- [ ] Analyze cost per workflow in LangSmith
- [ ] Check revenue impact vs. baseline
- [ ] Optimize top 3 slowest workflows
- [ ] Review false positive rates in fraud detection
- [ ] Update prompts based on LangSmith insights
- [ ] Check for any infrastructure upgrades needed
- [ ] Review customer feedback from reviews/churn workflows

---

**Status**: ✅ All monitoring configured
**Last Updated**: 2026-03-01T23:22:53.983Z
