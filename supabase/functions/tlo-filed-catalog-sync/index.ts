import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

type Chamber = "house" | "senate";
type Measure = {
  billType: string;
  billNumber: number;
  chamber: Chamber;
  caption: string;
  authors: string[];
  sponsors: string[];
  lastActionRaw: string;
  lastActionDate: string | null;
  statusCode: string;
  statusLabel: string;
  becameLaw: boolean;
  sourceUrl: string;
  billTextUrl: string;
};

const USER_AGENT = "Mozilla/5.0 (compatible; KeepTXRed/1.0; +https://keeptxred.com)";
const MEASURE_RE = /^(HB|HCR|HJR|HR|SB|SCR|SJR|SR)\s+(\d+)$/i;
const LABEL_RE = /^(Author|Sponsor|Last Action|Caption)\s*:?\s*$/i;
const ENTITIES: Record<string, string> = {
  amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " ",
  iacute: "í", Iacute: "Í", aacute: "á", Aacute: "Á", eacute: "é", Eacute: "É",
  oacute: "ó", Oacute: "Ó", uacute: "ú", Uacute: "Ú", ntilde: "ñ", Ntilde: "Ñ",
  uuml: "ü", Uuml: "Ü",
};

function decodeHtml(value: string) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&([a-z]+);/gi, (match, name) => ENTITIES[name] ?? match)
    .replace(/\u00a0/g, " ");
}

function htmlToLines(html: string) {
  let source = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ");
  source = source
    .replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(/<(?:tr|td|th|p|div|li|h[1-6]|section|article|center|a|span)\b[^>]*>/gi, "\n")
    .replace(/<\/(?:tr|td|th|p|div|li|h[1-6]|table|tbody|thead|section|article|center|a|span)>/gi, "\n")
    .replace(/<[^>]+>/g, " ");
  return decodeHtml(source)
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.replace(/[\t\f\v ]+/g, " ").trim())
    .filter(Boolean);
}

function normalizeTokens(lines: string[]) {
  const output: string[] = [];
  for (const line of lines) {
    const compact = line.replace(/\s+/g, " ").trim();
    if (compact === ":") continue;
    const measure = compact.match(/^(HB|HCR|HJR|HR|SB|SCR|SJR|SR)\s*(\d+)(.*)$/i);
    if (measure) {
      output.push(`${measure[1].toUpperCase()} ${measure[2]}`);
      if (measure[3].trim()) output.push(measure[3].trim());
      continue;
    }
    const exactLabel = compact.match(/^(Author|Sponsor|Last Action|Caption)\s*:?\s*$/i);
    if (exactLabel) {
      output.push(`${exactLabel[1]}:`);
      continue;
    }
    const inlineLabel = compact.match(/^(Author|Sponsor|Last Action|Caption)\s*:\s*(.+)$/i);
    if (inlineLabel) {
      output.push(`${inlineLabel[1]}:`);
      output.push(inlineLabel[2].trim());
      continue;
    }
    output.push(compact);
  }
  return output;
}

function cleanPeople(raw: string) {
  const seen = new Set<string>();
  const output: string[] = [];
  for (const name of raw.split("|").map((value) => value.trim()).filter(Boolean)) {
    if (/^et al\.?$/i.test(name) || seen.has(name)) continue;
    seen.add(name);
    output.push(name);
  }
  return output;
}

function toIsoDate(raw: string) {
  const match = raw.match(/\b(\d{2})\/(\d{2})\/(\d{4})\b/);
  return match ? `${match[3]}-${match[1]}-${match[2]}` : null;
}

function normalizeStatus(raw: string) {
  const text = raw.replace(/^\s*\d{2}\/\d{2}\/\d{4}\s+[HSE]\s*/i, "").trim();
  if (/vetoed by the governor/i.test(text)) return { code: "vetoed", label: "Vetoed by the Governor", law: false };
  if (/effective/i.test(text)) return { code: "effective", label: text || "Effective", law: true };
  if (/signed by the governor|signed by governor/i.test(text)) return { code: "signed", label: text || "Signed by the Governor", law: true };
  if (/filed with the secretary of state/i.test(text)) return { code: "filed_with_sos", label: text, law: false };
  if (/passed|adopted/i.test(text)) return { code: "passed", label: text, law: false };
  if (/filed$/i.test(text)) return { code: "filed", label: "Filed", law: false };
  return { code: "latest_action", label: text || "Filed", law: false };
}

function historyUrl(type: string, number: number, session: string) {
  return `https://capitol.texas.gov/billlookup/History.aspx?LegSess=${session}&Bill=${type}${number}`;
}

function textUrl(type: string, number: number, session: string) {
  return `https://capitol.texas.gov/billlookup/Text.aspx?LegSess=${session}&Bill=${type}${number}`;
}

function parseReport(html: string, chamber: Chamber, session: string) {
  const lines = normalizeTokens(htmlToLines(html));
  const expectedMatch = lines.join("\n").match(/Number of Bills:\s*([\d,]+)/i);
  const expected = expectedMatch ? Number(expectedMatch[1].replace(/,/g, "")) : null;
  const starts: number[] = [];
  for (let index = 0; index < lines.length; index += 1) if (MEASURE_RE.test(lines[index])) starts.push(index);

  const measures: Measure[] = [];
  for (let blockIndex = 0; blockIndex < starts.length; blockIndex += 1) {
    const start = starts[blockIndex];
    const end = blockIndex + 1 < starts.length ? starts[blockIndex + 1] : lines.length;
    const identifier = lines[start].match(MEASURE_RE);
    if (!identifier) continue;
    const type = identifier[1].toUpperCase();
    const number = Number(identifier[2]);
    const fields: Record<string, string[]> = { "Author:": [], "Sponsor:": [], "Last Action:": [], "Caption:": [] };
    let current: string | null = null;
    for (let index = start + 1; index < end; index += 1) {
      const label = lines[index].match(LABEL_RE);
      if (label) {
        current = `${label[1]}:`;
        continue;
      }
      if (current && fields[current]) fields[current].push(lines[index]);
    }
    const caption = fields["Caption:"].join(" ").replace(/\s+/g, " ").trim();
    if (!caption) continue;
    const lastActionRaw = fields["Last Action:"].join(" ").replace(/\s+/g, " ").trim();
    const status = normalizeStatus(lastActionRaw);
    measures.push({
      billType: type.toLowerCase(), billNumber: number, chamber, caption,
      authors: cleanPeople(fields["Author:"].join(" ")), sponsors: cleanPeople(fields["Sponsor:"].join(" ")),
      lastActionRaw, lastActionDate: toIsoDate(lastActionRaw), statusCode: status.code,
      statusLabel: status.label, becameLaw: status.law,
      sourceUrl: historyUrl(type, number, session), billTextUrl: textUrl(type, number, session),
    });
  }
  return { expected, measures };
}

function normalizeSession(raw: string) {
  const session = raw.trim().toUpperCase();
  const match = session.match(/^(\d{2})(R|\d+)$/);
  if (!match) throw new Error(`Unsupported session ${raw}`);
  return { session, legislature: Number(match[1]), sessionCode: match[2] };
}

function slugify(name: string) {
  return name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function chunks<T>(values: T[], size: number) {
  const output: T[][] = [];
  for (let index = 0; index < values.length; index += size) output.push(values.slice(index, index + size));
  return output;
}

async function fetchReport(chamber: Chamber, session: string) {
  const reportName = chamber === "house" ? "housefiled" : "senatefiled";
  const candidates = [
    `https://capitol.texas.gov/tlodocs/${session}/reports/${reportName}.htm`,
    `https://capitol.texas.gov/reports/Report.aspx?ID=${reportName}&LegSess=${session}`,
  ];
  for (const url of candidates) {
    const response = await fetch(url, { headers: { "user-agent": USER_AGENT, accept: "text/html,application/xhtml+xml" }, redirect: "follow" });
    const html = await response.text();
    const parsed = parseReport(html, chamber, session);
    if (response.ok && parsed.measures.length) return { ...parsed, url: response.url };
  }
  throw new Error(`No ${chamber} measures parsed for ${session}`);
}

Deno.serve(async (request) => {
  if (request.method !== "POST") return Response.json({ error: "POST required" }, { status: 405 });
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return Response.json({ error: "Supabase configuration missing" }, { status: 500 });
  const db = createClient(url, key, { auth: { persistSession: false } });
  try {
    const body = await request.json().catch(() => ({}));
    const { session, legislature, sessionCode } = normalizeSession(String(body.session || "89R"));
    const dryRun = body.dry_run !== false;
    const [house, senate] = await Promise.all([fetchReport("house", session), fetchReport("senate", session)]);
    const measures = [...house.measures, ...senate.measures];
    const expected = (house.expected ?? 0) + (senate.expected ?? 0);
    if (expected && measures.length !== expected) throw new Error(`Parser count mismatch parsed=${measures.length} expected=${expected}`);
    const typeCounts = Object.fromEntries([...new Set(measures.map((measure) => measure.billType))].sort().map((type) => [type, measures.filter((measure) => measure.billType === type).length]));
    if (dryRun) return Response.json({ ok: true, dry_run: true, session, expected, parsed: measures.length, house: { expected: house.expected, parsed: house.measures.length, source: house.url }, senate: { expected: senate.expected, parsed: senate.measures.length, source: senate.url }, type_counts: typeCounts });

    const { data: sessionRow, error: sessionError } = await db.from("legislative_sessions").select("id").eq("legislature_number", legislature).eq("session_code", sessionCode).maybeSingle();
    if (sessionError) throw sessionError;
    if (!sessionRow) throw new Error(`Missing session ${session}`);

    const existing = new Set<string>();
    for (let from = 0; ; from += 1000) {
      const { data, error } = await db.from("bills").select("bill_type,bill_number").eq("legislature_number", legislature).eq("session_code", sessionCode).range(from, from + 999);
      if (error) throw error;
      for (const row of data ?? []) existing.add(`${String(row.bill_type).toLowerCase()}:${row.bill_number}`);
      if ((data ?? []).length < 1000) break;
    }
    const missing = measures.filter((measure) => !existing.has(`${measure.billType}:${measure.billNumber}`));
    const preexisting = measures.length - missing.length;
    let created = 0;
    let actions = 0;
    let sponsors = 0;

    for (const batch of chunks(missing, 250)) {
      const now = new Date().toISOString();
      const payload = batch.map((measure) => ({
        legislative_session_id: sessionRow.id, legislature_number: legislature, session_code: sessionCode,
        bill_type: measure.billType, bill_number: measure.billNumber, chamber: measure.chamber,
        caption: measure.caption, current_status_code: measure.statusCode, current_status_label: measure.statusLabel,
        last_action_date: measure.lastActionDate, became_law: measure.becameLaw, source_url: measure.sourceUrl,
        bill_text_url: measure.billTextUrl, is_active: true, last_synced_at: now, updated_at: now,
      }));
      const { data: rows, error } = await db.from("bills").upsert(payload, { onConflict: "legislature_number,session_code,bill_type,bill_number", ignoreDuplicates: true }).select("id,bill_type,bill_number");
      if (error) throw error;
      created += (rows ?? []).length;
      const ids = new Map((rows ?? []).map((row: any) => [`${String(row.bill_type).toLowerCase()}:${row.bill_number}`, row.id]));
      const actionRows: any[] = [];
      const sponsorRows: any[] = [];
      for (const measure of batch) {
        const billId = ids.get(`${measure.billType}:${measure.billNumber}`);
        if (!billId) continue;
        if (measure.lastActionDate && measure.lastActionRaw) actionRows.push({ bill_id: billId, action_date: measure.lastActionDate, action_sequence: 900000, chamber: measure.chamber, action_code: "tlo-filed-report-latest", action_text: measure.lastActionRaw.replace(/^\d{2}\/\d{2}\/\d{4}\s+[HSE]\s*/i, "").trim() || measure.statusLabel, normalized_status: measure.statusCode, source_url: measure.sourceUrl });
        let sequence = 0;
        for (const name of measure.authors) sponsorRows.push({ bill_id: billId, sponsor_name: name, sponsor_slug: slugify(name), sponsor_role: "author", chamber: measure.chamber, sequence: sequence++ });
        sequence = 0;
        const other: Chamber = measure.chamber === "house" ? "senate" : "house";
        for (const name of measure.sponsors) sponsorRows.push({ bill_id: billId, sponsor_name: name, sponsor_slug: slugify(name), sponsor_role: "sponsor", chamber: other, sequence: sequence++ });
      }
      if (actionRows.length) {
        const { error } = await db.from("bill_actions").upsert(actionRows, { onConflict: "bill_id,action_date,action_sequence,action_text", ignoreDuplicates: true });
        if (error) throw error;
        actions += actionRows.length;
      }
      if (sponsorRows.length) {
        const { error } = await db.from("bill_sponsors").upsert(sponsorRows, { onConflict: "bill_id,representative_id,external_legislator_id,sponsor_name,sponsor_role", ignoreDuplicates: true });
        if (error) throw error;
        sponsors += sponsorRows.length;
      }
    }
    return Response.json({ ok: true, dry_run: false, session, expected, parsed: measures.length, type_counts: typeCounts, preexisting, missing: missing.length, created, seeded_latest_actions: actions, seeded_visible_authors_sponsors: sponsors });
  } catch (error) {
    return Response.json({ ok: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
});
