import { texasSchoolDistricts } from "@/data/schools/texasSchoolDistricts";
import { searchLocations } from "@/lib/relocation/search/searchEngine";
import type { SchoolSearchRequest, SchoolSearchResponse } from "@/types/schools/SchoolSearch";
export const searchSchoolDistricts=(request:SchoolSearchRequest):SchoolSearchResponse=>searchLocations(texasSchoolDistricts,{...request,filters:request.filters});
