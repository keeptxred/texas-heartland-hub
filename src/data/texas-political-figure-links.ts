export type PoliticalFigureLink = {
  name: string;
  slug: string;
};

const normalizePoliticalFigureName = (name: string) =>
  name.toLocaleLowerCase("en-US").replace(/[^a-z0-9]+/g, " ").trim();

// Keep this client-safe: Election Central needs only names and slugs, not the full
// political-biography corpus. The companion test validates every entry against
// the authoritative profile registry.
export const POLITICAL_FIGURE_LINKS: readonly PoliticalFigureLink[] = [
  { name: "Greg Abbott", slug: "greg-abbott-texas-governor-profile" },
  { name: "Dan Patrick", slug: "dan-patrick-texas-lieutenant-governor-profile" },
  { name: "Ken Paxton", slug: "ken-paxton-texas-attorney-general-profile" },
  { name: "Sid Miller", slug: "sid-miller-texas-agriculture-commissioner-profile" },
  { name: "Dawn Buckingham", slug: "dawn-buckingham-texas-land-commissioner-profile" },
  { name: "Jim Wright", slug: "jim-wright-texas-railroad-commission-profile" },
  { name: "John Cornyn", slug: "john-cornyn-texas-senator-profile" },
  { name: "Chip Roy", slug: "chip-roy-texas-congressman-profile" },
  { name: "Dan Crenshaw", slug: "dan-crenshaw-texas-congressman-profile" },
  { name: "Michael McCaul", slug: "michael-mccaul-texas-congressman-profile" },
  { name: "Jodey Arrington", slug: "jodey-arrington-texas-congressman-profile" },
  { name: "Ronny Jackson", slug: "ronny-jackson-texas-congressman-profile" },
  { name: "Pete Sessions", slug: "pete-sessions-texas-congressman-profile" },
  { name: "Beth Van Duyne", slug: "beth-van-duyne-texas-congresswoman-profile" },
  { name: "Monica De La Cruz", slug: "monica-de-la-cruz-texas-congresswoman-profile" },
  { name: "Troy Nehls", slug: "troy-nehls-texas-congressman-profile" },
  { name: "Pat Fallon", slug: "pat-fallon-texas-congressman-profile" },
  { name: "August Pfluger", slug: "august-pfluger-texas-congressman-profile" },
  { name: "Lance Gooden", slug: "lance-gooden-texas-congressman-profile" },
  { name: "Roger Williams", slug: "roger-williams-texas-congressman-profile" },
  { name: "Keith Self", slug: "keith-self-texas-congressman-profile" },
  { name: "Nathaniel Moran", slug: "nathaniel-moran-texas-congressman-profile" },
  { name: "Morgan Luttrell", slug: "morgan-luttrell-texas-congressman-profile" },
  { name: "Jake Ellzey", slug: "jake-ellzey-texas-congressman-profile" },
  { name: "Randy Weber", slug: "randy-weber-texas-congressman-profile" },
  { name: "Michael Cloud", slug: "michael-cloud-texas-congressman-profile" },
  { name: "John Carter", slug: "john-carter-texas-congressman-profile" },
  { name: "Brian Babin", slug: "brian-babin-texas-congressman-profile" },
  { name: "Tony Gonzales", slug: "tony-gonzales-texas-congressman-profile" },
  { name: "Craig Goldman", slug: "craig-goldman-texas-congressman-profile" },
  { name: "Brandon Gill", slug: "brandon-gill-texas-congressman-profile" },
];

const politicalFigureLinkByName = new Map(
  POLITICAL_FIGURE_LINKS.map((figure) => [normalizePoliticalFigureName(figure.name), figure] as const),
);

export function politicalFigureProfilePathByName(name: string): string | null {
  const figure = politicalFigureLinkByName.get(normalizePoliticalFigureName(name));
  return figure ? `/texas-politics/figures/${figure.slug}` : null;
}
