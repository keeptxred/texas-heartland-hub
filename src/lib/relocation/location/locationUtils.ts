import type { RelocationLocation } from "@/types/relocation/location";
export const locationLabel=(location:RelocationLocation)=>[location.city,location.county?`${location.county} County`:undefined,"Texas"].filter(Boolean).join(", ");
export const locationMatches=(location:RelocationLocation,value:string)=>[location.name,location.city,location.county,...location.zipCodes].filter(Boolean).some(part=>String(part).toLowerCase()===value.toLowerCase());
