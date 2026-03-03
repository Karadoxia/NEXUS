const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
const targetPath = path.join(__dirname, '../prisma/schema.infra.prisma');

const content = fs.readFileSync(schemaPath, 'utf8');
const lines = content.split('\n');

const infraLines = [
    ...lines.slice(160, 169), // Performance
    "",
    ...lines.slice(186, 231), // Agent Jobs & Configs
    "",
    ...lines.slice(232, 305) // Container Registry & Events
];

const mainLines = [
    ...lines.slice(0, 160), // Up to Subscriber
    ...lines.slice(169, 186) // Log exactly
];

const extractedContent = `// Extracted Infra Schema
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma-infra"
}

datasource db {
  provider = "postgresql"
  url      = env("INFRA_DATABASE_URL")
}

` + infraLines.join('\n') + '\n';

fs.writeFileSync(schemaPath, mainLines.join('\n') + '\n');
fs.writeFileSync(targetPath, extractedContent);

console.log('Schemas cleanly split via line indices.');
