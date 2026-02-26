import fs from 'fs';
import path from 'path';
import { PrismaClient } from '../src/generated/prisma/client';

async function main() {
  const prisma = new PrismaClient();
  const cfgPath = path.resolve(process.cwd(), 'agents/config.json');
  const raw = fs.readFileSync(cfgPath, 'utf-8');
  const cfg = JSON.parse(raw);
  for (const a of cfg.agentList || []) {
    const prompt = cfg.agentPrompts?.[a.name] || a.prompt;
    await prisma.agentConfig.upsert({
      where: { agentName: a.name },
      update: { config: { prompt, ...a } },
      create: { agentName: a.name, config: { prompt, ...a } },
    });
  }
  console.log('seeded agent configs');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
