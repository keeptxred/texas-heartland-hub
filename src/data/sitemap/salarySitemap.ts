export const salarySitemap={url:"https://keeptxred.com/texas-salary-calculator",lastModified:new Date().toISOString(),changeFrequency:"monthly",priority:.95};
export const generateSalaryLocationPages=(locations:string[])=>locations.map(location=>({url:`https://keeptxred.com/${location}-salary-calculator`,lastModified:new Date().toISOString(),changeFrequency:"monthly",priority:.85}));
