import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
const dir=mkdtempSync(join(tmpdir(),'ktr-ingest-test-'));
after(()=>rmSync(dir,{recursive:true,force:true}));
const file=join(dir,'results.json');
const source={id:'tx-law',url:'https://statutes.capitol.texas.gov/',status:'retrieved-not-verified',checkedAt:'2026-10-11T18:00:00Z'};
function run(results,env={}) {
 writeFileSync(file,JSON.stringify({results}));
 return spawnSync(process.execPath,['scripts/evergreen/persist-source-results.mjs',file],{encoding:'utf8',env:{...process.env,SUPABASE_URL:'https://example.supabase.co',SUPABASE_SERVICE_ROLE_KEY:'test-only',...env}});
}
test('rejects duplicate records before attempting network',()=>assert.match(run([source,source]).stderr,/Duplicate source-check identifiers/));
test('rejects missing check timestamp',()=>assert.match(run([{...source,checkedAt:undefined}]).stderr,/Invalid check time/));
test('rejects URL credentials',()=>assert.match(run([{...source,url:'https://user:pass@statutes.capitol.texas.gov/'}]).stderr,/Invalid government source URL/));
test('rejects arbitrary source domains',()=>assert.match(run([{...source,url:'https://example.com/'}]).stderr,/Invalid government source URL/));
test('rejects unsupported statuses',()=>assert.match(run([{...source,status:'verified'}]).stderr,/Unknown source-check status/));
test('rejects more than 25 results',()=>assert.match(run(Array.from({length:26},(_,i)=>({...source,id:'source-'+i}))).stderr,/Expected 1 to 25/));
test('fails closed without service credentials',()=>assert.match(run([source],{SUPABASE_SERVICE_ROLE_KEY:''}).stderr,/requires SUPABASE_URL/));
