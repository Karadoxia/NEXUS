#!/usr/bin/env node
/**
 * n8n MCP (Model Context Protocol) Server
 * Enables Claude and other AI models to interact with n8n workflows
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const N8N_API_BASE = process.env.N8N_API_BASE || 'http://localhost:5678/api/v1';
const N8N_API_KEY = process.env.N8N_API_KEY || '';
const MCP_PORT = process.env.MCP_PORT || 3000;

class N8nMCPServer {
  constructor() {
    this.workflows = [];
    this.credentials = [];
    this.loadResources();
  }

  loadResources() {
    console.log(`[MCP] Initializing n8n MCP Server`);
    console.log(`[MCP] n8n API Base: ${N8N_API_BASE}`);
    console.log(`[MCP] MCP Server Port: ${MCP_PORT}`);
  }

  async getWorkflows() {
    const options = new URL(N8N_API_BASE + '/workflows').href;
    return new Promise((resolve, reject) => {
      const requestUrl = new URL(options);
      const protocol = requestUrl.protocol === 'https:' ? https : http;

      const req = protocol.get(options, {
        headers: {
          'X-N8N-API-KEY': N8N_API_KEY,
          'Content-Type': 'application/json'
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data).data || []);
          } catch(e) {
            resolve([]);
          }
        });
      });

      req.on('error', reject);
    });
  }

  async executeWorkflow(workflowId, data) {
    const url = `${N8N_API_BASE}/workflows/${workflowId}/execute`;
    return new Promise((resolve, reject) => {
      const options = new URL(url);
      const protocol = options.protocol === 'https:' ? https : http;

      const req = protocol.request(options, {
        method: 'POST',
        headers: {
          'X-N8N-API-KEY': N8N_API_KEY,
          'Content-Type': 'application/json'
        }
      }, (res) => {
        let response = '';
        res.on('data', chunk => response += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(response));
          } catch(e) {
            resolve({ status: 'executed', message: response });
          }
        });
      });

      req.on('error', reject);
      req.write(JSON.stringify(data || {}));
      req.end();
    });
  }

  startServer() {
    const server = http.createServer(async (req, res) => {
      // Enable CORS
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.setHeader('Content-Type', 'application/json');

      if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
      }

      const { pathname } = new URL(req.url, `http://${req.headers.host}`);

      try {
        if (pathname === '/mcp/workflows' && req.method === 'GET') {
          const workflows = await this.getWorkflows();
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            data: workflows,
            count: workflows.length
          }));
        }
        else if (pathname.startsWith('/mcp/execute/') && req.method === 'POST') {
          const workflowId = pathname.replace('/mcp/execute/', '');
          let body = '';

          req.on('data', chunk => body += chunk);
          req.on('end', async () => {
            try {
              const data = JSON.parse(body);
              const result = await this.executeWorkflow(workflowId, data);
              res.writeHead(200);
              res.end(JSON.stringify({
                success: true,
                workflowId,
                result
              }));
            } catch(e) {
              res.writeHead(400);
              res.end(JSON.stringify({
                success: false,
                error: e.message
              }));
            }
          });
        }
        else if (pathname === '/mcp/health' && req.method === 'GET') {
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            status: 'healthy',
            version: '1.0.0',
            n8nConnected: !!N8N_API_KEY
          }));
        }
        else {
          res.writeHead(404);
          res.end(JSON.stringify({
            success: false,
            error: 'Endpoint not found',
            availableEndpoints: [
              '/mcp/health',
              '/mcp/workflows',
              '/mcp/execute/{workflowId}'
            ]
          }));
        }
      } catch(error) {
        res.writeHead(500);
        res.end(JSON.stringify({
          success: false,
          error: error.message
        }));
      }
    });

    server.listen(MCP_PORT, () => {
      console.log(`[MCP] ✅ Server running on port ${MCP_PORT}`);
      console.log(`[MCP] Available endpoints:`);
      console.log(`[MCP]   GET  /mcp/health - Server health check`);
      console.log(`[MCP]   GET  /mcp/workflows - List all workflows`);
      console.log(`[MCP]   POST /mcp/execute/{workflowId} - Execute workflow`);
    });

    return server;
  }
}

// Start the MCP server
const mcpServer = new N8nMCPServer();
mcpServer.startServer();

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('[MCP] Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('[MCP] Interrupted, shutting down...');
  process.exit(0);
});
