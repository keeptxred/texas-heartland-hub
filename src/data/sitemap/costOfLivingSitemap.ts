export const costOfLivingSitemap={url:"https://keeptxred.com/texas-cost-of-living-calculator",lastModified:new Date().toISOString(),changeFrequency:"monthly",priority:.95};
export const generateCityCostPages=(cities:string[])=>cities.map(city=>({url:`https://keeptxred.com/${city}-cost-of-living-calculator`,lastModified:new Date().toISOString(),changeFrequency:"monthly",priority:.85}));
