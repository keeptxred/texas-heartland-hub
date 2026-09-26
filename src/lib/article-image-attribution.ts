export type ArticleImageAttribution = {
  credit: string;
  sourceUrl: string;
  licenseName: string;
  licenseUrl: string;
  caption?: string;
  usageNote?: string;
};

type AttributionEntry = ArticleImageAttribution & {
  imageUrl: string;
};

const COMMONS = "https://commons.wikimedia.org/wiki/File:";

const ATTRIBUTIONS: AttributionEntry[] = [
  {
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Flock_Safety_License_Plate_Reader_Camera_in_Colorado_(55307233186).jpg",
    credit: "Tony Webster",
    sourceUrl: `${COMMONS}Flock_Safety_License_Plate_Reader_Camera_in_Colorado_(55307233186).jpg`,
    licenseName: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    caption: "Representative 2026 archive photograph of an actual Flock Safety ALPR camera; not one of the Texas cameras disconnected after the funding change.",
  },
  {
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Victor_Wembanyama_San_Antonio_Spurs_2025_NBA_Cup_(cropped).jpg",
    credit: "Daiei Onoguchi",
    sourceUrl: `${COMMONS}Victor_Wembanyama_San_Antonio_Spurs_2025_NBA_Cup_(cropped).jpg`,
    licenseName: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    caption: "Representative archive photo of Victor Wembanyama; not the Katy pickup soccer game.",
  },
  {
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Luke_Kornet.jpg",
    credit: "Rikster2",
    sourceUrl: `${COMMONS}Luke_Kornet.jpg`,
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    caption: "Representative archive photo of Luke Kornet; not the reported roadside stop.",
  },
  {
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Jacob_deGrom.jpg",
    credit: "slgckgc",
    sourceUrl: `${COMMONS}Jacob_deGrom.jpg`,
    licenseName: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    caption: "Representative archive photo of Jacob deGrom; not the game described in this article.",
  },
  {
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Victor_Wembanyama_San_Antonio_Spurs_2024.jpg",
    credit: "Frenchieinportland",
    sourceUrl: `${COMMONS}Victor_Wembanyama_San_Antonio_Spurs_2024.jpg`,
    licenseName: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    caption: "Representative archive photo of Victor Wembanyama; not the NBA 2K27 cover image.",
  },
  {
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Houston_Texans_vs._Dallas_Cowboys_2019_45_(Dallas_kicking_off).jpg",
    credit: "Michael Barera",
    sourceUrl: `${COMMONS}Houston_Texans_vs._Dallas_Cowboys_2019_45_(Dallas_kicking_off).jpg`,
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    caption: "Representative archive Dallas Cowboys football photo; not the game described in this article.",
  },
  {
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Texans_vs_Cowboys_preseason_2010.jpg",
    credit: "MC Glasgow",
    sourceUrl: `${COMMONS}Texans_vs_Cowboys_preseason_2010.jpg`,
    licenseName: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    caption: "Representative archive Dallas Cowboys football photo; not the game described in this article.",
  },
  {
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Dan_Patrick_Texas.jpg",
    credit: "Redwhiteandboujee",
    sourceUrl: `${COMMONS}Dan_Patrick_Texas.jpg`,
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    caption: "Representative archive photo of Dan Patrick; not the event described in this article.",
  },
  {
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Brandon_Williams_Cowboys_vs_Texans.jpg",
    credit: "MC Glasgow",
    sourceUrl: `${COMMONS}Brandon_Williams_Cowboys_vs_Texans.jpg`,
    licenseName: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    caption: "Representative archive Dallas Cowboys football photo; not the game described in this article.",
  },
  {
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Dallas_Cowboys_in_the_red-zone.jpg",
    credit: "Mahanga",
    sourceUrl: `${COMMONS}Dallas_Cowboys_in_the_red-zone.jpg`,
    licenseName: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    caption: "Representative archive Dallas Cowboys football photo; not the game described in this article.",
  },
  {
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/2020_Cowboys_pregame_(50533294763).jpg",
    credit: "All-Pro Reels",
    sourceUrl: `${COMMONS}2020_Cowboys_pregame_(50533294763).jpg`,
    licenseName: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
    caption: "Representative archive Dallas Cowboys football photo; not the roster-decision event described in this article.",
  },
  {
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Jimmy_Kimmel_01.jpg",
    credit: "Ken Conley",
    sourceUrl: `${COMMONS}Jimmy_Kimmel_01.jpg`,
    licenseName: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
    caption: "Representative archive photo of Jimmy Kimmel; not the unaired James Talarico interview.",
  },
  {
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Lone_Star_Showdown_2006_McGee_on_goal-line.jpg",
    credit: "Johntex",
    sourceUrl: `${COMMONS}Lone_Star_Showdown_2006_McGee_on_goal-line.jpg`,
    licenseName: "CC BY 2.5",
    licenseUrl: "https://creativecommons.org/licenses/by/2.5/",
    caption: "Representative archive Texas A&M football photo from the 2006 Lone Star Showdown; not the 2026 Missouri State game.",
  },
  {
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6b/TXSE_logo_Sep_2024.svg/1280px-TXSE_logo_Sep_2024.svg.png",
    credit: "TXSE Group Inc.",
    sourceUrl: `${COMMONS}TXSE_logo_Sep_2024.svg`,
    licenseName: "Public domain (PD-textlogo)",
    licenseUrl: "https://commons.wikimedia.org/wiki/Template:PD-textlogo",
    caption: "Texas Stock Exchange identity graphic. Used editorially to identify the exchange discussed in the article; not a photograph of the reported listings.",
  },
  {
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Folclor_mexicano_-_Frida_Kahlo.jpg",
    credit: "Lemad.resaeva",
    sourceUrl: `${COMMONS}Folclor_mexicano_-_Frida_Kahlo.jpg`,
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    caption: "Representative archive photograph of a Frida Kahlo impersonator and related student artwork; not the San Antonio Frida Fest record attempt.",
  },
  {
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Lupe_logo_jpeg.jpg",
    credit: "TE(HIST 316)",
    sourceUrl: `${COMMONS}Lupe_logo_jpeg.jpg`,
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    caption: "La Unión del Pueblo Entero (LUPE) logo, used to identify the organization discussed in this article.",
  },
  {
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Entrance_to_San_Antonio_Zoo_IMG_3110.JPG",
    credit: "Billy Hathorn",
    sourceUrl: `${COMMONS}Entrance_to_San_Antonio_Zoo_IMG_3110.JPG`,
    licenseName: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    caption: "Representative archive photo of the San Antonio Zoo entrance; not the Dinos After Dark event described in this article.",
  },
  {
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Texas_A%26M_University_Academic_Building.jpg",
    credit: "Donnie Ray Jones",
    sourceUrl: `${COMMONS}Texas_A%26M_University_Academic_Building.jpg`,
    licenseName: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    caption: "Representative archive photo of the Texas A&M University Academic Building; not the SB 37 review meeting described in this article.",
  },
  {
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Charley_Crockett.jpg",
    credit: "Bobby Cochran",
    sourceUrl: `${COMMONS}Charley_Crockett.jpg`,
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    caption: "Archive photograph of Charley Crockett, the named subject; not the social-media exchange described in this article.",
  },
  {
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Pickle_Juice_Drinking_Competition.jpg",
    credit: "BanjoZebra",
    sourceUrl: `${COMMONS}Pickle_Juice_Drinking_Competition.jpg`,
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    caption: "Representative archive pickle-festival competition; not the Helotes event described in this article.",
  },
  {
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/ERCOTOperator_2.jpg",
    credit: "Dpysh w",
    sourceUrl: `${COMMONS}ERCOTOperator_2.jpg`,
    licenseName: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0/",
    caption: "Archive photograph of an ERCOT control-room operator; not the specific data-center audit described in this article.",
  },
  {
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/USA_Big_Bend_Rio_Grande_TX.jpg",
    credit: "Daniel Schwen",
    sourceUrl: `${COMMONS}USA_Big_Bend_Rio_Grande_TX.jpg`,
    licenseName: "CC BY-SA 2.5",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.5/",
    caption: "Archive photograph of the Rio Grande in Big Bend National Park; not the disputed construction activity itself.",
  },
  {
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/1_Opening_the_box_(12001259465).jpg",
    credit: "Bob Herndon, U.S. Fish and Wildlife Service",
    sourceUrl: `${COMMONS}1_Opening_the_box_(12001259465).jpg`,
    licenseName: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    caption: "Archive U.S. Fish and Wildlife Service package inspection involving live turtles; not the 2026 Denton shipment.",
  },
  {
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Tesla_Cybercab_-_San_Francisco_-_June_2026.jpg",
    credit: "9yz",
    sourceUrl: `${COMMONS}Tesla_Cybercab_-_San_Francisco_-_June_2026.jpg`,
    licenseName: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    caption: "June 2026 archive photograph of a Tesla Cybercab in San Francisco; not the Austin launch described in this article.",
  },
  {
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Lake_Livingston_Dam.jpg",
    credit: "i_am_jim",
    sourceUrl: `${COMMONS}Lake_Livingston_Dam.jpg`,
    licenseName: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    caption: "Archive photograph of Lake Livingston Dam, operated by the Trinity River Authority of Texas; not the board appointment event.",
  },
  {
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Fallopian_tube.jpg",
    credit: "Scientific Animations",
    sourceUrl: `${COMMONS}Fallopian_tube.jpg`,
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    caption: "Medical visualization of a fallopian tube; representative anatomy, not a patient image.",
  },
  {
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/0011Tarrant%20County%20Courthouse%20Full%20E%20Fort%20Worth%20Texas.jpg",
    credit: "Mark Fisher",
    sourceUrl: `${COMMONS}0011Tarrant_County_Courthouse_Full_E_Fort_Worth_Texas.jpg`,
    licenseName: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    caption: "Archive photograph of the Tarrant County Courthouse in Fort Worth; not the specific court proceeding described in this article.",
  },
  {
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Celina%20High%20School%2C%20Friday%20Night%20Football.jpg",
    credit: "Heidi Knapp",
    sourceUrl: `${COMMONS}Celina_High_School,_Friday_Night_Football.jpg`,
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    caption: "Representative archive Texas high-school football scene; not the streaming-rights events described in this article.",
  },
  {
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Federal_Courthouse,_Austin,_TX_IMG_6339.JPG",
    credit: "Billy Hathorn",
    sourceUrl: `${COMMONS}Federal_Courthouse,_Austin,_TX_IMG_6339.JPG`,
    licenseName: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    caption: "Archive photograph of the federal courthouse in Austin; not the September 2026 proceeding described in this article.",
  },
  {
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/HuntsvilleUnitHuntsvilleTX.jpg",
    credit: "Nick DiFonzo",
    sourceUrl: `${COMMONS}HuntsvilleUnitHuntsvilleTX.jpg`,
    licenseName: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    caption: "Archive photograph of the Huntsville Unit; not the specific federal court proceeding or air-conditioning work described in this article.",
  },
  {
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Stock_ponds_are_vital_for_livestock_to_survive_at_Stasney%27s_Cook_Ranch_in_Albany,_Texas._(25017182991).jpg",
    credit: "USDA NRCS Texas",
    sourceUrl: `${COMMONS}Stock_ponds_are_vital_for_livestock_to_survive_at_Stasney%27s_Cook_Ranch_in_Albany,_Texas._(25017182991).jpg`,
    licenseName: "Public domain (U.S. Department of Agriculture work)",
    licenseUrl: "https://commons.wikimedia.org/wiki/Template:PD-USGov-USDA",
    caption: "Archive USDA photograph of a Texas stock pond used for livestock.",
  },
  {
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Texas_Woman%27s_University_September_2015_04_(Old_Main_Building).jpg",
    credit: "Michael Barera",
    sourceUrl: `${COMMONS}Texas_Woman%27s_University_September_2015_04_(Old_Main_Building).jpg`,
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    caption: "Archive photograph of Old Main at Texas Woman's University; not the governing-board appointment event described in this article.",
  },
  {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/33/Japanese_dinner%2C_kaiseki.jpg",
    credit: "(WT-en) Jpatokal at English Wikivoyage",
    sourceUrl: `${COMMONS}Japanese_dinner,_kaiseki.jpg`,
    licenseName: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    caption: "Representative archive kaiseki meal; not a photograph of Ichika in Plano.",
  },
].map((entry) => ({
  ...entry,
  usageNote: "Source image unmodified; page presentation may crop it responsively.",
}));

const ATTRIBUTION_BY_URL = new Map(
  ATTRIBUTIONS.map((entry) => [entry.imageUrl, entry] as const),
);

const CONTAINED_ARTICLE_IMAGE_URLS = new Set([
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Lupe_logo_jpeg.jpg",
  "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6b/TXSE_logo_Sep_2024.svg/1280px-TXSE_logo_Sep_2024.svg.png",
]);

export function getArticleImageAttribution(
  imageUrl: string | null | undefined,
): ArticleImageAttribution | null {
  const key = String(imageUrl ?? "").trim();
  if (!key) return null;
  const entry = ATTRIBUTION_BY_URL.get(key);
  if (!entry) return null;
  const { imageUrl: _imageUrl, ...attribution } = entry;
  return attribution;
}

export function hasRequiredArticleImageAttribution(
  imageUrl: string | null | undefined,
): boolean {
  return getArticleImageAttribution(imageUrl) !== null;
}

export function shouldContainArticleImage(
  imageUrl: string | null | undefined,
): boolean {
  return CONTAINED_ARTICLE_IMAGE_URLS.has(String(imageUrl ?? "").trim());
}

export function getGeneratedArticleImageDisclosure(
  imageUrl: string | null | undefined,
): string | null {
  const raw = String(imageUrl ?? "").trim();
  if (!raw) return null;

  let path = raw;
  try {
    path = new URL(raw, "https://keeptxred.com").pathname;
  } catch {
    // Keep the raw value for defensive path matching below.
  }

  if (
    path.includes("/images/news/generated/")
    || path.startsWith("/api/public/article-image/")
  ) {
    return "Illustrative image generated by Keep TX Red; not a documentary photograph of the reported event.";
  }

  return null;
}
