import { describe, it, expect, vi } from 'vitest';
import { buildGraph, createAgent, runAgentJob } from '../../lib/agents/base';
import { prisma } from '@/src/lib/prisma';

// mock ChatGroq so we don't actually call the API
vi.mock('@langchain/groq', () => {
  return {
    ChatGroq: vi.fn().mockImplementation(() => ({
      invoke: vi.fn().mockResolvedValue({ content: 'ok', assistant: true }),
    })),
  };
});

describe('agent framework', () => {
  it('buildGraph returns compiled graph object', async () => {
    const graph = await buildGraph({
      name: 'test',
      description: '',
      systemPrompt: 'hello',
      tools: [],
    } as any);
    expect(graph.invoke).toBeInstanceOf(Function);
  });

  it('createAgent returns object with invoke', () => {
    const ag = createAgent({
      name: 'x',
      description: '',
      systemPrompt: 'hi',
      tools: [],
    } as any);
    expect(ag.invoke).toBeInstanceOf(Function);
  });

  it('runAgentJob creates and updates job record', async () => {
    // use a temporary sqlite file
    process.env.DATABASE_URL = 'file:./test.db?mode=memory&cache=shared';
    const cfg = { name: 't', description: '', systemPrompt: '', tools: [] } as any;
    const { jobId, result } = await runAgentJob(cfg, 'input', 'tester');
    expect(jobId).toBeTruthy();
    expect(result).toContain('ok');

    const record = await prisma.agentJob.findUnique({ where: { id: jobId } });
    expect(record?.status).toBe('COMPLETED');
  });
});
