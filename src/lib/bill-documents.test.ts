import { describe, expect, it } from 'vitest';
import {
  groupLegislativeDocuments,
  legislativeDocumentHref,
  legislativeDocumentLabel,
} from './bill-documents';

describe('legislative document grouping', () => {
  it('orders groups and selects the latest version deterministically', () => {
    const groups = groupLegislativeDocuments([
      {
        id: 'analysis-house',
        document_type: 'analysis',
        document_url: 'https://example.test/analysis-house',
        version_label: 'House committee report',
        version_sequence: 40,
      },
      {
        id: 'text-introduced',
        document_type: 'bill_text',
        document_url: 'https://example.test/text-introduced',
        version_label: 'Introduced',
        version_sequence: 20,
      },
      {
        id: 'text-enrolled',
        document_type: 'bill_text',
        source_html_url: 'https://example.test/text-enrolled',
        version_label: 'Enrolled',
        version_sequence: 100,
        is_latest: true,
      },
      {
        id: 'fiscal',
        document_type: 'fiscal_note',
        source_pdf_url: 'https://example.test/fiscal.pdf',
      },
    ]);

    expect(groups.map((group) => group.type)).toEqual(['bill_text', 'analysis', 'fiscal_note']);
    expect(groups[0].latest.id).toBe('text-enrolled');
    expect(groups[0].versions.map((document) => document.id)).toEqual(['text-enrolled', 'text-introduced']);
  });

  it('prefers HTML, then PDF, then the generic document URL', () => {
    expect(legislativeDocumentHref({
      id: 'doc',
      source_html_url: 'https://example.test/doc.htm',
      source_pdf_url: 'https://example.test/doc.pdf',
      document_url: 'https://example.test/doc',
    })).toBe('https://example.test/doc.htm');
  });

  it('creates user-facing version labels and drops documents without a URL', () => {
    expect(legislativeDocumentLabel({
      id: 'doc',
      document_type: 'witness_list',
      version_label: 'Senate committee report',
    })).toBe('Witness list — Senate committee report');

    expect(groupLegislativeDocuments([{ id: 'missing', document_type: 'analysis' }])).toEqual([]);
  });
});
