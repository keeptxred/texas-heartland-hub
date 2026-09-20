import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

type Chamber = "house" | "senate";
type Measure = { billType:string; billNumber:number; chamber:Chamber; caption:string; authors:string[]; sponsors:string[]; lastActionRaw:string; lastActionDate:string|null; statusCode:string; statusLabel:string; becameLaw:boolean; sourceUrl:string; billTextUrl:string };

const UA = "Mozilla/5.0 (compatible; KeepTXRed/1.0; +https://keeptxred.com)";
const MEASURE_RE = /^(HB|HCR|HJR|HR|SB|SCR|SJR|SR)\s+(\d+)$/i;
const LABEL_RE = /^(Author|Sponsor|Last Action|Caption)\s*:?\s*$/i;
const ENTITIES:Record<string,string> = {amp:"&",quot:'"',apos:"'",lt:"<",gt:">",nbsp:" ",iacute:"í",Iacute:"Í",aacute:"á",Aacute:"Á",eacute:"é",Eacute:"É",oacute:"ó",Oacute:"Ó",uacute:"ú",Uacute:"Ú",ntilde:"ñ",Ntilde:"Ñ",uuml:"ü",Uuml:"Ü"};

function decodeHtml(value:string) { return value.replace(/&#x([0-9a-f]+);/gi,(_,c)=>String.fromCodePoint(parseInt(c,16))).replace(/&#(\d+);/g,(_,c)=>String.fromCodePoint(Number(c))).replace(/&([a-z]+);/gi,(m,n)=>ENTITIES[n]??m).replace(/\u00a0/g," "); }
function htmlToLines(html:string) {
  let source=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi," ").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi," ");
  source=source.replace(/<br\s*\/?\s*>/gi,"\n").replace(/<(?:tr|td|th|p|div|li|h[1-6]|section|article|center|a|span)\b[^>]*>/gi,"\n").replace(/<\/(?:tr|td|th|p|div|li|h[1-6]|table|tbody|thead|section|article|center|a|span)>/gi,"\n").replace(/<[^>]+>/g," ");
  return decodeHtml(source).replace(/\r/g,"").split("\n").map((line)=>line.replace(/[\t\f\v ]+/g," ").trim()).filter(Boolean);
}
function normalizeTokens(lines:string[]) {
  const out:string[]=[];
  for(const line of lines){
    const compact=line.replace(/\s+/g," ").trim(); if(compact===":") continue;
    const measure=compact.match(/^(HB|HCR|HJR|HR|SB|SCR|SJR|SR)\s*(\d+)(.*)$/i);
    if(measure){out.push(`${measure[1].toUpperCase()} ${measure[2]}`);if(measure[3].trim())out.push(measure[3].trim());continue;}
    const label=compact.match(/^(Author|Sponsor|Last Action|Caption)\s*:?\s*$/i); if(label){out.push(`${label[1]}:`);continue;}
    const inline=compact.match(/^(Author|Sponsor|Last Action|Caption)\s*:\s*(.+)$/i); if(inline){out.push(`${inline[1]}:`);out.push(inline[2].trim());continue;}
    out.push(compact);
  }
  return out;
}
function cleanPeople(raw:string){const seen=new Set<string>();const out:string[]=[];for(const name of raw.split("|").map((v)=>v.trim()).filter(Boolean)){if(/^et al\.?$/i.test(name)||seen.has(name))continue;seen.add(name);out.push(name);}return out;}
function toIsoDate(raw:string){const m=raw.match(/\b(\d{2})\/(\d{2})\/(\d{4})\b/);return m?`${m[3]}-${m[1]}-${m[2]}`:null;}
function normalizeStatus(raw:string){const text=raw.replace(/^\s*\d{2}\/\d{2}\/\d{4}\s+[HSE]\s*/i,"").trim();if(/vetoed by the governor/i.test(text))return{code:"vetoed",label:"Vetoed by the Governor",law:false};if(/effective/i.test(text))return{code:"effective",label:text||"Effective",law:true};if(/signed by the governor|signed by governor/i.test(text))return{code:"signed",label:text||"Signed by the Governor",law:true};if(/filed with the secretary of state/i.test(text))return{code:"filed_with_sos",label:text,law:false};if(/passed|adopted/i.test(text))return{code:"passed",label:text,law:false};if(/filed$/i.test(text))return{code:"filed",label:"Filed",law:false};return{code:"latest_action",label:text||"Filed",law:false};}
function historyUrl(type:string,number:number,session:string){return `https://capitol.texas.gov/billlookup/History.aspx?LegSess=${session}&Bill=${type}${number}`;}
function textUrl(type:string,number:number,session:string){return `https://capitol.texas.gov/billlookup/Text.aspx?LegSess=${session}&Bill=${type}${number}`;}
function parseReport(html:string,chamber:Chamber,session:string){
  const lines=normalizeTokens(htmlToLines(html)); const expectedMatch=lines.join("\n").match(/Number of Bills:\s*([\d,]+)/i); const expected=expectedMatch?Number(expectedMatch[1].replace(/,/g,"")):null; const starts:number[]=[];
  for(let i=0;i<lines.length;i++)if(MEASURE_RE.test(lines[i]))starts.push(i);
  const measures:Measure[]=[];
  for(let block=0;block<starts.length;block++){
    const start=starts[block],end=block+1<starts.length?starts[block+1]:lines.length,id=lines[start].match(MEASURE_RE);if(!id)continue;
    const type=id[1].toUpperCase(),number=Number(id[2]),fields:Record<string,string[]>={"Author:":[],"Sponsor:":[],"Last Action:":[],"Caption:":[]};let current:string|null=null;
    for(let i=start+1;i<end;i++){const label=lines[i].match(LABEL_RE);if(label){current=`${label[1]}:`;continue;}if(current&&fields[current])fields[current].push(lines[i]);}
    const caption=fields["Caption:"].join(" ").replace(/\s+/g," ").trim();if(!caption)continue;const lastActionRaw=fields["Last Action:"].join(" ").replace(/\s+/g," ").trim();const status=normalizeStatus(lastActionRaw);
    measures.push({billType:type.toLowerCase(),billNumber:number,chamber,caption,authors:cleanPeople(fields["Author:"].join(" ")),sponsors:cleanPeople(fields["Sponsor:"].join(" ")),lastActionRaw,lastActionDate:toIsoDate(lastActionRaw),statusCode:status.code,statusLabel:status.label,becameLaw:status.law,sourceUrl:historyUrl(type,number,session),billTextUrl:textUrl(type,number,session)});
  }
  return {expected,measures};
}
function normalizeSession(raw:string){const session=raw.trim().toUpperCase(),m=session.match(/^(\d{2})(R|\d+)$/);if(!m)throw new Error(`Unsupported session ${raw}`);return{session,legislature:Number(m[1]),sessionCode:m[2]};}
function slugify(name:string){return name.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");}
function chunks<T>(values:T[],size:number){const out:T[][]=[];for(let i=0;i<values.length;i+=size)out.push(values.slice(i,i+size));return out;}
async function fetchReport(chamber:Chamber,session:string){const name=chamber==="house"?"housefiled":"senatefiled";for(const url of [`https://capitol.texas.gov/tlodocs/${session}/reports/${name}.htm`,`https://capitol.texas.gov/reports/Report.aspx?ID=${name}&LegSess=${session}`]){const response=await fetch(url,{headers:{"user-agent":UA,accept:"text/html,application/xhtml+xml"},redirect:"follow"});const html=await response.text(),parsed=parseReport(html,chamber,session);if(response.ok&&parsed.measures.length)return{...parsed,url:response.url};}throw new Error(`No ${chamber} measures parsed for ${session}`);}

Deno.serve(async(request)=>{
  if(request.method!=="POST")return Response.json({error:"POST required"},{status:405});
  const url=Deno.env.get("SUPABASE_URL"),key=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");if(!url||!key)return Response.json({error:"Supabase configuration missing"},{status:500});
  const db=createClient(url,key,{auth:{persistSession:false}});
  try{
    const body=await request.json().catch(()=>({}));const{session,legislature,sessionCode}=normalizeSession(String(body.session||"89R"));const dryRun=body.dry_run!==false;
    const[house,senate]=await Promise.all([fetchReport("house",session),fetchReport("senate",session)]);const measures=[...house.measures,...senate.measures],expected=(house.expected??0)+(senate.expected??0);
    if(expected&&measures.length!==expected)throw new Error(`Parser count mismatch parsed=${measures.length} expected=${expected}`);
    const typeCounts=Object.fromEntries([...new Set(measures.map((m)=>m.billType))].sort().map((type)=>[type,measures.filter((m)=>m.billType===type).length]));
    if(dryRun)return Response.json({ok:true,dry_run:true,session,expected,parsed:measures.length,house:{expected:house.expected,parsed:house.measures.length,source:house.url},senate:{expected:senate.expected,parsed:senate.measures.length,source:senate.url},type_counts:typeCounts});
    const{data:sessionRow,error:sessionError}=await db.from("legislative_sessions").select("id").eq("legislature_number",legislature).eq("session_code",sessionCode).maybeSingle();if(sessionError)throw sessionError;if(!sessionRow)throw new Error(`Missing session ${session}`);
    const existing=new Set<string>();for(let from=0;;from+=1000){const{data,error}=await db.from("bills").select("bill_type,bill_number").eq("legislature_number",legislature).eq("session_code",sessionCode).range(from,from+999);if(error)throw error;for(const row of data??[])existing.add(`${String(row.bill_type).toLowerCase()}:${row.bill_number}`);if((data??[]).length<1000)break;}
    const missing=measures.filter((m)=>!existing.has(`${m.billType}:${m.billNumber}`)),preexisting=measures.length-missing.length;let created=0,actions=0,sponsors=0;
    for(const batch of chunks(missing,250)){
      const now=new Date().toISOString(),payload=batch.map((m)=>({legislative_session_id:sessionRow.id,legislature_number:legislature,session_code:sessionCode,bill_type:m.billType,bill_number:m.billNumber,chamber:m.chamber,caption:m.caption,current_status_code:m.statusCode,current_status_label:m.statusLabel,last_action_date:m.lastActionDate,became_law:m.becameLaw,source_url:m.sourceUrl,bill_text_url:m.billTextUrl,is_active:true,last_synced_at:now,updated_at:now}));
      const{data:rows,error}=await db.from("bills").upsert(payload,{onConflict:"legislature_number,session_code,bill_type,bill_number",ignoreDuplicates:true}).select("id,bill_type,bill_number");if(error)throw error;created+=(rows??[]).length;
      const ids=new Map((rows??[]).map((row:any)=>[`${String(row.bill_type).toLowerCase()}:${row.bill_number}`,row.id])),actionRows:any[]=[],sponsorRows:any[]=[];
      for(const m of batch){const billId=ids.get(`${m.billType}:${m.billNumber}`);if(!billId)continue;if(m.lastActionDate&&m.lastActionRaw)actionRows.push({bill_id:billId,action_date:m.lastActionDate,action_sequence:900000,chamber:m.chamber,action_code:"tlo-filed-report-latest",action_text:m.lastActionRaw.replace(/^\d{2}\/\d{2}\/\d{4}\s+[HSE]\s*/i,"").trim()||m.statusLabel,normalized_status:m.statusCode,source_url:m.sourceUrl});let sequence=0;for(const name of m.authors)sponsorRows.push({bill_id:billId,sponsor_name:name,sponsor_slug:slugify(name),sponsor_role:"author",chamber:m.chamber,sequence:sequence++});sequence=0;const other:Chamber=m.chamber==="house"?"senate":"house";for(const name of m.sponsors)sponsorRows.push({bill_id:billId,sponsor_name:name,sponsor_slug:slugify(name),sponsor_role:"sponsor",chamber:other,sequence:sequence++});}
      if(actionRows.length){const{error}=await db.from("bill_actions").upsert(actionRows,{onConflict:"bill_id,action_date,action_sequence,action_text",ignoreDuplicates:true});if(error)throw error;actions+=actionRows.length;}
      if(sponsorRows.length){const{error}=await db.from("bill_sponsors").upsert(sponsorRows,{onConflict:"bill_id,representative_id,external_legislator_id,sponsor_name,sponsor_role",ignoreDuplicates:true});if(error)throw error;sponsors+=sponsorRows.length;}
    }
    return Response.json({ok:true,dry_run:false,session,expected,parsed:measures.length,type_counts:typeCounts,preexisting,missing:missing.length,created,seeded_latest_actions:actions,seeded_visible_authors_sponsors:sponsors});
  }catch(error){return Response.json({ok:false,error:error instanceof Error?error.message:String(error)},{status:500});}
});
