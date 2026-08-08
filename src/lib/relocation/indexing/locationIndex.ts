import type { RelocationLocation } from "@/types/relocation/location";
import type { DatasetIndexEntry } from "@/types/relocation/dataset";
export const toLocationIndexEntry=(item:RelocationLocation):DatasetIndexEntry=>({id:item.id,searchText:[item.name,item.city,item.county,...item.zipCodes].filter(Boolean).join(" "),city:item.city,county:item.county,zipCodes:item.zipCodes});
