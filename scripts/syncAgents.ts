import fs from 'fs';
import path from 'path';
import { paramCase } from 'change-case';

// read the configuration and generate any missing agent files
async function main() {
  const cfgPath = path.resolve(process.cwd(), 'agents/config.json');
  if (!fs.existsSync(cfgPath)) {
    console.error('config.json not found');
    process.exit(1);
  }
  const raw = fs.readFileSync(cfgPath, 'utf-8');
  const cfg = JSON.parse(raw);
  const agentsDir = path.resolve(process.cwd(), 'lib/agents');
  if (!fs.existsSync(agentsDir)) fs.mkdirSync(agentsDir, { recursive: true });

  const indexFile = path.join(agentsDir, 'index.ts');
  let indexContent = '';
  if (fs.existsSync(indexFile)) {
    indexContent = fs.readFileSync(indexFile, 'utf-8');
  }

  for (const a of cfg.agentList || []) {
    const name = a.name;
    const fileName = paramCase(name);
    const target = path.join(agentsDir, `${fileName}.ts`);
    const prompt = cfg.agentPrompts?.[name] || a.prompt || '';
    const description = a.description || name;

    if (fs.existsSync(target)) {
      console.log(`skipping existing ${fileName}`);
    } else {
      const varName = name.replace(/\W/g, '_').toUpperCase();
      const content = `import { createAgent } from "./base";

const PROMPT = \`${prompt}\`;

export const ${varName} = createAgent({
  name: "${name}",
  description: "${description}",
  systemPrompt: PROMPT,
  tools: [],
  temperature: 0.3,
  maxSteps: 10,
});
`;
      fs.writeFileSync(target, content);
      console.log(`generated ${fileName}.ts`);
    }

    const exportLine = `export { ${name.replace(/\W/g, '_').toUpperCase()} } from './${fileName}';`;
    if (!indexContent.includes(exportLine)) {
      indexContent += `\n${exportLine}\n`;
      console.log(`added export for ${fileName}`);
    }
  }

  fs.writeFileSync(indexFile, indexContent);
}

main().catch((e) => { console.error(e); process.exit(1); });
