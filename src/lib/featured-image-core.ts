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
  evidenceGuidance?: string;
  imageGroundingMode?: "verified_scene" | "verified_symbolic";
};

export type VisionVerdict = { matches: boolean; photorealistic: boolean; reason: string };

const MILITARY_HONORS_RE = /\b(purple heart|medal of honor|military honor(?:s)?|military award(?:s)?|service member(?:s)?|servicemember(?:s)?|fallen (?:service member|servicemember|soldier|marine|airman|sailor|troop|hero)(?:s)?|memorial day|veterans day|veteran(?:s)?|remembrance|military remembrance|wounded warrior(?:s)?|combat wounded|killed in action|missing in action|pow|mia)\b/i;
const WEATHER_PREPAREDNESS_RE = /\b(emergency plan|preparedness|prepared|checklist|emergency kit|go bag|family communication|shelter in place|evacuation plan|year-round)\b/i;
const SENSITIVE_VIOLENCE_RE = /\b(shooting|shot|gunfire|road rage|killed|dead|death|fatal|murder|homicide|victim|suspect|attack|assault)\b/i;
const DATA_CENTER_POLICY_RE = /\b(data center(?:s)?|data-center(?:s)?|server farm(?:s)?|hyperscale)\b/i;

const DOMAIN_KEYWORDS: Array<[Domain, RegExp]> = [
  ["wildlife", /\b(jellyfish|shark|whale|dolphin|bird|fish|species|wildlife|reef|coral|deer|coyote|snake|alligator|manatee|turtle|habitat|ecosystem|marine|hunting|hunter(?:s)?|fishing|angler(?:s)?)\b/i],
  ["weather", /\b(hurricane|tornado|flood|drought|storm|heat wave|freeze|blizzard|wildfire|rainfall|weather)\b/i],
  ["energy", /\b(oil|gas|permian|pipeline|refinery|ercot|grid|wind farm|solar farm|drilling|rig|data center(?:s)?)\b/i],
  ["sports", /\b(dallas cowboys|houston texans|houston astros|dallas mavericks|san antonio spurs|houston rockets|dallas stars|nfl|nba|mlb|mls|football|basketball|baseball|soccer|playoff|cross country|track(?: and field)?|athletics?|athlete|runner|running|punter|punting|kicker|kicking|special teams|watch list|championship|tournament|meet)\b/i],
  ["military", /\b(purple heart|medal of honor|military|army|navy|air force|airman|marines?|marine corps|coast guard|soldier|sailor|troop|veteran(?:s)?|service member(?:s)?|servicemember(?:s)?|armed forces|military honor(?:s)?|military award(?:s)?|remembrance|memorial|wounded warrior(?:s)?|combat wounded|killed in action|missing in action|pow|mia|fort cavazos)\b/i],
  ["education", /\b(school|isd|university|college|teacher|classroom|student|curriculum)\b/i],
  ["health", /\b(hospital|clinic|doctor|nurse|patient|disease|virus|outbreak|medicaid|healthcare)\b/i],
  ["transportation", /\b(highways?|interstates?|traffic|txdot|airports?|rail|transit|bridges?|road construction)\b/i],
  ["housing", /\b(housing|rent|home price|real estate|apartment|homebuyer|mortgage|property tax|appraisal)\b/i],
  ["border", /\b(border|migrant|immigration|cartel|rio grande|asylum)\b/i],
  ["business", /\b(company|corporation|factory|manufacturing|semiconductor|investment|economy|jobs|hiring)\b/i],
  ["legal", /\b(court|courthouse|judge|justice|lawsuit|sues?|suing|ruling|appeal|appellate|injunction|litigation|plaintiff|defendant|judicial|legal challenge|supreme court|court of appeals|acquit(?:s|ted|tal)?|extradition|custody|parental rights|surrogacy|fraud case|criminal charges?)\b/i],
  ["politics", /\b(governor|senator|representative|legislature|capitol|abbott|patrick|paxton|cruz|cornyn|bill|law|policy|election|ballot)\b/i],
  ["culture", /\b(rodeo|barbecue|music|festival|art|museum|heritage|cultural)\b/i],
];

const VISUAL_DOMAIN_PRIORITY: Domain[] = [
  "sports", "transportation", "energy", "border", "weather", "wildlife",
  "health", "housing", "business", "education", "legal", "military",
  "culture", "politics",
];

function matchedDomains(text: string): Set<Domain> {
  const matches = new Set<Domain>();
  for (const [domain, re] of DOMAIN_KEYWORDS) if (re.test(text)) matches.add(domain);
  return matches;
}

function chooseVisualDomain(text: string): Domain {
  const matches = matchedDomains(text);
  if (matches.size === 0) return "general";

  // Multi-topic governor/legislative agenda stories are policy stories, not a
  // sports/classroom/energy image merely because one agenda item contains a
  // domain keyword. Three or more competing domains plus politics is a strong
  // signal that the visual should remain a neutral government/policy scene.
  if (matches.has("politics") && matches.size >= 3) return "politics";

  for (const domain of VISUAL_DOMAIN_PRIORITY) if (matches.has(domain)) return domain;
  return "general";
}

export function inferDomain(text: string): Domain {
  return chooseVisualDomain(text);
}

export function inferArticleImageDomain(primaryText: string, fallbackText: string): Domain {
  const primary = chooseVisualDomain(primaryText);
  return primary !== "general" ? primary : chooseVisualDomain(fallbackText);
}

const DOMAIN_STEER: Record<Domain, string> = {
  wildlife: "the actual named animal or species in its natural habitat; when no species is named, use a believable Texas wildlife habitat, refuge, fishing water, or hunting-access landscape instead of inventing an animal",
  weather: "the actual weather event affecting a recognizable Texas landscape",
  energy: "the actual Texas energy infrastructure described in the story",
  sports: "the actual sport named in the story, photographed during believable athletic action or practice in a real outdoor course, track, field, stadium, or competition setting",
  military: "the actual military subject named in the story; for honors or remembrance coverage, center the specific medal, decoration, folded flag, memorial, or remembrance setting rather than generic bases, aircraft, hangars, or troops",
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
  const evidenceLock = subject.evidenceGuidance ? `EVIDENCE CONSTRAINTS: ${subject.evidenceGuidance} ` : "";
  const storyText = `${subject.title} ${subject.firstParagraph} ${subject.concreteSubject}`;
  const isMilitaryHonors = subject.domain === "military" && MILITARY_HONORS_RE.test(`${subject.title} ${subject.firstParagraph}`);
  const militaryHonorsLock = isMilitaryHonors
    ? "MILITARY HONORS OVERRIDE: This is an honors/remembrance story. Make the named medal, decoration, folded flag, memorial, or remembrance subject dominate the frame. Do not center a politician, government building, press event, generic military base, aircraft, hangar, unrelated combat scene, or generic troops. "
    : "";
  const isWeatherPreparedness = subject.domain === "weather" && WEATHER_PREPAREDNESS_RE.test(`${subject.title} ${subject.firstParagraph}`);
  if (isWeatherPreparedness) {
    return `${correction}${evidenceLock}OBJECT-ONLY TEXAS PREPAREDNESS DOCUMENTARY PHOTOGRAPH. ZERO PEOPLE IN FRAME: no adults, children, faces, hands, silhouettes, or human figures. Horizontal 16:9, physical 35mm camera look, bright natural indoor daylight, realistic household textures and depth of field. Story: ${subject.title}. PRIMARY SUBJECT: a Texas household emergency-preparedness inventory arranged on a kitchen, dining, mudroom, or utility-room surface before any emergency. Clearly show multiple hazard-specific objects: sealed water jugs and a battery-powered fan for extreme heat and outages; outdoor faucet covers or pipe insulation for hard freezes; weather radio, flashlights, batteries and power bank for storms and outages; N95 masks for wildfire smoke; waterproof document pouch and packed evacuation bag for flood or hurricane evacuation; first-aid kit, medication organizer, pet carrier or leash, and shelf-stable food. ${loc ? `Location context: ${loc}, Texas.` : "Believable Texas home setting."} No storm scene, darkness, frightened family, people, survivalist fantasy, readable text, logos, maps, flags, state shapes, illustration, infographic, collage, poster, or graphic design.`.slice(0, 1800);
  }
  if (SENSITIVE_VIOLENCE_RE.test(storyText)) {
    return `${correction}${evidenceLock}NON-GRAPHIC REAL NEWS PHOTOGRAPH ONLY. Horizontal 16:9 documentary photojournalism captured with a physical camera, natural daylight, realistic roadway textures and depth of field. Story context: ${subject.title}. PRIMARY SUBJECT: the real-world Texas location and traffic aftermath relevant to the report, such as an empty interstate lane, overpass, shoulder, lane-closure cones, traffic-control vehicles, or distant generic law-enforcement vehicles where appropriate. ${loc ? `Location context: ${loc}, Texas.` : "Believable Texas roadway setting."} ZERO PEOPLE and ZERO VIOLENCE IN FRAME: no victim, suspect, body, blood, injury, weapon, firearm, gun, muzzle flash, confrontation, crash victim, reenactment, speech bubble, dramatic action, or identifiable person. The image must look like a restrained local-news location photograph, not a reconstruction of the crime. No illustration, cartoon, vector art, poster, collage, infographic, typography, readable signage, logo, or sensational imagery.`.slice(0, 1800);
  }
  if (subject.domain === "energy" && DATA_CENTER_POLICY_RE.test(storyText)) {
    return `${correction}${evidenceLock}INFRASTRUCTURE-ONLY REAL NEWS PHOTOGRAPH. ZERO PEOPLE IN FRAME. Horizontal 16:9 documentary photojournalism captured with a physical camera, natural daylight, realistic industrial materials, optics and depth of field. Story context: ${subject.title}. PRIMARY SUBJECT: a believable Texas data-center campus or large server-facility exterior with cooling equipment, utility substation, transmission lines, transformers, fenced industrial grounds, or electrical infrastructure clearly visible. ${loc ? `Location context: ${loc}, Texas.` : "Believable Texas industrial setting."} Represent the policy action only through the infrastructure under review; do not depict a governor, politician, public official, press conference, podium, government signing, identifiable face, protest, or invented readable document. No people, portraits, illustration, cartoon, vector art, poster, collage, infographic, typography, readable signs, logos, flags, or state-shaped graphics.`.slice(0, 1800);
  }
  if (subject.domain === "legal") {
    return `${correction}${evidenceLock}Professional documentary photojournalism photograph, horizontal 16:9. Story: ${subject.title}. Photograph ${DOMAIN_STEER.legal}. Natural daylight or realistic courtroom lighting, 35mm camera, lifelike stone and wood, true photographic depth of field, realistic architecture, neutral news photography. PRIMARY SUBJECT: a believable real Texas courthouse or courtroom representing the judicial ruling. ${loc ? `Location context: ${loc}, Texas.` : "Texas setting."} Election-law context may appear only as subtle ordinary paperwork or voting materials in the background. Do not use a politician, Texas-shaped graphic, map, flagpole, capitol dome, campaign rally, podium, poster, illustration, vector art, cartoon, infographic, collage, text overlay, seal, logo, or symbolic state graphic.`.slice(0, 1800);
  }
  if (subject.domain === "sports") {
    return `${correction}${evidenceLock}REAL SPORTS PHOTOJOURNALISM PHOTOGRAPH ONLY, horizontal 16:9, captured with a physical professional camera, natural stadium or outdoor daylight, realistic motion blur where appropriate, authentic grass/dirt/track/course textures, true photographic depth of field, lifelike anatomy and equipment. Story: ${subject.title}. PRIMARY SUBJECT: ${subject.concreteSubject}. Depict ${DOMAIN_STEER.sports}. Match the exact sport in the story: cross-country coverage must show believable distance runners on a real course or meet setting; punting coverage must show a believable football punter or special-teams practice/action on a real field. ${loc ? `Location context: ${loc}, Texas.` : "Believable Texas collegiate athletics setting."} Use anonymous athletes with no readable school logos, jersey text, sponsor marks, or identifiable faces. The frame must look like an ordinary newspaper sports photograph, never concept art or promotional artwork. No illustration, cartoon, digital painting, vector art, poster, collage, typography, readable signage, mascot, logo, trophy graphic, symbolic state shape, or invented named athlete likeness.`.slice(0, 1800);
  }
  if (subject.domain === "culture") {
    return `${correction}${evidenceLock}REAL DOCUMENTARY PHOTOGRAPH ONLY, horizontal 16:9, candid Texas event photojournalism captured with a physical 35mm camera, natural daylight, realistic lens depth, real materials, real food and real venue architecture. Story: ${subject.title}. PRIMARY SUBJECT: ${subject.concreteSubject}. Depict ${DOMAIN_STEER.culture}. ${loc ? `Location context: ${loc}, Texas.` : "Believable Texas setting."} For a festival move or planned event, prefer a believable outdoor venue, festival-ground preparation, food-vendor setup, tables, tents, or ordinary event infrastructure rather than inventing a packed crowd. The image must look like an unedited newspaper photograph, not promotional artwork. Absolutely no event flyer, advertisement, poster, banner, signboard, mascot, giant novelty object, typography, readable words, title text, logo, vector shapes, illustration, painting, cartoon, collage, or graphic design.`.slice(0, 1800);
  }
  return `${correction}${evidenceLock}${militaryHonorsLock}Professional photorealistic editorial news photograph, horizontal 16:9, documentary photojournalism, natural lighting, realistic textures, believable perspective and depth of field. PRIMARY SUBJECT: ${subject.concreteSubject}. Depict ${DOMAIN_STEER[subject.domain]}. ${loc ? `Location context: ${loc}, Texas.` : "Believable Texas setting where relevant."} One coherent real-world scene. No illustration, vector art, cartoon, infographic, collage, poster, text overlay, watermark, logo, generic symbolic placeholder, or fabricated recognizable face.`.slice(0, 1800);
}

export function buildNegativeImagePrompt(subject: SubjectExtract, rejectedReason = ""): string {
  const items = [
    "illustration", "cartoon", "drawing", "painting", "digital art", "vector art", "graphic design",
    "infographic", "poster", "3D render", "clip art", "flat icon", "symbolic placeholder", "collage",
    "split screen", "text", "headline", "caption", "watermark", "logo", "low detail", "plastic texture",
    "CGI", "concept art", "comic", "anime", "stylized", "surreal",
  ];
  const storyText = `${subject.title} ${subject.firstParagraph} ${subject.concreteSubject}`;
  if (subject.domain === "weather" && WEATHER_PREPAREDNESS_RE.test(`${subject.title} ${subject.firstParagraph}`)) items.unshift(
    "people", "person", "family", "adults", "children", "faces", "hands", "human figures", "silhouettes",
    "family huddled in darkness", "generic disaster scene", "single dramatic storm", "disaster movie scene",
    "storm spectacle", "survivalist fantasy", "Texas-shaped symbol",
  );
  if (SENSITIVE_VIOLENCE_RE.test(storyText)) items.unshift(
    "people", "person", "faces", "hands", "victim", "suspect", "body", "blood", "injury", "weapon", "firearm",
    "gun", "muzzle flash", "shooting", "confrontation", "reenactment", "speech bubble", "crime reconstruction",
    "sensational violence", "dramatic crash victim",
  );
  if (subject.domain === "energy" && DATA_CENTER_POLICY_RE.test(storyText)) items.unshift(
    "people", "person", "politician", "governor", "public official", "portrait", "identifiable face", "press conference",
    "podium", "government signing", "protest", "readable document", "campaign imagery",
  );
  if (subject.evidenceGuidance) items.push(
    "fabricated recognizable face", "invented casualty", "invented damage", "invented crowd", "invented protest",
    "invented rally", "invented document text", "unsupported official seal", "unsupported numerical text",
  );
  if (subject.domain === "legal") items.push(
    "Texas state silhouette", "Texas-shaped graphic", "map of Texas", "politician", "candidate", "campaign rally",
    "podium", "flagpole", "capitol dome", "election icon", "ballot illustration", "government seal",
  );
  if (subject.domain === "sports") items.push(
    "school logo", "team logo", "readable jersey text", "mascot", "trophy graphic", "sports poster",
    "promotional athlete portrait", "invented named athlete likeness", "classroom", "lecture hall", "graduation scene",
  );
  if (subject.domain === "military" && MILITARY_HONORS_RE.test(`${subject.title} ${subject.firstParagraph}`)) items.push(
    "politician", "governor", "press conference", "capitol building", "government signing ceremony",
    "generic military base", "generic aircraft", "hangar", "unrelated combat", "generic troops",
  );
  if (subject.domain === "culture") items.push(
    "event flyer", "advertisement", "promotional graphic", "event poster", "banner", "signboard",
    "readable signage", "typography", "mascot", "giant novelty object", "oversized food mascot",
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
