#!/usr/bin/env node
// Refresh and optimize static tool thumbnails for the site.
// Usage: node scripts/fetch-thumbnails.mjs

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const TOOLS_DIR = 'src/content/tools';
const THUMBS_DIR = 'public/thumbnails';
const MIN_IMAGE_SIZE = 10 * 1024;
const MAX_SOURCE_IMAGE_SIZE = 60 * 1024 * 1024;
const FETCH_TIMEOUT = 15000;
const STATIC_MAX_WIDTH = 960;
const STATIC_MAX_HEIGHT = 540;
const ANIMATED_MAX_WIDTH = 480;
const ANIMATED_MAX_HEIGHT = 270;
const MAX_ANIMATED_OUTPUT_SIZE = 900 * 1024;

const badgeHosts = [
  'img.shields.io',
  'badge.fury.io',
  'badgen.net',
  'badges.',
  'coveralls.io',
  'codecov.io',
  'travis-ci.',
  'ci.appveyor.com',
  'github.com/workflows',
];

const isBadge = (url) => badgeHosts.some(host => url.includes(host)) || url.includes('/badge');
const avatarHosts = [
  'avatars.githubusercontent.com',
  'gravatar.com',
];
const isLikelyAvatar = (url) =>
  avatarHosts.some(host => url.includes(host)) ||
  url.includes('all_contributors') ||
  url.includes('/contributors') ||
  /(^|[/?=_-])(avatar|profile)([/?=_-]|$)/i.test(url);

async function fetchWithTimeout(url, opts = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    return await fetch(url, { ...opts, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};

  const fm = {};
  for (const line of match[1].split('\n')) {
    const item = line.match(/^([\w_]+):\s*"?([^"]*)"?\s*$/);
    if (item) fm[item[1]] = item[2];
  }
  return fm;
}

function resolveReadmeImageUrl(owner, repo, branch, imgPath) {
  if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
    return imgPath;
  }

  const cleanPath = imgPath
    .replace(/^\.\//, '')
    .replace(/^\//, '');

  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${cleanPath}`;
}

function getExistingThumbnailFile(slug, currentThumbnail) {
  if (currentThumbnail && currentThumbnail.startsWith('/thumbnails/')) {
    const explicitPath = path.join(process.cwd(), 'public', currentThumbnail.replace(/^\//, ''));
    if (fs.existsSync(explicitPath)) {
      return explicitPath;
    }
  }

  if (!fs.existsSync(THUMBS_DIR)) return null;

  const match = fs.readdirSync(THUMBS_DIR).find(file => file.startsWith(`${slug}.`));
  return match ? path.join(THUMBS_DIR, match) : null;
}

function removeStaleThumbnailFiles(slug, keepFileName, currentThumbnail) {
  if (!fs.existsSync(THUMBS_DIR)) return;

  for (const file of fs.readdirSync(THUMBS_DIR)) {
    if (!file.startsWith(`${slug}.`)) continue;
    if (file === keepFileName) continue;
    fs.unlinkSync(path.join(THUMBS_DIR, file));
  }

  if (currentThumbnail && currentThumbnail.startsWith('/thumbnails/')) {
    const currentFileName = path.basename(currentThumbnail);
    if (currentFileName !== keepFileName) {
      const stalePath = path.join(THUMBS_DIR, currentFileName);
      if (fs.existsSync(stalePath)) {
        fs.unlinkSync(stalePath);
      }
    }
  }
}

async function downloadBuffer(url) {
  const res = await fetchWithTimeout(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }

  const advertisedSize = parseInt(res.headers.get('content-length') || '0', 10);
  if (advertisedSize > MAX_SOURCE_IMAGE_SIZE) {
    throw new Error(`Image too large (${Math.round(advertisedSize / 1024 / 1024)} MB)`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.length > MAX_SOURCE_IMAGE_SIZE) {
    throw new Error(`Downloaded image too large (${Math.round(buffer.length / 1024 / 1024)} MB)`);
  }

  if (buffer.length < MIN_IMAGE_SIZE) {
    throw new Error(`Image too small (${Math.round(buffer.length / 1024)} KB)`);
  }

  return buffer;
}

async function optimizeThumbnail(buffer) {
  const metadata = await sharp(buffer, { animated: true, pages: -1, failOn: 'none', limitInputPixels: false }).metadata();
  const isAnimated = (metadata.pages || 1) > 1;

  if (isAnimated) {
    try {
      const animatedBuffer = await sharp(buffer, { animated: true, pages: -1, failOn: 'none', limitInputPixels: false })
        .rotate()
        .resize({
          width: ANIMATED_MAX_WIDTH,
          height: ANIMATED_MAX_HEIGHT,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .gif({
          effort: 5,
          colours: 96,
        })
        .toBuffer();

      if (animatedBuffer.length <= MAX_ANIMATED_OUTPUT_SIZE) {
        return { buffer: animatedBuffer, ext: '.gif', animated: true };
      }
    } catch {
      // Fall back to a static preview when animated encoding is unavailable.
    }
  }

  const staticBuffer = await sharp(buffer, { animated: true, pages: 1, failOn: 'none', limitInputPixels: false })
    .rotate()
    .resize({
      width: STATIC_MAX_WIDTH,
      height: STATIC_MAX_HEIGHT,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({
      quality: 78,
      effort: 5,
    })
    .toBuffer();

  return { buffer: staticBuffer, ext: '.webp', animated: false };
}

async function findBestReadmeImage(owner, repo) {
  for (const branch of ['main', 'master']) {
    const readmeUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`;

    try {
      const res = await fetchWithTimeout(readmeUrl);
      if (!res.ok) continue;

      const readme = await res.text();
      const mdImgs = [...readme.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map(match => match[1]);
      const htmlImgs = [...readme.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map(match => match[1]);
      const topImages = [...mdImgs, ...htmlImgs]
        .filter(url => !isBadge(url) && !isLikelyAvatar(url))
        .slice(0, 5);

      if (topImages.length === 0) continue;

      const candidates = [];
      for (const imgPath of topImages) {
        const absoluteUrl = resolveReadmeImageUrl(owner, repo, branch, imgPath);

        try {
          const buffer = await downloadBuffer(absoluteUrl);
          candidates.push({ url: absoluteUrl, size: buffer.length, buffer });
        } catch {
          // Skip broken or unsupported candidates.
        }
      }

      if (candidates.length === 0) continue;

      candidates.sort((a, b) => b.size - a.size);
      return candidates[0];
    } catch {
      // Try the next branch.
    }
  }

  return null;
}

async function main() {
  if (!fs.existsSync(THUMBS_DIR)) {
    fs.mkdirSync(THUMBS_DIR, { recursive: true });
  }

  const files = fs.readdirSync(TOOLS_DIR).filter(file => file.endsWith('.md'));
  let updated = 0;
  const referencedThumbFiles = new Set();

  console.log(`Found ${files.length} tools\n`);

  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    const toolPath = path.join(TOOLS_DIR, file);
    const content = fs.readFileSync(toolPath, 'utf-8');
    const fm = parseFrontmatter(content);
    const githubUrl = fm.github_url;

    if (!githubUrl) {
      console.log(`⏭️  ${slug}: no github_url, skipping`);
      continue;
    }

    const repoMatch = githubUrl.match(/github\.com\/([^/]+)\/([^/\s]+?)(?:\.git|\/|$)/);
    if (!repoMatch) {
      console.log(`⏭️  ${slug}: can't parse github_url`);
      continue;
    }

    const [, owner, repo] = repoMatch;
    console.log(`🔍 ${slug}: checking ${owner}/${repo}...`);

    try {
      let source = null;

      if (fm.thumbnail_source) {
        try {
          const buffer = await downloadBuffer(fm.thumbnail_source);
          source = {
            url: fm.thumbnail_source,
            size: buffer.length,
            buffer,
          };
          console.log('   🖼️ Using thumbnail_source');
        } catch (error) {
          console.log(`   ⚠️ thumbnail_source failed (${error instanceof Error ? error.message : String(error)})`);
        }
      }

      if (!source) {
        const existingThumb = getExistingThumbnailFile(slug, fm.thumbnail);
        if (existingThumb) {
          source = {
            url: existingThumb,
            size: fs.statSync(existingThumb).size,
            buffer: fs.readFileSync(existingThumb),
          };
          console.log('   ↺ Re-optimizing existing thumbnail');
        }
      }

      if (!source) {
        source = await findBestReadmeImage(owner, repo);
      }

      if (!source) {
        if (fm.thumbnail && fm.thumbnail.startsWith('/thumbnails/')) {
          referencedThumbFiles.add(path.basename(fm.thumbnail));
        }
        console.log('   ❌ No suitable image found');
        continue;
      }

      const optimized = await optimizeThumbnail(source.buffer);
      const thumbFile = `${slug}${optimized.ext}`;
      const thumbPath = `/thumbnails/${thumbFile}`;
      const destPath = path.join(THUMBS_DIR, thumbFile);
      referencedThumbFiles.add(thumbFile);

      removeStaleThumbnailFiles(slug, thumbFile, fm.thumbnail);

      const existingBuffer = fs.existsSync(destPath) ? fs.readFileSync(destPath) : null;
      if (!existingBuffer || Buffer.compare(existingBuffer, optimized.buffer) !== 0) {
        fs.writeFileSync(destPath, optimized.buffer);
        updated++;
      }

      const nextContent = content.includes('thumbnail:')
        ? content.replace(/thumbnail:.*/, `thumbnail: "${thumbPath}"`)
        : content.replace(/(github_url:.*\n)/, `$1thumbnail: "${thumbPath}"\n`);

      if (nextContent !== content) {
        fs.writeFileSync(toolPath, nextContent);
      }

      console.log(
        `   ✅ Saved ${thumbFile} (${(optimized.buffer.length / 1024).toFixed(1)} KB, ${optimized.animated ? 'animated' : 'static'})`
      );
    } catch (error) {
      if (fm.thumbnail && fm.thumbnail.startsWith('/thumbnails/')) {
        referencedThumbFiles.add(path.basename(fm.thumbnail));
      }
      console.log(`   ❌ Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  for (const file of fs.readdirSync(THUMBS_DIR)) {
    if (!referencedThumbFiles.has(file)) {
      fs.unlinkSync(path.join(THUMBS_DIR, file));
    }
  }

  console.log(`\nDone! Updated ${updated} thumbnails.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
