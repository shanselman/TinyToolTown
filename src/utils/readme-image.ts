const imageCache = new Map<string, string | null>();

export async function getReadmeImage(githubUrl: string): Promise<string | null> {
  if (imageCache.has(githubUrl)) {
    return imageCache.get(githubUrl)!;
  }

  try {
    const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) return null;
    const [, owner, repo] = match;

    for (const branch of ['main', 'master']) {
      const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`;
      const res = await fetch(rawUrl);
      if (!res.ok) continue;

      const readme = await res.text();

      // Match markdown images: ![alt](url)
      const mdMatch = readme.match(/!\[[^\]]*\]\(([^)]+)\)/);
      // Match HTML images: <img src="url"
      const htmlMatch = readme.match(/<img[^>]+src=["']([^"']+)["']/i);

      const imgPath = mdMatch?.[1] || htmlMatch?.[1] || null;
      if (!imgPath) continue;

      // Resolve relative URLs to absolute GitHub raw URLs
      let absoluteUrl = imgPath;
      if (!imgPath.startsWith('http')) {
        const cleanPath = imgPath.replace(/^\.\//, '');
        absoluteUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${cleanPath}`;
      }

      imageCache.set(githubUrl, absoluteUrl);
      return absoluteUrl;
    }
  } catch (e) {
    console.warn(`Failed to fetch README image for ${githubUrl}:`, e);
  }

  imageCache.set(githubUrl, null);
  return null;
}
