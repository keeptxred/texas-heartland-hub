import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const loaderSource = readFileSync(new URL('./bill-primary-source-data.ts', import.meta.url), 'utf8');
const retiredGuard = readFileSync(new URL('./retired-bill-documents.ts', import.meta.url), 'utf8');
const publicApi = readFileSync(new URL('../routes/api/public/bill-detail.ts', import.meta.url), 'utf8');

describe('bill reference route performance contract', () => {
  it('keeps legacy reference documents retired instead of publishing JSON URLs', () => {
    expect(retiredGuard).toContain("normalized.startsWith('/bills/')");
    expect(publicApi).toContain("'X-Robots-Tag': 'noindex, follow'");
    expect(publicApi).toContain("getPublicBillRelations(bill.id)");
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
