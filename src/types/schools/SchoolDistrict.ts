import type { RelocationLocation } from "@/types/relocation/location";
export interface SchoolDistrict extends RelocationLocation { districtId:string; districtType:"independent"|"consolidated"|"common"; website?:string; phone?:string; enrollment?:number; accountabilityRating?:"A"|"B"|"C"|"D"|"F"|"Not Rated"; gradeSpan?:string; }
