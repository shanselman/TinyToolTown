// Shared social-card (Open Graph image) renderer.
//
// Produces a 1200x630 PNG for a tool. Used by scripts/generate-social.mjs to
// write static images into public/social/{slug}.png. This logic previously
// lived in src/pages/social/[slug].png.ts as a per-tool prerendered route; it
// was moved here so a normal `astro build` no longer renders hundreds of PNGs.

import sharp from 'sharp';
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SITE_URL = 'https://www.tinytooltown.com';
const WIDTH = 1200;
const HEIGHT = 630;

export const themeAccents = {
  terminal: '#00ff9c',
  neon: '#ff4ecd',
  minimal: '#8b949e',
  pastel: '#ffb3c7',
  matrix: '#39ff14',
  sunset: '#ff8a65',
  ocean: '#4cc9f0',
  forest: '#72d572',
  candy: '#ff66c4',
  synthwave: '#a855f7',
  newspaper: '#f4d35e',
  retro: '#ff8c42',
};

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function truncate(text, maxLength) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trimEnd()}...`;
}

function stripMarkdown(markdown) {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[`*_>#~|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function wrapLines(text, maxChars, maxLines) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars) {
      current = next;
      continue;
    }

    if (current) lines.push(current);
    current = word;

    if (lines.length === maxLines) break;
  }

  if (current && lines.length < maxLines) {
    lines.push(current);
  }

  if (lines.length > maxLines) {
    return lines.slice(0, maxLines);
  }

  if (words.join(' ').length > lines.join(' ').length && lines.length > 0) {
    lines[lines.length - 1] = truncate(lines[lines.length - 1], Math.max(8, maxChars - 3));
  }

  return lines;
}

async function buildPreviewDataUrl(thumbnail, rootDir) {
  if (!thumbnail) return null;

  const relative = thumbnail.replace(/^\//, '');
  const imagePath = join(rootDir, 'public', relative);
  if (!existsSync(imagePath)) return null;

  const ext = relative.split('.').pop()?.toLowerCase();
  if (!ext || !['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext)) {
    return null;
  }

  const sizeBytes = statSync(imagePath).size;
  if (sizeBytes > 2 * 1024 * 1024 || ext === 'gif') {
    return null;
  }

  try {
    const buffer = await sharp(imagePath, { animated: false })
      .resize(420, 240, { fit: 'cover', position: 'attention' })
      .png({ compressionLevel: 9, quality: 80 })
      .toBuffer();

    return `data:image/png;base64,${buffer.toString('base64')}`;
  } catch (error) {
    console.warn(`Skipping social preview thumbnail for ${relative}: ${error instanceof Error ? error.message : 'unsupported image'}`);
    return null;
  }
}

/**
 * Render a social card PNG for a tool.
 *
 * @param {object} tool - Parsed tool data.
 * @param {string} tool.slug
 * @param {string} tool.name
 * @param {string} [tool.tagline]
 * @param {string} [tool.ai_summary]
 * @param {string} [tool.body] - Markdown body, used as a description fallback.
 * @param {string[]} [tool.tags]
 * @param {string} [tool.language]
 * @param {string} [tool.license]
 * @param {string} [tool.theme]
 * @param {string} [tool.thumbnail]
 * @param {object} [options]
 * @param {string} [options.rootDir] - Repo root used to resolve public/ thumbnails.
 * @returns {Promise<Buffer>} PNG buffer.
 */
export async function renderSocialCard(tool, { rootDir = process.cwd() } = {}) {
  const slug = tool.slug;
  const accent = themeAccents[tool.theme || ''] || '#8b5cf6';
  const title = tool.name;
  const descriptionSource = tool.ai_summary || stripMarkdown(tool.body || '') || tool.tagline || '';
  const description = truncate(descriptionSource, 150);
  const tags = Array.isArray(tool.tags) ? tool.tags : [];
  const tagText = tags.slice(0, 3).join(' • ');
  const metaLine = [tool.language, tool.license].filter(Boolean).join('  ·  ');
  const previewDataUrl = await buildPreviewDataUrl(tool.thumbnail, rootDir);

  const titleLines = wrapLines(title, 18, 2);
  const descriptionLines = wrapLines(description, 40, 3);

  const titleSvg = titleLines
    .map((line, index) => `<text x="72" y="${160 + (index * 70)}" font-size="58" font-weight="800" fill="#ffffff">${escapeXml(line)}</text>`)
    .join('');

  const descriptionSvg = descriptionLines
    .map((line, index) => `<text x="72" y="${320 + (index * 36)}" font-size="28" font-weight="500" fill="#d7def7">${escapeXml(line)}</text>`)
    .join('');

  const previewBlock = previewDataUrl
    ? `
      <g filter="url(#shadow)">
        <rect x="735" y="110" width="390" height="300" rx="24" fill="#0d1326" stroke="rgba(255,255,255,0.18)" />
        <rect x="755" y="130" width="350" height="220" rx="16" fill="#101826" />
        <image href="${previewDataUrl}" x="755" y="130" width="350" height="220" preserveAspectRatio="xMidYMid slice" clip-path="url(#previewClip)" />
      </g>
    `
    : `
      <g filter="url(#shadow)">
        <rect x="735" y="110" width="390" height="300" rx="24" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.18)" />
        <text x="775" y="220" font-size="28" font-weight="700" fill="#ffffff">Tiny Tool Town</text>
        <text x="775" y="260" font-size="22" font-weight="500" fill="#d7def7">Free, fun, open source</text>
        <text x="775" y="300" font-size="22" font-weight="500" fill="#d7def7">tiny tools made with love.</text>
      </g>
    `;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" font-family="Inter, Arial, sans-serif">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#101424" />
          <stop offset="60%" stop-color="#1b1140" />
          <stop offset="100%" stop-color="${accent}" />
        </linearGradient>
        <linearGradient id="accentFade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="${accent}" stop-opacity="0.95" />
          <stop offset="100%" stop-color="${accent}" stop-opacity="0.15" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="18" stdDeviation="20" flood-color="#050816" flood-opacity="0.45" />
        </filter>
        <clipPath id="previewClip">
          <rect x="755" y="130" width="350" height="220" rx="16" />
        </clipPath>
      </defs>

      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)" />
      <circle cx="1080" cy="95" r="180" fill="rgba(255,255,255,0.08)" />
      <circle cx="1110" cy="550" r="140" fill="rgba(255,255,255,0.06)" />
      <rect x="0" y="0" width="670" height="${HEIGHT}" fill="url(#accentFade)" opacity="0.18" />

      <rect x="72" y="58" width="190" height="40" rx="20" fill="rgba(255,255,255,0.12)" />
      <text x="98" y="84" font-size="20" font-weight="700" fill="#ffffff">Tiny Tool Town</text>

      ${titleSvg}
      ${descriptionSvg}

      <rect x="72" y="500" width="282" height="50" rx="25" fill="#ffffff" />
      <text x="102" y="533" font-size="22" font-weight="800" fill="#101424">View on Tiny Tool Town</text>

      <text x="72" y="580" font-size="22" font-weight="600" fill="#ffffff">${escapeXml(metaLine || 'Tiny software for real humans')}</text>
      <text x="735" y="452" font-size="24" font-weight="700" fill="#ffffff">${escapeXml(tagText || slug)}</text>
      <text x="735" y="486" font-size="20" font-weight="500" fill="#d7def7">${escapeXml(SITE_URL.replace('https://', ''))}</text>

      ${previewBlock}
    </svg>
  `;

  return sharp(Buffer.from(svg))
    .png({ compressionLevel: 9, quality: 90 })
    .toBuffer();
}

/**
 * Render a social card PNG for an author showcase page.
 *
 * @param {object} author
 * @param {string} author.github
 * @param {string} author.name
 * @param {string} [author.headline]
 * @param {string} [author.intro]
 * @param {number} author.toolCount
 * @param {{name: string, count?: number}[]} [author.tags]
 * @param {{name: string, count?: number}[]} [author.languages]
 * @param {{name: string}} [author.latestTool]
 * @returns {Promise<Buffer>} PNG buffer.
 */
export async function renderAuthorSocialCard(author) {
  const accent = '#ff8906';
  const title = author.name || `@${author.github}`;
  const descriptionSource = author.headline || author.intro || `${title} has shared ${author.toolCount} tiny tools in Tiny Tool Town.`;
  const description = truncate(descriptionSource, 170);
  const toolCountLabel = `${author.toolCount} ${author.toolCount === 1 ? 'tiny tool' : 'tiny tools'}`;
  const tags = Array.isArray(author.tags) ? author.tags.map((tag) => tag.name || tag).filter(Boolean) : [];
  const languages = Array.isArray(author.languages) ? author.languages.map((language) => language.name || language).filter(Boolean) : [];
  const tagText = tags.slice(0, 4).join(' • ');
  const languageText = languages.slice(0, 3).join(' • ');
  const latestTool = author.latestTool?.name ? `Latest: ${author.latestTool.name}` : 'Author showcase';

  const titleLines = wrapLines(title, 20, 2);
  const descriptionLines = wrapLines(description, 44, 3);

  const titleSvg = titleLines
    .map((line, index) => `<text x="72" y="${166 + (index * 70)}" font-size="58" font-weight="850" fill="#ffffff">${escapeXml(line)}</text>`)
    .join('');

  const descriptionSvg = descriptionLines
    .map((line, index) => `<text x="72" y="${322 + (index * 36)}" font-size="28" font-weight="500" fill="#d7def7">${escapeXml(line)}</text>`)
    .join('');

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" font-family="Inter, Arial, sans-serif">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#101424" />
          <stop offset="58%" stop-color="#23113c" />
          <stop offset="100%" stop-color="${accent}" />
        </linearGradient>
        <linearGradient id="accentFade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="${accent}" stop-opacity="0.98" />
          <stop offset="100%" stop-color="${accent}" stop-opacity="0.16" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="18" stdDeviation="20" flood-color="#050816" flood-opacity="0.45" />
        </filter>
      </defs>

      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)" />
      <circle cx="1060" cy="120" r="190" fill="rgba(255,255,255,0.08)" />
      <circle cx="1040" cy="552" r="150" fill="rgba(255,255,255,0.06)" />
      <rect x="0" y="0" width="710" height="${HEIGHT}" fill="url(#accentFade)" opacity="0.18" />

      <rect x="72" y="58" width="244" height="40" rx="20" fill="rgba(255,255,255,0.12)" />
      <text x="98" y="84" font-size="20" font-weight="700" fill="#ffffff">Tiny Tool Town author</text>

      ${titleSvg}
      ${descriptionSvg}

      <g filter="url(#shadow)">
        <rect x="770" y="108" width="330" height="330" rx="44" fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.18)" />
        <circle cx="935" cy="235" r="82" fill="#ffffff" opacity="0.95" />
        <text x="935" y="263" text-anchor="middle" font-size="86" font-weight="900" fill="#101424">@</text>
        <text x="935" y="358" text-anchor="middle" font-size="30" font-weight="800" fill="#ffffff">${escapeXml(`@${author.github}`)}</text>
        <text x="935" y="394" text-anchor="middle" font-size="24" font-weight="600" fill="#d7def7">${escapeXml(toolCountLabel)}</text>
      </g>

      <rect x="72" y="500" width="282" height="50" rx="25" fill="#ffffff" />
      <text x="102" y="533" font-size="22" font-weight="800" fill="#101424">View author tools</text>

      <text x="72" y="580" font-size="22" font-weight="650" fill="#ffffff">${escapeXml(latestTool)}</text>
      <text x="770" y="492" font-size="24" font-weight="750" fill="#ffffff">${escapeXml(tagText || 'Tiny software for real humans')}</text>
      <text x="770" y="528" font-size="20" font-weight="600" fill="#d7def7">${escapeXml(languageText || SITE_URL.replace('https://', ''))}</text>
      <text x="770" y="564" font-size="20" font-weight="500" fill="#d7def7">${escapeXml(SITE_URL.replace('https://', ''))}</text>
    </svg>
  `;

  return sharp(Buffer.from(svg))
    .png({ compressionLevel: 9, quality: 90 })
    .toBuffer();
}
