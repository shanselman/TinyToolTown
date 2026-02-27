#!/usr/bin/env node
/**
 * Refresh the star-counts cache by fetching from the GitHub API.
 * Usage:  GITHUB_TOKEN=ghp_xxx node scripts/refresh-stars.mjs
 * Without a token the unauthenticated rate limit (60 req/hr) applies.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const TOOLS_DIR = join(ROOT, 'src', 'content', 'tools');
const CACHE_PATH = join(ROOT, 'src', 'data', 'star-counts.json');

function getGitHubRepo(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== 'github.com' && parsed.hostname !== 'www.github.com') return null;
    const segments = parsed.pathname.split('/').filter(Boolean);
    if (segments.length < 2) return null;
    return `${segments[0]}/${segments[1].replace(/\.git$/, '')}`;
  } catch { return null; }
}

// Extract github_url from YAML frontmatter
function extractGitHubUrl(md) {
  const match = md.match(/^github_url:\s*["']?(https?:\/\/[^\s"']+)/m);
  return match ? match[1] : null;
}

async function main() {
  const token = process.env.GITHUB_TOKEN;
  const headers = { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'TinyToolTown' };
  if (token) headers['Authorization'] = `token ${token}`;

  // Collect repos from tool markdown files
  const files = readdirSync(TOOLS_DIR).filter(f => f.endsWith('.md'));
  const repos = new Set();
  for (const f of files) {
    const content = readFileSync(join(TOOLS_DIR, f), 'utf-8');
    const repo = getGitHubRepo(extractGitHubUrl(content));
    if (repo) repos.add(repo);
  }

  console.log(`Found ${repos.size} repos to fetch star counts for.`);

  // Check rate limit
  const rateRes = await fetch('https://api.github.com/rate_limit', { headers });
  const rate = await rateRes.json();
  const remaining = rate?.resources?.core?.remaining ?? 0;
  console.log(`GitHub API rate limit remaining: ${remaining}`);
  if (remaining < repos.size) {
    console.warn(`⚠ Only ${remaining} requests remaining, need ${repos.size}. Some repos may be skipped.`);
  }

  // Load existing cache
  let cache = {};
  try {
    const raw = JSON.parse(readFileSync(CACHE_PATH, 'utf-8'));
    // Normalize old format ({repo: number}) to new format ({repo: {stars, etag}})
    for (const [repo, value] of Object.entries(raw)) {
      if (typeof value === 'number') {
        cache[repo] = { stars: value };
      } else {
        cache[repo] = value;
      }
    }
  } catch {}

  // Fetch in batches using conditional requests (ETags)
  const repoList = [...repos];
  let fetched = 0;
  let notModified = 0;
  for (let i = 0; i < repoList.length; i += 20) {
    const batch = repoList.slice(i, i + 20);
    const results = await Promise.allSettled(batch.map(async (repo) => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const reqHeaders = { ...headers };
      const cached = cache[repo];
      if (cached && cached.etag) {
        reqHeaders['If-None-Match'] = cached.etag;
      }
      const res = await fetch(`https://api.github.com/repos/${repo}`, { headers: reqHeaders, signal: controller.signal });
      clearTimeout(timeout);
      if (res.status === 304) return { repo, notModified: true };
      if (!res.ok) return null;
      const etag = res.headers.get('etag') || undefined;
      const data = await res.json();
      return { repo, stars: data.stargazers_count || 0, etag };
    }));
    for (const r of results) {
      if (r.status === 'fulfilled' && r.value) {
        if (r.value.notModified) {
          notModified++;
        } else {
          cache[r.value.repo] = { stars: r.value.stars, etag: r.value.etag };
          fetched++;
        }
      }
    }
  }

  // Sort keys for stable output
  const sorted = Object.fromEntries(Object.entries(cache).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(CACHE_PATH, JSON.stringify(sorted, null, 2) + '\n');
  console.log(`✓ Updated ${fetched} repos, ${notModified} unchanged (304). Cache has ${Object.keys(sorted).length} entries.`);
}

main().catch(e => { console.error(e); process.exit(1); });
