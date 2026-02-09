import { defineCollection, z } from 'astro:content';

const tools = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    author: z.string(),
    author_github: z.string(),
    github_url: z.string().url(),
    website_url: z.string().url().optional(),
    thumbnail: z.string().optional(),
    tags: z.array(z.string()),
    language: z.string().optional(),
    license: z.string().optional(),
    date_added: z.string(),
    featured: z.boolean().optional().default(false),
  }),
});

export const collections = { tools };
