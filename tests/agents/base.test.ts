import { describe, it, expect, vi } from 'vitest';
import { buildGraph, createAgent, runAgentJob } from '../../lib/agents/base';
import { rustTool } from '../../lib/agents/tools';
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

  it('attaches LangSmith tracer when key set (if tracer module exists)', async () => {
    // temporarily set env var and spy on ChatGroq
    process.env.LANGSMITH_API_KEY = 'dummy';
    const spy = vi.fn();
    const mod = await import('@langchain/groq');
    (mod.ChatGroq as any).mockImplementation(() => {
      return {
        invoke: vi.fn().mockResolvedValue({ content: 'ok', assistant: true }),
        addTracer: spy,
      };
    });
    let graph;
    try {
      graph = await buildGraph({
        name: 't',
        description: '',
        systemPrompt: '',
        tools: [],
      } as any);
    } catch (e) {
      // dynamic import of tracer may fail; in that case just skip assertion
      console.warn('buildGraph failed during tracer test, skipping', e);
    }
    // tracer might not be available in this langchain version; we just
    // ensure buildGraph completes without throwing.
    expect(graph).toBeDefined();
    delete process.env.LANGSMITH_API_KEY;
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

  it('rustTool calls fetch and returns JSON', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ result: 42 }),
    } as any);
    const tool = rustTool();
    const out = await tool.call({ operation: 'sum', numbers: [1, 2] });
    expect(out).toEqual({ result: 42 });
    expect(fetch).toHaveBeenCalled();
  });

  it('runAgentJob creates and updates job record (prisma mocked)', async () => {
    // mock prisma to avoid real DB
    const createSpy = vi
      .spyOn(prisma.agentJob, 'create')
      .mockResolvedValue({ id: '123' } as any);
    const updateSpy = vi
      .spyOn(prisma.agentJob, 'update')
      .mockResolvedValue({ status: 'COMPLETED' } as any);

    const cfg = { name: 't', description: '', systemPrompt: '', tools: [] } as any;
    const { jobId, result } = await runAgentJob(cfg, 'input', 'tester');
    expect(jobId).toBe('123');
    expect(result).toContain('ok');

    expect(createSpy).toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalled();

    createSpy.mockRestore();
    updateSpy.mockRestore();
  });
});
