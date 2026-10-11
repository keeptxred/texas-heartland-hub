import fs from 'node:fs';
import path from 'node:path';
const roots = ['src/routes'];
const paths = [];
function walk(dir) {
 for (const entry of fs.readdirSync(dir,{withFileTypes:true})) {
  const full=path.join(dir,entry.name);
  if(entry.isDirectory()) walk(full);
  else if(/\.(tsx|ts)$/.test(entry.name)) paths.push(full);
 }
}
roots.forEach(walk);
const topics = [
 ['homestead exemption',/homestead/i],['property tax protest',/property.tax.*(protest|appeal)|appraisal.protest/i],
 ['appraisal districts',/appraisal.district/i],['property tax deadlines',/property.tax.*deadline/i],
 ['senior exemptions',/(senior|over.65).*exemption/i],['disabled veteran exemptions',/disabled.veteran.*exemption/i],
 ['homeowners insurance',/homeowner.*insurance/i],['Texas Constitution',/texas.constitution/i],
 ['Texas Property Code',/property.code/i],['public information law',/public.information|open.records/i],
 ['landlord tenant law',/landlord.tenant/i],['firearm law',/firearm|gun.law/i],['HOA law',/hoa|homeowner.association/i],
 ['Comptroller',/comptroller/i],['DPS',/department.of.public.safety|texas.dps/i],
 ['TxDOT',/txdot|transportation.department/i],['Attorney General',/attorney.general/i],
 ['Railroad Commission',/railroad.commission/i],['Secretary of State',/secretary.of.state/i],
 ['LLC formation',/form.*llc|llc.*formation/i],['franchise tax',/franchise.tax/i],
 ['sales tax permits',/sales.tax.permit/i],['cost of living',/cost.of.living/i],
 ['employment and wages',/employment|wages/i],['housing market',/housing.market/i]
];
const records=topics.map(([topic,re])=>{
 const matches=paths.filter(p=>re.test(p.replaceAll(/[-_./]/g,' ')));
 return {topic,routeFiles:matches,classification:matches.length?'candidate-route-found':'needs-manual-inventory'};
});
console.log(JSON.stringify({generatedAt:new Date().toISOString(),scannedRouteFiles:paths.length,topics:records},null,2));
