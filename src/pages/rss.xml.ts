import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { getToolReleaseLink } from '../lib/github';

export async function GET(context: APIContext) {
  const allTools = await getCollection('tools');

  const toolsByDate = [...allTools].sort((a, b) => {
    const dateA = new Date(a.data.date_added);
    const dateB = new Date(b.data.date_added);
    return dateB.getTime() - dateA.getTime();
  });

  // context.site is guaranteed by astro.config.mjs `site` setting
  const site = context.site!;

  return rss({
    title: 'Tiny Tool Town',
    description: 'A delightful showcase for free, fun & open source tiny tools. Stupid-delightful software made with love.',
    site: site,
    xmlns: {
      atom: 'http://www.w3.org/2005/Atom',
    },
    customData: [
      `<language>en-us</language>`,
      `<atom:link href="${new URL('/rss.xml', site).href}" rel="self" type="application/rss+xml" />`,
    ].join(''),
    items: toolsByDate.map((tool) => {
      const slug = tool.id.replace(/\.md$/, '');

      // Build a clean plain-text description (no raw markdown)
      const parts: string[] = [];
      parts.push(tool.data.tagline);

      if (tool.data.ai_summary) {
        parts.push('');
        parts.push(tool.data.ai_summary);
      }

      if (tool.data.ai_features && tool.data.ai_features.length > 0) {
        parts.push('');
        parts.push('Key Features:');
        for (const feature of tool.data.ai_features) {
          parts.push(`• ${feature}`);
        }
      }

      // Metadata footer
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
