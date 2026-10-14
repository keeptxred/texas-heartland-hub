import { describe, expect, it } from "vitest";
import { selectRotatedSourceWindow } from "./ingest-source-window";

const core = [{url:"https://gov.texas.gov/rss"},{url:"https://tx.gov/rss"}];
const supplemental = Array.from({length:29}, (_,i)=>({url:`https://news-${String(i).padStart(2,"0")}.example/rss`}));
const items = [...supplemental.slice(12),...core,...supplemental.slice(0,12)];

describe("ingest source window rotation",()=>{
 it("always includes every core feed without duplicating supplemental feeds",()=>{
  for(let slot=0;slot<8;slot++){
   const result=selectRotatedSourceWindow(items,new Set(core.map(x=>x.url)),12,slot);
   expect(result.selected.slice(0,2)).toEqual(core);
   expect(result.selected.length).toBeLessThanOrEqual(14);
   expect(new Set(result.selected.map(x=>x.url)).size).toBe(result.selected.length);
  }
 });
 it("exhausts every supplemental feed in exactly one complete rotation",()=>{
  const all=new Set<string>();
  for(let slot=0;slot<3;slot++){
   const win=selectRotatedSourceWindow(items,new Set(core.map(x=>x.url)),12,slot);
   expect(win.windows).toBe(3);
   for(const s of win.selected.slice(core.length)){
    expect(all.has(s.url)).toBe(false);
    all.add(s.url);
   }
  }
  expect(all).toEqual(new Set(supplemental.map(x=>x.url)));
 });
 it("uses deterministic windows even when the database order changes",()=>{
  const flags=new Set(core.map(x=>x.url));
  const first=selectRotatedSourceWindow(items,flags,12,11);
  const second=selectRotatedSourceWindow([...items].reverse(),flags,12,11);
  expect(first.selected.slice(2)).toEqual(second.selected.slice(2));
  expect(first.selected.slice(2)).toEqual(selectRotatedSourceWindow(items,flags,12,2).selected.slice(2));
 });
 it("rejects invalid limits and slots",()=>{
  expect(()=>selectRotatedSourceWindow(items,new Set(),0,0)).toThrow();
  expect(()=>selectRotatedSourceWindow(items,new Set(),12,-1)).toThrow();
 });
 it("works with no supplemental feeds",()=>{
  const result=selectRotatedSourceWindow(core,new Set(core.map(x=>x.url)),12,4);
  expect(result.selected).toEqual(core);
  expect(result.deferred).toBe(0);
 });
});
