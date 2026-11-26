import { describe, it, expect } from 'vitest';
import { archiveDirectColdKind, validateDirectSnapshot } from './direct-cold-archive.mjs';
const id = '3';
const payload = JSON.stringify({format:'direct-cold-v1',project:'ftkznprjljkhymknvhye',kind:'feed',parent_ids:[id],records:{
  texas_news_feed:[{id:3,body:'exact'}],news_feed_normalization:[{feed_item_id:3}],newsroom_source_page_fetch_state:[],
}});
function fixture({publicBucket=false, corrupt=false, rejectTamper=true, rejectDry=false, snapshot=payload}={}) {
  const files = new Map(), calls = [];
  const db = {
    storage:{
      getBucket:async()=>({data:{id:'shared-postgres-cold-archives',public:publicBucket}}),
      from:()=>({
        upload:async(path,bytes,opts)=>{ expect(opts.upsert).toBe(false); files.set(path, Buffer.from(bytes)); return {data:{path}}; },
        download:async(path)=>({data:new Blob([corrupt ? Buffer.from('bad') : files.get(path)])}),
      }),
    },
    rpc:async(name,args)=>{
      if(name==='snapshot_direct_cold_records') return {data:snapshot};
      expect(name).toBe('verify_direct_cold_retirement');
      calls.push(args);
      if(args.p_payload!==snapshot && rejectTamper)
        return {error:{code:'P0001',message:'Direct manifest does not match snapshot'}};
      if(rejectDry && !args.p_retire) return {error:{code:'P0001',message:'Concurrent update'}};
      return {data:{verified:true,parents:1,retired:args.p_retire?1:0,manifest_name:args.p_manifest_name}};
    },
  };
  return {db,calls,files};
}
describe('direct private cold archive',()=>{
  it('rejects incomplete, foreign, duplicate, and malformed snapshots',()=>{
    expect(validateDirectSnapshot(payload,'feed',50)).toEqual({parents:1,rows:2});
    expect(()=>validateDirectSnapshot(payload,'newsroom',1)).toThrow();
    for(const mutate of [
      d=>d.parent_ids.push(id),d=>delete d.records.news_feed_normalization,
      d=>d.records.news_feed_normalization[0].feed_item_id=4,
      d=>d.records.texas_news_feed[0].id=4,d=>d.records.other=[],
    ]) { const d=JSON.parse(payload);mutate(d);expect(()=>validateDirectSnapshot(JSON.stringify(d),'feed',50)).toThrow(); }
    expect(()=>validateDirectSnapshot(payload,'feed',51)).toThrow();
  });
  it('reads both immutable objects and verifies tamper rejection, dry run and exact retirement in order',async()=>{
    const {db,calls,files}=fixture();
    const result=await archiveDirectColdKind(db,'feed',50,{retire:true});
    expect(result.retired).toBe(1);expect(result.rows).toBe(2);expect(files.size).toBe(2);
    expect(calls.map(c=>c.p_retire)).toEqual([false,false,true]);
    expect(calls[0].p_payload).toBe(payload+' ');expect(calls[1].p_payload).toBe(payload);
    expect(calls[2].p_payload).toBe(payload);
  });
  it('is read-only unless explicitly activated',async()=>{
    const {db,calls}=fixture();
    expect((await archiveDirectColdKind(db,'feed',50)).retired).toBe(0);
    expect(calls.every(c=>!c.p_retire)).toBe(true);
  });
  for(const flags of [{publicBucket:true},{corrupt:true},{rejectTamper:false},{rejectDry:true}]) {
    it('fails closed with '+JSON.stringify(flags),async()=>{
      const {db,calls}=fixture(flags);
      await expect(archiveDirectColdKind(db,'feed',50,{retire:true})).rejects.toThrow();
      expect(calls.some(c=>c.p_retire)).toBe(false);
    });
  }
});
