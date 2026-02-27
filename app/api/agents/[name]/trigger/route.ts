import { NextRequest, NextResponse, after } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { requireAdmin } from '@/lib/server-auth';
import { promises as fsp } from 'fs';
import path from 'path';
import { buildGraph } from '@/lib/agents/base';

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
    const dbCfg = await prisma.agentConfig.findUnique({ where: { agentName: name } });
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
  const job = await prisma.agentJob.create({
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
      const compiled = await buildGraph({
        name,
        description: agentDescription,
        systemPrompt: resolvedPrompt,
        tools: [],
      });

      // Race the graph against a hard timeout so a hung LLM call doesn't leave
      // the job record in RUNNING state indefinitely.
      const result = await Promise.race([
        compiled.invoke({ messages: [{ role: 'user', content: 'Run now and produce a full report.' }] }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Agent timed out after ${AGENT_TIMEOUT_MS / 1000}s`)), AGENT_TIMEOUT_MS),
        ),
      ]);

      const text =
        typeof result?.messages?.at(-1)?.content === 'string'
          ? result.messages.at(-1).content
          : JSON.stringify(result);

      await prisma.agentJob.update({
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
      await prisma.agentJob.update({
        where: { id: job.id },
        data: { status: 'FAILED', error: msg },
      });
    }
  });

  return NextResponse.json({ jobId: job.id, status: 'started' });
}
