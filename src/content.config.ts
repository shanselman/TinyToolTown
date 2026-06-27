import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const tools = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tools' }),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    author: z.string(),
    author_github: z.string(),
    github_url: z.string().url(),
    website_url: z.string().url().optional(),
    release_url: z.string().url().optional(),
    download_url: z.string().url().optional(),
    thumbnail_source: z.string().url().optional(),
    thumbnail: z.string().optional(),
    tags: z.array(z.string()),
    language: z.string().optional(),
    license: z.string().optional(),
    date_added: z.string(),
    featured: z.boolean().optional().default(false),
    theme: z.string().optional(),
    ai_summary: z.string().optional(),
    ai_features: z.array(z.string()).optional(),
  }),
});

const authors = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/authors' }),
  schema: z.object({
    github: z.string().optional(),
    name: z.string().optional(),
    headline: z.string().optional(),
    intro: z.string().optional(),
    website_url: z.string().url().optional(),
    links: z.array(z.object({
      label: z.string(),
      url: z.string().url(),
    })).optional(),
    notes: z.array(z.string()).optional(),
    sections: z.array(z.object({
      title: z.string(),
      description: z.string(),
      toolSlugs: z.array(z.string()),
    })).optional(),
  }),
});

export const collections = { tools, authors };
