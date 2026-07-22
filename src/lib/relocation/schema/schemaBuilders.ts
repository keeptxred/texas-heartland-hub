import type { RelocationLocation } from "@/types/relocation/location";
import type { JsonLdObject } from "@/types/relocation/schema";
export const buildFinderSchema=(name:string,description:string,url:string):JsonLdObject=>({"@context":"https://schema.org","@type":"WebApplication",name,description,url,applicationCategory:"ReferenceApplication",operatingSystem:"Any"});
export const buildLocationSchema=(location:RelocationLocation,url:string):JsonLdObject=>({"@context":"https://schema.org","@type":"Place",name:location.name,url,address:{"@type":"PostalAddress",addressLocality:location.city??"",addressRegion:"TX",addressCountry:"US"}});
