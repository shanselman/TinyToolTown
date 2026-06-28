#!/usr/bin/env node
// Generate static social-card images into public/social/.
//
// Two kinds of cards are produced, both by default:
//   - Tool cards   -> public/social/{slug}.png           (one per tool markdown)
//   - Author cards -> public/social/authors/{github}.png  (one per author handle)
//
// By default this regenerates only cards whose source markdown (or thumbnail)
// is newer than the existing card, so it is cheap to run on every deploy. Pass
// specific tool slugs to (re)generate just those tools, or --force to rebuild
// everything. Author cards are rebuilt whenever any of that author's tool files
// changed (or with --force).
//
// Usage:
//   node scripts/generate-social.mjs                 # incremental, all cards
//   node scripts/generate-social.mjs --force         # rebuild every card
//   node scripts/generate-social.mjs my-tool other   # only these tool slugs
//   node scripts/generate-social.mjs --prune         # also delete orphan cards
//   node scripts/generate-social.mjs --no-authors    # skip author cards
import {
  readFileSync,
  readdirSync,
  existsSync,
  statSync,
  mkdirSync,
  writeFileSync,
  unlinkSync,
} from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderSocialCard, renderAuthorSocialCard } from './social-card.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const TOOLS_DIR = join(ROOT, 'src', 'content', 'tools');
const SOCIAL_DIR = join(ROOT, 'public', 'social');
const AUTHORS_SOCIAL_DIR = join(SOCIAL_DIR, 'authors');

function parseToolFile(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: '' };

  const fmRaw = match[1];
  const body = (match[2] || '').trim();
  const unescape = (s) => s.replace(/\\(.)/g, '$1');

  const scalar = (key) => {
    const m = fmRaw.match(new RegExp(`^${key}:\\s*"((?:[^"\\\\]|\\\\.)*)"\\s*$`, 'm'));
    return m ? unescape(m[1]) : undefined;
  };

  const tagsMatch = fmRaw.match(/^tags:\s*\[([\s\S]*?)\]\s*$/m);
  const tags = tagsMatch
    ? [...tagsMatch[1].matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) => unescape(m[1]))
    : [];

  return {
    data: {
      name: scalar('name'),
      tagline: scalar('tagline'),
      author: scalar('author'),
      author_github: scalar('author_github'),
      ai_summary: scalar('ai_summary'),
      language: scalar('language'),
      license: scalar('license'),
      theme: scalar('theme'),
      thumbnail: scalar('thumbnail'),
      tags,
    },
    body,
  };
}

function normalizeHandle(handle) {
  return (handle || '').trim().replace(/^@+/, '').toLowerCase();
}

// Aggregate tool data into one entry per author handle, mirroring
// src/lib/authors.ts buildAuthors() (name/tags/languages by frequency).
function buildAuthors(tools) {
  const groups = new Map();
  for (const tool of tools) {
    const github = normalizeHandle(tool.data.author_github);
    if (!github) continue;
    const group = groups.get(github) || [];
    group.push(tool);
    groups.set(github, group);
  }

  const mostFrequent = (values) => {
    const counts = new Map();
    for (const raw of values) {
      const value = (raw || '').trim();
      const key = value.toLowerCase();
      if (!key) continue;
      const current = counts.get(key);
      if (current) current.count++;
      else counts.set(key, { name: value, count: 1 });
    }
    return [...counts.values()]
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
      .map((entry) => entry.name);
  };

  const authors = [];
  for (const [github, authorTools] of groups) {
    const name = mostFrequent(authorTools.map((tool) => tool.data.author))[0]
      || authorTools[0].data.author
      || `@${github}`;
    authors.push({
      github,
      name,
      toolCount: authorTools.length,
      tags: mostFrequent(authorTools.flatMap((tool) => tool.data.tags || [])),
      languages: mostFrequent(authorTools.map((tool) => tool.data.language).filter(Boolean)),
      sourcePaths: authorTools.map((tool) => tool.path),
    });
  }
  return authors;
}

function mtime(path) {
  try {
    return statSync(path).mtimeMs;
  } catch {
    return 0;
  }
}

function needsRegen(slug, toolPath, thumbnail, force) {
  const outPath = join(SOCIAL_DIR, `${slug}.png`);
  if (force || !existsSync(outPath)) return true;
  const outMtime = mtime(outPath);
  if (mtime(toolPath) > outMtime) return true;
  if (thumbnail) {
    const thumbPath = join(ROOT, 'public', thumbnail.replace(/^\//, ''));
    if (existsSync(thumbPath) && mtime(thumbPath) > outMtime) return true;
  }
  return false;
}

// An author card is stale when it is missing, forced, or any of the author's
// tool files is newer than the existing card.
function authorNeedsRegen(author, force) {
  const outPath = join(AUTHORS_SOCIAL_DIR, `${author.github}.png`);
  if (force || !existsSync(outPath)) return true;
  const outMtime = mtime(outPath);
  return author.sourcePaths.some((path) => mtime(path) > outMtime);
}

async function generateAuthorCards(parsedTools, { force, prune }) {
  const authors = buildAuthors(parsedTools);
  mkdirSync(AUTHORS_SOCIAL_DIR, { recursive: true });

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (const author of authors) {
    if (!authorNeedsRegen(author, force)) {
      skipped++;
      continue;
    }
    try {
      const png = await renderAuthorSocialCard(author);
      writeFileSync(join(AUTHORS_SOCIAL_DIR, `${author.github}.png`), png);
      generated++;
    } catch (error) {
      failed++;
      console.error(`✗ author @${author.github}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  let pruned = 0;
  if (prune && existsSync(AUTHORS_SOCIAL_DIR)) {
    const validHandles = new Set(authors.map((author) => author.github));
    for (const file of readdirSync(AUTHORS_SOCIAL_DIR)) {
      if (!file.endsWith('.png')) continue;
      if (!validHandles.has(file.replace(/\.png$/, ''))) {
        unlinkSync(join(AUTHORS_SOCIAL_DIR, file));
        pruned++;
      }
    }
  }

  console.log(
    `Author cards: ${generated} generated, ${skipped} up-to-date, ${failed} failed` +
      (prune ? `, ${pruned} pruned` : '')
  );
  if (failed > 0) process.exitCode = 1;
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const prune = args.includes('--prune');
  const skipAuthors = args.includes('--no-authors');
  const requestedSlugs = args.filter((a) => !a.startsWith('--'));

  if (!existsSync(TOOLS_DIR)) {
    console.error(`Tools directory not found: ${TOOLS_DIR}`);
    process.exit(1);
  }
  mkdirSync(SOCIAL_DIR, { recursive: true });

  const allSlugs = readdirSync(TOOLS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));
  const validSlugs = new Set(allSlugs);

  // Parse every tool once: the tool cards loop and the author aggregation
  // (which spans tools) both read from this list.
  const parsedTools = [];
  for (const slug of allSlugs) {
    const toolPath = join(TOOLS_DIR, `${slug}.md`);
    const { data, body } = parseToolFile(readFileSync(toolPath, 'utf-8'));
    parsedTools.push({ slug, path: toolPath, data, body });
  }
  const toolBySlug = new Map(parsedTools.map((tool) => [tool.slug, tool]));

  const targetSlugs = requestedSlugs.length ? requestedSlugs : allSlugs;

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (const slug of targetSlugs) {
    const tool = toolBySlug.get(slug);
    if (!tool) {
      console.warn(`⚠ No tool file for slug "${slug}", skipping`);
      continue;
    }

    const { data, body, path: toolPath } = tool;
    if (!data.name) {
      console.warn(`⚠ ${slug}: could not parse name, skipping`);
      continue;
    }

    if (!needsRegen(slug, toolPath, data.thumbnail, force)) {
      skipped++;
      continue;
    }

    try {
      const png = await renderSocialCard({ slug, body, ...data }, { rootDir: ROOT });
      writeFileSync(join(SOCIAL_DIR, `${slug}.png`), png);
      generated++;
    } catch (error) {
      failed++;
      console.error(`✗ ${slug}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Only prune when looking at the whole set (no specific slugs requested).
  let pruned = 0;
  if (prune && requestedSlugs.length === 0 && existsSync(SOCIAL_DIR)) {
    for (const file of readdirSync(SOCIAL_DIR)) {
      if (!file.endsWith('.png')) continue;
      const slug = file.replace(/\.png$/, '');
      if (!validSlugs.has(slug)) {
        unlinkSync(join(SOCIAL_DIR, file));
        pruned++;
      }
    }
  }

  console.log(
    `Social cards: ${generated} generated, ${skipped} up-to-date, ${failed} failed` +
      (prune ? `, ${pruned} pruned` : '')
  );

  // Author cards span every tool, so they ignore the per-tool slug filter and
  // regenerate from the full set. Skip with --no-authors.
  if (!skipAuthors) {
    await generateAuthorCards(parsedTools, { force, prune: prune && requestedSlugs.length === 0 });
  }

  if (failed > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
