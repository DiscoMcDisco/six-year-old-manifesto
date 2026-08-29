import fs from 'node:fs';
import path from 'node:path';

const pages = ['index.html', 'test.html'];
const requiredIndexIds = ['start-here', 'principles', 'transition', 'foundry', 'evidence', 'uncertainty', 'sources'];
let failed = false;

function fail(message) {
  failed = true;
  console.error(`Structure validation failed: ${message}`);
}

function idsFor(file) {
  const html = fs.readFileSync(file, 'utf8');
  return new Set([...html.matchAll(/\sid=["']([^"']+)["']/g)].map((match) => match[1]));
}

const pageIds = Object.fromEntries(pages.map((file) => [file, idsFor(file)]));
for (const id of requiredIndexIds) {
  if (!pageIds['index.html'].has(id)) fail(`index.html is missing #${id}`);
}

for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8');
  const refs = [...html.matchAll(/(?:href|src)=["']([^"']+)["']/g)].map((match) => match[1]);

  for (const ref of refs) {
    if (/^(?:https?:|mailto:|tel:|data:|javascript:)/.test(ref)) continue;
    if (ref.startsWith('#')) {
      const id = ref.slice(1);
      if (id && !pageIds[file].has(id)) fail(`${file} links to missing #${id}`);
      continue;
    }

    const [targetPath, fragment] = ref.split('#');
    if (!targetPath || targetPath.startsWith('/')) continue;
    const resolved = path.normalize(path.join(path.dirname(file), targetPath));
    if (!fs.existsSync(resolved)) {
      fail(`${file} references missing local file ${targetPath}`);
      continue;
    }
    if (fragment && resolved.endsWith('.html')) {
      const targetIds = pageIds[resolved] ?? idsFor(resolved);
      if (!targetIds.has(fragment)) fail(`${file} links to missing ${resolved}#${fragment}`);
    }
  }
}

if (failed) process.exit(1);
console.log('Manifesto structure validation passed.');
