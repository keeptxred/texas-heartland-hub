// Texas property-tax planning dataset.
// Seeded local rates are planning snapshots and must be verified against the property's taxing units.
export type SchoolDistrict = { name: string; rate: number };
export type SpecialDistrict = { name: string; rate: number; kind: "MUD" | "PID" | "hospital" | "college" | "ESD" | "other" };
export type CountyDataStatus = "seeded-local-rates" | "manual-entry-required";
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
  planningTaxYear: 2024,
  lastUpdated: "2026-07-22",
  nextReviewOn: "2026-10-01",
  sourceUrl: "https://comptroller.texas.gov/taxes/property-tax/rates/",
  exemptionSourceUrl: "https://comptroller.texas.gov/taxes/property-tax/exemptions/",
  countyCount: 254,
  seededCountyCount: 10,
  statewideSchoolHomesteadExemption: 140000,
  scopeNote:
    "Seeded county, city-average, and ISD rates are planning snapshots. Exact bills depend on the property's city, ISD, MUD/PID, hospital, college, ESD, and other taxing units.",
} as const;

const COUNTY_NAMES = `Anderson|Andrews|Angelina|Aransas|Archer|Armstrong|Atascosa|Austin|Bailey|Bandera|Bastrop|Baylor|Bee|Bell|Bexar|Blanco|Borden|Bosque|Bowie|Brazoria|Brazos|Brewster|Briscoe|Brooks|Brown|Burleson|Burnet|Caldwell|Calhoun|Callahan|Cameron|Camp|Carson|Cass|Castro|Chambers|Cherokee|Childress|Clay|Cochran|Coke|Coleman|Collin|Collingsworth|Colorado|Comal|Comanche|Concho|Cooke|Coryell|Cottle|Crane|Crockett|Crosby|Culberson|Dallam|Dallas|Dawson|Deaf Smith|Delta|Denton|DeWitt|Dickens|Dimmit|Donley|Duval|Eastland|Ector|Edwards|Ellis|El Paso|Erath|Falls|Fannin|Fayette|Fisher|Floyd|Foard|Fort Bend|Franklin|Freestone|Frio|Gaines|Galveston|Garza|Gillespie|Glasscock|Goliad|Gonzales|Gray|Grayson|Gregg|Grimes|Guadalupe|Hale|Hall|Hamilton|Hansford|Hardeman|Hardin|Harris|Harrison|Hartley|Haskell|Hays|Hemphill|Henderson|Hidalgo|Hill|Hockley|Hood|Hopkins|Houston|Howard|Hudspeth|Hunt|Hutchinson|Irion|Jack|Jackson|Jasper|Jeff Davis|Jefferson|Jim Hogg|Jim Wells|Johnson|Jones|Karnes|Kaufman|Kendall|Kenedy|Kent|Kerr|Kimble|King|Kinney|Kleberg|Knox|La Salle|Lamar|Lamb|Lampasas|Lavaca|Lee|Leon|Liberty|Limestone|Lipscomb|Live Oak|Llano|Loving|Lubbock|Lynn|Madison|Marion|Martin|Mason|Matagorda|Maverick|McCulloch|McLennan|McMullen|Medina|Menard|Midland|Milam|Mills|Mitchell|Montague|Montgomery|Moore|Morris|Motley|Nacogdoches|Navarro|Newton|Nolan|Nueces|Ochiltree|Oldham|Orange|Palo Pinto|Panola|Parker|Parmer|Pecos|Polk|Potter|Presidio|Rains|Randall|Reagan|Real|Red River|Reeves|Refugio|Roberts|Robertson|Rockwall|Runnels|Rusk|Sabine|San Augustine|San Jacinto|San Patricio|San Saba|Schleicher|Scurry|Shackelford|Shelby|Sherman|Smith|Somervell|Starr|Stephens|Sterling|Stonewall|Sutton|Swisher|Tarrant|Taylor|Terrell|Terry|Throckmorton|Titus|Tom Green|Travis|Trinity|Tyler|Upshur|Upton|Uvalde|Val Verde|Van Zandt|Victoria|Walker|Waller|Ward|Washington|Webb|Wharton|Wheeler|Wichita|Wilbarger|Willacy|Williamson|Wilson|Winkler|Wise|Wood|Yoakum|Young|Zapata|Zavala`.split("|");

type Seed = Pick<County, "countyRate" | "cityAvgRate" | "specialDistrictRate" | "schoolDistricts">;

const SEEDED: Record<string, Seed> = {
  Harris: { countyRate: 0.3769, cityAvgRate: 0.5198, specialDistrictRate: 0.185, schoolDistricts: [{ name: "Houston ISD", rate: 0.8683 }, { name: "Cypress-Fairbanks ISD", rate: 1.1146 }, { name: "Katy ISD", rate: 1.1175 }, { name: "Spring Branch ISD", rate: 1.0934 }] },
  Dallas: { countyRate: 0.2179, cityAvgRate: 0.7458, specialDistrictRate: 0.2435, schoolDistricts: [{ name: "Dallas ISD", rate: 1.0828 }, { name: "Richardson ISD", rate: 1.0316 }, { name: "Garland ISD", rate: 1.1546 }, { name: "Mesquite ISD", rate: 1.2746 }] },
  Tarrant: { countyRate: 0.1945, cityAvgRate: 0.6725, specialDistrictRate: 0.2244, schoolDistricts: [{ name: "Fort Worth ISD", rate: 1.0664 }, { name: "Arlington ISD", rate: 1.0892 }, { name: "Keller ISD", rate: 1.0867 }, { name: "Northwest ISD", rate: 1.09 }] },
  Bexar: { countyRate: 0.2768, cityAvgRate: 0.5418, specialDistrictRate: 0.2762, schoolDistricts: [{ name: "Northside ISD", rate: 1.0408 }, { name: "North East ISD", rate: 1.0334 }, { name: "San Antonio ISD", rate: 1.1408 }, { name: "Judson ISD", rate: 1.3022 }] },
  Travis: { countyRate: 0.3047, cityAvgRate: 0.4458, specialDistrictRate: 0.0998, schoolDistricts: [{ name: "Austin ISD", rate: 0.8649 }, { name: "Round Rock ISD", rate: 0.9046 }, { name: "Leander ISD", rate: 1.1075 }, { name: "Pflugerville ISD", rate: 1.2546 }] },
  Collin: { countyRate: 0.1499, cityAvgRate: 0.4322, specialDistrictRate: 0.0828, schoolDistricts: [{ name: "Plano ISD", rate: 1.0779 }, { name: "Frisco ISD", rate: 1.0727 }, { name: "McKinney ISD", rate: 1.1675 }, { name: "Allen ISD", rate: 1.1294 }] },
  Denton: { countyRate: 0.1898, cityAvgRate: 0.5535, specialDistrictRate: 0.1233, schoolDistricts: [{ name: "Denton ISD", rate: 1.1592 }, { name: "Lewisville ISD", rate: 1.0867 }, { name: "Argyle ISD", rate: 1.2675 }] },
  Williamson: { countyRate: 0.3331, cityAvgRate: 0.4012, specialDistrictRate: 0.1097, schoolDistricts: [{ name: "Round Rock ISD", rate: 0.9046 }, { name: "Leander ISD", rate: 1.1075 }, { name: "Georgetown ISD", rate: 1.0816 }, { name: "Hutto ISD", rate: 1.2925 }] },
  "Fort Bend": { countyRate: 0.4383, cityAvgRate: 0.4475, specialDistrictRate: 0.2987, schoolDistricts: [{ name: "Fort Bend ISD", rate: 1.0793 }, { name: "Katy ISD", rate: 1.1175 }, { name: "Lamar CISD", rate: 1.1487 }] },
  "El Paso": { countyRate: 0.45, cityAvgRate: 0.8645, specialDistrictRate: 0.2031, schoolDistricts: [{ name: "El Paso ISD", rate: 1.0746 }, { name: "Socorro ISD", rate: 1.2293 }, { name: "Ysleta ISD", rate: 1.2237 }] },
};

const slug = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

export const COUNTIES: County[] = COUNTY_NAMES.map((name) => {
  const seed = SEEDED[name];
  const seeded = Boolean(seed);
  return {
    slug: slug(name),
    name: `${name} County`,
    region: "Texas",
    countyRate: seed?.countyRate ?? 0,
    cityAvgRate: seed?.cityAvgRate ?? 0,
    specialDistrictRate: seed?.specialDistrictRate ?? 0,
    homesteadExemption: TAX_RATE_DATASET.statewideSchoolHomesteadExemption,
    schoolDistricts: seed?.schoolDistricts ?? [{ name: "Enter exact ISD rate", rate: 0 }],
    specialDistricts: [],
    taxYear: TAX_RATE_DATASET.planningTaxYear,
    dataSource: seeded ? "local-rate-planning-snapshot-2024" : "manual-entry-required",
    dataStatus: seeded ? "seeded-local-rates" : "manual-entry-required",
    reviewedOn: TAX_RATE_DATASET.lastUpdated,
    nextReviewOn: TAX_RATE_DATASET.nextReviewOn,
    sourceUrl: TAX_RATE_DATASET.sourceUrl,
  };
});

export const SEEDED_COUNTIES = COUNTIES.filter((county) => county.dataStatus === "seeded-local-rates");
export const MANUAL_ENTRY_COUNTIES = COUNTIES.filter((county) => county.dataStatus === "manual-entry-required");

export function getCountyBySlug(value: string) {
  return COUNTIES.find((county) => county.slug === value);
}
