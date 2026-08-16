export type Domain =
  | "wildlife" | "weather" | "energy" | "sports" | "business" | "military"
  | "education" | "health" | "transportation" | "housing" | "legal" | "politics"
  | "border" | "culture" | "general";

export type SubjectExtract = {
  title: string;
  firstParagraph: string;
  entities: string[];
  locations: string[];
  domain: Domain;
  concreteSubject: string;
};

export type VisionVerdict = { matches: boolean; photorealistic: boolean; reason: string };

const DOMAIN_KEYWORDS: Array<[Domain, RegExp]> = [
  ["wildlife", /\b(jellyfish|shark|whale|dolphin|bird|fish|species|wildlife|reef|coral|deer|coyote|snake|alligator|manatee|turtle|habitat|ecosystem|marine)\b/i],
  ["weather", /\b(hurricane|tornado|flood|drought|storm|heat wave|freeze|blizzard|wildfire|rainfall|weather)\b/i],
  ["energy", /\b(oil|gas|permian|pipeline|refinery|ercot|grid|wind farm|solar farm|drilling|rig)\b/i],
  ["sports", /\b(cowboys|texans|rangers|astros|mavericks|spurs|rockets|stars|nfl|nba|mlb|football|basketball|baseball|playoff)\b/i],
  ["military", /\b(purple heart|medal of honor|military|army|navy|air force|marines|fort cavazos|soldier|veteran)\b/i],
  ["education", /\b(school|isd|university|college|teacher|classroom|student|curriculum)\b/i],
  ["health", /\b(hospital|clinic|doctor|nurse|patient|disease|virus|outbreak|medicaid|healthcare)\b/i],
  ["transportation", /\b(highway|interstate|traffic|txdot|airport|rail|transit|bridge|road construction)\b/i],
  ["housing", /\b(housing|rent|home price|real estate|apartment|homebuyer|mortgage|property tax|appraisal)\b/i],
  ["border", /\b(border|migrant|immigration|cartel|rio grande|asylum)\b/i],
  ["business", /\b(company|corporation|factory|manufacturing|semiconductor|investment|economy|jobs|hiring)\b/i],
  ["legal", /\b(court|courthouse|judge|justice|lawsuit|ruling|appeal|appellate|injunction|litigation|plaintiff|defendant|judicial|legal challenge|supreme court|court of appeals)\b/i],
  ["politics", /\b(governor|senator|representative|legislature|capitol|abbott|patrick|paxton|cruz|cornyn|bill|law|policy|election|ballot)\b/i],
  ["culture", /\b(rodeo|barbecue|music|festival|art|museum|heritage|cultural)\b/i],
];

export function inferDomain(text: string): Domain {
  for (const [domain, re] of DOMAIN_KEYWORDS) if (re.test(text)) return domain;
  return "general";
}

const DOMAIN_STEER: Record<Domain, string> = {
  wildlife: "the actual named animal or species in its natural habitat",
  weather: "the actual weather event affecting a recognizable Texas landscape",
  energy: "the actual Texas energy infrastructure described in the story",
  sports: "a realistic game-day stadium or athletic action with no logos or identifiable player faces",
  military: "the specific medal, honor, installation, aircraft, or anonymous military scene named by the story",
  education: "a realistic school classroom, hallway, or campus exterior",
  health: "a realistic hospital, clinic, medical campus, or healthcare facility",
  transportation: "the actual road, highway, airport, bridge, rail, or transit infrastructure",
  housing: "real Texas homes, neighborhood, development, or construction",
  legal: "a real courthouse exterior or courtroom interior with stone, wood, desks, judicial bench, counsel tables, paper court files, and anonymous legal participants",
  border: "the real Rio Grande, border landscape, or fence line",
  business: "the actual factory, storefront, workplace, industrial facility, or business setting",
  politics: "a real-world policy impact or government setting directly relevant to the story",
  culture: "the real cultural event, venue, food, music, museum, or heritage scene",
  general: "a specific real-world Texas scene directly tied to the article",
};

export function buildImagePrompt(subject: SubjectExtract, extraGuidance = ""): string {
  const loc = subject.locations.slice(0, 2).join(", ");
  const correction = extraGuidance ? `Correction from rejected attempt: ${extraGuidance}. ` : "";
  if (subject.domain === "legal") {
    return `${correction}Professional documentary photojournalism photograph, horizontal 16:9. Story: ${subject.title}. Photograph ${DOMAIN_STEER.legal}. Natural daylight or realistic courtroom lighting, 35mm camera, lifelike stone and wood, true photographic depth of field, realistic architecture, neutral news photography. PRIMARY SUBJECT: a believable real Texas courthouse or courtroom representing the judicial ruling. ${loc ? `Location context: ${loc}, Texas.` : "Texas setting."} Election-law context may appear only as subtle ordinary paperwork or voting materials in the background. Do not use a politician, Texas-shaped graphic, map, flagpole, capitol dome, campaign rally, podium, poster, illustration, vector art, cartoon, infographic, collage, text overlay, seal, logo, or symbolic state graphic.`.slice(0, 1800);
  }
  return `${correction}Professional photorealistic editorial news photograph, horizontal 16:9, documentary photojournalism, natural lighting, realistic textures, believable perspective and depth of field. PRIMARY SUBJECT: ${subject.concreteSubject}. Depict ${DOMAIN_STEER[subject.domain]}. ${loc ? `Location context: ${loc}, Texas.` : "Believable Texas setting where relevant."} One coherent real-world scene. No illustration, vector art, cartoon, infographic, collage, poster, text overlay, watermark, logo, generic symbolic placeholder, or fabricated recognizable face.`.slice(0, 1800);
}

export function buildNegativeImagePrompt(subject: SubjectExtract, rejectedReason = ""): string {
  const items = [
    "illustration", "cartoon", "drawing", "painting", "digital art", "vector art", "graphic design",
    "infographic", "poster", "3D render", "clip art", "flat icon", "symbolic placeholder", "collage",
    "split screen", "text", "headline", "caption", "watermark", "logo", "low detail", "plastic texture",
    "CGI", "concept art", "comic", "anime", "stylized", "surreal",
  ];
  if (subject.domain === "legal") items.push(
    "Texas state silhouette", "Texas-shaped graphic", "map of Texas", "politician", "candidate", "campaign rally",
    "podium", "flagpole", "capitol dome", "election icon", "ballot illustration", "government seal",
  );
  if (rejectedReason) items.push(`rejected visual motif: ${rejectedReason.slice(0, 240)}`);
  return items.join(", ").slice(0, 1500);
}

export function parseVisionVerdict(value: unknown): VisionVerdict | null {
  const normalize = (candidate: unknown): VisionVerdict | null => {
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) return null;
    const v = candidate as { matches?: unknown; photorealistic?: unknown; reason?: unknown };
    if (typeof v.matches !== "boolean" || typeof v.photorealistic !== "boolean") return null;
    return { matches: v.matches, photorealistic: v.photorealistic, reason: typeof v.reason === "string" ? v.reason : "" };
  };
  const direct = normalize(value);
  if (direct) return direct;
  if (typeof value !== "string") return null;
  const cleaned = value.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  const candidates = [cleaned];
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start >= 0 && end > start) candidates.push(cleaned.slice(start, end + 1));
  for (const candidate of candidates) {
    try {
      const parsed = normalize(JSON.parse(candidate));
      if (parsed) return parsed;
    } catch {
      // fall through to prose parsing
    }
  }
  const prose = cleaned.replace(/\s+/g, " ").trim();
  const lower = prose.toLowerCase();
  const labeledMatch = lower.match(/matches\*?\*?\s*[:\-]\s*(true|false|yes|no)/i);
  const labeledPhoto = lower.match(/photorealistic\*?\*?\s*[:\-]\s*(true|false|yes|no)/i);
  if (labeledMatch && labeledPhoto) {
    const reasonMatch = prose.match(/reason\*?\*?\s*[:\-]\s*(.+)$/i);
    const toBoolean = (token: string) => token === "true" || token === "yes";
    return {
      matches: toBoolean(labeledMatch[1]),
      photorealistic: toBoolean(labeledPhoto[1]),
      reason: (reasonMatch?.[1] || prose).trim().slice(0, 300),
    };
  }
  const rejectsMatch = /does not (?:clearly |directly )?(?:match|depict)|doesn't match|unrelated to|generic news symbolism|matches?\s*[:\-]\s*(?:false|no)/i.test(lower);
  const rejectsPhoto = /not photorealistic|photorealistic\s*[:\-]\s*(?:false|no)|appears? to be an? (?:illustration|cartoon|graphic)|looks? (?:illustrated|cartoon|vector|poster)|vector-like|cartoon-like|illustration/i.test(lower);
  const acceptsMatch = !rejectsMatch && /clearly matches|matches the story|direct story match|clearly depicts|relevant to the story/i.test(lower);
  const acceptsPhoto = !rejectsPhoto && /photorealistic|realistic editorial photograph|believable .*photograph/i.test(lower);
  if (rejectsMatch || rejectsPhoto) return { matches: !rejectsMatch, photorealistic: !rejectsPhoto, reason: prose.slice(0, 300) };
  if (acceptsMatch && acceptsPhoto) return { matches: true, photorealistic: true, reason: prose.slice(0, 300) };
  return null;
}
