import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const allTools = await getCollection('tools');
  
  // Sort tools by date_added, newest first
  const toolsByDate = [...allTools].sort((a, b) => {
    const dateA = new Date(a.data.date_added);
    const dateB = new Date(b.data.date_added);
    return dateB.getTime() - dateA.getTime();
  });

  return rss({
    title: 'Tiny Tool Town 🏘️',
    description: 'A delightful showcase for free, fun & open source tiny tools. Stupid-delightful software made with love.',
    site: context.site ?? 'https://tinytooltown.com',
    items: toolsByDate.map((tool) => {
      const slug = tool.id.replace(/\.md$/, '');
      
      // Build comprehensive description
      const descParts: string[] = [];
      descParts.push(tool.data.tagline);
      
      if (tool.data.ai_summary) {
        descParts.push('');
        descParts.push(tool.data.ai_summary);
      }
      
      if (tool.body) {
        descParts.push('');
        descParts.push(tool.body);
      }
      
      if (tool.data.ai_features && tool.data.ai_features.length > 0) {
        descParts.push('');
        descParts.push('Key Features:');
        for (const feature of tool.data.ai_features) {
          descParts.push(`• ${feature}`);
        }
      }
      
      // Add metadata
      descParts.push('');
      descParts.push(`Author: ${tool.data.author} (@${tool.data.author_github})`);
      if (tool.data.language) {
        descParts.push(`Language: ${tool.data.language}`);
      }
      if (tool.data.license) {
        descParts.push(`License: ${tool.data.license}`);
      }
      descParts.push(`GitHub: ${tool.data.github_url}`);
      if (tool.data.website_url) {
        descParts.push(`Website: ${tool.data.website_url}`);
      }
      
      return {
        title: tool.data.name,
        pubDate: new Date(tool.data.date_added),
        description: descParts.join('\n'),
        link: `/tools/${slug}/`,
        categories: tool.data.tags,
        author: `${tool.data.author_github}@github`,
      };
    }),
    customData: `<language>en-us</language>`,
  });
}
