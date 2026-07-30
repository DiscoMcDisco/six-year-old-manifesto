import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const repositoryRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

const readText = (relativePath) =>
  fs.readFileSync(path.join(repositoryRoot, relativePath), 'utf8');

const readJson = (relativePath) =>
  JSON.parse(readText(relativePath));

const fail = (message) => {
  console.error(`✗ ${message}`);
  process.exitCode = 1;
};

const pass = (message) => console.log(`✓ ${message}`);

const requiredFiles = [
  'es/index.html',
  'es/test.html',
  'styles/localisation.css',
  'scripts/manifesto-es.js',
  'scripts/test-es.js',
  'data/test/es/content.json',
  'docs/localisation-pilot.md'
];

for (const relativePath of requiredFiles) {
  if (!fs.existsSync(path.join(repositoryRoot, relativePath))) {
    fail(`Missing required localisation file: ${relativePath}`);
  }
}

if (process.exitCode) process.exit(process.exitCode);

const manifestoHtml = readText('es/index.html');
const testHtml = readText('es/test.html');
const result = readJson('data/test/current-result.json');
const evidence = readJson('data/test/evidence-ledger.json');
const locale = readJson('data/test/es/content.json');

for (const [name, html] of [['manifesto', manifestoHtml], ['test', testHtml]]) {
  if (!/<html lang="es" dir="ltr">/.test(html)) {
    fail(`${name} page must declare lang="es" and dir="ltr"`);
  } else {
    pass(`${name} page declares the Spanish locale and direction`);
  }

  if (!html.includes('/styles/localisation.css')) {
    fail(`${name} page does not load the localisation stylesheet`);
  }

  if (!html.includes('class="language-switcher"')) {
    fail(`${name} page does not expose a language switcher`);
  }

  const unsafeRelativeRoute = /(?:href|src)="(?:\.\.\/|\.\/|index\.html|test\.html)/;
  if (unsafeRelativeRoute.test(html)) {
    fail(`${name} page contains a route-relative asset or clean-URL-sensitive link`);
  } else {
    pass(`${name} page uses root-relative site paths`);
  }
}

const assertCoverage = (label, canonicalIds, translatedIds) => {
  const missing = canonicalIds.filter((id) => !translatedIds.includes(id));
  const stale = translatedIds.filter((id) => !canonicalIds.includes(id));

  if (missing.length) fail(`${label} translations missing: ${missing.join(', ')}`);
  if (stale.length) fail(`${label} translations no longer exist canonically: ${stale.join(', ')}`);
  if (!missing.length && !stale.length) pass(`${label} translation coverage matches canonical data`);
};

assertCoverage(
  'Dimension',
  result.dimensions.map((item) => item.id),
  Object.keys(locale.dimensions)
);

assertCoverage(
  'Headline callout',
  result.headlineCallouts.map((item) => item.id),
  Object.keys(locale.callouts)
);

assertCoverage(
  'Pathway checkpoint',
  result.pathwayCheckpoints.map((item) => item.metricId),
  Object.keys(locale.checkpoints)
);

assertCoverage(
  'Evidence claim',
  evidence.entries.map((item) => item.metricId),
  Object.keys(locale.evidence)
);

assertCoverage(
  'Provider access gate',
  evidence.providerAccessGate.map((item) => item.provider),
  Object.keys(locale.providers)
);

if (locale.knownUnknowns.length !== result.knownUnknowns.length) {
  fail(`Known-unknown translation count differs: canonical ${result.knownUnknowns.length}, Spanish ${locale.knownUnknowns.length}`);
} else {
  pass('Known-unknown translation count matches canonical data');
}

const requiredSpanishRuntimeStrings = [
  'Enlace copiado',
  'Copia este enlace:',
  'No se pudieron cargar los datos de la Prueba.'
];

const runtimeCode = `${readText('scripts/manifesto-es.js')}\n${readText('scripts/test-es.js')}`;
for (const text of requiredSpanishRuntimeStrings) {
  if (!runtimeCode.includes(text)) fail(`Spanish runtime string is missing: ${text}`);
}

if (!process.exitCode) {
  pass('Spanish localisation pilot passed all structural checks');
}
