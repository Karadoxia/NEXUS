import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import fs from 'fs';
import path from 'path';
import { createAgent } from '@/lib/agents/base';

// load config file (agents/config.json)
function loadConfig() {
  const cfgPath = path.resolve(process.cwd(), 'agents/config.json');
  try {
    const raw = fs.readFileSync(cfgPath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export async function POST(req: NextRequest, { params }: { params: { name: string } }) {
  const { name } = params;
  const config = loadConfig();
  const prompt = config.agentPrompts?.[name];
  if (!prompt) {
    return NextResponse.json({ error: 'Agent not configured' }, { status: 404 });
  }

  const job = await prisma.agentJob.create({ data: { agentName: name, triggeredBy: 'admin' } });

  (async () => {
    const start = Date.now();
    try {
      const agent = await createAgent({
        name,
        description: config.agentList?.find((a: any) => a.name === name)?.description || '',
        systemPrompt: prompt,
        tools: [],
      });
      const result = await agent.invoke({ messages: [{ role: 'user', content: 'Run now' }] });
      await prisma.agentJob.update({
        where: { id: job.id },
        data: { status: 'COMPLETED', result, completedAt: new Date(), durationMs: Date.now() - start },
      });
    } catch (e) {
      await prisma.agentJob.update({ where: { id: job.id }, data: { status: 'FAILED', error: String(e) } });
    }
  })();

  return NextResponse.json({ jobId: job.id, status: 'started' });
}
