import { TEXAS_POLITICAL_FIGURES as ESTABLISHED_FIGURES, type TexasPoliticalFigure } from "./texas-political-figures";
import { TEXAS_POLITICAL_FIGURES_STATEWIDE_JUDICIARY } from "./texas-political-figures-statewide-judiciary";
import { TEXAS_POLITICAL_FIGURES_CONGRESS } from "./texas-political-figures-congress";
import { TEXAS_POLITICAL_FIGURES_LEGISLATURE } from "./texas-political-figures-legislature";
import { TEXAS_POLITICAL_FIGURES_HISTORY_ORGANIZERS } from "./texas-political-figures-history-organizers";
import type { ExtendedTexasPoliticalFigure, PoliticalFigureCategory } from "./texas-political-figure-builder";

export type TexasPoliticalFigureRecord = TexasPoliticalFigure & {
  category?: PoliticalFigureCategory;
  seoKeywords?: string[];
  relatedFigureSlugs?: string[];
  aliases?: string[];
};

const ESTABLISHED_CATEGORIES: Record<string, PoliticalFigureCategory> = {
  "Ronald Reagan": "Party organizers and conservative activists",
  "George H.W. Bush": "Historical U.S. House leaders",
  "George W. Bush": "Statewide executive leaders",
  "Ted Cruz": "U.S. senators",
  "John Cornyn": "U.S. senators",
  "Greg Abbott": "Statewide executive leaders",
  "Dan Patrick": "Statewide executive leaders",
  "Ken Paxton": "Statewide executive leaders",
  "Phil Gramm": "U.S. senators",
  "Rick Perry": "Statewide executive leaders",
};

const PROFILE_ALIASES: Record<string, string[]> = {
  "James Blacklock": ["James D. Blacklock", "Jimmy Blacklock"],
  "Bill Clements": ["William P. Clements Jr.", "William Perry Clements Jr."],
  "Norris Wright Cuney": ["Norris Cuney"],
  "William Madison McDonald": ["Gooseneck Bill McDonald"],
  "Rentfro Banton Creager": ["R. B. Creager", "Rene B. Creager"],
  "George H.W. Bush": ["George Herbert Walker Bush"],
  "George W. Bush": ["George Walker Bush"],
};

const establishedWithMetadata: TexasPoliticalFigureRecord[] = ESTABLISHED_FIGURES.map((figure) => ({
  ...figure,
  category: ESTABLISHED_CATEGORIES[figure.name],
  seoKeywords: [figure.name, figure.texasRole, "Texas politics", "Texas Republican history"],
  aliases: PROFILE_ALIASES[figure.name],
}));

const additions: ExtendedTexasPoliticalFigure[] = [
  ...TEXAS_POLITICAL_FIGURES_STATEWIDE_JUDICIARY,
  ...TEXAS_POLITICAL_FIGURES_CONGRESS,
  ...TEXAS_POLITICAL_FIGURES_LEGISLATURE,
  ...TEXAS_POLITICAL_FIGURES_HISTORY_ORGANIZERS,
];

const normalizedName = (name: string) => name.toLocaleLowerCase("en-US").replace(/[^a-z0-9]+/g, " ").trim();
const byName = new Map<string, TexasPoliticalFigureRecord>();

for (const figure of additions) {
  byName.set(normalizedName(figure.name), { ...figure, aliases: PROFILE_ALIASES[figure.name] });
}
for (const figure of establishedWithMetadata) {
  // Prefer the already-published substantive profile when the 100-name target overlaps it.
  byName.set(normalizedName(figure.name), figure);
}
for (const figure of [...byName.values()]) {
  for (const alias of figure.aliases ?? []) {
    const aliasKey = normalizedName(alias);
    if (!byName.has(aliasKey)) byName.set(aliasKey, figure);
  }
}

export const TEXAS_POLITICAL_FIGURES: TexasPoliticalFigureRecord[] = [
  ...establishedWithMetadata,
  ...additions.filter((figure) => !ESTABLISHED_FIGURES.some((existing) => normalizedName(existing.name) === normalizedName(figure.name))),
];

export const texasPoliticalFigureBySlug = (slug: string) => TEXAS_POLITICAL_FIGURES.find((figure) => figure.slug === slug);

export const TEXAS_REPUBLICAN_CONSERVATIVE_LEADER_TARGETS = [
  "Greg Abbott", "Dan Patrick", "Ken Paxton", "Rick Perry", "George W. Bush", "Bill Clements", "Glenn Hegar", "Sid Miller", "Dawn Buckingham", "Christi Craddick", "Wayne Christian", "Jim Wright", "Susan Combs", "Carole Keeton Strayhorn", "Jerry E. Patterson", "David Dewhurst", "George P. Bush",
  "Ted Cruz", "John Cornyn", "Phil Gramm", "John Tower", "George H.W. Bush",
  "Nathan Hecht", "James Blacklock", "Jane Bland", "Jeff Boyd", "Brett Busby", "John Devine", "Rebeca Huddle", "Evan Young", "Don Willett", "Eva Guzman", "Wallace B. Jefferson", "Priscilla Owen", "Thomas R. Phillips",
  "Chip Roy", "Dan Crenshaw", "Michael McCaul", "Jodey Arrington", "Ronny Jackson", "Pete Sessions", "Beth Van Duyne", "Monica De La Cruz", "Troy Nehls", "Pat Fallon", "August Pfluger", "Lance Gooden", "Roger Williams", "Keith Self", "Nathaniel Moran", "Morgan Luttrell", "Jake Ellzey", "Randy Weber", "Michael Cloud", "John Carter", "Brian Babin", "Tony Gonzales", "Craig Goldman", "Brandon Gill",
  "Dick Armey", "Tom DeLay", "Ron Paul", "Sam Johnson", "Bill Archer", "Mac Thornberry", "Lamar Smith", "Jeb Hensarling", "Kevin Brady", "Joe Barton",
  "Tom Craddick", "Joe Straus", "Dennis Bonnen", "Dade Phelan", "Bryan Hughes", "Brandon Creighton", "Bob Hall", "Mayes Middleton", "Briscoe Cain", "Steve Toth", "Brian Harrison", "Tony Tinderholt", "Matt Rinaldi", "Joan Huffman", "Paul Bettencourt",
  "Edmund J. Davis", "Andrew Jackson Hamilton", "Elisha M. Pease", "Norris Wright Cuney", "George T. Ruby", "Richard Allen", "William Madison McDonald",
  "John Connally", "Allan Shivers", "Rentfro Banton Creager", "Rita Crocker Clements", "James Ashby", "Abraham George", "Allen West", "Cathie Adams", "Michael Williams",
] as const;

export const TEXAS_REPUBLICAN_CONSERVATIVE_LEADER_SOURCE_ALIASES: Record<string, string> = {
  "Jimmy Blacklock": "James Blacklock",
};

export const texasPoliticalFigureByName = (name: string) => {
  const canonicalName = TEXAS_REPUBLICAN_CONSERVATIVE_LEADER_SOURCE_ALIASES[name] ?? name;
  return byName.get(normalizedName(canonicalName));
};

export const TEXAS_REPUBLICAN_CONSERVATIVE_LEADERS: TexasPoliticalFigureRecord[] = TEXAS_REPUBLICAN_CONSERVATIVE_LEADER_TARGETS
  .map((name) => texasPoliticalFigureByName(name))
  .filter((figure): figure is TexasPoliticalFigureRecord => Boolean(figure));
