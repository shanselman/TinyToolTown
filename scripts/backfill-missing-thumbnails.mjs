#!/usr/bin/env node
// One-shot backfill for tools missing a thumbnail.
// For each tool with no thumbnail file in public/thumbnails/, find the
// original closed `new-tool` issue by github_url, extract an image from
// the issue body (where most user uploads live), optimize, and save.
//
// Skips any tool that already has a thumbnail file on disk.
// Usage: GH_TOKEN=$(gh auth token) node scripts/backfill-missing-thumbnails.mjs

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import sharp from 'sharp';

const TOOLS_DIR = 'src/content/tools';
const THUMBS_DIR = 'public/thumbnails';
const REPO = 'shanselman/TinyToolTown';
const MIN_IMAGE_SIZE = 10 * 1024;
const MAX_SOURCE_IMAGE_SIZE = 60 * 1024 * 1024;
const STATIC_MAX_WIDTH = 960;
const STATIC_MAX_HEIGHT = 540;

const token = process.env.GH_TOKEN || execSync('gh auth token').toString().trim();
const ghHeaders = { Authorization: `Bearer ${token}`, 'User-Agent': 'ttt-backfill' };

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const fm = {};
  for (const line of match[1].split('\n')) {
    const m = line.match(/^([\w_]+):\s*"?([^"]*)"?\s*$/);
    if (m) fm[m[1]] = m[2];
  }
  return fm;
}

function extractImageUrl(text) {
  if (!text) return null;
  const md = text.match(/!\[[^\]]*\]\((https?:\/\/[^)]+)\)/);
  const html = text.match(/<img[^>]+src=["'](https?:\/\/[^"']+)["']/i);
  return (md && md[1]) || (html && html[1]) || null;
}

async function findIssueForRepo(githubUrl) {
  const cleanUrl = githubUrl.replace(/\/$/, '').toLowerCase();
  // Search closed issues with new-tool label, look for repo URL match in body
  const url = `https://api.github.com/search/issues?q=repo:${REPO}+label:new-tool+state:closed&per_page=100&sort=created&order=desc`;
  let page = 1;
  while (page <= 5) {
    const res = await fetch(`${url}&page=${page}`, { headers: ghHeaders });
    if (!res.ok) throw new Error(`Search failed: ${res.status}`);
    const json = await res.json();
    for (const issue of json.items) {
      if ((issue.body || '').toLowerCase().includes(cleanUrl)) return issue;
    }
    if (json.items.length < 100) break;
    page++;
  }
  return null;
}

async function optimizeBuffer(buf) {
  const meta = await sharp(buf, { animated: true }).metadata();
  const isAnimated = (meta.pages || 1) > 1;
  if (isAnimated) {
    const out = await sharp(buf, { animated: true })
      .resize(480, 270, { fit: 'inside' })
      .gif().toBuffer();
    return { buffer: out, ext: '.gif' };
  }
  const out = await sharp(buf)
    .resize(STATIC_MAX_WIDTH, STATIC_MAX_HEIGHT, { fit: 'inside' })
    .webp({ quality: 82 }).toBuffer();
  return { buffer: out, ext: '.webp' };
}

function hasThumbnailFile(slug) {
  if (!fs.existsSync(THUMBS_DIR)) return false;
  return fs.readdirSync(THUMBS_DIR).some(f => f.startsWith(slug + '.'));
}

async function processOne(toolFile) {
  const slug = path.basename(toolFile, '.md');
  if (hasThumbnailFile(slug)) return { slug, status: 'has-thumb' };

  const content = fs.readFileSync(toolFile, 'utf8');
  const fm = parseFrontmatter(content);
  if (!fm.github_url) return { slug, status: 'no-url' };

  const issue = await findIssueForRepo(fm.github_url);
  if (!issue) return { slug, status: 'no-issue' };

  const imgUrl = extractImageUrl(issue.body);
  if (!imgUrl) return { slug, status: 'no-image-in-body', issue: issue.number };

  try {
    const res = await fetch(imgUrl);
    if (!res.ok) return { slug, status: `fetch-${res.status}`, issue: issue.number };
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < MIN_IMAGE_SIZE) return { slug, status: 'too-small', issue: issue.number };
    if (buf.length > MAX_SOURCE_IMAGE_SIZE) return { slug, status: 'too-big', issue: issue.number };
    const opt = await optimizeBuffer(buf);
    const dest = path.join(THUMBS_DIR, slug + opt.ext);
    fs.writeFileSync(dest, opt.buffer);

    // Update frontmatter (insert thumbnail line if missing)
    let newContent = content;
    if (!/thumbnail:/.test(content)) {
      newContent = content.replace(/(^---[\s\S]*?\n)(---)/m,
        `$1thumbnail: "/thumbnails/${slug}${opt.ext}"\n$2`);
    } else {
      newContent = content.replace(/thumbnail:\s*"?[^"\n]*"?/,
        `thumbnail: "/thumbnails/${slug}${opt.ext}"`);
    }
    fs.writeFileSync(toolFile, newContent);
    return { slug, status: 'ok', issue: issue.number, size: opt.buffer.length, ext: opt.ext };
  } catch (e) {
    return { slug, status: `error: ${e.message}`, issue: issue.number };
  }
}

(async () => {
  const tools = fs.readdirSync(TOOLS_DIR).filter(f => f.endsWith('.md'));
  const missing = tools.filter(f => !hasThumbnailFile(path.basename(f, '.md')));
  console.log(`${missing.length} tools missing thumbnails (out of ${tools.length})`);
  const results = [];
  for (const f of missing) {
    const r = await processOne(path.join(TOOLS_DIR, f));
    results.push(r);
    console.log(`  ${r.slug}: ${r.status}${r.issue ? ` (issue #${r.issue})` : ''}`);
  }
  const ok = results.filter(r => r.status === 'ok').length;
  console.log(`\nFixed: ${ok} / ${missing.length}`);
})();
