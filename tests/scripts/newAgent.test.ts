import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

describe('newAgent script', () => {
  const tmpDir = path.resolve(__dirname, '../tmp');
  beforeAll(() => {
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
    fs.mkdirSync(tmpDir, { recursive: true });
    const agentsDir = path.join(tmpDir, 'agents');
    fs.mkdirSync(agentsDir, { recursive: true });
    fs.writeFileSync(path.join(agentsDir, 'config.json'), JSON.stringify({agentList: [], agentPrompts: {}}));
  });
  it('creates a new agent file and updates index/config', () => {
    const script = path.resolve(__dirname, '../../scripts/newAgent.ts');
    execSync(`ts-node ${script} FooBot \\"prompt\\" \\"desc\\"`, {
      cwd: tmpDir,
      stdio: 'inherit',
    });
    const agentsDir = path.join(tmpDir, 'lib/agents');
    expect(fs.existsSync(path.join(agentsDir, 'foo-bot.ts'))).toBe(true);
    const idx = fs.readFileSync(path.join(agentsDir, 'index.ts'), 'utf-8');
    expect(idx).toContain('foo-bot');
    const cfg = JSON.parse(fs.readFileSync(path.join(tmpDir, 'agents/config.json'), 'utf-8'));
    expect(cfg.agentList.find((a:any)=>a.name==='foo-bot')).toBeTruthy();
  });
});
