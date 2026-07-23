// Texas property-tax calculator coverage registry.
// Local rates are intentionally user-entered or address-derived because exact bills depend on parcel-specific taxing units.
export type SchoolDistrict = { name: string; rate: number };
export type SpecialDistrict = { name: string; rate: number; kind: "MUD" | "PID" | "hospital" | "college" | "ESD" | "other" };
export type CountyDataStatus = "manual-entry-required";
export type County = {
  slug: string;
  name: string;
  region: string;
  countyRate: number;
  cityAvgRate: number;
  specialDistrictRate: number;
  homesteadExemption: number;
  schoolDistricts: SchoolDistrict[];
  specialDistricts: SpecialDistrict[];
  taxYear: number;
  dataSource: string;
  dataStatus: CountyDataStatus;
  reviewedOn: string;
  nextReviewOn: string;
  sourceUrl: string;
};

export const TAX_RATE_DATASET = {
  planningTaxYear: 2026,
  taxYear: 2026,
  lastUpdated: "2026-07-22",
  nextReviewOn: "2027-01-15",
  sourceUrl: "https://comptroller.texas.gov/taxes/property-tax/rates/",
  exemptionSourceUrl: "https://comptroller.texas.gov/taxes/property-tax/exemptions/",
  countyCount: 254,
  seededCountyCount: 0,
  statewideSchoolHomesteadExemption: 140000,
  scopeNote:
    "All 254 counties are supported through exact local-rate entry or available address lookup. The calculator does not preload county, city-average, ISD, MUD/PID, hospital, college, ESD, or other local rates because those taxing units and effective years vary by property.",
} as const;

const COUNTY_NAMES = `Anderson|Andrews|Angelina|Aransas|Archer|Armstrong|Atascosa|Austin|Bailey|Bandera|Bastrop|Baylor|Bee|Bell|Bexar|Blanco|Borden|Bosque|Bowie|Brazoria|Brazos|Brewster|Briscoe|Brooks|Brown|Burleson|Burnet|Caldwell|Calhoun|Callahan|Cameron|Camp|Carson|Cass|Castro|Chambers|Cherokee|Childress|Clay|Cochran|Coke|Coleman|Collin|Collingsworth|Colorado|Comal|Comanche|Concho|Cooke|Coryell|Cottle|Crane|Crockett|Crosby|Culberson|Dallam|Dallas|Dawson|Deaf Smith|Delta|Denton|DeWitt|Dickens|Dimmit|Donley|Duval|Eastland|Ector|Edwards|Ellis|El Paso|Erath|Falls|Fannin|Fayette|Fisher|Floyd|Foard|Fort Bend|Franklin|Freestone|Frio|Gaines|Galveston|Garza|Gillespie|Glasscock|Goliad|Gonzales|Gray|Grayson|Gregg|Grimes|Guadalupe|Hale|Hall|Hamilton|Hansford|Hardeman|Hardin|Harris|Harrison|Hartley|Haskell|Hays|Hemphill|Henderson|Hidalgo|Hill|Hockley|Hood|Hopkins|Houston|Howard|Hudspeth|Hunt|Hutchinson|Irion|Jack|Jackson|Jasper|Jeff Davis|Jefferson|Jim Hogg|Jim Wells|Johnson|Jones|Karnes|Kaufman|Kendall|Kenedy|Kent|Kerr|Kimble|King|Kinney|Kleberg|Knox|La Salle|Lamar|Lamb|Lampasas|Lavaca|Lee|Leon|Liberty|Limestone|Lipscomb|Live Oak|Llano|Loving|Lubbock|Lynn|Madison|Marion|Martin|Mason|Matagorda|Maverick|McCulloch|McLennan|McMullen|Medina|Menard|Midland|Milam|Mills|Mitchell|Montague|Montgomery|Moore|Morris|Motley|Nacogdoches|Navarro|Newton|Nolan|Nueces|Ochiltree|Oldham|Orange|Palo Pinto|Panola|Parker|Parmer|Pecos|Polk|Potter|Presidio|Rains|Randall|Reagan|Real|Red River|Reeves|Refugio|Roberts|Robertson|Rockwall|Runnels|Rusk|Sabine|San Augustine|San Jacinto|San Patricio|San Saba|Schleicher|Scurry|Shackelford|Shelby|Sherman|Smith|Somervell|Starr|Stephens|Sterling|Stonewall|Sutton|Swisher|Tarrant|Taylor|Terrell|Terry|Throckmorton|Titus|Tom Green|Travis|Trinity|Tyler|Upshur|Upton|Uvalde|Val Verde|Van Zandt|Victoria|Walker|Waller|Ward|Washington|Webb|Wharton|Wheeler|Wichita|Wilbarger|Willacy|Williamson|Wilson|Winkler|Wise|Wood|Yoakum|Young|Zapata|Zavala`.split("|");

const slug = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

export const COUNTIES: County[] = COUNTY_NAMES.map((name) => ({
  slug: slug(name),
  name: `${name} County`,
  region: "Texas",
  countyRate: 0,
  cityAvgRate: 0,
  specialDistrictRate: 0,
  homesteadExemption: TAX_RATE_DATASET.statewideSchoolHomesteadExemption,
  schoolDistricts: [{ name: "Enter exact ISD rate", rate: 0 }],
  specialDistricts: [],
  taxYear: TAX_RATE_DATASET.taxYear,
  dataSource: "manual-or-address-derived-local-rates",
  dataStatus: "manual-entry-required",
  reviewedOn: TAX_RATE_DATASET.lastUpdated,
  nextReviewOn: TAX_RATE_DATASET.nextReviewOn,
  sourceUrl: TAX_RATE_DATASET.sourceUrl,
}));

export const SEEDED_COUNTIES: County[] = [];
export const MANUAL_ENTRY_COUNTIES = COUNTIES;

export function getCountyBySlug(value: string) {
  return COUNTIES.find((county) => county.slug === value);
}
