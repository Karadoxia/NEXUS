import { NextRequest, NextResponse, after } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { requireAdmin } from '@/lib/server-auth';
import { promises as fsp } from 'fs';
import path from 'path';
import { buildGraph } from '@/lib/agents/base';
import { safeAgentRun } from '@/lib/agents/safe-executor';
import { prismaInfra } from '@/src/lib/prisma-infra';


const AGENT_TIMEOUT_MS = 120_000; // 2 minutes max per agent run

async function loadConfig() {
  const cfgPath = path.resolve(process.cwd(), 'agents/config.json');
  try {
    return JSON.parse(await fsp.readFile(cfgPath, 'utf-8'));
  } catch {
    return {};
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { name } = await params;
  const config = await loadConfig();

  // Resolve prompt: DB config takes priority over file config
  let prompt: string | undefined;
  try {
    const dbCfg = await prismaInfra.agentConfig.findUnique({ where: { agentName: name } });
    if (dbCfg?.config) {
      const cfg = typeof dbCfg.config === 'string' ? JSON.parse(dbCfg.config) : dbCfg.config;
      prompt = (cfg as Record<string, string>).prompt ?? (cfg as Record<string, string>).systemPrompt;
    }
  } catch {
    // DB lookup failure is non-fatal — fall through to file config
  }

  if (!prompt) prompt = (config.agentPrompts as Record<string, string> | undefined)?.[name];

  if (!prompt) {
    return NextResponse.json({ error: 'Agent not configured' }, { status: 404 });
  }

  // Create the job upfront so we can return the jobId immediately
  const job = await prismaInfra.agentJob.create({
    data: { agentName: name, triggeredBy: 'admin', status: 'RUNNING' },
  });

  const agentDescription: string =
    (config.agentList as Array<{ name: string; description: string }> | undefined)
      ?.find((a) => a.name === name)?.description ?? '';

  const resolvedPrompt = prompt;

  // `after()` (Next.js 15+) schedules work to run after the response is sent,
  // and the runtime waits for it to complete before the function is torn down.
  // This replaces the fire-and-forget IIFE pattern which was silently killed in
  // serverless environments before the background task could finish.
  after(async () => {
    const start = Date.now();
    try {
      // execute via the safe executor which handles sanitization, approval, and timeout
      const result = await safeAgentRun({
        name,
        description: agentDescription,
        systemPrompt: resolvedPrompt,
        tools: [],
        messages: [{ role: 'user', content: 'Run now and produce a full report.' }],
      });

      const text =
        typeof result?.messages?.at(-1)?.content === 'string'
          ? result.messages.at(-1).content
          : JSON.stringify(result);

      await prismaInfra.agentJob.update({
        where: { id: job.id },
        data: {
          status: 'COMPLETED',
          result: { text },
          completedAt: new Date(),
          durationMs: Date.now() - start,
        },
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      await prismaInfra.agentJob.update({
        where: { id: job.id },
        data: { status: 'FAILED', error: msg },
      });
    }
  });

  return NextResponse.json({ jobId: job.id, status: 'started' });
}
