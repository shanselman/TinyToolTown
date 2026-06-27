import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { getToolReleaseLink } from '../../lib/github';

type Platform = {
  slug: string;
  label: string;
  tagAliases: string[];
};

const PLATFORMS: Platform[] = [
  { slug: 'windows', label: 'Windows',  tagAliases: ['windows', 'win32', 'winui', 'wpf', 'winforms', 'win'] },
  { slug: 'macos',   label: 'macOS',    tagAliases: ['macos', 'mac', 'osx', 'mac-os'] },
  { slug: 'linux',   label: 'Linux',    tagAliases: ['linux'] },
  { slug: 'ios',     label: 'iOS',      tagAliases: ['ios', 'iphone', 'ipad', 'ipados'] },
  { slug: 'android', label: 'Android',  tagAliases: ['android'] },
  { slug: 'web',     label: 'Web',      tagAliases: ['web', 'webapp', 'web-app', 'browser', 'pwa'] },
];

export async function getStaticPaths() {
  return PLATFORMS.map((p) => ({ params: { platform: p.slug }, props: { platform: p } }));
}

export async function GET(context: APIContext) {
  const platform = context.props.platform as Platform;
  const aliasSet = new Set(platform.tagAliases.map((t) => t.toLowerCase()));

  const allTools = await getCollection('tools');

  const matching = allTools.filter((tool) => {
    const tags = (tool.data.tags || []).map((t: string) => t.toLowerCase());
    return tags.some((t) => aliasSet.has(t));
  });

  const toolsByDate = [...matching].sort((a, b) => {
    return new Date(b.data.date_added).getTime() - new Date(a.data.date_added).getTime();
  });

  const site = context.site!;
  const feedUrl = new URL(`/rss/${platform.slug}.xml`, site).href;

  return rss({
    title: `Tiny Tool Town — ${platform.label}`,
    description: `Latest ${platform.label} tools from Tiny Tool Town. Free, fun & open source tiny tools.`,
    site,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: [
      `<language>en-us</language>`,
      `<atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />`,
    ].join(''),
    items: toolsByDate.map((tool) => {
      const slug = tool.id.replace(/\.md$/, '');

      const parts: string[] = [];
      parts.push(tool.data.tagline);

      if (tool.data.ai_summary) {
        parts.push('');
        parts.push(tool.data.ai_summary);
      }

      if (tool.data.ai_features && tool.data.ai_features.length > 0) {
        parts.push('');
        parts.push('Key Features:');
        for (const feature of tool.data.ai_features) parts.push(`• ${feature}`);
      }

      parts.push('');
      parts.push(`By ${tool.data.author} (@${tool.data.author_github})`);
      if (tool.data.language) parts.push(`Language: ${tool.data.language}`);
      if (tool.data.license) parts.push(`License: ${tool.data.license}`);
      parts.push(`GitHub: ${tool.data.github_url}`);
      if (tool.data.website_url) parts.push(`Website: ${tool.data.website_url}`);
      const releaseLink = getToolReleaseLink(tool.data);
      if (releaseLink?.explicit) parts.push(`${releaseLink.label}: ${releaseLink.url}`);

      return {
        title: tool.data.name,
        pubDate: new Date(tool.data.date_added),
        description: parts.join('\n'),
        link: new URL(`/tools/${slug}/`, site).href,
        categories: tool.data.tags,
      };
    }),
  });
}
