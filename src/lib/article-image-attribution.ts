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
].map((entry) => ({
  ...entry,
  usageNote: "Source image unmodified; page presentation may crop it responsively.",
}));

const ATTRIBUTION_BY_URL = new Map(
  ATTRIBUTIONS.map((entry) => [entry.imageUrl, entry] as const),
);

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
