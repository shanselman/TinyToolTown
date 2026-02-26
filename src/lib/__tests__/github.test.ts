import { describe, it, expect, vi } from 'vitest';
import { getGitHubRepo, fetchStarCounts } from '../github';

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
  it('returns a map of repo to star count', async () => {
    const mockResponse = { stargazers_count: 42 };
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await fetchStarCounts(['owner/repo']);
    expect(result.get('owner/repo')).toBe(42);

    vi.restoreAllMocks();
  });

  it('returns 0 for failed requests', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
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

  it('deduplicates repos', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ stargazers_count: 10 }),
    } as Response);

    await fetchStarCounts(['owner/repo', 'owner/repo', 'owner/repo']);
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    vi.restoreAllMocks();
  });

  it('handles empty input', async () => {
    const result = await fetchStarCounts([]);
    expect(result.size).toBe(0);
  });

  it('handles multiple repos', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
      const urlStr = url instanceof Request ? url.url : url.toString();
      if (urlStr.includes('repo-a')) {
        return { ok: true, json: async () => ({ stargazers_count: 100 }) } as Response;
      }
      if (urlStr.includes('repo-b')) {
        return { ok: true, json: async () => ({ stargazers_count: 200 }) } as Response;
      }
      return { ok: false, json: async () => ({}) } as Response;
    });

    const result = await fetchStarCounts(['owner/repo-a', 'owner/repo-b']);
    expect(result.get('owner/repo-a')).toBe(100);
    expect(result.get('owner/repo-b')).toBe(200);

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
