import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const getField = (body: string, label: string) => {
  const regex = new RegExp(`^### ${label}\\s*$\\n([\\s\\S]*?)(?=^### |\\Z)`, 'm');
  const match = body.match(regex);
  return match ? match[1].trim() : '';
};

describe('batch importer field parsing', () => {
  it('keeps an empty optional website URL field empty', () => {
    const body = `### Tool Name

Onboard

### Website or Demo URL (optional)



### Thumbnail image URL (optional)



### Your Name

Pablo`;

    expect(getField(body, 'Website or Demo URL \\(optional\\)')).toBe('');
  });

  it('uses the anchored multiline parser in the workflow', () => {
    const workflow = readFileSync('.github/workflows/batch-approve.yml', 'utf8');
    expect(workflow).toContain(
      "new RegExp(`^### ${label}\\\\s*$\\\\n([\\\\s\\\\S]*?)(?=^### |\\\\Z)`, 'm')"
    );
  });
});
