import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
  parseAuthorClaim,
  validateAuthorClaim,
  renderAuthorMarkdown,
  toolListsAuthor,
} = require('../../../scripts/author-claim-parser.cjs');

const CLAIM_BODY = `### GitHub username for this author page

demi-valerith

### Display name

Demi "D" Valerith

### Short headline

Focused planning tools.

### Bio / intro

I build small planning tools.

### Website URL (optional)

https://yardmaterialtools.com

### Other links (optional)

Coverage chart - https://yardmaterialtools.com/material-coverage-chart

### Notes or highlights (optional)

- Transparent calculations.
- Privacy friendly.

### Featured tool groups (optional)

Yard planning: yard-material-calculator-for-wordpress

### Checklist

- [x] Confirmed`;

describe('author claim parser', () => {
  it('preserves links, notes, and valid featured groups in author markdown', () => {
    const claim = parseAuthorClaim(
      CLAIM_BODY,
      new Set(['yard-material-calculator-for-wordpress'])
    );

    expect(validateAuthorClaim(claim, true)).toEqual([]);
    expect(renderAuthorMarkdown(claim)).toContain('name: "Demi \\"D\\" Valerith"');
    expect(renderAuthorMarkdown(claim)).toContain('notes:\n  - "Transparent calculations."');
    expect(renderAuthorMarkdown(claim)).toContain(
      'toolSlugs:\n      - "yard-material-calculator-for-wordpress"'
    );
  });

  it('reports missing profile content, ownership, malformed links, and unknown slugs', () => {
    const claim = parseAuthorClaim(
      `### GitHub username for this author page

someone

### Display name

Someone

### Other links (optional)

Blog - http://example.com

### Featured tool groups (optional)

Helpers: missing-tool`,
      new Set()
    );

    expect(validateAuthorClaim(claim, false)).toEqual([
      'Add a short headline or bio.',
      'The claimed GitHub account has no accepted tools yet.',
      'Invalid link line(s): Blog - http://example.com',
      'Unknown featured tool slug(s): missing-tool',
    ]);
  });

  it('recognizes an author in comma-delimited co-author frontmatter', () => {
    const tool = `---
author_github: "burkeholland,jamesmontemagno"
---`;
    expect(toolListsAuthor(tool, 'burkeholland')).toBe(true);
    expect(toolListsAuthor(tool, 'someone-else')).toBe(false);
  });
});

describe('author claim workflows', () => {
  it('triages verified claims in the validation run instead of relying on token-triggered labels', () => {
    const workflow = readFileSync('.github/workflows/validate-author-claim.yml', 'utf8');
    expect(workflow).toContain('author-claim-triage');
    expect(workflow).toContain('scripts/author-claim-parser.cjs');
  });

  it('processes claims with the shared parser', () => {
    const workflow = readFileSync('.github/workflows/process-author-claim.yml', 'utf8');
    expect(workflow).toContain('scripts/author-claim-parser.cjs');
    expect(workflow).toContain("refreshedIssue.data.state !== 'closed'");
    expect(workflow).toContain("['queued-author', 'needs-maintainer-review']");
  });

  it('serializes author-page writes against the other main-branch writers', () => {
    const workflow = readFileSync('.github/workflows/process-author-claim.yml', 'utf8');
    expect(workflow).toContain('group: tool-file-writer');
  });

  it('retries the push instead of failing on a concurrent commit', () => {
    const workflow = readFileSync('.github/workflows/process-author-claim.yml', 'utf8');
    expect(workflow).toContain("execFileSync('git', ['pull', '--rebase'])");
  });

  it('releases queued-author when processing fails so the claim can be retried', () => {
    const workflow = readFileSync('.github/workflows/process-author-claim.yml', 'utf8');
    expect(workflow).toContain('async function markFailed(reason)');
    expect(workflow).toContain("removeLabelIfExists('queued-author')");
    // Every bail-out must go through markFailed, never a bare core.setFailed,
    // otherwise the claim keeps queued-author forever and cannot self-retry.
    // Exactly one call is allowed: the one inside markFailed itself.
    expect(workflow.match(/core\.setFailed\(/g) ?? []).toHaveLength(1);
  });

  it('requires explicit approval before replacing an existing author page', () => {
    const workflow = readFileSync('.github/workflows/process-author-claim.yml', 'utf8');
    expect(workflow).toContain("labels.includes('author-update-approved')");
    // Identical content must be a no-op, not an empty commit.
    expect(workflow).toContain('current === mdContent');
  });

  it('ignores its own bookkeeping labels so validation cannot race the processor', () => {
    const workflow = readFileSync('.github/workflows/validate-author-claim.yml', 'utf8');
    expect(workflow).toContain("github.event.label.name != 'queued-author'");
    expect(workflow).toContain("github.event.label.name != 'needs-maintainer-review'");
  });
});

describe('batch import safety', () => {
  it('rolls back a partial write so a failed import is never staged', () => {
    const workflow = readFileSync('.github/workflows/batch-approve.yml', 'utf8');
    // `git add src/content/tools` stages the whole directory, so a tool file
    // written before a mid-import throw would otherwise ship a live page for a
    // submission that was marked import-failed.
    expect(workflow).toContain('writtenFilePath');
    expect(workflow).toContain('fs.unlinkSync(stalePath)');
  });

  it('clears queued-import once an issue has been imported and closed', () => {
    const workflow = readFileSync('.github/workflows/batch-approve.yml', 'utf8');
    expect(workflow).toContain("removeLabelIfExists(item.issueNumber, 'queued-import')");
  });
});
