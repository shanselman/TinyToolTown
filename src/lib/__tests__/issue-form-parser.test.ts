import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { getField, parseToolSubmission, normalizeRepoFromUrl, parseImportedIssueNumbers } = require('../../../scripts/issue-form-parser.cjs');

// A realistic GitHub issue-form body as posted by the submit-tool template.
const REAL_BODY = `### Tool Name

Onboard

### One-line description

A tiny tool for onboarding

### Tell us about your tool

Onboard helps you get started.
It supports multiple lines of description
including blank lines.

### GitHub Repository URL

https://github.com/pablo/onboard

### Website or Demo URL (optional)

_No response_

### Thumbnail image URL (optional)



### Your Name

Pablo

### Your GitHub Username

pablo

### Tags (comma-separated)

cli, productivity

### Primary Programming Language

Python

### License

MIT

### Page Theme (optional)

terminal

### Checklist

- [X] This tool is free and open source`;

const LEGACY_BODY = `### Tool Name

Steam Market Fee Calculator

### One-line description

See a fee breakdown.

### GitHub Repository URL

https://github.com/hyunjun12312/steam-market-fee-calculator

### Website or Demo URL

https://steamvaults.org/tools/steam-market-fee-calculator

### Your Name

hyunjun12312

### Your GitHub Username

hyunjun12312

### Tags

steam, calculator

### Page Theme

terminal

### Checklist

- [x] Confirmed`;

describe('issue-form-parser getField', () => {
  it('keeps an empty optional website URL field empty', () => {
    const body = `### Tool Name

Onboard

### Website or Demo URL (optional)



### Thumbnail image URL (optional)



### Your Name

Pablo`;

    expect(getField(body, 'Website or Demo URL (optional)')).toBe('');
  });

  it('captures multi-line field values', () => {
    expect(getField(REAL_BODY, 'Tell us about your tool')).toBe(
      'Onboard helps you get started.\nIt supports multiple lines of description\nincluding blank lines.'
    );
  });

  it('parses the last form field before the checklist', () => {
    expect(getField(REAL_BODY, 'Page Theme (optional)')).toBe('terminal');
  });

  it('keeps markdown subheadings inside textarea values', () => {
    const body = `### Tell us about your tool

This tool has sections.

### Features

- One
- Two

### GitHub Repository URL

https://github.com/owner/repo`;

    expect(getField(body, 'Tell us about your tool')).toBe(
      'This tool has sections.\n\n### Features\n\n- One\n- Two'
    );
  });
});

describe('parseToolSubmission', () => {
  it('extracts all known fields from a real issue body', () => {
    const fields = parseToolSubmission(REAL_BODY);
    expect(fields.name).toBe('Onboard');
    expect(fields.tagline).toBe('A tiny tool for onboarding');
    expect(fields.github_url).toBe('https://github.com/pablo/onboard');
    expect(fields.website_url).toBe('_No response_');
    expect(fields.thumbnail_url).toBe('');
    expect(fields.author).toBe('Pablo');
    expect(fields.author_github).toBe('pablo');
    expect(fields.tags).toBe('cli, productivity');
    expect(fields.language).toBe('Python');
    expect(fields.license).toBe('MIT');
    expect(fields.theme).toBe('terminal');
  });

  it('returns empty strings when fields are absent', () => {
    const fields = parseToolSubmission('### Tool Name\n\nJust a name');
    expect(fields.name).toBe('Just a name');
    expect(fields.tagline).toBe('');
    expect(fields.github_url).toBe('');
  });

  it('parses legacy headings without absorbing later fields into the GitHub URL', () => {
    const fields = parseToolSubmission(LEGACY_BODY);
    expect(fields.github_url).toBe('https://github.com/hyunjun12312/steam-market-fee-calculator');
    expect(fields.website_url).toBe('https://steamvaults.org/tools/steam-market-fee-calculator');
    expect(fields.tags).toBe('steam, calculator');
    expect(fields.theme).toBe('terminal');
  });
});

describe('normalizeRepoFromUrl', () => {
  it('normalizes equivalent URLs to the same owner/repo key', () => {
    const canonical = 'owner/repo';
    expect(normalizeRepoFromUrl('https://github.com/owner/repo')).toBe(canonical);
    expect(normalizeRepoFromUrl('https://www.github.com/Owner/Repo')).toBe(canonical);
    expect(normalizeRepoFromUrl('https://github.com/owner/repo.git')).toBe(canonical);
    expect(normalizeRepoFromUrl('https://github.com/owner/repo/')).toBe(canonical);
    expect(normalizeRepoFromUrl('https://github.com/owner/repo/tree/main')).toBe(canonical);
    expect(normalizeRepoFromUrl('https://github.com/Owner/Repo.')).toBe(canonical);
  });

  it('returns null for non-github or malformed URLs', () => {
    expect(normalizeRepoFromUrl('')).toBeNull();
    expect(normalizeRepoFromUrl('https://example.com/owner/repo')).toBeNull();
    expect(normalizeRepoFromUrl('not a url')).toBeNull();
  });
});

describe('parseImportedIssueNumbers', () => {
  it('reads Imported-from trailers across import commit messages', () => {
    const log = [
      '🏘️ Add 2 tools from import queue',
      '',
      'Imported-from: #928',
      'Imported-from: #926',
      '',
      '🏘️ Add 1 tool from import queue',
      '',
      'Imported-from: #914',
    ].join('\n');
    expect([...parseImportedIssueNumbers(log)].sort()).toEqual([914, 926, 928]);
  });

  it('ignores issue references that are not trailers', () => {
    expect(parseImportedIssueNumbers('Add claimed author page (closes #919)').size).toBe(0);
    expect(parseImportedIssueNumbers('See Imported-from: #12 in prose').size).toBe(0);
    expect(parseImportedIssueNumbers('').size).toBe(0);
  });
});

describe('workflows use the shared parser', () => {
  it('batch-approve.yml requires the shared parser module', () => {
    const workflow = readFileSync('.github/workflows/batch-approve.yml', 'utf8');
    expect(workflow).toContain('scripts/issue-form-parser.cjs');
    expect(workflow).not.toContain("getField(body, 'Tags \\\\(comma-separated\\\\)')");
  });

  it('triage-tool.yml requires the shared parser module', () => {
    const workflow = readFileSync('.github/workflows/triage-tool.yml', 'utf8');
    expect(workflow).toContain('scripts/issue-form-parser.cjs');
  });
});
