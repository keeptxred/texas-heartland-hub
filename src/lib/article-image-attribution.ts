export type ArticleImageAttribution = {
  label: string;
  href: string;
};

const LICENSE_PATTERNS: Array<[RegExp, string]> = [
  [/\bCC0(?:\s*1\.0)?\b/i, "CC0"],
  [/\bCC BY-SA 4\.0\b/i, "CC BY-SA 4.0"],
  [/\bCC BY 4\.0\b/i, "CC BY 4.0"],
  [/\bCC BY-SA 3\.0\b/i, "CC BY-SA 3.0"],
  [/\bCC BY 3\.0\b/i, "CC BY 3.0"],
  [/\bCC BY 2\.5\b/i, "CC BY 2.5"],
  [/\bCC BY-SA 2\.0\b/i, "CC BY-SA 2.0"],
  [/\bCC BY 2\.0\b/i, "CC BY 2.0"],
  [/\bpublic[- ]domain\b/i, "Public domain"],
];

function detectedLicense(note: string): string | null {
  for (const [pattern, label] of LICENSE_PATTERNS) {
    if (pattern.test(note)) return label;
  }
  return null;
}

function commonsFilePage(imageUrl: string): string {
  if (imageUrl.includes("commons.wikimedia.org/wiki/")) return imageUrl;
  if (!imageUrl.includes("upload.wikimedia.org/wikipedia/commons/")) return imageUrl;

  try {
    const parsed = new URL(imageUrl);
    const fileName = decodeURIComponent(parsed.pathname.split("/").pop() || "");
    if (!fileName) return imageUrl;
    return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(fileName).replace(/%20/g, "_")}`;
  } catch {
    return imageUrl;
  }
}

function extractCreator(note: string): string | null {
  const patterns = [
    /\bPhoto by\s+([^.;]+?)(?=\s+via\b|\s*\/\s*Wikimedia\b|[.;]|$)/i,
    /\bphotograph by\s+([^.;]+?)(?=\s+via\b|\s*\/\s*Wikimedia\b|[.;]|$)/i,
    /\b([A-Z][^.;/]{1,80}?)\s*\/\s*Wikimedia Commons\b/,
    /\bby\s+([^.;]+?)\s+via Wikimedia Commons\b/i,
    /\bby\s+([^.;]+?),\s*(?:licensed\s+)?CC\s/i,
  ];

  for (const pattern of patterns) {
    const match = note.match(pattern)?.[1]?.trim();
    if (match && match.length <= 100) return match;
  }
  return null;
}

export function getArticleImageAttribution(
  imageUrl: string | null | undefined,
  validationNote: string | null | undefined,
): ArticleImageAttribution | null {
  const url = String(imageUrl ?? "").trim();
  if (!/^https?:\/\//i.test(url)) return null;

  const note = String(validationNote ?? "").trim();
  const lower = url.toLowerCase();

  if (lower.includes("commons.wikimedia.org") || lower.includes("upload.wikimedia.org")) {
    const license = detectedLicense(note);
    const creator = extractCreator(note);
    const parts = ["Image", creator, "Wikimedia Commons", license].filter(Boolean);
    return { label: parts.join(" · "), href: commonsFilePage(url) };
  }

  if (lower.includes("nhc.noaa.gov") || lower.includes("noaa.gov")) {
    return { label: "Image · NOAA / National Hurricane Center · U.S. government source", href: url };
  }

  if (lower.includes("nps.gov")) {
    return { label: "Image · National Park Service · U.S. government source", href: url };
  }

  if (lower.includes("usda.gov") || lower.includes("ars.usda.gov")) {
    return { label: "Image · U.S. Department of Agriculture · U.S. government source", href: url };
  }

  if (/\bpublic[- ]domain\b/i.test(note) && /\.gov(?:\/|$)/i.test(lower)) {
    return { label: "Image · U.S. government source · Public domain", href: url };
  }

  return null;
}
