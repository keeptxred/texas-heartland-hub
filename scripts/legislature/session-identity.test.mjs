import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseTloSession, identityFromTloHistoryUrl } from './session-identity.mjs';

describe('official TLO regular and called-session identities', () => {
  it('splits regular and numeric called-session tokens without swallowing the suffix', () => {
    assert.deepEqual(parseTloSession('89R'), { legislature_number:89, session_code:'R' });
    assert.deepEqual(parseTloSession('891'), { legislature_number:89, session_code:'1' });
    assert.deepEqual(parseTloSession('892'), { legislature_number:89, session_code:'2' });
    assert.deepEqual(parseTloSession('90R'), { legislature_number:90, session_code:'R' });
    assert.throws(() => parseTloSession('89'), /Invalid/);
  });
  it('extracts bill ID from XML basename, NEVER the folder range (the 1,972-link incident)', () => {
    const url = 'ftp://ftp.legis.state.tx.us/bills/89R/billhistory/house_bills/HB00001_HB00099/HB%2010.xml';
    assert.deepEqual(identityFromTloHistoryUrl(url,'89R'), { legislature_number:89, session_code:'R', bill_type:'hb', bill_number:10 });
    const other = 'ftp://ftp.legis.state.tx.us/bills/892/billhistory/senate_resolutions/SR00001_SR00099/SR%202.xml';
    assert.deepEqual(identityFromTloHistoryUrl(other,'892'), { legislature_number:89, session_code:'2', bill_type:'sr', bill_number:2 });
  });
  it('fails closed for a folder name or unrelated file', () => {
    assert.equal(identityFromTloHistoryUrl('ftp://ftp.legis.state.tx.us/bills/89R/billhistory/house_bills/HB00001_HB00099/','89R'), null);
    assert.equal(identityFromTloHistoryUrl('ftp://ftp.legis.state.tx.us/bills/89R/readme.txt','89R'),null);
    assert.equal(identityFromTloHistoryUrl('ftp://ftp.legis.state.tx.us/bills/89R/HB%200.xml','89R'),null);
  });
});
