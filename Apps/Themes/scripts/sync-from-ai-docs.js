/**
 * Sync design system data from @rootplatform/ai-docs
 *
 * This script copies the design tokens and icons from the ai-docs package
 * into the generated/ folder so the Themes sample stays up-to-date.
 *
 * Usage: node scripts/sync-from-ai-docs.js
 *
 * Prerequisites:
 * - @rootplatform/ai-docs-single must be installed
 * - Or run from monorepo with access to RootApp.AiKit
 */

const fs = require('fs');
const path = require('path');

// Try multiple possible locations for ai-docs
const possiblePaths = [
  // Installed as npm package
  () => {
    try {
      const pkgPath = require.resolve('@rootplatform/ai-docs-single/package.json');
      return path.dirname(pkgPath);
    } catch {
      return null;
    }
  },
  // Local monorepo path (for development)
  () => {
    const localPath = path.resolve(__dirname, '../../../../RootApp.AiKit/.source/single');
    return fs.existsSync(localPath) ? localPath : null;
  },
  // Alternative monorepo path
  () => {
    const localPath = path.resolve(__dirname, '../../../../RootApp.AiKit/dist/ai-docs-single');
    return fs.existsSync(localPath) ? localPath : null;
  }
];

function findAiDocsPath() {
  for (const pathFn of possiblePaths) {
    const result = pathFn();
    if (result && fs.existsSync(result)) {
      return result;
    }
  }
  return null;
}

const aiDocsDir = findAiDocsPath();

if (!aiDocsDir) {
  console.error('Error: Could not find @rootplatform/ai-docs-single package.');
  console.error('Please ensure it is installed or run from the monorepo.');
  process.exit(1);
}

console.log(`Found ai-docs at: ${aiDocsDir}`);

const outDir = path.join(__dirname, '../client/src/generated');

// Ensure output directory exists
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Files to sync
const files = [
  { src: 'design-system/design-system.json', dest: 'design-tokens.json' },
  { src: 'icons/icons.json', dest: 'icons.json' },
  { src: 'design-system/design-system.md', dest: 'design-system-reference.md' },
];

let successCount = 0;

files.forEach(({ src, dest }) => {
  const srcPath = path.join(aiDocsDir, src);
  const destPath = path.join(outDir, dest);

  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`  Copied: ${src} -> ${dest}`);
    successCount++;
  } else {
    console.warn(`  Warning: Source not found: ${srcPath}`);
  }
});

// Write a README for the generated folder
const readmeContent = `# Generated Files

**DO NOT EDIT THESE FILES MANUALLY**

These files are auto-generated from \`@rootplatform/ai-docs-single\`.
To update them, run:

\`\`\`bash
node scripts/sync-from-ai-docs.js
\`\`\`

## Contents

- \`design-tokens.json\` - Design system tokens (colors, spacing, typography, etc.)
- \`icons.json\` - Icon metadata with inline SVG content
- \`design-system-reference.md\` - Full design system documentation

## Source

These files originate from the RootApp.AiKit package which generates
AI-optimized documentation from the Root design system source.

Last synced: ${new Date().toISOString()}
`;

fs.writeFileSync(path.join(outDir, 'README.md'), readmeContent);

console.log(`\nSync complete! ${successCount}/${files.length} files copied.`);
