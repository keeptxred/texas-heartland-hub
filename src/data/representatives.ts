export type Rep = {
  name: string;
  office: string;
  party: "R" | "D";
  district?: string;
  phoneDC?: string;
  phoneTX?: string;
  website: string;
};

export const US_SENATORS: Rep[] = [
  { name: "John Cornyn", office: "U.S. Senator", party: "R", phoneDC: "(202) 224-2934", phoneTX: "(512) 469-6034", website: "https://www.cornyn.senate.gov" },
  { name: "Ted Cruz", office: "U.S. Senator", party: "R", phoneDC: "(202) 224-5922", phoneTX: "(512) 916-5834", website: "https://www.cruz.senate.gov" },
];

export const STATE_LEADERSHIP: Rep[] = [
  { name: "Greg Abbott", office: "Governor", party: "R", phoneTX: "(512) 463-2000", website: "https://gov.texas.gov" },
  { name: "Dan Patrick", office: "Lieutenant Governor", party: "R", phoneTX: "(512) 463-0001", website: "https://www.ltgov.texas.gov" },
  { name: "Ken Paxton", office: "Attorney General", party: "R", phoneTX: "(512) 463-2100", website: "https://www.texasattorneygeneral.gov" },
  { name: "Glenn Hegar", office: "Comptroller", party: "R", phoneTX: "(512) 463-4444", website: "https://comptroller.texas.gov" },
  { name: "Sid Miller", office: "Agriculture Commissioner", party: "R", phoneTX: "(512) 463-7476", website: "https://www.texasagriculture.gov" },
  { name: "Dawn Buckingham", office: "Land Commissioner", party: "R", phoneTX: "(512) 463-5256", website: "https://www.glo.texas.gov" },
];

export const US_HOUSE_SAMPLE: Rep[] = [
  { name: "Wesley Hunt", office: "U.S. House", party: "R", district: "TX-38 (Houston)", phoneDC: "(202) 225-5601", website: "https://hunt.house.gov" },
  { name: "Dan Crenshaw", office: "U.S. House", party: "R", district: "TX-2 (Houston)", phoneDC: "(202) 225-6565", website: "https://crenshaw.house.gov" },
  { name: "Chip Roy", office: "U.S. House", party: "R", district: "TX-21 (Hill Country)", phoneDC: "(202) 225-4236", website: "https://roy.house.gov" },
  { name: "Ronny Jackson", office: "U.S. House", party: "R", district: "TX-13 (Panhandle)", phoneDC: "(202) 225-3706", website: "https://jackson.house.gov" },
  { name: "Pat Fallon", office: "U.S. House", party: "R", district: "TX-4 (North TX)", phoneDC: "(202) 225-6673", website: "https://fallon.house.gov" },
  { name: "Beth Van Duyne", office: "U.S. House", party: "R", district: "TX-24 (DFW)", phoneDC: "(202) 225-6605", website: "https://vanduyne.house.gov" },
  { name: "Lance Gooden", office: "U.S. House", party: "R", district: "TX-5 (East TX)", phoneDC: "(202) 225-3484", website: "https://gooden.house.gov" },
  { name: "Monica De La Cruz", office: "U.S. House", party: "R", district: "TX-15 (RGV)", phoneDC: "(202) 225-2531", website: "https://delacruz.house.gov" },
];

export const TEXAS_LAWS = [
  {
    title: "Constitutional Carry (HB 1927, 2021)",
    summary: "Texans 21+ may carry a handgun openly or concealed without a state-issued License to Carry, subject to federal prohibitions and posted property restrictions.",
  },
  {
    title: "Heartbeat Act (SB 8, 2021) & Human Life Protection Act",
    summary: "Abortion is prohibited from fertilization with narrow exceptions for medical emergencies. Civil enforcement provisions remain in effect.",
  },
  {
    title: "Election Integrity Act (SB 1, 2021)",
    summary: "Photo ID required for mail ballots, expanded poll-watcher access, ban on drive-thru and 24-hour voting, ID matching on mail-in ballot applications.",
  },
  {
    title: "Property Tax Relief (SB 2, 2023)",
    summary: "$100,000 homestead exemption for school M&O taxes, ISD compression, and a three-year 20% appraisal cap pilot on non-homestead properties under $5M.",
  },
  {
    title: "Parental Rights in Education (SB 763 & HB 900, 2023)",
    summary: "Schools must give parents access to instructional materials; vendors must rate library books for sexual content; chaplains may serve in public schools.",
  },
  {
    title: "Operation Lone Star / SB 4 (2023)",
    summary: "Creates state crime of illegal entry and authorizes Texas judges to order removal. Currently in federal litigation.",
  },
  {
    title: "Save Women's Sports Act (HB 25, 2021)",
    summary: "K-12 and collegiate athletes must compete on teams matching their biological sex assigned at birth.",
  },
  {
    title: "Texas DREAM Act Repeal Efforts & In-State Tuition",
    summary: "Ongoing legislative debate over whether non-citizens qualify for in-state college tuition rates under the 2001 statute.",
  },
  {
    title: "Death Penalty & Capital Murder",
    summary: "Texas remains an active death-penalty state. Capital cases require unanimous jury and automatic appeal to the Court of Criminal Appeals.",
  },
  {
    title: "Right-to-Work (Texas Labor Code §101.052)",
    summary: "Union membership and dues may not be required as a condition of employment in Texas.",
  },
];

export const ACTIVE_BILLS = [
  { bill: "HB 2", chamber: "House", topic: "Property Tax", status: "Engrossed", summary: "Further compresses ISD M&O rates and raises the homestead exemption to $140,000." },
  { bill: "SB 12", chamber: "Senate", topic: "Parental Rights", status: "Passed Senate", summary: "Codifies parental review of curriculum and library materials in all public K-12 schools." },
  { bill: "HB 4", chamber: "House", topic: "Border Security", status: "In Committee", summary: "Funds an additional $6.5B for state border operations and DPS deployment." },
  { bill: "SB 17", chamber: "Senate", topic: "DEI / Higher Ed", status: "Signed", summary: "Expands prohibition on DEI offices to all state-funded higher education institutions." },
  { bill: "HB 900", chamber: "House", topic: "Education", status: "In Conference", summary: "Strengthens vendor rating requirements for school library materials." },
  { bill: "SB 14", chamber: "Senate", topic: "Energy", status: "Passed Senate", summary: "Streamlines permitting for natural gas peaker plants under the Texas Energy Fund." },
];