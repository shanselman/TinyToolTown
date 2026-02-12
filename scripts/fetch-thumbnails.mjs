#!/usr/bin/env node
// One-time script to download README images for all existing tools
// Usage: node scripts/fetch-thumbnails.mjs

import fs from 'fs';
import path from 'path';

const TOOLS_DIR = 'src/content/tools';
const THUMBS_DIR = 'public/thumbnails';

const badgeHosts = ['img.shields.io', 'badge.fury.io', 'badgen.net', 'badges.', 'coveralls.io', 'codecov.io', 'travis-ci.', 'ci.appveyor.com', 'github.com/workflows'];
const isBadge = (url) => badgeHosts.some(h => url.includes(h)) || url.includes('/badge');
const MIN_IMAGE_SIZE = 10 * 1024; // 10 KB minimum

async function findBestReadmeImage(owner, repo) {
  for (const branch of ['main', 'master']) {
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`;
    const res = await fetch(rawUrl);
    if (!res.ok) continue;

    const readme = await res.text();
    
    // Find all images (markdown and HTML), filter out badges
    const mdMatches = [...readme.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)];
    const mdImgs = mdMatches.map(m => m[1]).filter(u => !isBadge(u));
    const htmlMatches = [...readme.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)];
    const htmlImgs = htmlMatches.map(m => m[1]).filter(u => !isBadge(u));
    const allImages = [...mdImgs, ...htmlImgs];
    
    // Take top 5 images
    const topImages = allImages.slice(0, 5);
    
    if (topImages.length === 0) {
      continue;
    }
    
    // Download each image and check size
    const imageCandidates = [];
    for (const imgPath of topImages) {
      try {
        let absoluteUrl = imgPath;
        if (!imgPath.startsWith('http')) {
          const cleanPath = imgPath.replace(/^\.\//, '');
          absoluteUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${cleanPath}`;
        }
        const imgRes = await fetch(absoluteUrl);
        if (imgRes.ok) {
          const buf = Buffer.from(await imgRes.arrayBuffer());
          if (buf.length >= MIN_IMAGE_SIZE) {
            imageCandidates.push({ url: absoluteUrl, size: buf.length, buffer: buf, branch });
          }
        }
      } catch (e) {
        // Skip failed images
      }
    }
    
    if (imageCandidates.length === 0) {
      continue;
    }
    
    // Pick the biggest image
    imageCandidates.sort((a, b) => b.size - a.size);
    return imageCandidates[0];
  }
  return null;
}

async function downloadImage(url, destPath, buffer) {
  if (buffer && Buffer.isBuffer(buffer)) {
    // Use pre-downloaded buffer
    fs.writeFileSync(destPath, buffer);
    return buffer.length;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buf);
  return buf.length;
}

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

async function main() {
  const files = fs.readdirSync(TOOLS_DIR).filter(f => f.endsWith('.md'));
  console.log(`Found ${files.length} tools\n`);

  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    const content = fs.readFileSync(path.join(TOOLS_DIR, file), 'utf-8');
    const fm = parseFrontmatter(content);
    const githubUrl = fm.github_url;
    
    if (!githubUrl) {
      console.log(`⏭️  ${slug}: no github_url, skipping`);
      continue;
    }

    const repoMatch = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!repoMatch) {
      console.log(`⏭️  ${slug}: can't parse github_url`);
      continue;
    }

    const [, owner, repo] = repoMatch;
    console.log(`🔍 ${slug}: checking ${owner}/${repo}...`);

    try {
      const result = await findBestReadmeImage(owner, repo);
      if (!result) {
        console.log(`   ❌ No suitable image found in README`);
        continue;
      }

      const urlPath = new URL(result.url).pathname;
      const ext = path.extname(urlPath).split('?')[0] || '.png';
      const thumbFile = `${slug}${ext}`;
      const destPath = path.join(THUMBS_DIR, thumbFile);

      const size = await downloadImage(result.url, destPath, result.buffer);
      console.log(`   ✅ Downloaded ${thumbFile} (${(size / 1024).toFixed(1)} KB) - biggest of candidates`);

      // Update the .md file to add thumbnail field
      const thumbPath = `/thumbnails/${thumbFile}`;
      if (content.includes('thumbnail:')) {
        const updated = content.replace(/thumbnail:.*/, `thumbnail: "${thumbPath}"`);
        fs.writeFileSync(path.join(TOOLS_DIR, file), updated);
      } else {
        const updated = content.replace(
          /(github_url:.*\n)/,
          `$1thumbnail: "${thumbPath}"\n`
        );
        fs.writeFileSync(path.join(TOOLS_DIR, file), updated);
      }
      console.log(`   📝 Updated frontmatter`);
    } catch (e) {
      console.log(`   ❌ Error: ${e.message}`);
    }
  }
  
  console.log('\nDone!');
}

main();
