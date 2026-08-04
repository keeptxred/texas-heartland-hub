export type TexasLifeAgency = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  officialUrl: string;
  services: Array<{ title: string; href: string }>;
  relatedGuides: string[];
};

export const TEXAS_LIFE_AGENCIES: TexasLifeAgency[] = [
  {
    id: 'texas-comptroller',
    name: 'Texas Comptroller of Public Accounts',
    shortName: 'Texas Comptroller',
    description: 'Administers state taxes, sales tax permits, public finance information, and many business tax responsibilities.',
    officialUrl: 'https://comptroller.texas.gov/',
    services: [
      { title: 'Apply for a sales tax permit', href: 'https://comptroller.texas.gov/taxes/permit/' },
      { title: 'Search property tax assistance', href: 'https://comptroller.texas.gov/taxes/property-tax/' },
    ],
    relatedGuides: ['/texas-sales-tax-permit', '/texas-property-taxes'],
  },
  {
    id: 'texas-secretary-of-state',
    name: 'Texas Secretary of State',
    shortName: 'Texas SOS',
    description: 'Handles business formations, elections administration, and official state filings.',
    officialUrl: 'https://www.sos.state.tx.us/',
    services: [
      { title: 'Form a business', href: 'https://www.sos.state.tx.us/corp/sosda/index.shtml' },
      { title: 'Texas elections information', href: 'https://www.votetexas.gov/' },
    ],
    relatedGuides: ['/start-an-llc-in-texas', '/register-to-vote-in-texas'],
  },
  {
    id: 'texas-dps',
    name: 'Texas Department of Public Safety',
    shortName: 'Texas DPS',
    description: 'Issues driver licenses and identification cards and provides public-safety services.',
    officialUrl: 'https://www.dps.texas.gov/',
    services: [
      { title: 'Driver license services', href: 'https://www.dps.texas.gov/section/driver-license' },
      { title: 'Schedule an appointment', href: 'https://public.txdpsscheduler.com/' },
    ],
    relatedGuides: ['/texas-driver-license', '/moving-to-texas'],
  },
  {
    id: 'texas-dmv',
    name: 'Texas Department of Motor Vehicles',
    shortName: 'TxDMV',
    description: 'Oversees vehicle titles, registration, motor carriers, and related services.',
    officialUrl: 'https://www.txdmv.gov/',
    services: [
      { title: 'Vehicle registration', href: 'https://www.txdmv.gov/motorists/register-your-vehicle' },
      { title: 'Vehicle titles', href: 'https://www.txdmv.gov/motorists/buying-or-selling-a-vehicle' },
    ],
    relatedGuides: ['/texas-vehicle-registration', '/moving-to-texas'],
  },
  {
    id: 'texas-parks-wildlife',
    name: 'Texas Parks and Wildlife Department',
    shortName: 'TPWD',
    description: 'Manages state parks, wildlife, hunting, fishing, and outdoor recreation programs.',
    officialUrl: 'https://tpwd.texas.gov/',
    services: [
      { title: 'Reserve a state park', href: 'https://texasstateparks.reserveamerica.com/' },
      { title: 'Buy licenses', href: 'https://tpwd.texas.gov/business/licenses/online_sales/' },
    ],
    relatedGuides: ['/texas-state-parks', '/texas-hunting-license', '/texas-fishing-license'],
  },
  {
    id: 'texas-workforce-commission',
    name: 'Texas Workforce Commission',
    shortName: 'TWC',
    description: 'Supports workers, employers, unemployment programs, and workforce development.',
    officialUrl: 'https://www.twc.texas.gov/',
    services: [
      { title: 'Unemployment benefits', href: 'https://www.twc.texas.gov/services/apply-benefits' },
      { title: 'Employer services', href: 'https://www.twc.texas.gov/businesses' },
    ],
    relatedGuides: ['/working-in-texas', '/start-an-llc-in-texas'],
  },
  {
    id: 'texas-education-agency',
    name: 'Texas Education Agency',
    shortName: 'TEA',
    description: 'Oversees public education, school accountability, and statewide education information.',
    officialUrl: 'https://tea.texas.gov/',
    services: [
      { title: 'School district information', href: 'https://tea.texas.gov/texas-schools' },
      { title: 'School report cards', href: 'https://txschools.gov/' },
    ],
    relatedGuides: ['/texas-school-districts', '/moving-to-texas'],
  },
];

export function texasLifeAgencyById(id: string) {
  return TEXAS_LIFE_AGENCIES.find((agency) => agency.id === id);
}

export function validateTexasLifeAgency(agency: TexasLifeAgency) {
  const errors: string[] = [];
  if (!agency.id.trim()) errors.push('Agency ID is required.');
  if (!agency.name.trim()) errors.push('Agency name is required.');
  if (!agency.description.trim()) errors.push('Agency description is required.');
  if (!agency.officialUrl.startsWith('https://')) errors.push('Official agency URL must use HTTPS.');
  if (!agency.services.length) errors.push('At least one official service is required.');
  if (agency.services.some((service) => !service.href.startsWith('https://'))) errors.push('Agency service URLs must use HTTPS.');
  if (agency.relatedGuides.some((href) => !href.startsWith('/'))) errors.push('Related guide URLs must be internal.');
  return { valid: errors.length === 0, errors };
}
