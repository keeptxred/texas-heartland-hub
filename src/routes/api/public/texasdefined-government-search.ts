import { createFileRoute } from "@tanstack/react-router";

import candidatesSnapshot from "@/data/elections/2026/candidates.json";
import pollsSnapshot from "@/data/elections/2026/polls.json";
import racesSnapshot from "@/data/elections/2026/races.json";
import {
  STATE_LEADERSHIP,
  TEXAS_HOUSE_MEMBERS,
  TEXAS_SENATE_MEMBERS,
  US_HOUSE_DELEGATION,
  US_SENATORS,
  representativeSlug,
} from "@/data/representatives";

const KTR_ORIGIN = "https://keeptxred.com";
const MAX_QUERY_LENGTH = 300;
const DEFAULT_LIMIT = 8;
const MAX_LIMIT = 10;
const MAX_DB_CANDIDATES = 30;

type KnowledgeKind =
  | "representative"
  | "bill"
  | "committee"
  | "candidate"
  | "race"
  | "poll"
  | "article"
  | "government-hub";

type Factuality =
  | "government-record"
  | "election-record"
  | "poll"
  | "news-report"
  | "reference";

type KnowledgeResult = {
  id: string;
  kind: KnowledgeKind;
  title: string;
  summary: string;
  url: string;
  sourceUrl: string | null;
  dataAsOf: string | null;
  factuality: Factuality;
  score: number;
};

const STOP_WORDS = new Set([
  "a", "about", "and", "are", "can", "did", "do", "does", "for", "from", "how", "i", "in", "is", "it",
  "me", "my", "of", "on", "or", "tell", "texas", "that", "the", "this", "to", "was", "what", "when", "where",
  "which", "who", "why", "with", "you", "your",
]);

const GOVERNMENT_HUBS: KnowledgeResult[] = [
  {
    id: "hub-representatives",
    kind: "government-hub",
    title: "Texas Representatives",
    summary: "Directory of Texas federal and state elected officials, including all Texas House and Senate districts.",
    url: `${KTR_ORIGIN}/representatives`,
    sourceUrl: null,
    dataAsOf: null,
    factuality: "reference",
    score: 0,
  },
  {
    id: "hub-legislature",
    kind: "government-hub",
    title: "Texas Legislature",
    summary: "Keep TX Red's Texas Legislature directory for bills, sessions, committees, votes and legislative districts.",
    url: `${KTR_ORIGIN}/texas-legislature`,
    sourceUrl: "https://capitol.texas.gov/",
    dataAsOf: null,
    factuality: "reference",
    score: 0,
  },
  {
    id: "hub-elections",
    kind: "government-hub",
    title: "Texas Elections 2026",
    summary: "Verified Texas election races, candidates, voting dates, polls and election reference material.",
    url: `${KTR_ORIGIN}/elections/2026`,
    sourceUrl: "https://www.sos.texas.gov/elections/",
    dataAsOf: null,
    factuality: "reference",
    score: 0,
  },
  {
    id: "hub-laws",
    kind: "government-hub",
    title: "Texas Laws",
    summary: "Texas civic-law explainers and references maintained by Keep TX Red with primary-source links.",
    url: `${KTR_ORIGIN}/laws`,
    sourceUrl: "https://statutes.capitol.texas.gov/",
    dataAsOf: null,
    factuality: "reference",
    score: 0,
  },
  {
    id: "hub-districts",
    kind: "government-hub",
    title: "Texas Legislative Districts",
    summary: "Permanent Texas House and Senate district reference pages linked to current members, elections, bills and committees.",
    url: `${KTR_ORIGIN}/districts`,
    sourceUrl: null,
    dataAsOf: null,
    factuality: "reference",
    score: 0,
  },
];

function corsHeaders(request: Request) {
  const origin = request.headers.get("origin") ?? "";
  const allowed = new Set([
    "https://texasdefined.com",
    "https://www.texasdefined.com",
    "https://keeptxred.com",
    "https://www.keeptxred.com",
  ]);
  return {
    "access-control-allow-origin": allowed.has(origin) ? origin : "https://texasdefined.com",
    "access-control-allow-methods": "GET, OPTIONS",
    "access-control-allow-headers": "content-type",
    "cache-control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
    "x-content-type-options": "nosniff",
    vary: "Origin",
  };
}

function normalize(value: unknown) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function termsFor(query: string) {
  return normalize(query)
    .split(" ")
    .filter((term) => term.length >= 2 && !STOP_WORDS.has(term))
    .slice(0, 10);
}

function cleanSummary(value: unknown, max = 520) {
  return String(value ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function scoreText(query: string, terms: string[], title: string, summary: string) {
  const normalizedQuery = normalize(query);
  const normalizedTitle = normalize(title);
  const normalizedSummary = normalize(summary);
  let score = 0;
  if (normalizedTitle === normalizedQuery) score += 30;
  else if (normalizedQuery.length >= 3 && normalizedTitle.includes(normalizedQuery)) score += 14;
  if (normalizedQuery.length >= 5 && normalizedSummary.includes(normalizedQuery)) score += 8;
  for (const term of terms) {
    if (normalizedTitle.split(" ").includes(term)) score += 5;
    else if (normalizedTitle.includes(term)) score += 3;
    if (normalizedSummary.includes(term)) score += 1;
  }
  return score;
}

function safeOfficialSource(value: unknown) {
  if (typeof value !== "string") return null;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" ? parsed.toString() : null;
  } catch {
    return null;
  }
}

function recordSource(record: Record<string, unknown>) {
  const source = record.source;
  if (typeof source !== "object" || source === null) return null;
  return safeOfficialSource(Reflect.get(source, "sourceUrl"));
}

function representatives(query: string, terms: string[]): KnowledgeResult[] {
  const rows = [
    ...US_SENATORS,
    ...STATE_LEADERSHIP,
    ...US_HOUSE_DELEGATION,
    ...TEXAS_SENATE_MEMBERS,
    ...TEXAS_HOUSE_MEMBERS,
  ];
  return rows.map((rep) => {
    const summary = [rep.office, rep.district, rep.party === "R" ? "Republican" : "Democratic", rep.phoneTX ? `Texas office ${rep.phoneTX}` : null, rep.phoneDC ? `Washington office ${rep.phoneDC}` : null]
      .filter(Boolean)
      .join(" · ");
    return {
      id: `representative-${representativeSlug(rep.name)}`,
      kind: "representative" as const,
      title: rep.name,
      summary,
      url: `${KTR_ORIGIN}/representatives/${representativeSlug(rep.name)}`,
      sourceUrl: safeOfficialSource(rep.website),
      dataAsOf: null,
      factuality: "government-record" as const,
      score: scoreText(query, terms, `${rep.name} ${rep.office} ${rep.district ?? ""}`, summary) + 3,
    };
  }).filter((row) => row.score > 2);
}

function electionRecords(query: string, terms: string[]): KnowledgeResult[] {
  const races = racesSnapshot as Array<Record<string, unknown>>;
  const candidates = candidatesSnapshot as Array<Record<string, unknown>>;
  const polls = pollsSnapshot as Array<Record<string, unknown>>;
  const raceNameById = new Map(races.map((race) => [String(race.id ?? ""), String(race.name ?? race.shortName ?? "Texas election race")]));
  const output: KnowledgeResult[] = [];

  for (const race of races) {
    if (race.publicationStatus !== "published" || race.verificationStatus !== "verified") continue;
    const title = String(race.name ?? race.shortName ?? "Texas election race");
    const summary = cleanSummary([
      race.officeName,
      race.electionType,
      race.jurisdictionType,
      race.electionDate ? `Election ${race.electionDate}` : null,
      race.registrationDeadline ? `registration deadline ${race.registrationDeadline}` : null,
      race.earlyVotingStart && race.earlyVotingEnd ? `early voting ${race.earlyVotingStart} through ${race.earlyVotingEnd}` : null,
      race.status,
    ].filter(Boolean).join(" · "));
    const score = scoreText(query, terms, title, summary) + (normalize(query).includes("election") ? 2 : 0);
    if (score <= 2) continue;
    output.push({
      id: `race-${race.slug}`,
      kind: "race",
      title,
      summary,
      url: `${KTR_ORIGIN}/elections/races/${race.slug}`,
      sourceUrl: recordSource(race),
      dataAsOf: typeof race.dataAsOf === "string" ? race.dataAsOf : null,
      factuality: "election-record",
      score,
    });
  }

  for (const candidate of candidates) {
    if (candidate.publicationStatus !== "published" || candidate.verificationStatus !== "verified") continue;
    const title = String(candidate.fullName ?? candidate.ballotName ?? "Texas candidate");
    const raceName = raceNameById.get(String(candidate.primaryRaceId ?? "")) ?? "Texas election";
    const summary = cleanSummary([
      candidate.partyLabel,
      candidate.status,
      raceName,
      candidate.currentOfficeName,
      candidate.freshnessStatus ? `freshness ${candidate.freshnessStatus}` : null,
    ].filter(Boolean).join(" · "));
    const score = scoreText(query, terms, `${title} ${raceName}`, summary) + (normalize(query).includes("candidate") ? 2 : 0);
    if (score <= 2) continue;
    output.push({
      id: `candidate-${candidate.slug}`,
      kind: "candidate",
      title,
      summary,
      url: `${KTR_ORIGIN}/elections/candidates/${candidate.slug}`,
      sourceUrl: recordSource(candidate),
      dataAsOf: typeof candidate.dataAsOf === "string" ? candidate.dataAsOf : null,
      factuality: "election-record",
      score,
    });
  }

  for (const poll of polls) {
    if (poll.publicationStatus !== "published" || poll.verificationStatus !== "verified" || poll.status !== "published") continue;
    const title = String(poll.title ?? "Texas election poll");
    const pollster = typeof poll.pollster === "object" && poll.pollster !== null ? String(Reflect.get(poll.pollster, "name") ?? "") : "";
    const methodology = typeof poll.methodology === "object" && poll.methodology !== null ? poll.methodology as Record<string, unknown> : {};
    const summary = cleanSummary([
      pollster,
      poll.fieldStartDate && poll.fieldEndDate ? `fielded ${poll.fieldStartDate}–${poll.fieldEndDate}` : null,
      methodology.sampleSize ? `sample ${methodology.sampleSize}` : null,
      methodology.marginOfError ? `margin of error ±${methodology.marginOfError}` : null,
      poll.releaseDate ? `released ${poll.releaseDate}` : null,
    ].filter(Boolean).join(" · "));
    const score = scoreText(query, terms, title, summary) + (normalize(query).includes("poll") ? 5 : 0);
    if (score <= 3) continue;
    output.push({
      id: `poll-${poll.slug}`,
      kind: "poll",
      title,
      summary,
      url: `${KTR_ORIGIN}/elections/polls`,
      sourceUrl: recordSource(poll),
      dataAsOf: typeof poll.dataAsOf === "string" ? poll.dataAsOf : null,
      factuality: "poll",
      score,
    });
  }

  return output;
}

function hubs(query: string, terms: string[]) {
  return GOVERNMENT_HUBS.map((row) => ({ ...row, score: scoreText(query, terms, row.title, row.summary) }))
    .filter((row) => row.score > 2);
}

function exactBillReference(query: string) {
  const match = query.match(/\b(HB|SB|HJR|SJR|HCR|SCR|HR|SR)\s*0*(\d+)\b/i);
  if (!match) return null;
  return { billType: match[1].toUpperCase(), billNumber: Number(match[2]) };
}

function billUrl(row: Record<string, unknown>) {
  const legislature = Number(row.legislature_number);
  const session = String(row.session_code ?? "").toLowerCase();
  const billType = String(row.bill_type ?? "").toLowerCase();
  const billNumber = Number(row.bill_number);
  if (!Number.isFinite(legislature) || !session || !billType || !Number.isFinite(billNumber)) return `${KTR_ORIGIN}/bills`;
  return `${KTR_ORIGIN}/bills/texas/${legislature}/${session}/${billType}/${billNumber}`;
}

function billResult(row: Record<string, unknown>, query: string, terms: string[], bonus = 0): KnowledgeResult {
  const identifier = String(row.bill_identifier ?? `${row.bill_type ?? "Bill"} ${row.bill_number ?? ""}`).trim();
  const caption = cleanSummary(row.short_title ?? row.caption ?? "Texas legislation", 220);
  const status = cleanSummary(row.current_status_label ?? row.current_status_description ?? "", 160);
  const core = cleanSummary(row.plain_language_summary ?? row.summary ?? row.description ?? row.caption ?? "", 420);
  const dates = [
    row.last_action_date ? `Last action ${row.last_action_date}` : null,
    row.signed_date ? `signed ${row.signed_date}` : null,
    row.effective_date ? `effective ${row.effective_date}` : null,
  ].filter(Boolean).join(" · ");
  const summary = cleanSummary([core, status ? `Status: ${status}` : null, dates].filter(Boolean).join(" "));
  return {
    id: `bill-${row.id}`,
    kind: "bill",
    title: `${identifier}${caption ? ` — ${caption}` : ""}`,
    summary,
    url: billUrl(row),
    sourceUrl: safeOfficialSource(row.source_url),
    dataAsOf: typeof row.last_synced_at === "string" ? row.last_synced_at : (typeof row.updated_at === "string" ? row.updated_at : null),
    factuality: "government-record",
    score: scoreText(query, terms, `${identifier} ${caption}`, summary) + bonus,
  };
}

async function databaseRecords(query: string, terms: string[]): Promise<KnowledgeResult[]> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const output: KnowledgeResult[] = [];
  const exactBill = exactBillReference(query);

  let billQuery = supabaseAdmin
    .from("bills" as never)
    .select("id,legislature_number,session_code,bill_type,bill_number,bill_identifier,caption,short_title,description,summary,plain_language_summary,current_status_label,current_status_description,last_action_date,signed_date,effective_date,became_law,source_url,updated_at,last_synced_at")
    .order("last_action_date", { ascending: false, nullsFirst: false })
    .limit(MAX_DB_CANDIDATES);

  if (exactBill) {
    billQuery = billQuery.eq("bill_type", exactBill.billType).eq("bill_number", exactBill.billNumber);
  } else {
    const billTerms = terms.filter((term) => term.length >= 3).slice(0, 4);
    if (billTerms.length) {
      const filters = billTerms.flatMap((term) => [
        `bill_identifier.ilike.%${term}%`,
        `caption.ilike.%${term}%`,
        `short_title.ilike.%${term}%`,
        `plain_language_summary.ilike.%${term}%`,
      ]);
      billQuery = billQuery.or(filters.join(","));
    } else {
      billQuery = billQuery.limit(0);
    }
  }

  const [billResponse, committeeResponse, articleResponse] = await Promise.all([
    billQuery,
    supabaseAdmin
      .from("legislative_committees" as never)
      .select("id,legislature_number,session_code,chamber,committee_name,committee_slug,description,source_url,updated_at")
      .order("updated_at", { ascending: false })
      .limit(250),
    supabaseAdmin
      .from("daily_articles" as never)
      .select("id,slug,title,dek,category,published_at,kind,internal_url,texas_impact_summary,source_name,source_url,keywords,updated_at")
      .not("published_at", "is", null)
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false })
      .limit(250),
  ]);

  if (!billResponse.error) {
    for (const raw of (billResponse.data ?? []) as unknown as Array<Record<string, unknown>>) {
      const result = billResult(raw, query, terms, exactBill ? 25 : 0);
      if (result.score > 2) output.push(result);
    }
  }

  if (!committeeResponse.error) {
    for (const row of (committeeResponse.data ?? []) as unknown as Array<Record<string, unknown>>) {
      const title = `${row.chamber === "house" ? "Texas House" : row.chamber === "senate" ? "Texas Senate" : "Texas Legislature"} — ${row.committee_name}`;
      const summary = cleanSummary(row.description ?? `${row.committee_name} legislative committee.`);
      const score = scoreText(query, terms, title, summary) + (normalize(query).includes("committee") ? 3 : 0);
      if (score <= 2) continue;
      output.push({
        id: `committee-${row.id}`,
        kind: "committee",
        title,
        summary,
        url: `${KTR_ORIGIN}/texas-legislature/committees/${row.committee_slug}`,
        sourceUrl: safeOfficialSource(row.source_url),
        dataAsOf: typeof row.updated_at === "string" ? row.updated_at : null,
        factuality: "government-record",
        score,
      });
    }
  }

  if (!articleResponse.error) {
    for (const row of (articleResponse.data ?? []) as unknown as Array<Record<string, unknown>>) {
      const title = String(row.title ?? "Keep TX Red article");
      const summary = cleanSummary(row.dek ?? row.texas_impact_summary ?? "Published Keep TX Red reporting.");
      const searchable = `${title} ${summary} ${row.category ?? ""} ${Array.isArray(row.keywords) ? row.keywords.join(" ") : ""}`;
      const score = scoreText(query, terms, searchable, summary);
      if (score <= 3) continue;
      const internalUrl = typeof row.internal_url === "string" && row.internal_url.startsWith("/") ? row.internal_url : `/news/${row.slug}`;
      output.push({
        id: `article-${row.id}`,
        kind: "article",
        title,
        summary,
        url: `${KTR_ORIGIN}${internalUrl}`,
        sourceUrl: safeOfficialSource(row.source_url),
        dataAsOf: typeof row.updated_at === "string" ? row.updated_at : (typeof row.published_at === "string" ? row.published_at : null),
        factuality: "news-report",
        score,
      });
    }
  }

  return output;
}

function dedupeAndRank(rows: KnowledgeResult[], limit: number) {
  const byUrl = new Map<string, KnowledgeResult>();
  for (const row of rows) {
    const existing = byUrl.get(row.url);
    if (!existing || row.score > existing.score) byUrl.set(row.url, row);
  }
  return [...byUrl.values()]
    .sort((a, b) => b.score - a.score || a.kind.localeCompare(b.kind) || a.title.localeCompare(b.title))
    .slice(0, limit);
}

export const Route = createFileRoute("/api/public/texasdefined-government-search")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => new Response(null, { status: 204, headers: corsHeaders(request) }),
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const query = (url.searchParams.get("q") ?? "").trim();
        if (query.length < 2 || query.length > MAX_QUERY_LENGTH) {
          return Response.json({ ok: false, error: `q must be between 2 and ${MAX_QUERY_LENGTH} characters` }, { status: 400, headers: corsHeaders(request) });
        }

        const requestedLimit = Number(url.searchParams.get("limit") ?? DEFAULT_LIMIT);
        const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(Math.floor(requestedLimit), 1), MAX_LIMIT) : DEFAULT_LIMIT;
        const terms = termsFor(query);
        if (!terms.length && !exactBillReference(query)) {
          return Response.json({ ok: true, query, results: [], corpus: "keeptxred-public-government-v1" }, { headers: corsHeaders(request) });
        }

        const staticRows = [...representatives(query, terms), ...electionRecords(query, terms), ...hubs(query, terms)];
        let databaseRows: KnowledgeResult[] = [];
        try {
          databaseRows = await databaseRecords(query, terms);
        } catch {
          // Static public government records remain useful if the database is temporarily unavailable.
        }

        const results = dedupeAndRank([...staticRows, ...databaseRows], limit);
        return Response.json({
          ok: true,
          query,
          count: results.length,
          results,
          corpus: "keeptxred-public-government-v1",
          scope: "Public-facing Keep TX Red government, elections, legislation and published reporting only; private operational data is excluded.",
          generatedAt: new Date().toISOString(),
        }, { headers: corsHeaders(request) });
      },
    },
  },
});
