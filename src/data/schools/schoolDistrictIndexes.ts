import { texasSchoolDistricts } from "./texasSchoolDistricts";
export const schoolDistrictById=new Map(texasSchoolDistricts.map(district=>[district.id,district]));
export const schoolDistrictsByCounty=Map.groupBy(texasSchoolDistricts,district=>district.county??"");
