#!/usr/bin/env ts-node

import fs from 'fs';
import path from 'path';
import { paramCase } from 'change-case';

if (process.argv.length < 4) {
  console.error('Usage: newAgent.ts <Name> <Prompt> [Description]');
  process.exit(1);
}

const name = process.argv[2];
const prompt = process.argv[3];
const desc = process.argv[4] || name;

const fileName = paramCase(name);
const agentsDir = path.resolve(process.cwd(), 'lib/agents');
const targetFile = path.join(agentsDir, `${fileName}.ts`);
const indexFile = path.join(agentsDir, 'index.ts');
const configPath = path.resolve(process.cwd(), 'agents/config.json');

if (!fs.existsSync(agentsDir)) {
  fs.mkdirSync(agentsDir, { recursive: true });
}

if (fs.existsSync(targetFile)) {
  console.error(`agent file already exists: ${targetFile}`);
  process.exit(1);
}

const content = `import { createAgent } from "./base";

const PROMPT = \\`${prompt}\\`;

export const ${name.replace(/\W/g, '_').toUpperCase()} = createAgent({
  name: "${name}",
  description: "${desc}",
  systemPrompt: PROMPT,
  tools: [],
  temperature: 0.3,
  maxSteps: 10,
});
`;

fs.writeFileSync(targetFile, content);
console.log(`created ${targetFile}`);

// add export to index.ts
let indexContent = '';
if (fs.existsSync(indexFile)) {
  indexContent = fs.readFileSync(indexFile, 'utf-8');
}
const exportLine = `export { ${name.replace(/\W/g, '_').toUpperCase()} } from './${fileName}';`;
if (!indexContent.includes(exportLine)) {
  indexContent += `\n${exportLine}\n`;
  fs.writeFileSync(indexFile, indexContent);
  console.log(`added export to index.ts`);
}

// update agents/config.json
if (fs.existsSync(configPath)) {
  const raw = fs.readFileSync(configPath, 'utf-8');
  const cfg = JSON.parse(raw);
  cfg.agentList = cfg.agentList || [];
  cfg.agentPrompts = cfg.agentPrompts || {};
  if (!cfg.agentList.find((a: any) => a.name === fileName)) {
    cfg.agentList.push({ name: fileName, description: desc, enabled: true });
    cfg.agentPrompts[fileName] = prompt;
    fs.writeFileSync(configPath, JSON.stringify(cfg, null, 2));
    console.log(`added entry to agents/config.json`);
  }
}
