import {createClient} from '@supabase/supabase-js';
const project='ftkznprjljkhymknvhye';
const url='https://'+project+'.supabase.co';
const key=process.env.SUPABASE_SERVICE_ROLE_KEY||process.env.KEEP_TX_RED_SUPABASE_SERVICE_ROLE_KEY;
const github=process.env.GITHUB_TOKEN;
const repo=process.env.GITHUB_REPOSITORY;
if(!key||!github||repo!=='keeptxred/texas-heartland-hub') throw Error('Missing trusted credentials or unexpected repo');
const supabase=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
const {data,error}=await supabase.rpc('read_shared_free_tier_database_capacity');
if(error||!data||data.project_id!==project) throw Error('Capacity probe failed');
const bytes=Number(data.database_bytes);
if(!Number.isSafeInteger(bytes)||bytes<1) throw Error('Invalid database size');
const limit=500000000, headroom=limit-bytes;
const actual=bytes>=limit?'over_limit':bytes>=475e6?'urgent':bytes>=450e6?'critical':bytes>=400e6?'investigate':bytes>=375e6?'warning':'ok';
if(data.status!==actual) throw Error('Capacity status calculation mismatch');
console.log('Supabase database size: '+(bytes/1e6).toFixed(2)+' MB, threshold: '+actual);
const headers={'Authorization':'Bearer '+github,'Accept':'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json'};
async function githubRequest(path,method='GET',payload){
 const response=await fetch('https://api.github.com/repos/'+repo+path,{
  method,headers,body:payload?JSON.stringify(payload):undefined
 });
 if(!response.ok) throw Error('GitHub issues API failure: '+response.status);
 return response.json();
}
const title='Shared Supabase Free Tier Capacity Alert';
const found=await githubRequest('/issues?state=open&per_page=100');
const issue=found.find(x=>!x.pull_request&&x.title===title);
if(actual==='ok'){
 if(issue) {
  await githubRequest('/issues/'+issue.number+'/comments','POST',{body:'Recovered below warning level: '+(bytes/1e6).toFixed(2)+' MB. Closing the capacity alert.'});
  await githubRequest('/issues/'+issue.number,'PATCH',{state:'closed'});
 }
 console.log('Capacity healthy; no issue opened.');
}else{
 const body=[
  '## Shared Supabase Free Tier capacity watch',
  '- Status: **'+actual.toUpperCase()+'**',
  '- PostgreSQL database: **'+(bytes/1e6).toFixed(2)+' MB**',
  '- Strict 500 MB limit; headroom: **'+(headroom/1e6).toFixed(2)+' MB**',
  '- Checked: '+data.measured_at,
  '- Project: `'+project+'`',
  '- Safeguard: Do not delete published articles, permanent government/property-tax records, or private archives lacking verified Storage exports.',
  '',
  '**Action:** Verify ingestion rate, cron success retention, cold archive export, and new stale-feed backlog. If at 475+ MB, prioritize immediate archival and investigate publishing pipeline safety.',
  '',
  'This issue is updated in place by a scheduled job; it will close after capacity returns below 375 MB.'
 ].join('\n');
 if(issue) await githubRequest('/issues/'+issue.number,'PATCH',{body});
 else await githubRequest('/issues','POST',{title,body,labels:[]});
}
