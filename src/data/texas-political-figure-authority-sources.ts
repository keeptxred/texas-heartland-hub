export type PoliticalFigureAuthoritySource = { href: string; label: string };

export const POLITICAL_FIGURE_AUTHORITY_SOURCES: Record<string, PoliticalFigureAuthoritySource[]> = {
  "ronald-reagan-texas-conservative-legacy": [
    { href: "https://www.reaganlibrary.gov/reagans/ronald-reagan", label: "Ronald Reagan Presidential Library — Ronald Reagan biography" },
    { href: "https://www.reaganlibrary.gov/archives", label: "Ronald Reagan Presidential Library — archives" },
  ],
  "george-hw-bush-texas-political-life": [
    { href: "https://www.bush41library.gov/bushes/president-george-bush", label: "George H.W. Bush Presidential Library — President George Bush" },
    { href: "https://www.bush41library.gov/research", label: "George H.W. Bush Presidential Library — research and archives" },
  ],
  "george-w-bush-texas-governor-president": [
    { href: "https://www.georgewbushlibrary.gov/bush-family/george-w-bush", label: "George W. Bush Presidential Library — George W. Bush biography" },
    { href: "https://www.georgewbushlibrary.gov/research", label: "George W. Bush Presidential Library — research resources" },
  ],
  "ted-cruz-texas-senator-profile": [
    { href: "https://www.cruz.senate.gov/newsroom/press-kit", label: "U.S. Senator Ted Cruz — official biography" },
    { href: "https://www.senate.gov/states/TX/timeline.shtml", label: "U.S. Senate — Texas Senate timeline" },
  ],
  "john-cornyn-texas-senator-profile": [
    { href: "https://www.cornyn.senate.gov/about/about-john-cornyn/", label: "U.S. Senator John Cornyn — official biography" },
    { href: "https://www.senate.gov/states/TX/timeline.shtml", label: "U.S. Senate — Texas Senate timeline" },
  ],
  "greg-abbott-texas-governor-profile": [
    { href: "https://gov.texas.gov/governor-abbott", label: "Office of the Texas Governor — Greg Abbott biography" },
    { href: "https://gov.texas.gov/governor-abbott/duties", label: "Office of the Texas Governor — duties, requirements and powers" },
  ],
  "dan-patrick-texas-lieutenant-governor-profile": [
    { href: "https://www.ltgov.texas.gov/about/", label: "Office of the Lieutenant Governor — Dan Patrick biography" },
    { href: "https://senate.texas.gov/", label: "Texas Senate — official institution site" },
  ],
  "ken-paxton-texas-attorney-general-profile": [
    { href: "https://www.texasattorneygeneral.gov/about-office", label: "Office of the Texas Attorney General — Ken Paxton biography" },
    { href: "https://www.texasattorneygeneral.gov/", label: "Office of the Texas Attorney General — official site" },
  ],
  "phil-gramm-texas-senator-fiscal-conservative": [
    { href: "https://www.senate.gov/states/TX/timeline.shtml", label: "U.S. Senate — Texas Senate timeline" },
    { href: "https://cemetery.tspb.texas.gov/pub/user_form.asp?pers_id=11248", label: "Texas State Cemetery — William Philip Gramm biography" },
  ],
  "rick-perry-texas-governor-energy-legacy": [
    { href: "https://www.energy.gov/person/rick-perry", label: "U.S. Department of Energy — Rick Perry biography" },
    { href: "https://www.energy.gov/lm/secretaries-energy", label: "U.S. Department of Energy — Secretaries of Energy" },
  ],
};

export const politicalFigureAuthoritySourcesBySlug = (slug: string) =>
  POLITICAL_FIGURE_AUTHORITY_SOURCES[slug] ?? [];
