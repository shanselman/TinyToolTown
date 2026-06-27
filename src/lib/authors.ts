import type { CollectionEntry } from 'astro:content';

export type ToolEntry = CollectionEntry<'tools'>;

export interface CountedValue {
  name: string;
  count: number;
}

export interface AuthorSummary {
  github: string;
  name: string;
  tools: ToolEntry[];
  toolCount: number;
  tags: CountedValue[];
  languages: CountedValue[];
  latestDateAdded: string;
  latestTool: ToolEntry;
}

export interface AuthorProfileSection {
  title: string;
  description: string;
  toolSlugs: string[];
}

export interface AuthorProfile {
  github: string;
  headline: string;
  intro: string;
  notes: string[];
  sections: AuthorProfileSection[];
}

export const customAuthorProfiles: Record<string, AuthorProfile> = {
  shanselman: {
    github: 'shanselman',
    headline: 'Small Windows comforts, terminal helpers, productivity papercuts, and joyful nonsense.',
    intro: 'Scott keeps a bench full of tiny utilities: little Windows affordances, command-line helpers, browser glue, speaking timers, health experiments, and a few bits of software that exist because computers should occasionally be silly.',
    notes: [
      'A lot of these tools smooth over daily friction: panes, desktops, package updates, certificates, shipping labels.',
      'Some are intentionally tiny and specific. Toasty is a 229 KB notification CLI; BabySmash is exactly what it sounds like.',
      'The common thread is practical tinkering: make the rough edge visible, shave it down, share the result.',
    ],
    sections: [
      {
        title: 'Windows workbench',
        description: 'Desktop and tray utilities for small Windows annoyances: virtual desktops, peeking at the wallpaper, posture nudges, edge lights, handheld companion controls, and Terminal pane cleanup.',
        toolSlugs: [
          'maximize-to-virtual-desktop',
          'peekdesktop',
          'posturr-windows',
          'windows-edge-light',
          'openclaw-windows-hub',
          'splitpanefix',
        ],
      },
      {
        title: 'Terminal and developer helpers',
        description: 'Tools for package updates, toast notifications, certificate inspection, and focused presentation timing.',
        toolSlugs: ['winget-tui', 'toasty', 'cert-inspector', 'markwatch'],
      },
      {
        title: 'Useful one-offs and odd joys',
        description: 'Browser automation, health-data experiments, and keyboard-smashing fun for small kids.',
        toolSlugs: ['depop-to-pirateship', 'nightscout-cgm-skill', 'babysmash'],
      },
    ],
  },
};

export function normalizeGitHubHandle(handle: string): string {
  return handle.trim().replace(/^@+/, '').toLowerCase();
}

export function getAuthorPath(handle: string): string {
  return `/authors/${normalizeGitHubHandle(handle)}/`;
}

export function getAvatarUrl(handle: string, size = 96): string {
  return `https://avatars.githubusercontent.com/${normalizeGitHubHandle(handle)}?s=${size}`;
}

export function slugForTool(tool: ToolEntry): string {
  return tool.id.replace(/\.md$/, '');
}

export function buildAuthors(tools: ToolEntry[]): AuthorSummary[] {
  const groups = new Map<string, ToolEntry[]>();

  for (const tool of tools) {
    const github = normalizeGitHubHandle(tool.data.author_github);
    if (!github) continue;
    const group = groups.get(github) || [];
    group.push(tool);
    groups.set(github, group);
  }

  return [...groups.entries()]
    .map(([github, authorTools]) => buildAuthorSummary(github, authorTools))
    .sort((a, b) =>
      b.toolCount - a.toolCount
      || a.name.localeCompare(b.name)
      || a.github.localeCompare(b.github)
    );
}

export function buildAuthorIntro(author: AuthorSummary): string {
  const topTags = author.tags.slice(0, 5).map(tag => tag.name);
  const languages = author.languages.map(language => language.name);
  const tagText = topTags.length > 0 ? `, mostly around ${formatList(topTags)}` : '';
  const languageText = languages.length > 0 ? ` The tools span ${formatList(languages)}.` : '';

  return `${author.name} has shared ${author.toolCount} ${pluralize('tiny tool', author.toolCount)} here${tagText}.${languageText}`;
}

function buildAuthorSummary(github: string, tools: ToolEntry[]): AuthorSummary {
  const sortedTools = [...tools].sort((a, b) =>
    b.data.date_added.localeCompare(a.data.date_added)
    || a.data.name.localeCompare(b.data.name)
  );
  const latestTool = sortedTools[0];

  return {
    github,
    name: chooseCanonicalName(tools),
    tools: sortedTools,
    toolCount: tools.length,
    tags: countValues(tools.flatMap(tool => tool.data.tags)),
    languages: countValues(tools.map(tool => tool.data.language).filter((language): language is string => Boolean(language))),
    latestDateAdded: latestTool.data.date_added,
    latestTool,
  };
}

function chooseCanonicalName(tools: ToolEntry[]): string {
  return countValues(tools.map(tool => tool.data.author))[0]?.name || tools[0]?.data.author || 'Unknown author';
}

function countValues(values: string[]): CountedValue[] {
  const counts = new Map<string, { name: string; count: number }>();

  for (const value of values) {
    const key = value.trim().toLowerCase();
    if (!key) continue;
    const current = counts.get(key);
    if (current) {
      current.count++;
    } else {
      counts.set(key, { name: value.trim(), count: 1 });
    }
  }

  return [...counts.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

function pluralize(label: string, count: number): string {
  return count === 1 ? label : `${label}s`;
}

function formatList(values: string[]): string {
  if (values.length === 0) return '';
  if (values.length === 1) return values[0];
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(', ')}, and ${values[values.length - 1]}`;
}
