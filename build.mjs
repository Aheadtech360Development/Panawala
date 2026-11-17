// Static site build: src/pages + src/partials -> dist/
// Usage: node build.mjs
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, cpSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = join(ROOT, 'src');
const DIST = join(ROOT, 'dist');

const header = readFileSync(join(SRC, 'partials/header.html'), 'utf8');
const footer = readFileSync(join(SRC, 'partials/footer.html'), 'utf8');

const ACTIVE = {
  services: '/services/',
  industries: '/industries/',
  how: '/how-it-works/',
  about: '/about/',
  contact: '/contact/'
};

// Cache-busting version for css/js
const VERSION = Date.now().toString(36);

function renderHeader(active) {
  const href = ACTIVE[active];
  if (!href) return header;
  return header.replace(`class="navlink" href="${href}"`, `class="navlink on" href="${href}" aria-current="page"`);
}

function layout(meta, body) {
  const css = ['base', ...(meta.css || [])]
    .map(c => `<link rel="stylesheet" href="/assets/css/${c}.css?v=${VERSION}">`).join('\n');
  const js = ['site', ...(meta.js || [])]
    .map(j => `<script src="/assets/js/${j}.js?v=${VERSION}" defer></script>`).join('\n');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${meta.title}</title>
${meta.description ? `<meta name="description" content="${meta.description}">\n` : ''}<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lora:wght@500;600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
${css}
${js}
</head>
<body>
${body}
</body>
</html>
`;
}

if (existsSync(DIST)) rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
cpSync(join(SRC, 'assets'), join(DIST, 'assets'), { recursive: true });

let count = 0;
for (const file of readdirSync(join(SRC, 'pages'))) {
  if (!file.endsWith('.html')) continue;
  const raw = readFileSync(join(SRC, 'pages', file), 'utf8');
  const m = raw.match(/^<!--page (\{.*\})-->\r?\n/);
  if (!m) throw new Error(`Missing page meta in ${file}`);
  const meta = JSON.parse(m[1]);
  const body = raw.slice(m[0].length)
    .replace(/<!--@include header(?: active="([^"]*)")?-->/g, (_, a) => renderHeader(a || ''))
    .replace(/<!--@include footer-->/g, footer);
  const out = join(DIST, meta.path);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, layout(meta, body));
  count++;
}
console.log(`Built ${count} pages into dist/`);
