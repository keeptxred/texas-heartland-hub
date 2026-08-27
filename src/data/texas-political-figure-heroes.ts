export type PoliticalFigureHero = {
  src: string;
  alt: string;
  credit: string;
  sourcePage: string;
  license: string;
};

export const POLITICAL_FIGURE_HEROES: Record<string, PoliticalFigureHero> = {
  "ronald-reagan-texas-conservative-legacy": {
    src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Ronald_Reagan_portrait_%28color%29.jpg?width=1200",
    alt: "Official portrait of President Ronald Reagan in 1981",
    credit: "U.S. Government · Public domain · Wikimedia Commons",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Ronald_Reagan_portrait_(color).jpg",
    license: "Public domain",
  },
  "george-hw-bush-texas-political-life": {
    src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/George_H._W._Bush_presidential_portrait.jpg?width=1200",
    alt: "Official presidential portrait of George H. W. Bush",
    credit: "U.S. federal government · Public domain · Wikimedia Commons",
    sourcePage: "https://commons.wikimedia.org/wiki/File:George_H._W._Bush_presidential_portrait.jpg",
    license: "Public domain",
  },
  "george-w-bush-texas-governor-president": {
    src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/George_W._Bush_108th_Congressional_Portrait.png?width=1200",
    alt: "Official federal portrait of President George W. Bush",
    credit: "U.S. Government · Public domain · Wikimedia Commons",
    sourcePage: "https://commons.wikimedia.org/wiki/File:George_W._Bush_108th_Congressional_Portrait.png",
    license: "Public domain",
  },
  "ted-cruz-texas-senator-profile": {
    src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Ted_Cruz_senatorial_portrait.jpg?width=1200",
    alt: "Official U.S. Senate portrait of Ted Cruz",
    credit: "U.S. Senate Photographic Studio · Public domain · Wikimedia Commons",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Ted_Cruz_senatorial_portrait.jpg",
    license: "Public domain",
  },
  "john-cornyn-texas-senator-profile": {
    src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/John_Cornyn_official_senate_portrait.jpg?width=1200",
    alt: "Official U.S. Senate portrait of John Cornyn",
    credit: "U.S. Senate · Public domain · Wikimedia Commons",
    sourcePage: "https://commons.wikimedia.org/wiki/File:John_Cornyn_official_senate_portrait.jpg",
    license: "Public domain",
  },
  "greg-abbott-texas-governor-profile": {
    src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Greg_Abbott_2024_%28cropped%29.jpg?width=1200",
    alt: "Texas Governor Greg Abbott during a 2024 NASA visit",
    credit: "NASA · Public domain · Wikimedia Commons",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Greg_Abbott_2024_(cropped).jpg",
    license: "Public domain",
  },
  "dan-patrick-texas-lieutenant-governor-profile": {
    src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Dan_Patrick_Texas.jpg?width=1200",
    alt: "Texas Lieutenant Governor Dan Patrick",
    credit: "Redwhiteandboujee · CC BY-SA 4.0 · Wikimedia Commons",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Dan_Patrick_Texas.jpg",
    license: "CC BY-SA 4.0",
  },
  "ken-paxton-texas-attorney-general-profile": {
    src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Ken_Paxton_-_55022425480.jpg?width=1200",
    alt: "Texas Attorney General Ken Paxton speaking in 2025",
    credit: "Gage Skidmore · CC BY-SA 4.0 · Wikimedia Commons",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Ken_Paxton_-_55022425480.jpg",
    license: "CC BY-SA 4.0",
  },
  "phil-gramm-texas-senator-fiscal-conservative": {
    src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/PhilGramm.jpg?width=1200",
    alt: "Official congressional portrait of Texas Senator Phil Gramm",
    credit: "U.S. Congress · Public domain · Wikimedia Commons",
    sourcePage: "https://commons.wikimedia.org/wiki/File:PhilGramm.jpg",
    license: "Public domain",
  },
  "rick-perry-texas-governor-energy-legacy": {
    src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Rick_Perry_official_portrait.jpg?width=1200",
    alt: "Official portrait of U.S. Energy Secretary and former Texas Governor Rick Perry",
    credit: "Ken Shipp / U.S. Department of Energy · Public domain · Wikimedia Commons",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Rick_Perry_official_portrait.jpg",
    license: "Public domain",
  },
};

export const politicalFigureHeroBySlug = (slug: string) => POLITICAL_FIGURE_HEROES[slug];
