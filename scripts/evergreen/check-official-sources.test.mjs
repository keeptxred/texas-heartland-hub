import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const dir = mkdtempSync(join(tmpdir(), 'ktr-source-test-'));
after(() => rmSync(dir,{recursive:true,force:true}));
{
  const input = join(dir, 'input.json');
  const output = join(dir, 'output.json');
  function run(records) {
    writeFileSync(input, JSON.stringify(records));
    return spawnSync(process.execPath, ['scripts/evergreen/check-official-sources.mjs', input, output], {encoding:'utf8'});
  }
  test('rejects empty manifest', () => assert.notEqual(run([]).status, 0));
  test('rejects duplicate source IDs', () => {
    const source = {id:'tx-law',url:'https://statutes.capitol.texas.gov/'};
    assert.notEqual(run([source,source]).status, 0);
  });
  test('rejects more than 25 sources rather than truncating', () => {
    assert.notEqual(run(Array.from({length:26},(_,i)=>({id:'source-'+i,url:'https://example.gov/'}))).status,0);
  });
  test('rejects invalid source identifiers', () => {
    assert.notEqual(run([{id:'../bad',url:'https://example.gov/'}]).status,0);
  });
}
