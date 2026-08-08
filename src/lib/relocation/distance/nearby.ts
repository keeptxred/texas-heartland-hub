import type { Coordinates, RelocationLocation } from "@/types/relocation/location";
import { haversineMiles } from "./haversine";
export function findNearby<T extends RelocationLocation>(items:T[],origin:Coordinates,limit=10,maxMiles=100){ return items.filter(item=>item.coordinates).map(item=>({item,distanceMiles:haversineMiles(origin,item.coordinates!)})).filter(row=>row.distanceMiles<=maxMiles).sort((a,b)=>a.distanceMiles-b.distanceMiles).slice(0,limit); }
