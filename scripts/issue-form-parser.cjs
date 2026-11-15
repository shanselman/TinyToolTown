'use strict';

// Shared parser for tool-submission GitHub issue forms.
//
// Used by both .github/workflows/triage-tool.yml and
// .github/workflows/batch-approve.yml (via `require` inside actions/github-script)
// and exercised by src/lib/__tests__/issue-form-parser.test.ts.
//
// Keeping a single source of truth avoids the two workflows drifting apart in
// how they read the issue body.

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Field key -> rendered issue-form label.
const FIELD_LABELS = {
  name: 'Tool Name',
  tagline: 'One-line description',
  description: 'Tell us about your tool',
  github_url: 'GitHub Repository URL',
  website_url: 'Website or Demo URL (optional)',
  thumbnail_url: 'Thumbnail image URL (optional)',
  author: 'Your Name',
  author_github: 'Your GitHub Username',
  tags: 'Tags (comma-separated)',
  language: 'Primary Programming Language',
  license: 'License',
  theme: 'Page Theme (optional)',
};

// Earlier versions of the issue form omitted "(optional)" and
// "(comma-separated)" from several rendered headings. Keep accepting those
// bodies so already-open submissions can move through the current importer.
const FIELD_LABEL_ALIASES = {
  website_url: ['Website or Demo URL'],
  thumbnail_url: ['Thumbnail image URL'],
  tags: ['Tags'],
  theme: ['Page Theme'],
};

function labelsForKey(key) {
  return [FIELD_LABELS[key], ...(FIELD_LABEL_ALIASES[key] || [])];
}

// Extract the value of a single issue-form field by its rendered label.
// GitHub renders each form field as `### <label>` followed by the user's value.
// Stop only at another known form field (or the checklist), not at any arbitrary
// markdown heading the submitter includes inside a textarea.
function getField(body, label) {
  const text = body || '';
  const fieldKey = Object.keys(FIELD_LABELS).find((key) => labelsForKey(key).includes(label));
  const startLabels = fieldKey ? labelsForKey(fieldKey) : [label];
  const startRegex = new RegExp(`^### (?:${startLabels.map(escapeRegExp).join('|')})\\s*$\\n?`, 'm');
  const startMatch = text.match(startRegex);
  if (!startMatch || startMatch.index === undefined) return '';

  const rest = text.slice(startMatch.index + startMatch[0].length);
  const nextLabels = Object.keys(FIELD_LABELS)
    .filter((key) => key !== fieldKey)
    .flatMap(labelsForKey)
    .map(escapeRegExp)
    .concat('Checklist');
  const nextRegex = new RegExp(`^### (?:${nextLabels.join('|')})\\s*$`, 'm');
  const nextMatch = rest.match(nextRegex);
  const value = nextMatch && nextMatch.index !== undefined ? rest.slice(0, nextMatch.index) : rest;
  return value.trim();
}

// Parse all known tool-submission fields from an issue body.
function parseToolSubmission(body) {
  const result = {};
  for (const [key, label] of Object.entries(FIELD_LABELS)) {
    result[key] = getField(body, label);
  }
  return result;
}

// Normalize a GitHub repository URL to a canonical "owner/repo" key (lowercased),
// or null when the URL is not a recognizable github.com repository URL. Used for
// duplicate detection so trivially different URLs (trailing slash, www, .git,
// case) collapse to the same key.
function normalizeRepoFromUrl(url) {
  if (!url) return null;
  const cleaned = String(url).trim().replace(/<[^>]*>/g, '');
  const match = cleaned.match(/github\.com\/([^/\s#?]+)\/([^/\s#?]+)/i);
  if (!match) return null;
  const owner = match[1].toLowerCase();
  const repo = match[2]
    .replace(/\.git$/i, '')
    .replace(/[.,;:!?]+$/g, '')
    .toLowerCase();
  if (!owner || !repo) return null;
  return `${owner}/${repo}`;
}

// Import commits carry one `Imported-from: #123` trailer per issue. Returns the
// set of issue numbers already committed, so a run that pushed but crashed
// before closing its issues can be finished by the next run.
function parseImportedIssueNumbers(text) {
  const numbers = new Set();
  for (const match of String(text || '').matchAll(/^Imported-from: #(\d+)\s*$/gm)) {
    numbers.add(Number(match[1]));
  }
  return numbers;
}

module.exports = {
  getField,
  parseToolSubmission,
  normalizeRepoFromUrl,
  parseImportedIssueNumbers,
  FIELD_LABELS,
  FIELD_LABEL_ALIASES,
};
