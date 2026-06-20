// Transforms the `infogiph-template-catalog` workflow JSON output into the
// typed `src/lib/templates/catalog.data.ts` data module.
//
// Usage: node scripts/gen-template-catalog.mjs <path-to-workflow-output.json>

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ICON_ENUM = new Set([
  'bot',
  'database',
  'cloud',
  'web',
  'chat',
  'drive',
  'mobile',
  'mail',
  'search',
  'process',
  'automation',
  'social',
  'layers',
]);

// Category display order (matches catalog.ts).
const CATEGORY_ORDER = [
  'architecture',
  'data',
  'ai-ml',
  'business',
  'marketing',
  'sales-crm',
  'product',
  'devops-cloud',
  'security',
  'finance',
  'org-people',
  'process',
  'education',
  'healthcare',
];

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Usage: node scripts/gen-template-catalog.mjs <output.json>');
  process.exit(1);
}

const raw = readFileSync(resolve(inputPath), 'utf8');
const parsed = JSON.parse(raw);

// The workflow result may sit at the top level or under `.result`.
const payload = parsed.result ?? parsed;
const templates = payload.templates;
if (!Array.isArray(templates)) {
  console.error('Could not find a templates array in the output.');
  console.error('Top-level keys:', Object.keys(parsed));
  process.exit(1);
}

const coerceIcon = (icon) => (ICON_ENUM.has(icon) ? icon : 'layers');

const seen = new Set();
const cleaned = [];
let fixedIcons = 0;

for (const t of templates) {
  if (!t || typeof t !== 'object') continue;
  const slug = String(t.slug || '').trim();
  if (!slug || seen.has(slug)) continue;
  seen.add(slug);

  const centerIcon = coerceIcon(t.centerIcon);
  if (centerIcon !== t.centerIcon) fixedIcons++;

  const satellites = (t.satellites || []).map((s) => {
    const icon = coerceIcon(s.icon);
    if (icon !== s.icon) fixedIcons++;
    return { label: String(s.label), icon };
  });

  let treeChildren;
  if (Array.isArray(t.treeChildren) && t.treeChildren.length > 0) {
    treeChildren = t.treeChildren.map((c) => {
      const icon = coerceIcon(c.icon);
      if (icon !== c.icon) fixedIcons++;
      const node = { label: String(c.label), icon };
      if (Array.isArray(c.children) && c.children.length > 0) {
        node.children = c.children.map((g) => {
          const gi = coerceIcon(g.icon);
          if (gi !== g.icon) fixedIcons++;
          return { label: String(g.label), icon: gi };
        });
      }
      return node;
    });
  }

  const entry = {
    slug,
    title: String(t.title),
    shortDescription: String(t.shortDescription),
    longDescription: String(t.longDescription),
    tags: (t.tags || []).map(String),
    keywords: (t.keywords || []).map(String),
    layout: t.layout === 'tree' ? 'tree' : 'hub',
    centerLabel: String(t.centerLabel),
    centerIcon,
    satellites,
    ...(treeChildren ? { treeChildren } : {}),
    faqs: (t.faqs || []).map((f) => ({ q: String(f.q), a: String(f.a) })),
    useCases: (t.useCases || []).map(String),
    category: String(t.category),
    categoryName: String(t.categoryName),
  };
  cleaned.push(entry);
}

// Stable sort by category order, then keep generation order within a category.
const orderIndex = (k) => {
  const i = CATEGORY_ORDER.indexOf(k);
  return i === -1 ? 999 : i;
};
cleaned.sort((a, b) => orderIndex(a.category) - orderIndex(b.category));

const counts = {};
for (const t of cleaned) counts[t.category] = (counts[t.category] || 0) + 1;

const header = `// AUTO-GENERATED — do not edit by hand.
//
// Produced by scripts/gen-template-catalog.mjs from the
// \`infogiph-template-catalog\` workflow output. Re-run that workflow and the
// script to regenerate.
//
// ${cleaned.length} templates across ${Object.keys(counts).length} categories.

import type { RawTemplate } from './types';

export const rawTemplates: RawTemplate[] = `;

const body = JSON.stringify(cleaned, null, 2);
const outPath = resolve('src/lib/templates/catalog.data.ts');
writeFileSync(outPath, `${header}${body};\n`, 'utf8');

console.log(`Wrote ${cleaned.length} templates to ${outPath}`);
console.log(`Coerced ${fixedIcons} invalid icon keys to 'layers'.`);
console.log('Per-category counts:');
for (const k of CATEGORY_ORDER) {
  if (counts[k]) console.log(`  ${k}: ${counts[k]}`);
}
const unknown = Object.keys(counts).filter((k) => !CATEGORY_ORDER.includes(k));
if (unknown.length) console.log('  UNKNOWN categories:', unknown.join(', '));
