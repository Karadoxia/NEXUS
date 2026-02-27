import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const tmpDir = path.resolve(__dirname, '../tmp-sync');

describe('syncAgents script', () => {
  beforeAll(() => {
    if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true });
    fs.mkdirSync(tmpDir, { recursive: true });
    // copy config.json into tmp
    const cfg = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'agents/config.json'), 'utf-8'));
    const agentsDir = path.join(tmpDir, 'agents');
    fs.mkdirSync(agentsDir, { recursive: true });
    fs.writeFileSync(path.join(agentsDir, 'config.json'), JSON.stringify(cfg, null, 2));
  });

  it('generates missing files and updates index', () => {
    const script = path.resolve(process.cwd(), 'scripts/syncAgents.ts');
    execSync(`ts-node ${script}`, { cwd: tmpDir, stdio: 'inherit' });
    const agentsDir = path.join(tmpDir, 'lib/agents');
    // ensure at least one known config entry produced file
    const cfg = JSON.parse(fs.readFileSync(path.join(tmpDir, 'agents/config.json'), 'utf-8'));
    const first = cfg.agentList[0].name;
    const fileName = first.replace(/\./g,'-');
    expect(fs.existsSync(path.join(agentsDir, `${fileName}.ts`))).toBe(true);
    const idx = fs.readFileSync(path.join(agentsDir, 'index.ts'), 'utf-8');
    expect(idx).toContain(fileName);
  });
});
