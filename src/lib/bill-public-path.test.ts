import { describe, expect, it } from 'vitest';
import { publicBillPath, publicBillReferencePath } from '@/lib/bill-public-path';

describe('publicBillPath', () => {
  it('preserves the legacy regular-session path', () => {
    expect(publicBillPath({ legislature_number: 89, session_code: 'R', bill_type: 'HB', bill_number: 1 }))
      .toBe('/bills/texas/89/hb/1');
  });

  it('creates unique called-session paths', () => {
    expect(publicBillPath({ legislature_number: 89, session_code: '1', bill_type: 'HB', bill_number: 1 }))
      .toBe('/bills/texas/89/1/hb/1');
    expect(publicBillPath({ legislature_number: 89, session_code: '2', bill_type: 'SB', bill_number: 18 }))
      .toBe('/bills/texas/89/2/sb/18');
  });

  it('creates session-aware reference paths', () => {
    expect(publicBillReferencePath({ legislature_number: 89, session_code: '2', bill_type: 'HB', bill_number: 8 }))
      .toBe('/bills/texas/89/2/hb/8/reference.json');
  });
});
