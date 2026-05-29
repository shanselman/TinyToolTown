import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';

export async function getStaticPaths() {
  const allTools = await getCollection('tools');
  const tags = new Set(allTools.flatMap((tool) => tool.data.tags.map((tag) => tag.trim())));

  return [...tags].map((tag) => ({
    params: { tag },
  }));
}

export async function GET(context: APIContext) {
  const tag = context.params.tag;
  if (!tag) {
    return new Response('Tag not found', { status: 404 });
  }

  const allTools = await getCollection('tools');

  const toolsByDate = allTools
    .filter((tool) => tool.data.tags.includes(tag))
    .sort((a, b) => {
      const dateA = new Date(a.data.date_added);
      const dateB = new Date(b.data.date_added);
      return dateB.getTime() - dateA.getTime();
    });

  const site = context.site!;
  const encodedTag = encodeURIComponent(tag);

  return rss({
    title: `Tiny Tool Town — ${tag} tools`,
    description: `Latest Tiny Tool Town entries tagged "${tag}".`,
    site: site,
    xmlns: {
      atom: 'http://www.w3.org/2005/Atom',
    },
    customData: [
      `<language>en-us</language>`,
      `<atom:link href="${new URL(`/rss/tags/${encodedTag}.xml`, site).href}" rel="self" type="application/rss+xml" />`,
    ].join(''),
    items: toolsByDate.map((tool) => {
      const slug = tool.id.replace(/\.md$/, '');
      const parts: string[] = [];

      if (tool.data.thumbnail) {
        parts.push(`<img src="${tool.data.thumbnail}" alt="${tool.data.name} thumbnail" />`);
      }

      parts.push(`<p>${tool.data.tagline}</p>`);

      if (tool.data.description) {
        parts.push(`<p>${tool.data.description}</p>`);
      }

      const links: string[] = [];
      if (tool.data.github_url) {
        links.push(`<a href="${tool.data.github_url}">GitHub</a>`);
      }
      if (tool.data.website_url) {
        links.push(`<a href="${tool.data.website_url}">Website</a>`);
      }
      if (links.length > 0) {
        parts.push(`<p>${links.join(' • ')}</p>`);
      }

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
