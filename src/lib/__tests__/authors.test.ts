import { describe, expect, it } from 'vitest';
import type { ToolEntry } from '../authors';
import { buildAuthorIntro, buildAuthors, getAuthorPath, getAvatarUrl, normalizeGitHubHandle, slugForTool } from '../authors';

function tool(id: string, data: Partial<ToolEntry['data']> & Pick<ToolEntry['data'], 'name' | 'author' | 'author_github' | 'tags' | 'date_added'>): ToolEntry {
  return {
    id,
    body: '',
    collection: 'tools',
    data: {
      tagline: `${data.name} tagline`,
      github_url: `https://github.com/${data.author_github}/${id}`,
      ...data,
    },
  } as ToolEntry;
}

describe('author helpers', () => {
  it('normalizes GitHub handles for URLs and avatars', () => {
    expect(normalizeGitHubHandle(' @Shanselman ')).toBe('shanselman');
    expect(getAuthorPath('Shanselman')).toBe('/authors/shanselman/');
    expect(getAvatarUrl('@Shanselman', 48)).toBe('https://avatars.githubusercontent.com/shanselman?s=48');
  });

  it('groups tools case-insensitively and sorts authors by tool count then name', () => {
    const authors = buildAuthors([
      tool('one.md', {
        name: 'One',
        author: 'Scott Hanselman',
        author_github: 'Shanselman',
        tags: ['windows', 'cli'],
        language: 'C#',
        date_added: '2026-02-09',
      }),
      tool('two.md', {
        name: 'Two',
        author: 'Scott Hanselman',
        author_github: 'shanselman',
        tags: ['windows'],
        language: 'PowerShell',
        date_added: '2026-03-01',
      }),
      tool('three.md', {
        name: 'Three',
        author: 'Ada',
        author_github: 'ada',
        tags: ['web'],
        language: 'TypeScript',
        date_added: '2026-01-01',
      }),
    ]);

    expect(authors.map(author => author.github)).toEqual(['shanselman', 'ada']);
    expect(authors[0].toolCount).toBe(2);
    expect(authors[0].latestTool.data.name).toBe('Two');
    expect(authors[0].tags).toEqual([
      { name: 'windows', count: 2 },
      { name: 'cli', count: 1 },
    ]);
    expect(authors[0].languages.map(language => language.name)).toEqual(['C#', 'PowerShell']);
  });

  it('builds concrete fallback intros from aggregated tool data', () => {
    const [author] = buildAuthors([
      tool('timer.md', {
        name: 'Timer',
        author: 'Maker',
        author_github: 'maker',
        tags: ['presentation', 'web'],
        language: 'TypeScript',
        date_added: '2026-01-01',
      }),
    ]);

    expect(buildAuthorIntro(author)).toBe('Maker has shared 1 tiny tool here, mostly around presentation and web. The tools span TypeScript.');
    expect(slugForTool(author.tools[0])).toBe('timer');
  });
});
