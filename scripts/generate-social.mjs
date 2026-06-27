#!/usr/bin/env node
// Generate static social-card images into public/social/{slug}.png and
// public/social/authors/{github}.png.
//
// By default this regenerates only tools whose markdown (or thumbnail) is newer
// than the existing card, so it is cheap to run on every deploy. Pass specific
// slugs to (re)generate just those tools, or --force to rebuild everything.
//
// Usage:
//   node scripts/generate-social.mjs                 # incremental, all tools
//   node scripts/generate-social.mjs --force         # rebuild every tool
//   node scripts/generate-social.mjs my-tool other   # only these slugs
//   node scripts/generate-social.mjs --authors shanselman
//   node scripts/generate-social.mjs --all           # incremental, all tools and authors
//   node scripts/generate-social.mjs --prune         # also delete orphan cards
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
import { renderAuthorSocialCard, renderSocialCard } from './social-card.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const TOOLS_DIR = join(ROOT, 'src', 'content', 'tools');
const AUTHORS_DIR = join(ROOT, 'src', 'content', 'authors');
const SOCIAL_DIR = join(ROOT, 'public', 'social');
const AUTHOR_SOCIAL_DIR = join(SOCIAL_DIR, 'authors');

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
      date_added: scalar('date_added'),
      tags,
    },
    body,
  };
}

function parseAuthorFile(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: content.trim() };

  const fmRaw = match[1];
  const body = (match[2] || '').trim();
  const unescape = (s) => s.replace(/\\(.)/g, '$1');
  const scalar = (key) => {
    const quoted = fmRaw.match(new RegExp(`^${key}:\\s*"((?:[^"\\\\]|\\\\.)*)"\\s*$`, 'm'));
    if (quoted) return unescape(quoted[1]);
    const plain = fmRaw.match(new RegExp(`^${key}:\\s*([^\\r\\n#]+)\\s*$`, 'm'));
    return plain ? plain[1].trim() : undefined;
  };

  return {
    data: {
      github: scalar('github'),
      name: scalar('name'),
      headline: scalar('headline'),
      intro: scalar('intro'),
    },
    body,
  };
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

function normalizeGitHubHandle(handle) {
  return (handle || '').trim().replace(/^@+/, '').toLowerCase();
}

function countValues(values) {
  const counts = new Map();
  for (const value of values) {
    const name = (value || '').trim();
    const key = name.toLowerCase();
    if (!key) continue;
    const current = counts.get(key);
    if (current) {
      current.count++;
    } else {
      counts.set(key, { name, count: 1 });
    }
  }
  return [...counts.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

function formatList(values) {
  if (values.length === 0) return '';
  if (values.length === 1) return values[0];
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(', ')}, and ${values[values.length - 1]}`;
}

function buildAuthorIntro(author) {
  const topTags = author.tags.slice(0, 5).map((tag) => tag.name);
  const languages = author.languages.map((language) => language.name);
  const tagText = topTags.length > 0 ? `, mostly around ${formatList(topTags)}` : '';
  const languageText = languages.length > 0 ? ` The tools span ${formatList(languages)}.` : '';
  const toolLabel = author.toolCount === 1 ? 'tiny tool' : 'tiny tools';

  return `${author.name} has shared ${author.toolCount} ${toolLabel} here${tagText}.${languageText}`;
}

function readToolEntries() {
  return readdirSync(TOOLS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const slug = file.replace(/\.md$/, '');
      const path = join(TOOLS_DIR, file);
      const { data, body } = parseToolFile(readFileSync(path, 'utf-8'));
      return { slug, path, data, body };
    });
}

function readAuthorProfile(github) {
  if (!existsSync(AUTHORS_DIR)) return null;
  const path = join(AUTHORS_DIR, `${github}.md`);
  if (!existsSync(path)) return null;
  const { data, body } = parseAuthorFile(readFileSync(path, 'utf-8'));
  return { path, data, body };
}

function buildAuthors(toolEntries) {
  const groups = new Map();
  for (const tool of toolEntries) {
    const github = normalizeGitHubHandle(tool.data.author_github);
    if (!github) continue;
    const group = groups.get(github) || [];
    group.push(tool);
    groups.set(github, group);
  }

  return [...groups.entries()].map(([github, tools]) => {
    const sortedTools = [...tools].sort((a, b) =>
      (b.data.date_added || '').localeCompare(a.data.date_added || '')
      || (a.data.name || '').localeCompare(b.data.name || '')
    );
    const names = countValues(tools.map((tool) => tool.data.author));
    const profile = readAuthorProfile(github);
    const author = {
      github,
      name: profile?.data.name || names[0]?.name || github,
      headline: profile?.data.headline,
      intro: profile?.data.intro || profile?.body,
      toolCount: tools.length,
      tags: countValues(tools.flatMap((tool) => tool.data.tags || [])),
      languages: countValues(tools.map((tool) => tool.data.language).filter(Boolean)),
      latestTool: sortedTools[0] ? { name: sortedTools[0].data.name } : undefined,
      sourcePaths: [
        ...tools.map((tool) => tool.path),
        ...(profile ? [profile.path] : []),
      ],
    };
    author.intro ||= buildAuthorIntro(author);
    return author;
  }).sort((a, b) =>
    b.toolCount - a.toolCount
    || a.name.localeCompare(b.name)
    || a.github.localeCompare(b.github)
  );
}

function authorNeedsRegen(author, force) {
  const outPath = join(AUTHOR_SOCIAL_DIR, `${author.github}.png`);
  if (force || !existsSync(outPath)) return true;
  const outMtime = mtime(outPath);
  return author.sourcePaths.some((path) => mtime(path) > outMtime);
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const prune = args.includes('--prune');
  const authorsOnly = args.includes('--authors') || args.includes('--author');
  const toolsOnly = args.includes('--tools') || args.includes('--tool');
  const includeAuthors = args.includes('--all');
  const requestedSlugs = args.filter((a) => !a.startsWith('--'));

  if (!existsSync(TOOLS_DIR)) {
    console.error(`Tools directory not found: ${TOOLS_DIR}`);
    process.exit(1);
  }
  mkdirSync(SOCIAL_DIR, { recursive: true });
  mkdirSync(AUTHOR_SOCIAL_DIR, { recursive: true });

  const toolEntries = readToolEntries();
  const allSlugs = toolEntries.map((tool) => tool.slug);
  const validSlugs = new Set(allSlugs);
  const toolsBySlug = new Map(toolEntries.map((tool) => [tool.slug, tool]));
  const authors = buildAuthors(toolEntries);
  const authorsByGithub = new Map(authors.map((author) => [author.github, author]));
  const validAuthors = new Set(authors.map((author) => author.github));

  const shouldGenerateTools = !authorsOnly;
  const shouldGenerateAuthors = authorsOnly || (includeAuthors && !toolsOnly);
  const targetSlugs = requestedSlugs.length && shouldGenerateTools ? requestedSlugs : allSlugs;
  const targetAuthors = requestedSlugs.length && authorsOnly
    ? requestedSlugs.map(normalizeGitHubHandle)
    : authors.map((author) => author.github);

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  if (shouldGenerateTools) {
    for (const slug of targetSlugs) {
      const tool = toolsBySlug.get(slug);
      if (!tool) {
        console.warn(`⚠ No tool file for slug "${slug}", skipping`);
        continue;
      }

      if (!tool.data.name) {
        console.warn(`⚠ ${slug}: could not parse name, skipping`);
        continue;
      }

      if (!needsRegen(slug, tool.path, tool.data.thumbnail, force)) {
        skipped++;
        continue;
      }

      try {
        const png = await renderSocialCard({ slug, body: tool.body, ...tool.data }, { rootDir: ROOT });
        writeFileSync(join(SOCIAL_DIR, `${slug}.png`), png);
        generated++;
      } catch (error) {
        failed++;
        console.error(`✗ ${slug}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  let authorGenerated = 0;
  let authorSkipped = 0;
  let authorFailed = 0;

  if (shouldGenerateAuthors) {
    for (const github of targetAuthors) {
      const author = authorsByGithub.get(github);
      if (!author) {
        console.warn(`⚠ No author page for "${github}", skipping`);
        continue;
      }

      if (!authorNeedsRegen(author, force)) {
        authorSkipped++;
        continue;
      }

      try {
        const png = await renderAuthorSocialCard(author);
        writeFileSync(join(AUTHOR_SOCIAL_DIR, `${github}.png`), png);
        authorGenerated++;
      } catch (error) {
        authorFailed++;
        console.error(`✗ author ${github}: ${error instanceof Error ? error.message : String(error)}`);
      }
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
    if (shouldGenerateAuthors && existsSync(AUTHOR_SOCIAL_DIR)) {
      for (const file of readdirSync(AUTHOR_SOCIAL_DIR)) {
        if (!file.endsWith('.png')) continue;
        const github = file.replace(/\.png$/, '');
        if (!validAuthors.has(github)) {
          unlinkSync(join(AUTHOR_SOCIAL_DIR, file));
          pruned++;
        }
      }
    }
  }

  console.log(
    `Social cards: ${generated} tools generated, ${skipped} tools up-to-date, ${failed} tools failed; ` +
      `${authorGenerated} authors generated, ${authorSkipped} authors up-to-date, ${authorFailed} authors failed` +
      (prune ? `, ${pruned} pruned` : '')
  );
  if (failed > 0 || authorFailed > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
