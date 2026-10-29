import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeTexasBillStatus, isTexasStatuteBill } from './status-normalization.mjs';
const actions = (...lines) => lines.map(action_text => ({action_text}));
describe('Texas legislative instrument classification', () => {
  it('recognizes SR 2 read & adopted, even when enrollment is the latest action', () => {
    assert.deepEqual(normalizeTexasBillStatus('sr', actions('Received by the Secretary of the Senate', 'Read & adopted', 'Reported enrolled')), {code:'adopted',label:'Adopted',becameLaw:false});
  });
  it('does not call governor-signed HCR 13 a law', () => {
    assert.deepEqual(normalizeTexasBillStatus('hcr', actions('Adopted', 'Sent to the Governor', 'Signed by the Governor')), {code:'signed-resolution',label:'Signed by governor (resolution)',becameLaw:false});
  });
  it('keeps a proposed constitutional amendment separate from enacted law', () => {
    assert.deepEqual(normalizeTexasBillStatus('sjr', actions('Passed Senate', 'Filed with Secretary of State')), {code:'proposed-amendment',label:'Proposed constitutional amendment',becameLaw:false});
  });
  it('does not mark merely referred legislation as enacted', () => {
    assert.equal(normalizeTexasBillStatus('hb', actions('Filed', 'Referred to State Affairs')).becameLaw,false);
  });
  it('permits ordinary governor-signed or effective statutes', () => {
    assert.deepEqual(normalizeTexasBillStatus('sb', actions('Signed by the Governor')), {code:'signed',label:'Signed by governor',becameLaw:true});
    assert.deepEqual(normalizeTexasBillStatus('hb', actions('Effective on 09/01/2025')), {code:'effective',label:'Effective',becameLaw:true});
    assert.equal(isTexasStatuteBill('hcr'),false);
    assert.equal(isTexasStatuteBill('HB'),true);
  });
  it('does not consider a description that merely mentions effective dates enacted', () => {
    assert.equal(normalizeTexasBillStatus('hb', actions('Caption: relating to effective dates')).becameLaw,false);
  });
});
