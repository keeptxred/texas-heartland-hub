export const normalizeCountyName=(value:string)=>value.trim().replace(/\s+county$/i,"").replace(/\b\w/g,char=>char.toUpperCase());
export const countySlug=(value:string)=>normalizeCountyName(value).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
