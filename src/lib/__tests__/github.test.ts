import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getGitHubRepo, fetchStarCounts, fetchFromApi } from '../github';
import type { StarCache, FetchRequest } from '../github';

// Mock the fs-based cache so tests don't touch disk
vi.mock('node:fs', () => ({
  readFileSync: vi.fn(() => '{}'),
  writeFileSync: vi.fn(),
  existsSync: vi.fn(() => false),
}));

import { readFileSync, writeFileSync, existsSync } from 'node:fs';

describe('getGitHubRepo', () => {
  it('extracts owner/repo from a standard GitHub URL', () => {
    expect(getGitHubRepo('https://github.com/vigo/tablo')).toBe('vigo/tablo');
  });

  it('extracts owner/repo from www.github.com URL', () => {
    expect(getGitHubRepo('https://www.github.com/owner/repo')).toBe('owner/repo');
  });

  it('strips .git suffix', () => {
    expect(getGitHubRepo('https://github.com/owner/repo.git')).toBe('owner/repo');
  });

  it('returns null for non-GitHub URLs', () => {
    expect(getGitHubRepo('https://gitlab.com/owner/repo')).toBeNull();
  });

  it('returns null for invalid URLs', () => {
    expect(getGitHubRepo('not-a-url')).toBeNull();
  });

  it('returns null for undefined input', () => {
    expect(getGitHubRepo(undefined)).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(getGitHubRepo('')).toBeNull();
  });

  it('returns null for GitHub URL with only owner (no repo)', () => {
    expect(getGitHubRepo('https://github.com/owner')).toBeNull();
  });

  it('handles URLs with extra path segments', () => {
    expect(getGitHubRepo('https://github.com/owner/repo/tree/main')).toBe('owner/repo');
  });
});

describe('fetchStarCounts', () => {
  beforeEach(() => {
    vi.mocked(existsSync).mockReturnValue(false);
    vi.mocked(readFileSync).mockReturnValue('{}');
  });

  it('returns star count from API when cache is empty', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ etag: '"abc123"' }),
      json: async () => ({ stargazers_count: 42 }),
    } as Response);

    const result = await fetchStarCounts(['owner/repo']);
    expect(result.get('owner/repo')).toBe(42);

    vi.restoreAllMocks();
  });

  it('returns star count from cache and sends conditional request', async () => {
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(readFileSync).mockReturnValue(
      JSON.stringify({ 'owner/repo': { stars: 99, etag: '"old-etag"' } })
    );
    // 304 — cached value is still fresh
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 304,
      headers: new Headers(),
      json: async () => ({}),
    } as Response);

    const result = await fetchStarCounts(['owner/repo']);
    expect(result.get('owner/repo')).toBe(99);

    vi.restoreAllMocks();
  });

  it('updates cached value when API returns 200 with new data', async () => {
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(readFileSync).mockReturnValue(
      JSON.stringify({ 'owner/repo': { stars: 50, etag: '"old"' } })
    );
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ etag: '"new"' }),
      json: async () => ({ stargazers_count: 75 }),
    } as Response);

    const result = await fetchStarCounts(['owner/repo']);
    expect(result.get('owner/repo')).toBe(75);
    // Cache should have been written
    expect(vi.mocked(writeFileSync)).toHaveBeenCalled();

    vi.restoreAllMocks();
  });

  it('returns 0 for repos not in cache when API fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 403,
      headers: new Headers(),
      json: async () => ({}),
    } as Response);

    const result = await fetchStarCounts(['owner/repo']);
    expect(result.get('owner/repo')).toBe(0);

    vi.restoreAllMocks();
  });

  it('returns 0 for network errors', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'));

    const result = await fetchStarCounts(['owner/repo']);
    expect(result.get('owner/repo')).toBe(0);

    vi.restoreAllMocks();
  });

  it('handles empty input', async () => {
    const result = await fetchStarCounts([]);
    expect(result.size).toBe(0);
  });

  it('reads old cache format (repo: number) and migrates', async () => {
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(readFileSync).mockReturnValue(JSON.stringify({ 'owner/repo': 42 }));
    // 304 to keep cached value
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false, status: 304, headers: new Headers(), json: async () => ({}),
    } as Response);

    const result = await fetchStarCounts(['owner/repo']);
    expect(result.get('owner/repo')).toBe(42);

    vi.restoreAllMocks();
  });
});

describe('fetchFromApi (ETag support)', () => {
  it('sends If-None-Match header when etag is provided', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false, status: 304, headers: new Headers(), json: async () => ({}),
    } as Response);

    await fetchFromApi([{ repo: 'owner/repo', etag: '"my-etag"' }]);

    const callHeaders = fetchSpy.mock.calls[0][1]?.headers as Record<string, string>;
    expect(callHeaders['If-None-Match']).toBe('"my-etag"');

    vi.restoreAllMocks();
  });

  it('does not send If-None-Match when no etag', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true, status: 200, headers: new Headers({ etag: '"new"' }),
      json: async () => ({ stargazers_count: 10 }),
    } as Response);

    await fetchFromApi([{ repo: 'owner/repo' }]);

    const callHeaders = fetchSpy.mock.calls[0][1]?.headers as Record<string, string>;
    expect(callHeaders['If-None-Match']).toBeUndefined();

    vi.restoreAllMocks();
  });

  it('returns null for 304 responses (cache still valid)', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false, status: 304, headers: new Headers(), json: async () => ({}),
    } as Response);

    const results = await fetchFromApi([{ repo: 'owner/repo', etag: '"abc"' }]);
    expect(results).toHaveLength(0); // 304 returns null, filtered out

    vi.restoreAllMocks();
  });

  it('returns stars and new etag for 200 responses', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true, status: 200, headers: new Headers({ etag: '"new-etag"' }),
      json: async () => ({ stargazers_count: 55 }),
    } as Response);

    const results = await fetchFromApi([{ repo: 'owner/repo', etag: '"old"' }]);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({ repo: 'owner/repo', stars: 55, etag: '"new-etag"' });

    vi.restoreAllMocks();
  });
});

describe('sortTools (client-side logic)', () => {
  // Test the pure sorting comparator logic extracted from the page script
  type ToolItem = { dateAdded: string; stars: number };

  function sortByNewest(a: ToolItem, b: ToolItem): number {
    return b.dateAdded.localeCompare(a.dateAdded);
  }

  function sortByOldest(a: ToolItem, b: ToolItem): number {
    return a.dateAdded.localeCompare(b.dateAdded);
  }

  function sortByStars(a: ToolItem, b: ToolItem): number {
    return b.stars - a.stars;
  }

  const tools: ToolItem[] = [
    { dateAdded: '2026-02-10', stars: 5 },
    { dateAdded: '2026-02-20', stars: 100 },
    { dateAdded: '2026-02-15', stars: 50 },
  ];

  it('sorts by newest first (descending date)', () => {
    const sorted = [...tools].sort(sortByNewest);
    expect(sorted[0].dateAdded).toBe('2026-02-20');
    expect(sorted[1].dateAdded).toBe('2026-02-15');
    expect(sorted[2].dateAdded).toBe('2026-02-10');
  });

  it('sorts by oldest first (ascending date)', () => {
    const sorted = [...tools].sort(sortByOldest);
    expect(sorted[0].dateAdded).toBe('2026-02-10');
    expect(sorted[1].dateAdded).toBe('2026-02-15');
    expect(sorted[2].dateAdded).toBe('2026-02-20');
  });

  it('sorts by most stars first (descending)', () => {
    const sorted = [...tools].sort(sortByStars);
    expect(sorted[0].stars).toBe(100);
    expect(sorted[1].stars).toBe(50);
    expect(sorted[2].stars).toBe(5);
  });

  it('handles tools with equal stars', () => {
    const tied = [
      { dateAdded: '2026-02-10', stars: 10 },
      { dateAdded: '2026-02-20', stars: 10 },
    ];
    const sorted = [...tied].sort(sortByStars);
    expect(sorted[0].stars).toBe(10);
    expect(sorted[1].stars).toBe(10);
  });

  it('handles tools with 0 stars', () => {
    const withZero = [
      { dateAdded: '2026-02-10', stars: 0 },
      { dateAdded: '2026-02-20', stars: 42 },
      { dateAdded: '2026-02-15', stars: 0 },
    ];
    const sorted = [...withZero].sort(sortByStars);
    expect(sorted[0].stars).toBe(42);
    expect(sorted[1].stars).toBe(0);
    expect(sorted[2].stars).toBe(0);
  });
});

describe('client-side star cache (localStorage TTL)', () => {
  const STAR_CACHE_PREFIX = 'ttt_stars_';
  const STAR_TTL_MS = 60 * 60 * 1000;

  // Simulate the localStorage cache functions from the page script
  function getCachedStars(storage: Map<string, string>, repo: string, now: number): number | null {
    const raw = storage.get(STAR_CACHE_PREFIX + repo);
    if (!raw) return null;
    const entry = JSON.parse(raw);
    if (now - entry.ts > STAR_TTL_MS) return null;
    return entry.stars;
  }

  function setCachedStars(storage: Map<string, string>, repo: string, stars: number, now: number): void {
    storage.set(STAR_CACHE_PREFIX + repo, JSON.stringify({ stars, ts: now }));
  }

  it('returns null for missing entries', () => {
    const storage = new Map<string, string>();
    expect(getCachedStars(storage, 'owner/repo', Date.now())).toBeNull();
  });

  it('returns cached stars within TTL', () => {
    const storage = new Map<string, string>();
    const now = Date.now();
    setCachedStars(storage, 'owner/repo', 42, now);
    expect(getCachedStars(storage, 'owner/repo', now + 1000)).toBe(42);
  });

  it('returns null for expired entries', () => {
    const storage = new Map<string, string>();
    const now = Date.now();
    setCachedStars(storage, 'owner/repo', 42, now);
    expect(getCachedStars(storage, 'owner/repo', now + STAR_TTL_MS + 1)).toBeNull();
  });

  it('returns stars at exact TTL boundary', () => {
    const storage = new Map<string, string>();
    const now = Date.now();
    setCachedStars(storage, 'owner/repo', 42, now);
    expect(getCachedStars(storage, 'owner/repo', now + STAR_TTL_MS)).toBe(42);
  });
});
