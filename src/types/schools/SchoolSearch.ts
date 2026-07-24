import type { SearchRequest, SearchResponse } from "@/types/relocation/search";
import type { SchoolDistrict } from "./SchoolDistrict";
export interface SchoolSearchFilters { city?:string; county?:string; zipCode?:string; minimumRating?:"A"|"B"|"C"|"D"|"F"; }
export interface SchoolSearchRequest extends Omit<SearchRequest,"filters"> { filters?:SchoolSearchFilters; }
export type SchoolSearchResponse=SearchResponse<SchoolDistrict>;
