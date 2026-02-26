#!/usr/bin/env node

/**
 * generate-llms-txt.js
 *
 * Scant pages/ directory, leest MDX frontmatter en _meta.ts bestanden,
 * en genereert public/llms.txt conform de llmstxt.org specificatie.
 *
 * Draait als onderdeel van prebuild (naast generate-meta.js).
 */

const fs = require('fs');
const path = require('path');

const PAGES_DIR = path.join(__dirname, '../pages');
const OUTPUT_PATH = path.join(__dirname, '../public/llms.txt');
const BASE_URL = 'https://docs.kroescontrol.nl';

const SITE_TITLE = 'Kroescontrol';
const SITE_DESCRIPTION = 'Publieke documentatie over Kroescontrol — cultuur, kantoren, branding, vacatures en juridische informatie.';

// Pagina's die we skippen in llms.txt
const SKIP_PAGES = new Set([
  'opt-out',     // Utility page
  'index',       // Homepage is apart behandeld
]);

// Secties die hidden zijn in navigatie
const HIDDEN_SECTIONS = new Set([
  'en',          // Engelse vertalingen apart
  'opt-out',
]);

/**
 * Parse YAML-achtige frontmatter uit MDX bestand.
 * Simpele parser — geen dependency nodig.
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};

  const fm = {};
  const lines = match[1].split('\n');
  let currentKey = null;
  let multilineValue = '';

  for (const line of lines) {
    // Multiline value continuation (indented or >- continuation)
    if (currentKey && (line.startsWith('  ') || line.startsWith('\t'))) {
      multilineValue += ' ' + line.trim();
      continue;
    }

    // Save previous multiline value
    if (currentKey && multilineValue) {
      fm[currentKey] = multilineValue.trim();
      currentKey = null;
      multilineValue = '';
    }

    const kvMatch = line.match(/^(\w[\w-]*):\s*(.*)/);
    if (kvMatch) {
      const key = kvMatch[1];
      let value = kvMatch[2].trim();

      // Multiline indicator
      if (value === '>-' || value === '|' || value === '>') {
        currentKey = key;
        multilineValue = '';
        continue;
      }

      // Remove quotes
      if ((value.startsWith("'") && value.endsWith("'")) ||
          (value.startsWith('"') && value.endsWith('"'))) {
        value = value.slice(1, -1);
      }

      fm[key] = value;
    }
  }

  // Final multiline value
  if (currentKey && multilineValue) {
    fm[currentKey] = multilineValue.trim();
  }

  return fm;
}

/**
 * Parse _meta.ts bestand en return key-value mapping.
 * Ondersteunt zowel `const meta = {...}` als `export default {...}` syntax.
 */
function parseMetaFile(filePath) {
  if (!fs.existsSync(filePath)) return {};

  const content = fs.readFileSync(filePath, 'utf-8');
  const entries = {};

  // Match key-value pairs: "key": "value" of key: "value"
  const regex = /['"]?([\w-]+)['"]?\s*:\s*(?:'([^']*)'|"([^"]*)"|\{[^}]*display:\s*['"]hidden['"][^}]*\}|(\{[\s\S]*?\}))/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const key = match[1];
    const value = match[2] || match[3]; // single or double quoted string

    if (value) {
      entries[key] = value;
    } else {
      // Object value (hidden, etc.) — markeer als hidden
      entries[key] = { hidden: true };
    }
  }

  return entries;
}

/**
 * Scan een directory voor MDX bestanden en return pagina-informatie.
 * Gebruikt _meta.ts voor volgorde en titels, maar ontdekt ook
 * MDX bestanden die niet in _meta.ts staan (filesystem fallback).
 */
function scanSection(sectionDir, sectionSlug) {
  const metaPath = path.join(sectionDir, '_meta.ts');
  const meta = parseMetaFile(metaPath);
  const pages = [];
  const seen = new Set();

  // Eerst: pagina's uit _meta.ts (behoudt navigatievolgorde)
  for (const [slug, title] of Object.entries(meta)) {
    if (slug === 'index') continue; // Section index handled separately

    // Hidden entries markeren als gezien maar niet toevoegen
    if (typeof title !== 'string') {
      seen.add(slug);
      continue;
    }

    const mdxPath = path.join(sectionDir, `${slug}.mdx`);
    if (!fs.existsSync(mdxPath)) continue;

    seen.add(slug);
    const content = fs.readFileSync(mdxPath, 'utf-8');
    const fm = parseFrontmatter(content);
    const description = fm.description && fm.description !== title
      ? fm.description
      : '';

    const url = `${BASE_URL}/${sectionSlug}/${slug}`;

    pages.push({ title, url, description });
  }

  // Daarna: MDX bestanden die niet in _meta.ts staan (filesystem discovery)
  const files = fs.readdirSync(sectionDir).filter(f => f.endsWith('.mdx'));
  for (const file of files) {
    const slug = file.replace('.mdx', '');
    if (seen.has(slug) || slug === 'index') continue;

    const mdxPath = path.join(sectionDir, file);
    const content = fs.readFileSync(mdxPath, 'utf-8');
    const fm = parseFrontmatter(content);
    const title = fm.title || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const description = fm.description && fm.description !== title
      ? fm.description
      : '';

    const url = `${BASE_URL}/${sectionSlug}/${slug}`;
    pages.push({ title, url, description });
  }

  return pages;
}

/**
 * Genereer llms.txt content.
 */
function generateLlmsTxt() {
  const rootMeta = parseMetaFile(path.join(PAGES_DIR, '_meta.ts'));
  const lines = [];

  // Header
  lines.push(`# ${SITE_TITLE}`);
  lines.push('');
  lines.push(`> ${SITE_DESCRIPTION}`);
  lines.push('');

  // Welkom pagina
  lines.push('## Welkom');
  lines.push('');
  lines.push(`- [Welkom bij Kroescontrol](${BASE_URL}/home): Publieke documentatie en informatie over Kroescontrol`);
  lines.push('');

  // Loop door root secties
  for (const [slug, value] of Object.entries(rootMeta)) {
    if (SKIP_PAGES.has(slug)) continue;
    if (HIDDEN_SECTIONS.has(slug)) continue;
    if (typeof value !== 'string') continue; // Skip hidden entries
    if (slug === 'home') continue; // Already handled above

    const sectionTitle = value;
    const sectionDir = path.join(PAGES_DIR, slug);

    // Standalone pagina (geen directory)
    if (!fs.existsSync(sectionDir) || !fs.statSync(sectionDir).isDirectory()) {
      const mdxPath = path.join(PAGES_DIR, `${slug}.mdx`);
      if (!fs.existsSync(mdxPath)) continue;

      const content = fs.readFileSync(mdxPath, 'utf-8');
      const fm = parseFrontmatter(content);
      const description = fm.description || '';

      lines.push(`## ${sectionTitle}`);
      lines.push('');
      lines.push(`- [${sectionTitle}](${BASE_URL}/${slug})${description ? ': ' + description : ''}`);
      lines.push('');
      continue;
    }

    // Sectie met subpagina's
    lines.push(`## ${sectionTitle}`);
    lines.push('');

    // Sectie index pagina
    const indexMdx = path.join(sectionDir, 'index.mdx');
    if (fs.existsSync(indexMdx)) {
      const content = fs.readFileSync(indexMdx, 'utf-8');
      const fm = parseFrontmatter(content);
      const description = fm.description && fm.description !== sectionTitle
        ? fm.description
        : '';
      lines.push(`- [${sectionTitle}](${BASE_URL}/${slug})${description ? ': ' + description : ''}`);
    }

    // Subpagina's
    const pages = scanSection(sectionDir, slug);
    for (const page of pages) {
      lines.push(`- [${page.title}](${page.url})${page.description ? ': ' + page.description : ''}`);
    }

    lines.push('');
  }

  // English legal section (hergebruik scanSection voor filesystem discovery)
  lines.push('## Legal (English)');
  lines.push('');
  const enLegalDir = path.join(PAGES_DIR, 'en', 'legal');
  if (fs.existsSync(enLegalDir)) {
    const enPages = scanSection(enLegalDir, 'en/legal');
    for (const page of enPages) {
      lines.push(`- [${page.title}](${page.url})${page.description ? ': ' + page.description : ''}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

// Run
const output = generateLlmsTxt();
fs.writeFileSync(OUTPUT_PATH, output);

const lineCount = output.split('\n').length;
const pageCount = (output.match(/^- \[/gm) || []).length;
console.log(`✅ Generated llms.txt: ${pageCount} pages, ${lineCount} lines`);
