import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const loaderSource = readFileSync(new URL('./bill-primary-source-data.ts', import.meta.url), 'utf8');
const regularReferenceRoute = readFileSync(
  new URL('../routes/bills.texas.$legislature.$billType.$billNumber.reference[.]json.ts', import.meta.url),
  'utf8',
);
const sessionReferenceRoute = readFileSync(
  new URL('../routes/bills.texas.$legislature.$session.$billType.$billNumber.reference[.]json.ts', import.meta.url),
  'utf8',
);

describe('bill reference route performance contract', () => {
  it('keeps both bill reference routes off the broad six-relation loader', () => {
    for (const source of [regularReferenceRoute, sessionReferenceRoute]) {
      expect(source).toContain('getBillPrimarySourceRelations');
      expect(source).not.toContain('getBillRelations');
    }
  });

  it('loads only official actions and documents for reference.json', () => {
    expect(loaderSource).toContain(".from('bill_actions')");
    expect(loaderSource).toContain(".from('bill_documents')");
    expect(loaderSource).not.toContain(".from('bill_sponsors')");
    expect(loaderSource).not.toContain(".from('bill_committee_history')");
    expect(loaderSource).not.toContain(".from('bill_subject_relationships')");
    expect(loaderSource).not.toContain(".from('bill_article_relationships')");
  });

  it('selects only the fields needed by the public primary-source projection', () => {
    expect(loaderSource).toContain(
      ".select('action_date,action_text,chamber,normalized_status,source_url')",
    );
    expect(loaderSource).toContain(
      ".select('id,bill_id,document_type,document_title,document_url,source_html_url,source_pdf_url,version_code,version_label,version_sequence,document_date,is_latest,file_format')",
    );
  });
});
