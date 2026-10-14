import { describe,expect,it } from "vitest";
import { partitionFeedLinkLookups } from "./ingest-link-lookup";

describe("bounded existing-link lookup", () => {
 it("never passes 100 long links in one PostgREST GET query", () => {
  const links=Array.from({length:1250}, (_,i)=>
    "https://news.google.com/articles/CBMiX2many-redirects-"+i+"?utm_campaign="+("txfeed".repeat(45)));
  const batches=partitionFeedLinkLookups(links);
  expect(batches.length).toBeGreaterThan(50);
  expect(batches.flatMap(b=>b.links)).toEqual(links);
  let offset=0;
  for(const batch of batches){
   expect(batch.offset).toBe(offset);
   expect(batch.links.length).toBeLessThanOrEqual(20);
   expect(batch.links.reduce((n,link)=>n+encodeURIComponent(link).length+6,0)).toBeLessThanOrEqual(2400);
   offset+=batch.links.length;
  }
 });
 it("splits small count of very long URLs by encoded request size",()=>{
  const links=Array.from({length:7},(_,i)=>"https://source.example/?query="+i+"%"+("p".repeat(1000)));
  const batches=partitionFeedLinkLookups(links);
  expect(batches.length).toBeGreaterThan(1);
  expect(batches.flatMap(x=>x.links)).toEqual(links);
 });
 it("retains all links, including repeats, so known-source attribution can be checked",()=>{
  const links=["https://one.example/x","https://two.example/y","https://one.example/x"];
  expect(partitionFeedLinkLookups(links,2,120).flatMap(b=>b.links)).toEqual(links);
 });
 it("handles empty input and validates limits",()=>{
  expect(partitionFeedLinkLookups([])).toEqual([]);
  expect(()=>partitionFeedLinkLookups(["x"],0)).toThrow();
  expect(()=>partitionFeedLinkLookups(["x"],5,0)).toThrow();
  expect(()=>partitionFeedLinkLookups([""])).toThrow();
 });
});
