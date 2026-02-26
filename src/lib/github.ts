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

/**
 * Fetch GitHub star counts for multiple repos in parallel.
 * Returns a Map from "owner/repo" to star count.
 * Repos that fail to fetch default to 0.
 * Applies a per-request timeout and overall timeout to avoid slow builds.
 */
export async function fetchStarCounts(repos: string[]): Promise<Map<string, number>> {
  const unique = [...new Set(repos.filter(Boolean))];
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'TinyToolTown',
  };
  const token = typeof process !== 'undefined' ? process.env.GITHUB_TOKEN : undefined;
  if (token) headers['Authorization'] = `token ${token}`;

  const fetchOne = async (repo: string): Promise<{ repo: string; stars: number }> => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`https://api.github.com/repos/${repo}`, {
        headers,
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!res.ok) return { repo, stars: 0 };
      const data = await res.json();
      return { repo, stars: (data.stargazers_count as number) || 0 };
    } catch {
      return { repo, stars: 0 };
    }
  };

  // Process in batches of 20 to avoid overwhelming the API
  const map = new Map<string, number>();
  const batchSize = 20;
  for (let i = 0; i < unique.length; i += batchSize) {
    const batch = unique.slice(i, i + batchSize);
    const results = await Promise.allSettled(batch.map(fetchOne));
    for (const result of results) {
      if (result.status === 'fulfilled') {
        map.set(result.value.repo, result.value.stars);
      }
    }
  }
  return map;
}
