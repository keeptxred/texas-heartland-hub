#!/usr/bin/env node
import assert from 'node:assert/strict';
import { parseAnalysis, parseFiscalNote, parseWitnessList } from './parse-official-document.mjs';

const analysis = parseAnalysis(`
<html><body><h1>BILL ANALYSIS</h1><p><b><u>BACKGROUND AND PURPOSE</u></b></p><p>Background text.</p><p><b><u>RULEMAKING AUTHORITY</u></b></p><p>No additional authority.</p><p><b><u>ANALYSIS</u></b></p><p>Section analysis text.</p></body></html>`);
assert.equal(analysis.sections.background_and_purpose, 'Background text.');
assert.equal(analysis.sections.rulemaking_authority, 'No additional authority.');
assert.equal(analysis.sections.analysis, 'Section analysis text.');

const fiscal = parseFiscalNote(`
<html><body><div id="divEditInRe">HB1 by Author, As Engrossed</div><div id="divSumStmt"><b>No fiscal implication to the State is anticipated.</b><br>The cost is $191,689.</div><div id="divGenStmt">General description.</div><div id="divLocalGov">No fiscal implication to units of local government is anticipated.</div><div id="divEditAgySource">304 Comptroller of Public Accounts</div><p>May 21, 2025</p></body></html>`);
assert.equal(fiscal.date, 'May 21, 2025');
assert.equal(fiscal.summary.includes('$191,689'), true);
assert.deepEqual(fiscal.monetary_amounts, ['$191,689']);
assert.equal(fiscal.no_state_fiscal_implication, true);
assert.equal(fiscal.no_local_fiscal_implication, true);
assert.equal(fiscal.source_agencies, '304 Comptroller of Public Accounts');

const witness = parseWitnessList(`
<html><body><p>WITNESS LIST</p><p>HB 1</p><p>HOUSE COMMITTEE REPORT</p><p>State Affairs Committee</p><p>April 28, 2025 - 9:00 AM</p><p>Registering, but not testifying:</p><p>Against :</p><p>Deline, Steven (Self)</p><p>On :</p><p>Barton, John (Veterans Land Board)</p></body></html>`);
assert.equal(witness.committee, 'State Affairs Committee');
assert.equal(witness.hearing_date, 'April 28, 2025 - 9:00 AM');
assert.deepEqual(witness.witnesses, [
  { name: 'Deline, Steven', organization: 'Self', position: 'against', testimony_type: 'registering, but not testifying' },
  { name: 'Barton, John', organization: 'Veterans Land Board', position: 'on', testimony_type: 'registering, but not testifying' },
]);

console.log(JSON.stringify({ analysis_sections: Object.keys(analysis.sections).length, fiscal_amounts: fiscal.monetary_amounts.length, witnesses: witness.witnesses.length, errors: 0 }, null, 2));
