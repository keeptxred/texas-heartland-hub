import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearPublicBillCache } from './public-bill-cache';

const mocks = vi.hoisted(() => ({ from: vi.fn() }));
vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: mocks.from },
}));
vi.mock('@/lib/bill-public-path', () => ({
  publicBillPath: (b: {bill_number:number}) => '/bills/texas/89/hb/' + b.bill_number,
}));

import { getRelatedBills } from './related-bills';

const bill = {
  id: 'related-bill', legislature_number: 89,session_code:'R',
  bill_type:'HB',bill_number:88,bill_identifier:'HB 88',
  caption:'An approved source-linked bill',current_status_label:'Filed',
  last_action_date:'2026-01-01',became_law:false,
};
function query(data: any[], error: any = null) {
  const chain: any = {
    select: () => chain, eq: () => chain, not: () => chain,
    in: () => chain, neq: () => chain, order: () => chain,
    limit: () => chain,
    then: (onSuccess: (value: any) => any, onFailure?: (error: any) => any) =>
      Promise.resolve({data,error}).then(onSuccess,onFailure),
  };
  return chain;
}
function installGraphReads(errorOnFirstSponsor = false) {
  let first = true;
  mocks.from.mockImplementation((table: string) => {
    if (table === 'bill_sponsors' && first) {
      first = false;
      return errorOnFirstSponsor
        ? query([], {message: 'temporary database error'})
        : query([{sponsor_slug:'verified-sponsor'}]);
    }
    if (table === 'bill_sponsors') return query([{bill_id:bill.id,sponsor_slug:'verified-sponsor'}]);
    if (table === 'bills') return query([bill]);
    throw new Error('Unexpected query ' + table);
  });
}
beforeEach(() => {
  clearPublicBillCache();
  vi.resetAllMocks();
});
describe('related-bill verified graph cache', () => {
  it('deduplicates concurrent public reads and caches a successful result', async () => {
    installGraphReads();
    const [first,second] = await Promise.all([
      getRelatedBills('source-bill',89,8,{subjectIds:[]}),
      getRelatedBills('source-bill',89,8,{subjectIds:[]}),
    ]);
    expect(first).toEqual(second);
    expect(first).toHaveLength(1);
    expect(first[0].relationshipReasons).toEqual(['1 shared sponsor']);
    expect(mocks.from).toHaveBeenCalledTimes(3);
    expect(await getRelatedBills('source-bill',89,8,{subjectIds:[]})).toEqual(first);
    expect(mocks.from).toHaveBeenCalledTimes(3);
  });

  it('does not persist empty results returned after a transient Supabase error', async () => {
    installGraphReads(true);
    expect(await getRelatedBills('source-bill',89,8,{subjectIds:[]})).toEqual([]);
    installGraphReads();
    const retry = await getRelatedBills('source-bill',89,8,{subjectIds:[]});
    expect(retry).toHaveLength(1);
    expect(retry[0].id).toBe('related-bill');
  });

  it('keeps separately seeded approved subject sets from sharing a cache entry', async () => {
    installGraphReads();
    await getRelatedBills('source-bill',89,8,{subjectIds:[]});
    const prior = mocks.from.mock.calls.length;
    installGraphReads();
    await getRelatedBills('source-bill',89,8,{subjectIds:['reviewed-subject']});
    expect(mocks.from.mock.calls.length).toBeGreaterThan(prior);
  });
});
