# Workflow Agents

Each n8n workflow runs under its own dedicated agent process. Agents are small Node.js programs that
monitor, trigger and health-check a single workflow. This design keeps the runtime decoupled from
n8n itself and makes it easy to scale or restart an individual workflow without touching the others.

## Components

- `scripts/agent-template.js` – the generic agent code. It exposes `/run` and `/health` HTTP endpoints
  and communicates with n8n via its public REST API.
- `scripts/generate-agents.js` – reads the workflow list from n8n and writes a
  `docker-compose.agents.yml` file containing one service per workflow.
- `Dockerfile.agent` – builds a lightweight image containing the template.
- `docker-compose.agents.yml` – (generated) adds one `agent-<slug>` service per workflow.

## How to build

1. Ensure you have a valid n8n API key in `app/n8n-API` (or exported as `N8N_API_KEY`).
2. Install dependencies: `npm install` (this will pull in `js-yaml`).
3. Run the generator:
   ```bash
   node scripts/generate-agents.js
   ```
   This queries the **`/api/v1/workflows`** endpoint (the public `/rest` routes are not API‑key protected) and writes `docker-compose.agents.yml` with one service per workflow; you should see a count of `18 services`.
4. Start the agents along with the regular stack. For example:
   ```bash
   docker compose up -d --build nexus-app n8n
   docker compose -f docker-compose.yml -f docker-compose.agents.yml up -d --build
   ```
   (The second command merges the two files and brings up 18 small agent containers.)
5. Verify by listing running containers:
   ```bash
   docker compose ps | grep agent-
   ```
   You should see `agent-global-error-notifier`, `agent-stripe-order-fulfillment`, etc.
```

## Agent API

Each agent listens on an ephemeral port inside the Compose network. When containers start,
`agent-template.js` prints its bound port. You can also reach them via the host by mapping ports
or using a reverse proxy.

Endpoints:

- `POST /run` – triggers the associated workflow via the n8n REST API.
- `GET /health` – returns `{ ok: true }` if the workflow configuration can be fetched.

The environment variables available inside each agent:

```
WORKFLOW_ID        # n8n workflow UUID
WORKFLOW_NAME      # human‑readable name
N8N_API_KEY        # key for the n8n public API
N8N_HOST           # base URL for n8n (default http://n8n:5678)
ADMIN_EMAIL        # optional fallback email for reports
DEFAULT_FROM_EMAIL # address to use when the workflow specifies an unverified from-domain (e.g. no-reply@resend.dev)
TELEGRAM_CHAT_ID   # optional Telegram chat to notify errors
```

Agents also import `TELEGRAM_CHAT_ID`, `ADMIN_EMAIL` and `DEFAULT_FROM_EMAIL` from the Compose environment, so make sure
you have the proper values in `.env` and the `docker-compose.yml` service definitions.

## Maintenance

- To add a new workflow simply import it into n8n and rerun the generator. The generated
  Compose file will include an additional service the next time you bring the cluster up.
- To update an existing agent’s logic, edit `scripts/agent-template.js` and rebuild the `agent`
  image (compose will notice the changed `Dockerfile.agent`).
- If an agent repeatedly fails, its logs (`docker compose logs agent-<slug>`) will explain why.

## Notes

- Agents do **not** expose SSH or database credentials; they only communicate with n8n via its
  API key. They are safe to run on public-facing hosts provided the key is protected.
- You can dock an alerting channel (Slack, Telegram) inside the template if you want automatic
  error notifications when a workflow execution fails.

---

This architecture was introduced on 2026‑03‑02 in response to a request to "delegate for each workflow a dedicated agent to manage." It enhances reliability and observability of the n8n automations.
