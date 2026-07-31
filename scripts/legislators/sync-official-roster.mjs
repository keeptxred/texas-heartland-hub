import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const REVIEWED_AT = new Date().toISOString().slice(0, 10);
const HOUSE_LIST_URL = "https://house.texas.gov/members";
const SENATE_LIST_URL = "https://senate.texas.gov/members.php";
const LRL_SEARCH_URL = "https://lrl.texas.gov/legeLeaders/members/membersearch.cfm";
const TEXAS_ETHICS = "https://www.ethics.state.tx.us/search/cf/";
const OUTPUT = resolve(process.cwd(), "src/data/texas-legislators.generated.ts");

const entityMap = {
  amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " ",
  iacute: "í", Iacute: "Í", aacute: "á", Aacute: "Á", eacute: "é", Eacute: "É",
  oacute: "ó", Oacute: "Ó", uacute: "ú", Uacute: "Ú", ntilde: "ñ", Ntilde: "Ñ",
};

function decodeHtml(value = "") {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&([a-z]+);/gi, (match, name) => entityMap[name] ?? match);
}

function cleanText(value = "") {
  return decodeHtml(value)
    .replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function normalizeName(value = "") {
  return cleanText(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\b(rep(?:resentative)?|sen(?:ator)?)\b/g, "")
    .replace(/\b(jr|sr|ii|iii|iv)\b/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function slugify(value) {
  return normalizeName(value).replace(/\s+/g, "-");
}

function sentenceList(text) {
  return cleanText(text)
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+(?=[A-Z0-9“\"])/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length >= 24);
}

function unique(values) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function reverseHouseName(value) {
  const decoded = cleanText(value).replace(/\s+/g, " ").trim();
  const comma = decoded.indexOf(",");
  if (comma < 0) return decoded;
  const last = decoded.slice(0, comma).trim();
  const first = decoded.slice(comma + 1).trim();
  return `${first} ${last}`.replace(/\s+/g, " ").trim();
}

async function fetchText(url, options = {}, attempt = 1) {
  const response = await fetch(url, {
    redirect: "follow",
    headers: { "user-agent": "KeepTXRed authority roster sync/1.0" },
    ...options,
  });
  if (!response.ok) {
    if (attempt < 3 && response.status >= 500) {
      await new Promise((resolveDelay) => setTimeout(resolveDelay, attempt * 400));
      return fetchText(url, options, attempt + 1);
    }
    throw new Error(`${response.status} ${response.statusText}: ${url}`);
  }
  return response.text();
}

async function mapLimit(items, limit, mapper) {
  const results = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await mapper(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

function parseLrlRows(html, chamber) {
  const rows = [...html.matchAll(/<tr>([\s\S]*?)<\/tr>/gi)].map((match) => match[1]);
  return rows.flatMap((row) => {
    const member = /memberDisplay\.cfm\?memberID=(\d+)[^>]*>[\s\S]*?(?:&nbsp;\s*&nbsp;|<br>)([^<]+)<\/a>/i.exec(row);
    if (!member) return [];
    const cells = [...row.matchAll(/<td[^>]*class="results"[^>]*>([\s\S]*?)<\/td>/gi)]
      .map((cell) => cleanText(cell[1]));
    const district = Number(cells.find((value) => /^\d+$/.test(value)));
    const partyCode = cells.find((value) => value === "R" || value === "D") ?? null;
    const serviceRange = cells.find((value) => /^\d{4}\s*-\s*(?:\d{4}|present)$/i.test(value)) ?? "";
    const home = cells.find((value) => value.includes(",")) ?? "";
    return [{
      chamber,
      memberId: Number(member[1]),
      name: cleanText(member[2]),
      nameKey: normalizeName(member[2]),
      district,
      party: partyCode,
      serviceRange,
      home,
    }];
  });
}

function parseServiceHistory(html, chamber) {
  const matches = [...html.matchAll(/([A-Z][a-z]{2}\s+\d{1,2},\s+\d{4})\s*-\s*(?:([A-Z][a-z]{2}\s+\d{1,2},\s+\d{4})|Present)[\s\S]{0,300}?(House|Senate) District\s+(\d+)/gi)];
  const relevant = matches.filter((match) => match[3].toLowerCase() === chamber);
  const starts = relevant.map((match) => ({ date: match[1], district: Number(match[4]) }));
  starts.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  return starts;
}

function extractHouseBiography(html) {
  const section = /<section id="biography">([\s\S]*?)<\/section>/i.exec(html)?.[1] ?? "";
  return cleanText(section.replace(/^.*?<h2[^>]*>Biography<\/h2>/is, ""));
}

function educationFromBiography(biography, chamberLabel) {
  const matches = sentenceList(biography).filter((sentence) =>
    /\b(degree|graduat|university|college|law school|school of law|bachelor|master|doctor(?:al|ate)?|juris|academy)\b/i.test(sentence),
  );
  return unique(matches).slice(0, 4).length
    ? unique(matches).slice(0, 4)
    : [`The official ${chamberLabel} biography does not publish a separate education credential.`];
}

function careerFromBiography(name, chamber, district, biography) {
  const matches = sentenceList(biography).filter((sentence) =>
    /\b(work|career|attorney|lawyer|business|teacher|educator|served|service|professional|owner|founder|president|director|judge|mayor|military|veteran|farmer|rancher|physician|engineer|realtor|minister|police|sheriff)\b/i.test(sentence),
  );
  const office = chamber === "house" ? "Texas House" : "Texas Senate";
  return unique([
    `${name} currently represents ${office} District ${district}.`,
    ...matches,
  ]).slice(0, 5);
}

function conciseBiography(name, chamber, district, biography) {
  const office = chamber === "house" ? "Texas House" : "Texas Senate";
  const selected = sentenceList(biography).slice(0, 3).join(" ");
  if (selected.length >= 80) return selected.slice(0, 1_200).trim();
  return `${name} represents ${office} District ${district} in the 89th Texas Legislature. This profile connects official biography, committee, legislative, campaign-finance and district sources.`;
}

function electionHistory(chamber, serviceHistory) {
  const office = chamber === "house" ? "Texas House" : "Texas Senate";
  const first = serviceHistory[0];
  const milestones = [];
  if (first) milestones.push({ year: String(new Date(first.date).getFullYear()), result: `Began service in the ${office}.` });
  milestones.push({ year: "2025–2027", result: "Serving during the 89th Texas Legislature." });
  return unique(milestones.map((item) => JSON.stringify(item))).map((item) => JSON.parse(item));
}

function houseRoster(html) {
  const encoded = /<get-members\s+:members="([\s\S]*?)"><\/get-members>/i.exec(html)?.[1];
  if (!encoded) throw new Error("Texas House roster payload was not found");
  const payload = JSON.parse(decodeHtml(encoded));
  return payload
    .filter((member) => Number(member.active) === 1)
    .map((member) => ({
      name: reverseHouseName(member.member_name),
      district: Number(member.id),
      code: String(member.member_bill_code),
      website: `https://house.texas.gov/members/${member.member_bill_code}`,
      imageUrl: new URL(member.image, "https://house.texas.gov/").href,
    }))
    .sort((a, b) => a.district - b.district);
}

function senateRoster(html) {
  const entries = [...html.matchAll(/<div class="mempicdiv"><a href="member\.php\?d=(\d+)"><img src="([^"]+)"[^>]*><\/a><br><a href="member\.php\?d=\1">([\s\S]*?)<\/a><br><span class="shrinkb">District \1<\/span><\/div>/gi)];
  return entries.map((match) => {
    const district = Number(match[1]);
    const label = cleanText(match[3]);
    const vacant = /constituent services|vacant/i.test(label);
    return {
      district,
      name: vacant ? null : label.replace(/\s+/g, " ").trim(),
      vacant,
      website: `https://senate.texas.gov/member.php?d=${district}`,
      imageUrl: new URL(match[2], "https://senate.texas.gov/").href,
    };
  }).sort((a, b) => a.district - b.district);
}

function parseSenatePage(html) {
  const field = (label) => cleanText(new RegExp(`<p class="meminfo"><span>${label}:<\\/span>\\s*([\\s\\S]*?)<\\/p>`, "i").exec(html)?.[1] ?? "");
  const biography = cleanText(/<div class="bio">([\s\S]*?)<\/div>/i.exec(html)?.[1] ?? "");
  const committeeSection = /<h2[^>]*id="cmtes"[^>]*>[\s\S]*?<\/h2>([\s\S]*?)<h2[^>]*id="distinfo"/i.exec(html)?.[1] ?? "";
  const committees = [...committeeSection.matchAll(/<li>([\s\S]*?)<\/li>/gi)]
    .map((match) => cleanText(match[1]).replace(/\s+—\s+/g, " — "))
    .filter(Boolean);
  return {
    biography,
    education: field("Education"),
    legislativeExperience: field("Legislative Experience"),
    party: field("Party"),
    committees,
  };
}

function lrlMatch(rows, name, district) {
  const key = normalizeName(name);
  return rows.find((row) => row.nameKey === key && row.district === district)
    ?? rows.find((row) => row.district === district);
}

function serialize(value) {
  return JSON.stringify(value, null, 2)
    .replace(/"([^"\\]+)":/g, "$1:")
    .replace(/\n/g, "\n");
}

async function main() {
  const [houseListHtml, senateListHtml, lrlHouseHtml, lrlSenateHtml] = await Promise.all([
    fetchText(HOUSE_LIST_URL),
    fetchText(SENATE_LIST_URL),
    fetchText(LRL_SEARCH_URL, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded", "user-agent": "KeepTXRed authority roster sync/1.0" }, body: "leg=89&chamber=H" }),
    fetchText(LRL_SEARCH_URL, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded", "user-agent": "KeepTXRed authority roster sync/1.0" }, body: "leg=89&chamber=S" }),
  ]);

  const house = houseRoster(houseListHtml);
  const senateSeats = senateRoster(senateListHtml);
  const lrlHouse = parseLrlRows(lrlHouseHtml, "house");
  const lrlSenate = parseLrlRows(lrlSenateHtml, "senate");

  if (house.length !== 150) throw new Error(`Expected 150 House members, received ${house.length}`);
  if (senateSeats.length !== 31) throw new Error(`Expected 31 Senate seats, received ${senateSeats.length}`);

  const houseProfiles = await mapLimit(house, 12, async (member) => {
    const lrl = lrlMatch(lrlHouse, member.name, member.district);
    const [bioHtml, committees, lrlHtml] = await Promise.all([
      fetchText(`${member.website}/biography`),
      fetchText(`https://house.texas.gov/api/getMemberCommittees/${member.code}`).then((text) => JSON.parse(text)),
      lrl?.memberId ? fetchText(`https://lrl.texas.gov/legeLeaders/members/memberDisplay.cfm?memberID=${lrl.memberId}`) : Promise.resolve(""),
    ]);
    const biography = extractHouseBiography(bioHtml);
    const serviceHistory = parseServiceHistory(lrlHtml, "house");
    const committeeLabels = committees.map((committee) =>
      committee.position && committee.position !== "Member"
        ? `${committee.committeeName} — ${committee.position}`
        : committee.committeeName,
    );
    return {
      slug: slugify(member.name),
      name: member.name,
      chamber: "house",
      district: member.district,
      party: lrl?.party ?? null,
      website: member.website,
      imageUrl: member.imageUrl,
      officialCode: `A${member.code}`,
      home: lrl?.home || null,
      vacant: false,
      authority: {
        slug: slugify(member.name),
        reviewedAt: REVIEWED_AT,
        biography: conciseBiography(member.name, "house", member.district, biography),
        career: careerFromBiography(member.name, "house", member.district, biography),
        education: educationFromBiography(biography, "Texas House"),
        committees: committeeLabels.length ? committeeLabels : ["No current committee assignment is published by the Texas House."],
        electionHistory: electionHistory("house", serviceHistory),
        districtOverview: `Texas House District ${member.district}${lrl?.home ? ` is represented from ${lrl.home}` : ""}. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.`,
        financeUrl: TEXAS_ETHICS,
        financeLabel: "Texas Ethics Commission campaign-finance search",
        newsKeywords: unique([member.name, `Representative ${member.name}`, `House District ${member.district}`]),
        sources: [
          { label: "Official Texas House member page", url: member.website },
          { label: "Official Texas House biography", url: `${member.website}/biography` },
          { label: "Official Texas House committee assignments", url: `${member.website}/committees` },
          { label: "Texas Legislature Online member record", url: `https://capitol.texas.gov/Members/MemberInfo.aspx?Leg=89&Chamber=H&Code=A${member.code}` },
          ...(lrl?.memberId ? [{ label: "Legislative Reference Library service history", url: `https://lrl.texas.gov/legeLeaders/members/memberDisplay.cfm?memberID=${lrl.memberId}` }] : []),
        ],
      },
    };
  });

  const senateProfiles = await mapLimit(senateSeats, 10, async (seat) => {
    if (seat.vacant) return {
      slug: `texas-senate-district-${seat.district}-vacant`,
      name: null,
      chamber: "senate",
      district: seat.district,
      party: null,
      website: seat.website,
      imageUrl: null,
      officialCode: null,
      home: null,
      vacant: true,
      authority: null,
    };
    const html = await fetchText(seat.website);
    const parsed = parseSenatePage(html);
    const lrl = lrlMatch(lrlSenate, seat.name, seat.district);
    const lrlHtml = lrl?.memberId ? await fetchText(`https://lrl.texas.gov/legeLeaders/members/memberDisplay.cfm?memberID=${lrl.memberId}`) : "";
    const serviceHistory = parseServiceHistory(lrlHtml, "senate");
    const education = parsed.education
      ? parsed.education.split(/;\s*/).map((item) => item.trim()).filter(Boolean)
      : educationFromBiography(parsed.biography, "Texas Senate");
    return {
      slug: slugify(seat.name),
      name: seat.name,
      chamber: "senate",
      district: seat.district,
      party: parsed.party.startsWith("Republican") ? "R" : parsed.party.startsWith("Democrat") ? "D" : lrl?.party ?? null,
      website: seat.website,
      imageUrl: seat.imageUrl,
      officialCode: null,
      home: lrl?.home || null,
      vacant: false,
      authority: {
        slug: slugify(seat.name),
        reviewedAt: REVIEWED_AT,
        biography: conciseBiography(seat.name, "senate", seat.district, parsed.biography),
        career: unique([
          `${seat.name} currently represents Texas Senate District ${seat.district}.`,
          ...(parsed.legislativeExperience ? [`Legislative experience: ${parsed.legislativeExperience}.`] : []),
          ...careerFromBiography(seat.name, "senate", seat.district, parsed.biography).slice(1),
        ]).slice(0, 5),
        education,
        committees: parsed.committees.length ? parsed.committees : ["No current committee assignment is published by the Texas Senate."],
        electionHistory: electionHistory("senate", serviceHistory),
        districtOverview: `Texas Senate District ${seat.district}${lrl?.home ? ` is represented from ${lrl.home}` : ""}. District boundaries and address-level representation should be verified through the official Texas Legislature lookup.`,
        financeUrl: TEXAS_ETHICS,
        financeLabel: "Texas Ethics Commission campaign-finance search",
        newsKeywords: unique([seat.name, `Senator ${seat.name}`, `Senate District ${seat.district}`]),
        sources: [
          { label: "Official Texas Senate member page and biography", url: seat.website },
          { label: "Texas Legislature Online Senate directory", url: "https://capitol.texas.gov/Members/Members.aspx?Chamber=S" },
          ...(lrl?.memberId ? [{ label: "Legislative Reference Library service history", url: `https://lrl.texas.gov/legeLeaders/members/memberDisplay.cfm?memberID=${lrl.memberId}` }] : []),
        ],
      },
    };
  });

  const seats = [...houseProfiles, ...senateProfiles];
  const seated = seats.filter((seat) => !seat.vacant);
  const duplicateSlugs = seated.map((seat) => seat.slug).filter((slug, index, all) => all.indexOf(slug) !== index);
  if (duplicateSlugs.length) throw new Error(`Duplicate legislator slugs: ${duplicateSlugs.join(", ")}`);
  if (seated.length !== 180) throw new Error(`Expected 180 seated legislators, received ${seated.length}`);
  if (seated.some((seat) => !seat.party || !seat.authority?.committees.length || !seat.authority?.education.length)) {
    throw new Error("One or more seated legislators are missing party, committee or education authority data");
  }

  const file = `/* eslint-disable */\n/**\n * Generated from official Texas House, Texas Senate, Texas Legislature Online,\n * and Legislative Reference Library sources by scripts/legislators/sync-official-roster.mjs.\n * Reviewed ${REVIEWED_AT}. Do not edit this file manually.\n */\n\nimport type { RepresentativeAuthority } from "./representative-authority";\n\nexport type TexasLegislativeChamber = "house" | "senate";\n\nexport type TexasLegislativeSeat = {\n  slug: string;\n  name: string | null;\n  chamber: TexasLegislativeChamber;\n  district: number;\n  party: "R" | "D" | null;\n  website: string;\n  imageUrl: string | null;\n  officialCode: string | null;\n  home: string | null;\n  vacant: boolean;\n  authority: RepresentativeAuthority | null;\n};\n\nexport const TEXAS_LEGISLATIVE_SEATS: TexasLegislativeSeat[] = ${serialize(seats)};\n\nexport const TEXAS_HOUSE_SEATS = TEXAS_LEGISLATIVE_SEATS.filter((seat) => seat.chamber === "house");\nexport const TEXAS_SENATE_SEATS = TEXAS_LEGISLATIVE_SEATS.filter((seat) => seat.chamber === "senate");\nexport const TEXAS_LEGISLATORS = TEXAS_LEGISLATIVE_SEATS.filter((seat): seat is TexasLegislativeSeat & { name: string; party: "R" | "D"; authority: RepresentativeAuthority } => !seat.vacant && Boolean(seat.name && seat.party && seat.authority));\nexport const TEXAS_LEGISLATOR_AUTHORITY = TEXAS_LEGISLATORS.map((seat) => seat.authority);\n\nexport function getTexasLegislativeSeatBySlug(slug: string) {\n  return TEXAS_LEGISLATIVE_SEATS.find((seat) => seat.slug === slug);\n}\n`;

  await mkdir(dirname(OUTPUT), { recursive: true });
  await writeFile(OUTPUT, file, "utf8");
  process.stdout.write(`Generated ${houseProfiles.length} House profiles, ${senateProfiles.filter((seat) => !seat.vacant).length} Senate profiles and ${senateProfiles.filter((seat) => seat.vacant).length} vacancy record.\n`);
}

await main();
