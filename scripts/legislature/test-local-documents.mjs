#!/usr/bin/env node
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const root = await mkdtemp(join(tmpdir(), 'ktr-legislature-'));

const fixtures = [
  ['billhistory/house_bills/HB00001_HB00099/HB 1.xml', '<billhistory bill="HB 1"><caption>Test bill</caption></billhistory>'],
  ['billhistory/house_joint_resolutions/HJ00001_HJ00099/HJ 2.xml', '<billhistory bill="HJR 2" />'],
  ['billhistory/senate_joint_resolutions/SJ00001_SJ00099/SJ 3.xml', '<billhistory bill="SJR 3" />'],
  ['billhistory/house_concurrent_resolutions/HC00001_HC00099/HC 4.xml', '<billhistory bill="HCR 4" />'],
  ['billhistory/senate_concurrent_resolutions/SC00001_SC00099/SC 5.xml', '<billhistory bill="SCR 5" />'],
  ['billtext/html/house_bills/HB00001_HB00099/HB00001I.htm', '<html><body>Introduced text</body></html>'],
  ['analysis/html/house_bills/HB00001_HB00099/HB00001H.htm', '<html><body><h1>BILL ANALYSIS</h1><h2>BACKGROUND AND PURPOSE</h2><p>Test purpose.</p><h2>RULEMAKING AUTHORITY</h2><p>Rulemaking is granted.</p></body></html>'],
  ['fiscalnotes/html/house_bills/HB00001_HB00099/HB00001E.htm', '<html><body><div id="divSumStmt">Estimated cost is $1,000.</div><div id="divLocalGov">No fiscal implication to units of local government is anticipated.</div></body></html>'],
  ['witlistbill/html/house_bills/HB00001_HB00099/HB00001H.htm', '<html><body><div>State Affairs Committee</div><div>January 1, 2026 - 10:00 AM</div><div>Testifying:</div><div>For:</div><div>Jane Doe (Example Organization)</div></body></html>'],
  ['reports/author/author001.htm', '<html><body>Author report</body></html>'],
];

try {
  for (const [relativePath, contents] of fixtures) {
    const fullPath = join(root, relativePath);
    await mkdir(join(fullPath, '..'), { recursive: true });
    await writeFile(fullPath, contents, 'utf8');
  }

  const validation = await execFileAsync(process.execPath, [
    'scripts/legislature/validate-local-documents.mjs', `--root=${root}`,
  ], { encoding: 'utf8' });
  const validationResult = JSON.parse(validation.stdout);
  assert.equal(validationResult.unmatched_bill_files, 0);
  assert.equal(validationResult.categories.billhistory.unique_bills, 5);
  assert.equal(validationResult.categories.billtext.unique_bills, 1);
  assert.equal(validationResult.categories.analysis.unique_bills, 1);
  assert.equal(validationResult.categories.fiscalnotes.unique_bills, 1);
  assert.equal(validationResult.categories.witlistbill.unique_bills, 1);

  const dryRun = await execFileAsync(process.execPath, [
    'scripts/legislature/import-local-documents.mjs', `--root=${root}`, '--session=89R', '--dry-run', '--fresh',
  ], { encoding: 'utf8' });
  const dryRunResult = JSON.parse(dryRun.stdout);
  assert.equal(dryRunResult.errors, 0);
  assert.equal(dryRunResult.total, 10);
  assert.equal(dryRunResult.imported, 9);
  assert.equal(dryRunResult.reports, 1);
  assert.equal(dryRunResult.parsed_structured, 3);
  assert.equal(dryRunResult.touched_bills, 5);
  assert.equal(dryRunResult.complete, true);

  console.log('Legislative local archive smoke test passed.');
} finally {
  await rm(root, { recursive: true, force: true });
}
