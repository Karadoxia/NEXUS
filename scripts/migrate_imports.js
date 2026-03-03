const { execSync } = require('child_process');
const fs = require('fs');

const files = execSync('find app lib scripts -type f -name "*.ts*" -exec grep -lE -i "prisma\.(agent|performance|container|registration)" {} +')
    .toString().trim().split('\n');

for (const file of files) {
    if (!file) continue;
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('prismaInfra.')) continue;

    let original = content;

    // Replace prisma.model with prismaInfra.model
    content = content.replace(/prisma\.(agentJob|agentResult|agentConfig|performance|containerRegistry|registrationEvent)/g, 'prismaInfra.$1');

    if (content !== original) {
        // Add import if not present
        if (!content.includes(`prisma-infra`)) {
            const importStatement = `import { prismaInfra } from '@/src/lib/prisma-infra';\n`;
            // Find the last import statement
            const importMatches = [...content.matchAll(/^import .+?;/gm)];
            if (importMatches.length > 0) {
                const lastMatch = importMatches[importMatches.length - 1];
                const lastIndex = lastMatch.index + lastMatch[0].length;
                content = content.slice(0, lastIndex) + '\n' + importStatement + content.slice(lastIndex);
            } else {
                content = importStatement + '\n' + content;
            }
        }

        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
    }
}
