export type TexasOfficialService = {
  title: string;
  href: string;
  description?: string;
};

export type TexasOfficialAgency = {
  id: string;
  name: string;
  acronym?: string;
  summary: string;
  officialUrl: string;
  phone?: string;
  responsibilities: string[];
  services: TexasOfficialService[];
  relatedGuideIds: string[];
  relatedLawIds: string[];
};

export type TexasPlaceProfile = {
  id: string;
  name: string;
  type: 'city' | 'county';
  summary: string;
  officialUrl: string;
  countyIds: string[];
  cityIds: string[];
  schoolDistrictIds: string[];
  representativeIds: string[];
  agencyIds: string[];
  utilityIds: string[];
  parkIds: string[];
  hospitalIds: string[];
  libraryIds: string[];
  emergencyManagementUrl?: string;
  electionUrl?: string;
  propertyTaxUrl?: string;
};

export function validateOfficialAgency(agency: TexasOfficialAgency) {
  const errors: string[] = [];
  if (!agency.id.trim()) errors.push('Agency ID is required.');
  if (!agency.name.trim()) errors.push('Agency name is required.');
  if (!agency.summary.trim()) errors.push('Agency summary is required.');
  if (!agency.officialUrl.startsWith('https://')) errors.push('Agency official URL must use HTTPS.');
  if (!agency.responsibilities.length) errors.push('Agency must list at least one responsibility.');
  if (!agency.services.length) errors.push('Agency must list at least one official service.');
  for (const service of agency.services) {
    if (!service.title.trim()) errors.push('Official service title is required.');
    if (!service.href.startsWith('https://')) errors.push(`Official service “${service.title}” must use HTTPS.`);
  }
  return { valid: errors.length === 0, errors };
}

export function validatePlaceProfile(profile: TexasPlaceProfile) {
  const errors: string[] = [];
  if (!profile.id.trim()) errors.push('Place ID is required.');
  if (!profile.name.trim()) errors.push('Place name is required.');
  if (!profile.summary.trim()) errors.push('Place summary is required.');
  if (!profile.officialUrl.startsWith('https://')) errors.push('Place official URL must use HTTPS.');
  for (const [label, value] of [
    ['emergency management', profile.emergencyManagementUrl],
    ['elections', profile.electionUrl],
    ['property tax', profile.propertyTaxUrl],
  ] as const) {
    if (value && !value.startsWith('https://')) errors.push(`${label} URL must use HTTPS.`);
  }
  return { valid: errors.length === 0, errors };
}

export function agencyById(agencies: ReadonlyArray<TexasOfficialAgency>, id: string) {
  return agencies.find((agency) => agency.id === id);
}

export function placeConnections(profile: TexasPlaceProfile) {
  return {
    counties: [...profile.countyIds],
    cities: [...profile.cityIds],
    schoolDistricts: [...profile.schoolDistrictIds],
    representatives: [...profile.representativeIds],
    agencies: [...profile.agencyIds],
    utilities: [...profile.utilityIds],
    parks: [...profile.parkIds],
    hospitals: [...profile.hospitalIds],
    libraries: [...profile.libraryIds],
  };
}
