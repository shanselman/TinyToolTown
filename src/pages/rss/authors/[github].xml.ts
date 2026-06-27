import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { buildAuthorIntro, buildAuthors, slugForTool, type AuthorSummary } from '../../../lib/authors';
import { getToolReleaseLink } from '../../../lib/github';

export async function getStaticPaths() {
  const tools = await getCollection('tools');
  return buildAuthors(tools).map((author) => ({
    params: { github: author.github },
    props: { author },
  }));
}

export async function GET(context: APIContext) {
  const author = context.props.author as AuthorSummary;
  const site = context.site!;
  const feedUrl = new URL(`/rss/authors/${author.github}.xml`, site).href;

  return rss({
    title: `Tiny Tool Town — ${author.name}`,
    description: buildAuthorIntro(author),
    site,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: [
      `<language>en-us</language>`,
      `<atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />`,
    ].join(''),
    items: author.tools.map((tool) => {
      const slug = slugForTool(tool);
      const parts: string[] = [];

      parts.push(tool.data.tagline);
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
