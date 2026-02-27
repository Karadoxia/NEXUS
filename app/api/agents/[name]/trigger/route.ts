import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { requireAdmin } from '@/lib/server-auth';
import fs from 'fs';
import path from 'path';
import { buildGraph } from '@/lib/agents/base';

function loadConfig() {
  const cfgPath = path.resolve(process.cwd(), 'agents/config.json');
  try {
    return JSON.parse(fs.readFileSync(cfgPath, 'utf-8'));
  } catch {
    return {};
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { name } = await params;
  const config = loadConfig();

  // resolve prompt: DB config first, then file config
  let prompt: string | undefined;
  try {
    const dbCfg = await prisma.agentConfig.findUnique({ where: { agentName: name } });
    if (dbCfg?.config) {
      const cfg = typeof dbCfg.config === 'string' ? JSON.parse(dbCfg.config) : dbCfg.config;
      prompt = cfg.prompt ?? cfg.systemPrompt;
    }
  } catch {}

  if (!prompt) prompt = config.agentPrompts?.[name];

  if (!prompt) {
    return NextResponse.json({ error: 'Agent not configured' }, { status: 404 });
  }

  // Create the job upfront so we can return the jobId immediately
  const job = await prisma.agentJob.create({
    data: { agentName: name, triggeredBy: 'admin', status: 'RUNNING' },
  });

  // Run the graph in the background — do NOT await
  ;(async () => {
    const start = Date.now();
    try {
      const compiled = await buildGraph({
        name,
        description: config.agentList?.find((a: any) => a.name === name)?.description ?? '',
        systemPrompt: prompt!,
        tools: [],
      });
      const result = await compiled.invoke({
        messages: [{ role: 'user', content: 'Run now and produce a full report.' }],
      });
      const text = result?.messages?.at(-1)?.content ?? JSON.stringify(result);
      await prisma.agentJob.update({
        where: { id: job.id },
        data: {
          status: 'COMPLETED',
          result: { text },
          completedAt: new Date(),
          durationMs: Date.now() - start,
        },
      });
    } catch (e: any) {
      await prisma.agentJob.update({
        where: { id: job.id },
        data: { status: 'FAILED', error: String(e?.message ?? e) },
      });
    }
  })();

  return NextResponse.json({ jobId: job.id, status: 'started' });
}
