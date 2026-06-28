import { describe, expect, it } from 'vitest';
import { renderAuthorSocialCard } from '../../../scripts/social-card.mjs';

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

describe('renderAuthorSocialCard', () => {
  it('renders a 1200x630 PNG buffer for an author', async () => {
    const png = await renderAuthorSocialCard({
      github: 'shanselman',
      name: 'Scott Hanselman',
      toolCount: 13,
      tags: ['windows', 'desktop', 'cli'],
      languages: ['C#', 'JavaScript'],
    });

    expect(Buffer.isBuffer(png)).toBe(true);
    expect(png.subarray(0, 8).equals(PNG_SIGNATURE)).toBe(true);
    // IHDR width/height are big-endian uint32 at byte offsets 16 and 20.
    expect(png.readUInt32BE(16)).toBe(1200);
    expect(png.readUInt32BE(20)).toBe(630);
  });

  it('renders without optional fields (no name, tags, or languages)', async () => {
    const png = await renderAuthorSocialCard({ github: 'octocat' });
    expect(png.subarray(0, 8).equals(PNG_SIGNATURE)).toBe(true);
  });
});
