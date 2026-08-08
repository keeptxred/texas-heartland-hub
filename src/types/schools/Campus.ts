import type { Coordinates } from "@/types/relocation/location";
export interface Campus { id:string; districtId:string; name:string; campusType:"elementary"|"middle"|"high"|"other"; city:string; zipCode:string; coordinates?:Coordinates; enrollment?:number; accountabilityRating?:"A"|"B"|"C"|"D"|"F"|"Not Rated"; }
