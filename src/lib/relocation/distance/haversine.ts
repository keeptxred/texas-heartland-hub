import type { Coordinates } from "@/types/relocation/location";
const radians=(degrees:number)=>degrees*Math.PI/180;
export function haversineMiles(a:Coordinates,b:Coordinates){ const earth=3958.8,dLat=radians(b.latitude-a.latitude),dLon=radians(b.longitude-a.longitude); const x=Math.sin(dLat/2)**2+Math.cos(radians(a.latitude))*Math.cos(radians(b.latitude))*Math.sin(dLon/2)**2; return earth*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x)); }
