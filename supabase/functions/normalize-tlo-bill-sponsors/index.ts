import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

type Chamber = "house" | "senate";
type Member = {
  name: string;
  slug: string;
  chamber: Chamber;
  district: number;
  officialCode: string | null;
  tloCode?: string | null;
  profileExists: boolean;
};
type Alias = {
  old_name: string;
  chamber: Chamber;
  full_name: string;
  canonical_slug: string;
  district: string;
  external_legislator_id: string;
};

const KTR_ROSTER = "https://raw.githubusercontent.com/keeptxred/texas-heartland-hub/main/src/data/texas-legislators.generated.ts";
const TLO_HOUSE = "https://capitol.texas.gov/Members/Members.aspx?Chamber=H";
const TLO_SENATE = "https://capitol.texas.gov/Members/Members.aspx?Chamber=S";
const HEADERS = { "user-agent": "KeepTXRed legislative sponsor normalizer/3.0" };
const BATCH_LIMIT = 250;
const MAX_BATCHES_PER_RUN = 6;

const historical: Member[] = [
  { name: "Brian Birdwell", slug: "brian-birdwell", chamber: "senate", district: 22, officialCode: null, tloCode: "A1080", profileExists: false },
  { name: "Brandon Creighton", slug: "brandon-creighton", chamber: "senate", district: 4, officialCode: null, tloCode: "A1040", profileExists: false },
  { name: "Kelly Hancock", slug: "kelly-hancock", chamber: "senate", district: 9, officialCode: null, tloCode: "A1015", profileExists: false },
];

const entityMap: Record<string, string> = {
  amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " ",
  iacute: "í", Iacute: "Í", aacute: "á", Aacute: "Á", eacute: "é", Eacute: "É",
  oacute: "ó", Oacute: "Ó", uacute: "ú", Uacute: "Ú", ntilde: "ñ", Ntilde: "Ñ",
};

function decodeHtml(value = "") {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&([a-z]+);/gi, (match, name) => entityMap[name] ?? match);
}

function clean(value = "") {
  return decodeHtml(value)
    .replace(/<br\s*\/?\s*>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function key(value = "") {
  return clean(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\b(rep(?:resentative)?|sen(?:ator)?)\b/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function decodeTs(value: string) {
  try {
    return JSON.parse(`"${value}"`);
  } catch {
    return value.replace(/\\"/g, '"').replace(/\\\\/g, "\\");
  }
}

async function getText(url: string) {
  const response = await fetch(url, { headers: HEADERS, redirect: "follow" });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.text();
}

function parseKtrRoster(ts: string): Member[] {
  const out: Member[] = [];
  const re = /\{\s*slug:\s*"((?:\\.|[^"\\])*)",\s*name:\s*(?:"((?:\\.|[^"\\])*)"|null),\s*chamber:\s*"(house|senate)",\s*district:\s*(\d+),[\s\S]{0,1200}?officialCode:\s*(?:"((?:\\.|[^"\\])*)"|null),/g;
  for (const match of ts.matchAll(re)) {
    const name = match[2] ? decodeTs(match[2]) : "";
    if (!name) continue;
    out.push({
      slug: decodeTs(match[1]),
      name,
      chamber: match[3] as Chamber,
      district: Number(match[4]),
      officialCode: match[5] ? decodeTs(match[5]) : null,
      profileExists: true,
    });
  }
  return out;
}

function parseTloDirectory(html: string, chamber: Chamber) {
  const letter = chamber === "house" ? "H" : "S";
  const out: Array<{ label: string; code: string; chamber: Chamber }> = [];
  const re = new RegExp(`MemberInfo\\.aspx\\?Leg=89&Chamber=${letter}&Code=([^'\"]+)[^>]*>([\\s\\S]*?)<\\/a>`, "gi");
  for (const match of html.matchAll(re)) {
    const label = clean(match[2]);
    if (label) out.push({ label, code: match[1].toUpperCase(), chamber });
  }
  return out;
}

function uniqueMember(label: string, chamber: Chamber, members: Member[]): Member | null {
  const normalized = key(label);
  if (!normalized) return null;
  const pool = members.filter((member) => member.chamber === chamber);
  const exact = pool.filter((member) => key(member.name) === normalized);
  if (exact.length === 1) return exact[0];
  const suffix = pool.filter((member) => {
    const memberKey = key(member.name);
    return memberKey === normalized || memberKey.endsWith(` ${normalized}`);
  });
  return suffix.length === 1 ? suffix[0] : null;
}

function errorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

Deno.serve(async (request) => {
  if (request.method !== "POST") {
    return Response.json({ error: "POST required" }, { status: 405 });
  }

  const url = Deno.env.get("SUPABASE_URL");
  const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !service) {
    return Response.json({ error: "Supabase configuration missing" }, { status: 500 });
  }

  const db = createClient(url, service, { auth: { persistSession: false } });
  try {
    const [rosterTs, houseHtml, senateHtml] = await Promise.all([
      getText(KTR_ROSTER),
      getText(TLO_HOUSE),
      getText(TLO_SENATE),
    ]);

    const current = parseKtrRoster(rosterTs);
    if (current.length < 170) throw new Error(`KTR canonical roster parse failed: ${current.length}`);

    const members = [
      ...current,
      ...historical.filter((historicalMember) => !current.some(
        (member) => member.chamber === historicalMember.chamber
          && member.district === historicalMember.district
          && key(member.name) === key(historicalMember.name),
      )),
    ];

    const directory = [
      ...parseTloDirectory(houseHtml, "house"),
      ...parseTloDirectory(senateHtml, "senate"),
    ];
    if (directory.length < 170) throw new Error(`TLO 89th directory parse failed: ${directory.length}`);

    const aliasMap = new Map<string, { member: Member; code: string }>();
    const collisions = new Set<string>();
    for (const entry of directory) {
      let member: Member | null = null;
      if (entry.chamber === "house") {
        member = members.find((candidate) => candidate.chamber === "house" && candidate.officialCode?.toUpperCase() === entry.code) || null;
      }
      if (!member) {
        member = members.find((candidate) => candidate.chamber === entry.chamber && candidate.tloCode?.toUpperCase() === entry.code) || null;
      }
      if (!member) member = uniqueMember(entry.label, entry.chamber, members);
      if (!member) continue;

      const aliasKey = `${entry.chamber}:${key(entry.label)}`;
      const prior = aliasMap.get(aliasKey);
      if (prior && prior.member.slug !== member.slug) {
        collisions.add(aliasKey);
        aliasMap.delete(aliasKey);
        continue;
      }
      if (!collisions.has(aliasKey)) aliasMap.set(aliasKey, { member, code: entry.code });
    }

    const rows: any[] = [];
    for (let from = 0; ; from += 1000) {
      const { data, error } = await db
        .from("bill_sponsors")
        .select("sponsor_name,chamber,bill_id")
        .order("id")
        .range(from, from + 999);
      if (error) throw error;
      rows.push(...(data || []));
      if ((data || []).length < 1000) break;
    }

    const groups = new Map<string, { name: string; chamber: Chamber }>();
    for (const row of rows) {
      const chamber = String(row.chamber || "").toLowerCase();
      if (chamber !== "house" && chamber !== "senate") continue;
      groups.set(`${chamber}:${String(row.sponsor_name || "")}`, {
        name: String(row.sponsor_name || ""),
        chamber: chamber as Chamber,
      });
    }

    const aliases: Alias[] = [];
    const unresolved: any[] = [];
    for (const group of groups.values()) {
      const aliasKey = `${group.chamber}:${key(group.name)}`;
      let found = aliasMap.get(aliasKey) || null;
      if (!found) {
        const member = uniqueMember(group.name, group.chamber, members);
        if (member) {
          found = {
            member,
            code: member.tloCode || member.officialCode || String(member.district),
          };
        }
      }
      if (!found) {
        unresolved.push({ name: group.name, chamber: group.chamber });
        continue;
      }
      aliases.push({
        old_name: group.name,
        chamber: group.chamber,
        full_name: found.member.name,
        canonical_slug: found.member.slug,
        district: String(found.member.district),
        external_legislator_id: `tlo:${group.chamber}:${found.code}`,
      });
    }

    let updated = 0;
    let deduplicated = 0;
    let touched = 0;
    let batches = 0;
    let lastTouched = 0;
    for (let index = 0; index < MAX_BATCHES_PER_RUN; index += 1) {
      const { data, error } = await db.rpc("normalize_89th_bill_sponsors_batch", {
        p_aliases: aliases,
        p_limit: BATCH_LIMIT,
      });
      if (error) throw error;
      const result = (data || {}) as any;
      lastTouched = Number(result.touched_bills || 0);
      updated += Number(result.updated || 0);
      deduplicated += Number(result.deduplicated || 0);
      touched += lastTouched;
      batches += 1;
      if (lastTouched === 0) break;
    }

    return Response.json({
      ok: true,
      canonical_roster: current.length,
      master_roster: members.length,
      tlo_directory: directory.length,
      alias_keys: aliasMap.size,
      groups: groups.size,
      resolved_groups: aliases.length,
      unresolved_groups: unresolved.length,
      normalization: {
        aliases: aliases.length,
        updated,
        deduplicated,
        touched_bills: touched,
        batches,
        more_work: lastTouched === BATCH_LIMIT,
      },
      unresolved: unresolved.slice(0, 100),
    });
  } catch (error) {
    return Response.json({ ok: false, error: errorMessage(error) }, { status: 500 });
  }
});
