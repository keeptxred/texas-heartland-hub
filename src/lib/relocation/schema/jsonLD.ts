import type { JsonLdObject } from "@/types/relocation/schema";
export const serializeJsonLd=(value:JsonLdObject)=>JSON.stringify(value).replace(/</g,"\u003c");
