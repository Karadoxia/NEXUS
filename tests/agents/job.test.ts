import { describe, it, expect } from 'vitest';
import { runAgentJob } from '../../lib/agents/base';

// minimal test to exercise DB row creation/ failure path

describe('runAgentJob edge cases', () => {
  it('throws when model call fails', async () => {
    process.env.DATABASE_URL = 'file:./test.db?mode=memory&cache=shared';
    const badCfg = { name: 'bad', description: '', systemPrompt: '', tools: [], temperature: -1 } as any;
    await expect(runAgentJob(badCfg, 'input')).rejects.toBeDefined();
  });
});
