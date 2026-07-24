import { useState } from "react";

/**
 * Find My DMV
 *
 * Texas splits vehicle registration (county tax assessor-collector) from
 * driver's license services (Texas DPS) across two different agencies.
 * This tool covers the top-population counties with real office data
 * sourced from the Texas Secretary of State's official Tax Assessor-Collector
 * directory, and falls back to the statewide TxDMV directory for any
 * county not yet in the list.
 *
 * Paste this file directly into your project (e.g. src/components/FindMyDMV.tsx)
 * rather than asking the AI to regenerate it.
 */

export type CountyOffice = {
  county: string;
  officeName: string;
  contact: string;
  phone: string;
  address: string;
  website?: string;
};

// Sourced from Texas Secretary of State Tax Assessor-Collector directory
// (https://www.sos.state.tx.us/elections/voter/tac.shtml) — covers the
// highest-population counties. Update phone/contact periodically; these
// offices are elected, so names change every 4 years.
// Shared with the expanded registration guide while this legacy component remains available.
// eslint-disable-next-line react-refresh/only-export-components
export const COUNTY_OFFICES: CountyOffice[] = [
  {
    county: "Harris",
    officeName: "Harris County Tax Assessor-Collector",
    contact: "Annette Ramirez",
    phone: "(713) 274-8000",
    address: "P.O. Box 3527, Houston, TX 77253",
    website: "https://www.hctax.net",
  },
  {
    county: "Bexar",
    officeName: "Bexar County Tax Assessor-Collector",
    contact: "Albert Uresti",
    phone: "(210) 335-6625",
    address: "233 N. Pecos La Trinidad, San Antonio, TX 78207",
    website: "https://www.bexar.org/1529/Tax-Assessor-Collector",
  },
  {
    county: "Tarrant",
    officeName: "Tarrant County Tax Assessor-Collector",
    contact: "Wendy Burgess",
    phone: "(817) 212-7212",
    address: "100 E. Weatherford St., Fort Worth, TX 76196",
    website: "https://www.tarrantcountytx.gov/en/tax.html",
  },
  {
    county: "Dallas",
    officeName: "Dallas County Tax Assessor-Collector",
    contact: "John R. Ames",
    phone: "(214) 653-7811",
    address: "509 Main St., 1st Fl., Dallas, TX 75202",
    website: "https://www.dallascounty.org/departments/tax/",
  },
  {
    county: "Travis",
    officeName: "Travis County Tax Assessor-Collector",
    contact: "Celia Israel",
    phone: "(512) 854-9473",
    address: "P.O. Box 1748, Austin, TX 78767",
    website: "https://tax-office.traviscountytx.gov",
  },
  {
    county: "Collin",
    officeName: "Collin County Tax Assessor-Collector",
    contact: "Kenneth Maun",
    phone: "(972) 547-5020",
    address: "2300 Bloomdale Rd., Ste. 2324, McKinney, TX 75071",
    website: "https://www.collincountytx.gov/tax_assessor",
  },
  {
    county: "Denton",
    officeName: "Denton County Tax Assessor-Collector",
    contact: "Michelle French",
    phone: "(940) 349-3500",
    address: "1505 E. McKinney St., Denton, TX 76209",
    website: "https://www.dentoncounty.gov/778/Tax-Assessor-Collector",
  },
  {
    county: "Fort Bend",
    officeName: "Fort Bend County Tax Assessor-Collector",
    contact: "Carmen Turner",
    phone: "(281) 341-3710",
    address: "500 Liberty St., #103, Richmond, TX 77469",
    website: "https://www.fbctx.gov/government/departments/tax-assessor-collector",
  },
  {
    county: "Hidalgo",
    officeName: "Hidalgo County Tax Assessor-Collector",
    contact: "Pablo Villareal Jr.",
    phone: "(956) 318-2157",
    address: "2804 US Hwy 281, Edinburg, TX 78539",
    website: "https://www.hidalgocounty.us/206/Tax-Office",
  },
  {
    county: "El Paso",
    officeName: "El Paso County Tax Assessor-Collector",
    contact: "Ruben Gonzalez",
    phone: "(915) 546-2140",
    address: "301 Manny Martinez Dr., 1st Fl., El Paso, TX 79905",
    website: "https://www.epcounty.com/taxoffice/",
  },
  {
    county: "Montgomery",
    officeName: "Montgomery County Tax Assessor-Collector",
    contact: "Tammy McRae",
    phone: "(936) 539-7897",
    address: "400 N. San Jacinto St., Conroe, TX 77301",
    website: "https://www.mctx.org/departments/departments_a_-_c/tax_office",
  },
  {
    county: "Williamson",
    officeName: "Williamson County Tax Assessor-Collector",
    contact: "Larry Gaddes",
    phone: "(512) 943-1601",
    address: "904 S. Main St., Georgetown, TX 78626",
    website: "https://www.wilco.org/Government/Departments/Tax-Assessor-Collector",
  },
  {
    county: "Cameron",
    officeName: "Cameron County Tax Assessor-Collector",
    contact: "Tony Yzaguirre Jr.",
    phone: "(956) 544-0807",
    address: "964 E. Harrison St., Brownsville, TX 78520",
    website: "https://www.cameroncountytx.gov/taxoffice/",
  },
  {
    county: "Nueces",
    officeName: "Nueces County Tax Assessor-Collector",
    contact: "Kevin Kieschnick",
    phone: "(361) 888-0307",
    address: "901 Leopard St., Ste. 301, Corpus Christi, TX 78401",
    website: "https://ncounty.com/tax-assessor",
  },
  {
    county: "Bell",
    officeName: "Bell County Tax Assessor-Collector",
    contact: "Shay Luedeke",
    phone: "(800) 460-2355",
    address: "P.O. Box 669, Belton, TX 76513",
    website: "https://www.bellcountytx.com/tax-assessor-collector",
  },
  {
    county: "Galveston",
    officeName: "Galveston County Tax Assessor-Collector",
    contact: "Cheryl E. Johnson",
    phone: "(409) 766-2280",
    address: "722 21st St., Ste. 224, Galveston, TX 77550",
    website: "https://galvestontx.gov/389/Tax-Office",
  },
  {
    county: "Brazoria",
    officeName: "Brazoria County Tax Assessor-Collector",
    contact: "Kristin Bulanek",
    phone: "(979) 864-1320",
    address: "111 E. Locust St., Angleton, TX 77515",
    website: "https://www.brazoriacountytx.gov/departments/tax-assessor-collector",
  },
  {
    county: "Lubbock",
    officeName: "Lubbock County Tax Assessor-Collector",
    contact: "Ronnie Keister",
    phone: "(806) 775-1338",
    address: "P.O. Box 10536, Lubbock, TX 79408",
    website: "https://tax.lubbockcad.org",
  },
  {
    county: "Webb",
    officeName: "Webb County Tax Assessor-Collector",
    contact: "Patricia A. Barrera",
    phone: "(956) 721-2323",
    address: "1110 Victoria St., Ste. 107, Laredo, TX 78040",
    website: "https://www.webbcountytx.gov/tax-assessor",
  },
  {
    county: "Jefferson",
    officeName: "Jefferson County Tax Assessor-Collector",
    contact: "Kate Carroll",
    phone: "(409) 835-8714",
    address: "P.O. Box 2112, Beaumont, TX 77704",
    website: "https://www.co.jefferson.tx.us/tax_office/",
  },
  {
    county: "McLennan",
    officeName: "McLennan County Tax Assessor-Collector",
    contact: "Randy H. Riggs",
    phone: "(254) 757-5130",
    address: "215 N. 5th St., Ste. 118, Waco, TX 76701",
    website: "https://www.co.mclennan.tx.us/198/Tax-Office",
  },
  {
    county: "Smith",
    officeName: "Smith County Tax Assessor-Collector",
    contact: "Gary B. Barber",
    phone: "(903) 590-2935",
    address: "P.O. Box 2011, Tyler, TX 75710",
    website: "https://www.smith-county.com/government/tax-office",
  },
  {
    county: "Ellis",
    officeName: "Ellis County Tax Assessor-Collector",
    contact: "John Bridges",
    phone: "(872) 825-5150",
    address: "P.O. Box 188, Waxahachie, TX 75165",
    website: "https://www.co.ellis.tx.us/153/Tax-Assessor-Collector",
  },
  {
    county: "Johnson",
    officeName: "Johnson County Tax Assessor-Collector",
    contact: "Scott Porter",
    phone: "(817) 558-0122",
    address: "2 N. Mill St., Cleburne, TX 76033",
    website: "https://www.johnsoncountytx.org/152/Tax-Assessor-Collector",
  },
  {
    county: "Parker",
    officeName: "Parker County Tax Assessor-Collector",
    contact: "Jenny Gentry",
    phone: "(817) 598-6149",
    address: "1112 Santa Fe Dr., Weatherford, TX 76086",
    website: "https://www.parkercountytx.com/188/Tax-Assessor-Collector",
  },
  {
    county: "Kaufman",
    officeName: "Kaufman County Tax Assessor-Collector",
    contact: "Teressa Floyd",
    phone: "(469) 376-4690",
    address: "100 N. Washington St., Kaufman, TX 75142",
    website: "https://www.kaufmancounty.net/172/Tax-Office",
  },
  {
    county: "Rockwall",
    officeName: "Rockwall County Tax Assessor-Collector",
    contact: "Kim Sweet",
    phone: "(972) 882-0350",
    address: "101 E. Rusk St., Ste. 101, Rockwall, TX 75087",
    website: "https://www.rockwallcountytexas.com/149/Tax-Assessor-Collector",
  },
  {
    county: "Guadalupe",
    officeName: "Guadalupe County Tax Assessor-Collector",
    contact: "Daryl W. John",
    phone: "(830) 303-4188",
    address: "307 W. Court St., Seguin, TX 78155",
    website: "https://www.co.guadalupe.tx.us/tax_assessor",
  },
  {
    county: "Comal",
    officeName: "Comal County Tax Assessor-Collector",
    contact: "Kristen Hoyt",
    phone: "(830) 221-1352",
    address: "205 N. Seguin Ave., New Braunfels, TX 78130",
    website: "https://www.co.comal.tx.us/TaxAC.htm",
  },
  {
    county: "Hays",
    officeName: "Hays County Tax Assessor-Collector",
    contact: "Jenifer O'Kane",
    phone: "(512) 393-5545",
    address: "712 S. Stagecoach Trl., Ste. 1120, San Marcos, TX 78666",
    website: "https://www.co.hays.tx.us/tax-assessor-collector.aspx",
  },
  {
    county: "Bastrop",
    officeName: "Bastrop County Tax Assessor-Collector",
    contact: "Ellen Owens",
    phone: "(512) 581-7161",
    address: "P.O. Box 579, Bastrop, TX 78602",
    website: "https://www.co.bastrop.tx.us/page/co.tax_assessor",
  },
  {
    county: "Brazos",
    officeName: "Brazos County Tax Assessor-Collector",
    contact: "Kristeen Roe",
    phone: "(979) 775-9930",
    address: "4151 County Park Ct., Bryan, TX 77802",
    website: "https://www.brazoscountytx.gov/168/Tax-Office",
  },
  {
    county: "Midland",
    officeName: "Midland County Tax Assessor-Collector",
    contact: "Karen Hood",
    phone: "(432) 688-4810",
    address: '2110 N. "A" St., Midland, TX 79705',
    website: "https://www.midlandtexas.gov/149/Tax-Office",
  },
  {
    county: "Ector",
    officeName: "Ector County Tax Assessor-Collector",
    contact: "Lindy Wright",
    phone: "(432) 498-4054",
    address: "1010 E. 8th St., Rm. 100, Odessa, TX 79761",
    website: "https://www.co.ector.tx.us/page/ector.TaxOffice",
  },
  {
    county: "Taylor",
    officeName: "Taylor County Tax Assessor-Collector",
    contact: "Kay Middleton",
    phone: "(325) 674-1224",
    address: "400 Oak St., Abilene, TX 79602",
    website: "https://www.taylorcountytexas.org/173/Tax-Assessor-Collector",
  },
  {
    county: "Grayson",
    officeName: "Grayson County Tax Assessor-Collector",
    contact: "Bruce Stidham",
    phone: "(903) 893-8683",
    address: "P.O. Box 2107, Sherman, TX 75091",
    website: "https://www.co.grayson.tx.us/page/grayson.TaxOfficeHome",
  },
];

const TXDMV_FULL_DIRECTORY = "https://www.txdmv.gov/tax-assessor-collectors/county-tax-offices";
const DPS_OFFICE_LOCATOR = "https://www.dps.texas.gov/section/driver-license";
const DPS_NEW_RESIDENT_GUIDE = "https://www.dps.texas.gov/section/driver-license/moving-texas";

export default function FindMyDMV() {
  const [selectedCounty, setSelectedCounty] = useState("");
  const sortedCounties = [...COUNTY_OFFICES].sort((a, b) => a.county.localeCompare(b.county));
  const office = COUNTY_OFFICES.find((o) => o.county === selectedCounty);

  return (
    <div className="max-w-xl mx-auto p-6 rounded-lg border border-gray-200 bg-white">
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Find My DMV</h2>
      <p className="text-gray-600 mb-4">
        Texas splits vehicle registration and driver's licenses across two agencies. Select your
        county to find both.
      </p>
      <div className="mb-4 p-3 rounded-md bg-amber-50 border border-amber-200 text-sm text-amber-900">
        <strong>Two deadlines:</strong> 30 days to title &amp; register your vehicle (county tax
        office), 90 days to get a Texas driver's license (DPS).
      </div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Your county</label>
      <select
        value={selectedCounty}
        onChange={(e) => setSelectedCounty(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 mb-4"
      >
        <option value="">Select your county...</option>
        {sortedCounties.map((o) => (
          <option key={o.county} value={o.county}>
            {o.county} County
          </option>
        ))}
      </select>

      {office && (
        <div className="p-4 rounded-md bg-gray-50 border border-gray-200 mb-4">
          <p className="text-sm text-gray-500 mb-1">Vehicle registration — county tax office</p>
          <p className="text-lg font-bold text-gray-900">{office.officeName}</p>
          <p className="text-gray-700">{office.contact}</p>
          <p className="text-gray-700">{office.address}</p>
          <p className="text-gray-700 mb-3">{office.phone}</p>
          {office.website && (
            <a
              href={office.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-red-700 text-white font-semibold rounded-md hover:bg-red-800 transition"
            >
              Visit office website
            </a>
          )}
        </div>
      )}

      {selectedCounty && !office && (
        <div className="p-4 rounded-md bg-gray-50 border border-gray-200 mb-4 text-sm text-gray-700">
          We don't have this county in our directory yet.{" "}
          <a
            href={TXDMV_FULL_DIRECTORY}
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-700 font-semibold underline"
          >
            Look it up in the full TxDMV county directory
          </a>
          .
        </div>
      )}

      <div className="p-4 rounded-md bg-gray-50 border border-gray-200">
        <p className="text-sm text-gray-500 mb-1">Driver's license — Texas DPS</p>
        <p className="text-gray-700 mb-3">
          DPS is a separate agency from your county tax office. Find your nearest office and book an
          appointment — availability can run several weeks out in fast-growing counties.
        </p>
        <div className="flex flex-wrap gap-2">
          <a
            href={DPS_OFFICE_LOCATOR}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-gray-800 text-white font-semibold rounded-md hover:bg-gray-900 transition"
          >
            Find a DPS office
          </a>
          <a
            href={DPS_NEW_RESIDENT_GUIDE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-white text-gray-800 font-semibold rounded-md border border-gray-300 hover:bg-gray-50 transition"
          >
            New resident checklist
          </a>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        Office names and contacts sourced from the Texas Secretary of State's official Tax
        Assessor-Collector directory. These are elected positions and details can change —{" "}
        <a
          href={TXDMV_FULL_DIRECTORY}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          verify with TxDMV
        </a>{" "}
        if something looks out of date.
      </p>
    </div>
  );
}
