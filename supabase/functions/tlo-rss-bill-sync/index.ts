import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const FEEDS=[
  ["house_meetings","https://capitol.texas.gov/MyTLO/RSS/RSS.aspx?Type=upcomingmeetingshouse","meeting","house",null],
  ["senate_meetings","https://capitol.texas.gov/MyTLO/RSS/RSS.aspx?Type=upcomingmeetingssenate","meeting","senate",null],
  ["bills_filed_house","https://capitol.texas.gov/MyTLO/RSS/RSS.aspx?Type=todaysfiledhouse","filed","house",null],
  ["bills_filed_senate","https://capitol.texas.gov/MyTLO/RSS/RSS.aspx?Type=todaysfiledsenate","filed","senate",null],
  ["bills_passed","https://capitol.texas.gov/MyTLO/RSS/RSS.aspx?Type=todaysbillspassed","passed",null,null],
  ["house_calendars","https://capitol.texas.gov/MyTLO/RSS/RSS.aspx?Type=upcomingcalendarshouse","calendar","house",null],
  ["senate_calendars","https://capitol.texas.gov/MyTLO/RSS/RSS.aspx?Type=upcomingcalendarssenate","calendar","senate",null],
  ["bill_text","https://capitol.texas.gov/MyTLO/RSS/RSS.aspx?Type=todaysbilltext","document",null,"bill_text"],
  ["fiscal_notes","https://capitol.texas.gov/MyTLO/RSS/RSS.aspx?Type=todaysfiscalnotes","document",null,"fiscal_note"],
  ["bill_analyses","https://capitol.texas.gov/MyTLO/RSS/RSS.aspx?Type=todaysbillanalyses","document",null,"analysis"],
] as const;

type Feed={key:string;url:string;kind:string;chamber:string|null;documentType:string|null};
type Item={title:string;link:string;description:string;pubDate:string;raw:string};
type BillRef={billType:string;billNumber:number;legislature?:number;sessionCode?:string};
const HEADERS={"User-Agent":"Mozilla/5.0 (compatible; KeepTXRedBot/1.9; +https://keeptxred.com)",Accept:"application/rss+xml,application/xml,text/xml,text/html,*/*"};
const BILL_RE=/\b(HB|SB|HJR|SJR|HCR|SCR|HR|SR)\s*(?:NO\.?\s*)?(\d{1,5})\b/gi;
const SESSION_RE=/(?:LegSess|Legislature|Session)[=:\s%22'\"]*(\d{2})(R|\d+)\b/i;
const TLO_SESSION_RE=/(?:\/tlodocs\/|[?&]LegSess=)(\d{2})(R|\d+)(?:\/|&|$)/i;

const decode=(value:string)=>value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi,"$1").replace(/&amp;/gi,"&").replace(/&quot;/gi,'"').replace(/&#39;|&apos;/gi,"'").replace(/&lt;/gi,"<").replace(/&gt;/gi,">").replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();
const pick=(block:string,tag:string)=>decode(block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`,`i`))?.[1]||"");
const parse=(xml:string):Item[]=>(xml.match(/<item\b[\s\S]*?<\/item>/gi)||[]).slice(0,100).map((raw)=>({title:pick(raw,"title"),link:pick(raw,"link"),description:pick(raw,"description"),pubDate:pick(raw,"pubDate"),raw}));
const safeDecode=(value:string)=>{try{return decodeURIComponent(value);}catch{return value;}};
const dateOnly=(value:string)=>{const date=new Date(value||Date.now());return Number.isNaN(date.getTime())?new Date().toISOString().slice(0,10):date.toISOString().slice(0,10);};
const eventDate=(text:string,fallback:string)=>{const m=text.match(/\b(\d{1,2})\/(\d{1,2})\/(20\d{2})\b/);return m?`${m[3]}-${m[1].padStart(2,"0")}-${m[2].padStart(2,"0")}`:dateOnly(fallback);};
const hash=(value:string)=>{let h=2166136261;for(let i=0;i<value.length;i++){h^=value.charCodeAt(i);h=Math.imul(h,16777619);}return 100000+((h>>>0)%800000000);};
const normalizeName=(value:string)=>value.toLowerCase().replace(/\b(committee|on)\b/g," ").replace(/[^a-z0-9]+/g," ").replace(/\s+/g," ").trim();
const same=(a:any,b:any)=>(a??null)===(b??null);
const sameJson=(a:any,b:any)=>JSON.stringify(a??{})===JSON.stringify(b??{});
const errorText=(error:any)=>error instanceof Error?error.message:(typeof error?.message==="string"?error.message:JSON.stringify(error));

function refs(text:string):BillRef[]{
  const decoded=safeDecode(text),sessionMatch=decoded.match(SESSION_RE)||decoded.match(TLO_SESSION_RE),session=sessionMatch?{legislature:Number(sessionMatch[1]),sessionCode:sessionMatch[2].toUpperCase()}:null,out=new Map<string,BillRef>();
  for(const match of decoded.matchAll(BILL_RE)){const ref={billType:match[1].toLowerCase(),billNumber:Number(match[2]),...(session||{})};out.set(`${ref.legislature||""}:${ref.sessionCode||""}:${ref.billType}:${ref.billNumber}`,ref);}
  for(const match of decoded.matchAll(/(?:Bill|bill)=((?:HB|SB|HJR|SJR|HCR|SCR|HR|SR)\d{1,5})/gi)){const parts=match[1].match(/^([A-Z]+)(\d+)$/i);if(parts){const ref={billType:parts[1].toLowerCase(),billNumber:Number(parts[2]),...(session||{})};out.set(`${ref.legislature||""}:${ref.sessionCode||""}:${ref.billType}:${ref.billNumber}`,ref);}}
  return [...out.values()];
}

async function getText(url:string,timeout=20000){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeout);try{const response=await fetch(url,{headers:HEADERS,redirect:"follow",signal:controller.signal});return{ok:response.ok,status:response.status,text:response.ok?await response.text():""};}finally{clearTimeout(timer);}}

Deno.serve(async(request)=>{
  if(request.method!=="POST")return Response.json({error:"POST required"},{status:405});
  const url=Deno.env.get("SUPABASE_URL"),key=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");if(!url||!key)return Response.json({error:"config missing"},{status:500});
  const db=createClient(url,key,{auth:{persistSession:false}}),sourceKey="tlo-rss-bill-sync",now=new Date().toISOString();
  const{data:prior}=await db.from("legislative_sync_runs").select("started_at,status").eq("source_key",sourceKey).order("started_at",{ascending:false}).limit(1).maybeSingle();
  if(prior?.started_at&&Date.now()-new Date(prior.started_at).getTime()<5*60*1000)return Response.json({ok:true,skipped:true,reason:"rate-limited",prior});
  const{data:session}=await db.from("legislative_sessions").select("legislature_number,session_code").order("legislature_number",{ascending:false}).limit(1).maybeSingle();
  const{data:run,error:runError}=await db.from("legislative_sync_runs").insert({source_key:sourceKey,legislature_number:session?.legislature_number||89,session_code:session?.session_code||"R",status:"running"}).select("id").single();
  if(runError||!run)return Response.json({error:runError?.message||"run start failed"},{status:500});

  const stats:any={
    feeds:{},items:0,matched_bill_refs:0,missing_bills:0,
    documents_inserted:0,documents_existing:0,
    actions_upserted:0,actions_inserted:0,actions_updated:0,actions_existing:0,
    committee_events_inserted:0,
    opportunities_upserted:0,opportunities_inserted:0,opportunities_updated:0,opportunities_existing:0,
    bill_links_updated:0,bill_freshness_updates:0,linked_pages_fetched:0
  };
  const warnings:string[]=[],samples:any[]=[],billCache=new Map<string,any>(),committeeCache=new Map<string,any[]>(),freshBillIds=new Set<string>();

  const findBill=async(ref:BillRef)=>{const cacheKey=`${ref.legislature||"*"}:${ref.sessionCode||"*"}:${ref.billType}:${ref.billNumber}`;if(billCache.has(cacheKey))return billCache.get(cacheKey);let query=db.from("bills").select("id,legislature_number,session_code,bill_type,bill_number,bill_identifier,caption,last_action_date,bill_text_url,analysis_url,fiscal_note_url").eq("bill_type",ref.billType).eq("bill_number",ref.billNumber).eq("is_active",true);if(ref.legislature)query=query.eq("legislature_number",ref.legislature);if(ref.sessionCode)query=query.eq("session_code",ref.sessionCode);const{data,error}=await query.order("legislature_number",{ascending:false}).order("last_action_date",{ascending:false,nullsFirst:false}).limit(20);if(error)throw error;const bill=data?.[0]||null;billCache.set(cacheKey,bill);return bill;};
  const matchCommittee=async(bill:any,chamber:string|null,name:string)=>{const cacheKey=`${bill.legislature_number}:${bill.session_code}:${chamber||""}`;if(!committeeCache.has(cacheKey)){let query=db.from("legislative_committees").select("id,committee_name,chamber").eq("legislature_number",bill.legislature_number).eq("session_code",bill.session_code);if(chamber)query=query.eq("chamber",chamber);const{data}=await query;committeeCache.set(cacheKey,data||[]);}const target=normalizeName(name);return(committeeCache.get(cacheKey)||[]).find((committee:any)=>{const normalized=normalizeName(committee.committee_name||"");return normalized===target||normalized.includes(target)||target.includes(normalized);})||null;};
  const committeeLabel=(item:Item,chamber:string|null)=>item.title.replace(/\s*-\s*\d{1,2}\/\d{1,2}\/20\d{2}.*$/," ").trim()||`${chamber||""} committee`;

  async function upsertAction(bill:any,feed:Feed,item:Item,date:string,committeeId:string|null){
    let text=item.title,status="official-update";
    if(feed.kind==="filed"){text=`Filed: ${item.title}`;status="filed";}
    if(feed.kind==="passed"){text=`TLO bills-passed update: ${item.title}`;status="passed";}
    if(feed.kind==="calendar"){text=`Scheduled on ${feed.chamber==="senate"?"Senate":"House"} calendar: ${item.title}`;status="scheduled-for-calendar";}
    if(feed.kind==="meeting"){text=`Scheduled for ${feed.chamber==="senate"?"Senate":"House"} committee hearing: ${item.title}`;status="scheduled-for-hearing";}
    const sourceUrl=item.link||feed.url,actionCode=`tlo-rss-${feed.kind}`;
    const identity={bill_id:bill.id,action_date:date,action_sequence:hash(`${feed.key}|${item.link}|${bill.id}`),action_text:text.slice(0,1000)};
    const desired={chamber:feed.chamber,action_code:actionCode,normalized_status:status,committee_id:committeeId,source_url:sourceUrl};
    const{data:existing,error:findError}=await db.from("bill_actions")
      .select("id,action_date,action_sequence,action_text,chamber,action_code,normalized_status,committee_id,source_url")
      .eq("bill_id",bill.id).eq("source_url",sourceUrl).eq("action_code",actionCode).eq("action_sequence",identity.action_sequence).limit(1).maybeSingle();
    if(findError)throw findError;
    freshBillIds.add(bill.id);
    if(existing){
      const classificationLocked=existing.normalized_status==="interim-oversight"||String(existing.action_text||"").startsWith("Interim oversight hearing reference:");
      const patch:any={};
      if(!same(existing.chamber,desired.chamber))patch.chamber=desired.chamber;
      if(!same(existing.committee_id,desired.committee_id))patch.committee_id=desired.committee_id;
      if(!classificationLocked){
        if(!same(existing.action_date,identity.action_date))patch.action_date=identity.action_date;
        if(!same(existing.action_text,identity.action_text))patch.action_text=identity.action_text;
        if(!same(existing.normalized_status,desired.normalized_status))patch.normalized_status=desired.normalized_status;
      }
      if(Object.keys(patch).length){const{error}=await db.from("bill_actions").update({...patch,updated_at:now}).eq("id",existing.id);if(error)throw error;stats.actions_updated++;stats.actions_upserted++;}
      else stats.actions_existing++;
      return existing.id;
    }
    const{data:exact,error:exactError}=await db.from("bill_actions").select("id").eq("bill_id",identity.bill_id).eq("action_date",identity.action_date).eq("action_sequence",identity.action_sequence).eq("action_text",identity.action_text).limit(1).maybeSingle();
    if(exactError)throw exactError;
    if(exact?.id){stats.actions_existing++;return exact.id;}
    const{data,error}=await db.from("bill_actions").insert({...identity,...desired,updated_at:now}).select("id").single();if(error)throw error;
    stats.actions_inserted++;stats.actions_upserted++;return data?.id||null;
  }

  async function upsertOpportunity(bill:any,feed:Feed,item:Item,date:string,actionId:string|null){
    const mapping:any={filed:["filed",45],passed:["passed",82],meeting:["committee-hearing",68]},mapped=mapping[feed.kind];if(!mapped)return;
    const dedupeKey=`${sourceKey}:${feed.key}:${bill.id}:${item.link||item.title}`.slice(0,1800);
    const metadata={source:"Texas Legislature Online RSS",feed_key:feed.key,feed_url:feed.url,rss_title:item.title};
    const desired={bill_id:bill.id,action_id:actionId,event_type:mapped[0],event_date:date,headline:`${bill.bill_identifier}: ${item.title}`.slice(0,500),summary:(item.description||`${feed.key} update from Texas Legislature Online`).slice(0,1600),priority:mapped[1],source_url:item.link||feed.url,dedupe_key:dedupeKey,metadata};
    const{data:existing,error:findError}=await db.from("legislative_content_opportunities").select("id,bill_id,action_id,event_type,event_date,headline,summary,priority,source_url,metadata,status").eq("dedupe_key",dedupeKey).limit(1).maybeSingle();
    if(findError)throw findError;
    if(!existing){const{error}=await db.from("legislative_content_opportunities").insert({...desired,status:"new",updated_at:now});if(error)throw error;stats.opportunities_inserted++;stats.opportunities_upserted++;return;}
    const changed=!same(existing.bill_id,desired.bill_id)||!same(existing.action_id,desired.action_id)||!same(existing.event_type,desired.event_type)||!same(existing.event_date,desired.event_date)||!same(existing.headline,desired.headline)||!same(existing.summary,desired.summary)||!same(existing.priority,desired.priority)||!same(existing.source_url,desired.source_url)||!sameJson(existing.metadata,desired.metadata);
    if(changed){const{error}=await db.from("legislative_content_opportunities").update({...desired,status:existing.status,updated_at:now}).eq("id",existing.id);if(error)throw error;stats.opportunities_updated++;stats.opportunities_upserted++;}
    else stats.opportunities_existing++;
  }

  async function upsertDocument(bill:any,feed:Feed,item:Item,date:string){
    const documentUrl=item.link||feed.url,{data:existing,error:findError}=await db.from("bill_documents").select("id").eq("bill_id",bill.id).eq("document_url",documentUrl).limit(1).maybeSingle();if(findError)throw findError;
    freshBillIds.add(bill.id);
    if(existing?.id)stats.documents_existing++;
    else{
      const format=/\.pdf(?:$|\?)/i.test(documentUrl)?"pdf":/\.html?/i.test(documentUrl)?"html":null,{error}=await db.from("bill_documents").insert({bill_id:bill.id,document_type:feed.documentType,document_title:(item.title||`${bill.bill_identifier} ${feed.documentType}`).slice(0,500),document_date:date,document_url:documentUrl,file_format:format,source_key:sourceKey,source_record_key:`${feed.key}:${documentUrl}`,legislature_number:bill.legislature_number,session_code:bill.session_code,bill_type:bill.bill_type,bill_number:bill.bill_number,source_html_url:format==="html"?documentUrl:null,source_pdf_url:format==="pdf"?documentUrl:null,metadata:{source:"Texas Legislature Online RSS",feed_key:feed.key,feed_url:feed.url,rss_description:item.description,rss_pub_date:item.pubDate},last_seen_at:now,last_imported_at:now,updated_at:now});
      if(error&&!String(error.message).toLowerCase().includes("duplicate"))throw error;if(!error)stats.documents_inserted++;
    }
    const field=feed.documentType==="bill_text"?"bill_text_url":feed.documentType==="analysis"?"analysis_url":feed.documentType==="fiscal_note"?"fiscal_note_url":null;
    if(field&&bill[field]!==documentUrl){const{error}=await db.from("bills").update({[field]:documentUrl}).eq("id",bill.id);if(error)throw error;bill[field]=documentUrl;stats.bill_links_updated++;}
  }

  try{
    for(const tuple of FEEDS){
      const feed:Feed={key:tuple[0],url:tuple[1],kind:tuple[2],chamber:tuple[3],documentType:tuple[4]};
      let response;try{response=await getText(feed.url,25000);}catch(error){warnings.push(`${feed.key}: ${errorText(error)}`);stats.feeds[feed.key]={status:0,items:0};continue;}
      if(!response.ok){warnings.push(`${feed.key}: HTTP ${response.status}`);stats.feeds[feed.key]={status:response.status,items:0};continue;}
      const items=parse(response.text);stats.items+=items.length;stats.feeds[feed.key]={status:200,items:items.length,matched_items:0};
      for(const item of items){
        let context=`${item.title}\n${item.description}\n${item.link}\n${item.raw}`,billRefs=refs(context);
        if((feed.kind==="meeting"||feed.kind==="calendar")&&billRefs.length===0&&item.link&&/capitol\.texas\.gov/i.test(item.link)){
          try{const linked=await getText(item.link,12000);if(linked.ok&&linked.text){stats.linked_pages_fetched++;context+=`\n${linked.text}`;billRefs=refs(context);}}
          catch(error){warnings.push(`${feed.key} linked page: ${errorText(error)}`);}
        }
        if(!billRefs.length)continue;stats.feeds[feed.key].matched_items++;
        const date=eventDate(`${item.title} ${item.description}`,item.pubDate),unique=new Map(billRefs.map((ref)=>[`${ref.legislature||""}:${ref.sessionCode||""}:${ref.billType}:${ref.billNumber}`,ref]));
        for(const ref of unique.values()){
          stats.matched_bill_refs++;const bill=await findBill(ref);
          if(!bill){stats.missing_bills++;if(samples.length<12)samples.push({feed:feed.key,title:item.title,ref,matched:false});continue;}
          freshBillIds.add(bill.id);
          if(samples.length<12)samples.push({feed:feed.key,title:item.title,bill:bill.bill_identifier,legislature:bill.legislature_number,session:bill.session_code,matched:true});
          if(feed.kind==="document"){await upsertDocument(bill,feed,item,date);continue;}
          let committeeId:string|null=null;
          if(feed.kind==="meeting"){
            const name=committeeLabel(item,feed.chamber),committee=await matchCommittee(bill,feed.chamber,name);committeeId=committee?.id||null;
            const{data:existing,error:findError}=await db.from("bill_committee_history").select("id").eq("bill_id",bill.id).eq("source_url",item.link||feed.url).eq("action_type","hearing").limit(1).maybeSingle();if(findError)throw findError;
            if(!existing?.id){const{error}=await db.from("bill_committee_history").insert({bill_id:bill.id,committee_id:committeeId,chamber:feed.chamber,committee_name:committee?.committee_name||name,action_type:"hearing",action_description:item.title.slice(0,1000),hearing_date:date,sequence:hash(`${feed.key}:${item.link}:${bill.id}`),source_url:item.link||feed.url,updated_at:now});if(error)throw error;stats.committee_events_inserted++;}
          }
          const actionId=await upsertAction(bill,feed,item,date,committeeId);await upsertOpportunity(bill,feed,item,date,actionId);
        }
      }
    }

    if(freshBillIds.size){const{error}=await db.from("bills").update({last_synced_at:now}).in("id",[...freshBillIds]);if(error)throw error;stats.bill_freshness_updates=freshBillIds.size;}
    const changed=stats.documents_inserted+stats.actions_upserted+stats.committee_events_inserted+stats.opportunities_upserted+stats.bill_links_updated+stats.bill_freshness_updates;
    await db.from("legislative_sync_runs").update({completed_at:new Date().toISOString(),status:warnings.length?"completed_with_warnings":"completed",records_seen:stats.items,records_changed:changed,cursor_after:stats,errors:warnings}).eq("id",run.id);
    return Response.json({ok:true,run_id:run.id,stats,warnings,samples});
  }catch(error){
    const message=errorText(error);warnings.push(message);
    await db.from("legislative_sync_runs").update({completed_at:new Date().toISOString(),status:"failed",records_seen:stats.items,cursor_after:stats,errors:warnings}).eq("id",run.id);
    return Response.json({ok:false,error:message,stats,warnings,samples},{status:500});
  }
});