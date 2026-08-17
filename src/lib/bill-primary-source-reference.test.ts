import { describe, expect, it } from 'vitest';

import { buildBillPrimarySourceReference } from '@/lib/bill-primary-source-reference';

describe('buildBillPrimarySourceReference', () => {
  it('projects only public primary-source fields and orders latest documents first', () => {
    const payload = buildBillPrimarySourceReference(
      {
        legislature_number: 89,
        session_code: 'R',
        bill_type: 'HB',
        bill_number: 7,
        bill_identifier: 'HB 7',
        caption: 'Relating to a public policy matter.',
        current_status_label: 'Signed by the Governor',
        last_action_date: '2025-06-20',
        last_synced_at: '2026-08-17T12:00:00Z',
        source_url: 'https://capitol.texas.gov/BillLookup/History.aspx?LegSess=89R&Bill=HB7',
      },
      [
        {
          action_date: '2025-06-20',
          action_text: 'Signed by the Governor',
          chamber: 'house',
          normalized_status: 'signed',
          source_url: 'https://capitol.texas.gov/BillLookup/History.aspx?LegSess=89R&Bill=HB7',
          internal_note: 'must not leak',
        } as any,
      ],
      [
        {
          id: 'older',
          document_type: 'bill_text',
          document_title: 'House Bill 7',
          source_pdf_url: 'https://capitol.texas.gov/tlodocs/89R/billtext/pdf/HB00007I.pdf',
          version_code: 'I',
          version_label: 'Introduced',
          version_sequence: 1,
          document_date: '2025-03-01',
          metadata: { private: 'must not leak' },
        },
        {
          id: 'latest',
          document_type: 'bill_text',
          document_title: 'House Bill 7',
          source_html_url: 'https://capitol.texas.gov/tlodocs/89R/billtext/html/HB00007F.htm',
          source_pdf_url: 'https://capitol.texas.gov/tlodocs/89R/billtext/pdf/HB00007F.pdf',
          version_code: 'F',
          version_label: 'Enrolled',
          version_sequence: 9,
          document_date: '2025-06-18',
          is_latest: true,
          metadata: { private: 'must not leak' },
        },
      ],
    );

    expect(payload.canonicalUrl).toBe('https://keeptxred.com/bills/texas/89/hb/7');
    expect(payload.officialBillUrl).toContain('capitol.texas.gov');
    expect(payload.documents).toHaveLength(2);
    expect(payload.documents[0]).toMatchObject({ versionCode: 'F', versionLabel: 'Enrolled' });
    expect(payload.documents[0].officialUrl).toContain('/html/HB00007F.htm');
    expect(payload.actions[0]).toMatchObject({ text: 'Signed by the Governor', status: 'signed' });

    const serialized = JSON.stringify(payload);
    expect(serialized).not.toContain('metadata');
    expect(serialized).not.toContain('internal_note');
    expect(serialized).not.toContain('must not leak');
    expect(serialized).not.toContain('"id"');
  });

  it('drops document rows without a public URL and blank actions', () => {
    const payload = buildBillPrimarySourceReference(
      {
        legislature_number: 89,
        bill_type: 'sb',
        bill_number: 1,
        bill_identifier: 'SB 1',
        caption: 'Test bill',
      },
      [{ action_text: '   ' }],
      [{ id: 'private-only', document_type: 'analysis', metadata: { source: 'internal' } }],
    );

    expect(payload.documents).toEqual([]);
    expect(payload.actions).toEqual([]);
  });
});
