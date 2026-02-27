import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Extract "owner/repo" from a GitHub URL.
 * Returns null if the URL doesn't point to a valid GitHub repository.
 */
export function getGitHubRepo(url?: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== 'github.com' && parsed.hostname !== 'www.github.com') {
      return null;
    }
    const segments = parsed.pathname.split('/').filter(Boolean);
    if (segments.length < 2) return null;
    const repo = segments[1].replace(/\.git$/, '');
    return `${segments[0]}/${repo}`;
  } catch {
    return null;
  }
}

export interface StarCacheEntry {
  stars: number;
  etag?: string;
}

export type StarCache = Record<string, StarCacheEntry>;

const CACHE_PATH = join(process.cwd(), 'src', 'data', 'star-counts.json');

/** Read cached star counts from disk. Handles both old ({repo: number}) and new ({repo: {stars, etag}}) formats. */
export function readStarCache(): StarCache {
  try {
    if (existsSync(CACHE_PATH)) {
      const raw = JSON.parse(readFileSync(CACHE_PATH, 'utf-8'));
      const cache: StarCache = {};
      for (const [repo, value] of Object.entries(raw)) {
        if (typeof value === 'number') {
          cache[repo] = { stars: value };
        } else if (value && typeof value === 'object' && 'stars' in (value as any)) {
          cache[repo] = value as StarCacheEntry;
        }
      }
      return cache;
    }
  } catch { /* ignore corrupt cache */ }
  return {};
}

/** Write star counts cache to disk. */
export function writeStarCache(data: StarCache): void {
  const sorted = Object.fromEntries(
    Object.entries(data).sort(([a], [b]) => a.localeCompare(b))
  );
  writeFileSync(CACHE_PATH, JSON.stringify(sorted, null, 2) + '\n');
}

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'TinyToolTown',
  };
  const token = typeof process !== 'undefined' ? process.env.GITHUB_TOKEN : undefined;
  if (token) headers['Authorization'] = `token ${token}`;
  return headers;
}

/**
 * Load star counts for the given repos.
 * 1. Reads the local cache (with ETags).
 * 2. Makes conditional requests (If-None-Match) for ALL cached repos — 304s are free.
 * 3. Makes unconditional requests for repos not in cache.
 * 4. Updates the cache file with any changes.
 */
export async function fetchStarCounts(repos: string[]): Promise<Map<string, number>> {
  const unique = [...new Set(repos.filter(Boolean))];
  const cache = readStarCache();
  const map = new Map<string, number>();

  const cached: string[] = [];
  const missing: string[] = [];
  for (const repo of unique) {
    if (repo in cache) {
      map.set(repo, cache[repo].stars);
      cached.push(repo);
    } else {
      missing.push(repo);
    }
  }

  // Conditional-fetch cached repos (304s are free against rate limit)
  // and unconditional-fetch missing repos — all in one pass
  const toFetch = [
    ...cached.map(repo => ({ repo, etag: cache[repo].etag })),
    ...missing.map(repo => ({ repo, etag: undefined })),
  ];

  if (toFetch.length > 0) {
    const results = await fetchFromApi(toFetch);
    let cacheUpdated = false;
    for (const result of results) {
      map.set(result.repo, result.stars);
      const prev = cache[result.repo];
      if (!prev || prev.stars !== result.stars || prev.etag !== result.etag) {
        cache[result.repo] = { stars: result.stars, etag: result.etag };
        cacheUpdated = true;
      }
    }
    if (cacheUpdated) {
      try { writeStarCache(cache); } catch { /* ignore write errors */ }
    }
  }

  // Fill any still-missing repos with 0
  for (const repo of unique) {
    if (!map.has(repo)) map.set(repo, 0);
  }

  return map;
}

export interface FetchRequest {
  repo: string;
  etag?: string;
}

export interface FetchResult {
  repo: string;
  stars: number;
  etag?: string;
}

/** Fetch star counts from the GitHub API with ETag conditional request support. */
export async function fetchFromApi(requests: FetchRequest[]): Promise<FetchResult[]> {
  const baseHeaders = getAuthHeaders();

  const fetchOne = async (req: FetchRequest): Promise<FetchResult | null> => {
    try {
      const headers = { ...baseHeaders };
      if (req.etag) {
        headers['If-None-Match'] = req.etag;
      }
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`https://api.github.com/repos/${req.repo}`, {
        headers,
        signal: controller.signal,
      });
      clearTimeout(timeout);

      // 304 Not Modified — cached value is still fresh (doesn't cost rate limit)
      if (res.status === 304) return null;

      if (!res.ok) return null;
      const etag = res.headers.get('etag') || undefined;
      const data = await res.json();
      return { repo: req.repo, stars: (data.stargazers_count as number) || 0, etag };
    } catch {
      return null;
    }
  };

  const results: FetchResult[] = [];
  const batchSize = 20;
  for (let i = 0; i < requests.length; i += batchSize) {
    const batch = requests.slice(i, i + batchSize);
    const settled = await Promise.allSettled(batch.map(fetchOne));
    for (const s of settled) {
      if (s.status === 'fulfilled' && s.value) {
        results.push(s.value);
      }
    }
  }
  return results;
}
