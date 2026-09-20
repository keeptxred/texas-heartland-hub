import { describe, expect, it } from 'vitest';
import {
  CATALOG_SEED_ACTION_CODE,
  hasMeaningfulBillText,
  isScheduleBillActionCode,
  isSubstantiveBillActionCode,
} from './bill-indexability';

describe('bill indexability signals', () => {
  it('does not treat filed-report seed or schedule notices as substantive legal actions', () => {
    expect(isSubstantiveBillActionCode(CATALOG_SEED_ACTION_CODE)).toBe(false);
    expect(isSubstantiveBillActionCode('tlo-rss-meeting')).toBe(false);
    expect(isSubstantiveBillActionCode('tlo-rss-calendar')).toBe(false);
    expect(isScheduleBillActionCode('TLO-RSS-MEETING')).toBe(true);
    expect(isScheduleBillActionCode('tlo-rss-calendar')).toBe(true);
  });

  it('treats real legislative history as substantive regardless of case or whitespace', () => {
    expect(isSubstantiveBillActionCode(' tlo-history ')).toBe(true);
    expect(isSubstantiveBillActionCode('PASSED')).toBe(true);
    expect(isSubstantiveBillActionCode(null)).toBe(false);
  });

  it('requires meaningful editorial text instead of a thin phrase', () => {
    expect(hasMeaningfulBillText('Short caption')).toBe(false);
    expect(hasMeaningfulBillText('x'.repeat(80))).toBe(true);
  });
});
