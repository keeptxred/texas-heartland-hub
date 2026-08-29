import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

type Bill = {
  id: string;
  legislature_number: number;
  session_code: string;
  bill_type: string;
  bill_number: number;
  bill_identifier: string;
  last_action_date: string | null;
};

type HistAction = {
  chamber: string | null;
  text: string;
  date: string;
  sourceUrl: string | null;
};

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (compatible; KeepTXRedBot/2.4; +https://keeptxred.com)",
  Accept: "text/html,application/xhtml+xml,*/*",
};

const clean = (value: string) => value
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1")
  .replace(/&nbsp;/gi, " ")
  .replace(/&amp;/gi, "&")
  .replace(/&quot;/gi, '"')
  .replace(/&#39;|&apos;/gi, "'")
  .replace(/&lt;/gi, "<")
  .replace(/&gt;/gi, ">")
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const span = (html: string, id: string) => clean(
  html.match(new RegExp(`<span[^>]+id=["']${id}["'][^>]*>([\\s\\S]*?)<\\/span>`, "i"))?.[1] || "",
);

const slug = (value: string) => value
  .toLowerCase()
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "");

const iso = (value: string) => {
  const match = value.match(/\b(\d{1,2})\/(\d{1,2})\/(\d{2,4})\b/);
  if (!match) return null;
  const year = match[3].length === 2 ? `20${match[3]}` : match[3];
  return `${year}-${match[1].padStart(2, "0")}-${match[2].padStart(2, "0")}`;
};

const absoluteUrl = (value: string) => {
  try {
    return new URL(value, "https://capitol.texas.gov/").toString();
  } catch {
    return null;
  }
};

const originatingChamber = (billType: string) => billType.startsWith("h")
  ? "house"
  : billType.startsWith("s")
    ? "senate"
    : "joint";

const errorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
};

async function fetchHtml(url: string, timeout = 18_000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      headers: HEADERS,
      redirect: "follow",
      signal: controller.signal,
    });
    return {
      ok: response.ok,
      status: response.status,
      text: response.ok ? await response.text() : "",
    };
  } finally {
    clearTimeout(timer);
  }
}

function historyActions(html: string): HistAction[] {
  const out: HistAction[] = [];
  for (const row of html.match(/<tr\b[\s\S]*?<\/tr>/gi) || []) {
    const cell = (label: string) => clean(
      row.match(new RegExp(`<td[^>]+data-label=["']${label}["'][^>]*>([\\s\\S]*?)<\\/td>`, "i"))?.[1] || "",
    );
    const text = cell("Action Description");
    const date = iso(cell("Action Date"));
    if (!text || !date) continue;
    const chamberCode = cell("Action Chamber").toUpperCase();
    const chamber = chamberCode === "H"
      ? "house"
      : chamberCode === "S"
        ? "senate"
        : chamberCode === "E"
          ? "executive"
          : null;
    const href = row.match(/<td[^>]+data-label=["']Action Description["'][^>]*>[\s\S]*?<a[^>]+href=["']([^"']+)["']/i)?.[1] || "";
    out.push({ text, date, chamber, sourceUrl: href ? absoluteUrl(href) : null });
  }
  return out;
}

function normalizedStatus(actions: HistAction[]) {
  const text = actions.map((action) => action.text.toLowerCase());
  if (text.some((value) => value.includes("vetoed"))) return ["vetoed", "Vetoed", false] as const;
  if (text.some((value) => value.includes("effective on") || value.includes("effective immediately"))) return ["effective", "Effective", true] as const;
  if (text.some((value) => value.includes("signed by the governor"))) return ["signed", "Signed", true] as const;
  if (text.some((value) => value.includes("sent to the governor"))) return ["sent-to-governor", "Sent to governor", false] as const;
  if (text.some((value) => /^passed\b/.test(value) || value.includes("passage"))) return ["passed", "Passed", false] as const;
  if (text.some((value) => value.includes("referred to"))) return ["referred-to-committee", "In committee", false] as const;
  return ["filed", "Filed", false] as const;
}

const milestone = (actions: HistAction[], pattern: RegExp, chamber?: string) =>
  actions.find((action) => (!chamber || action.chamber === chamber) && pattern.test(action.text))?.date || null;

function effectiveDate(actions: HistAction[]) {
  for (const action of actions) {
    if (!/effective/i.test(action.text)) continue;
    return iso(action.text) || (/effective immediately/i.test(action.text) ? action.date : null);
  }
  return null;
}

function committeeRecords(html: string) {
  const out: Array<{ name: string; chamber: string | null; status: string }> = [];
  for (const index of [1, 2, 3]) {
    const name = span(html, `lblComm${index}CommitteeValue`);
    if (!name) continue;
    const label = span(html, `lblComm${index}CommitteeLabel`);
    const status = span(html, `lblComm${index}CommitteeStatusValue`) || span(html, `lblComm${index}CommitteeStatus`);
    out.push({
      name,
      chamber: /senate/i.test(label) ? "senate" : /house/i.test(label) ? "house" : null,
      status,
    });
  }
  return out;
}

Deno.serve(async (request) => {
  if (request.method !== "POST") return Response.json({ error: "POST required" }, { status: 405 });

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) return Response.json({ error: "config missing" }, { status: 500 });

  const db = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const body = await request.json().catch(() => ({}));
  const targetedIds = Array.isArray(body.bill_ids)
    ? body.bill_ids.filter((value: any) => typeof value === "string" && /^[0-9a-f-]{36}$/i.test(value)).slice(0, 20)
    : [];
  const requested = targetedIds.length || Math.max(1, Math.min(Number(body.limit) || 10, 20));
  const stats: any = {
    requested,
    targeted: targetedIds.length > 0,
    selected: 0,
    enriched: 0,
    actions: 0,
    sponsors: 0,
    sponsors_existing: 0,
    committees: 0,
    skipped_no_history: 0,
    skipped_no_actions: 0,
    errors: [],
  };
  let runId: string | null = null;

  try {
    const startedAt = new Date().toISOString();
    const { data: run, error: runError } = await db
      .from("legislative_sync_runs")
      .insert({
        source_key: "tlo-seed-bill-enrichment",
        legislature_number: 89,
        session_code: "ALL",
        started_at: startedAt,
        status: "running",
        cursor_before: {
          requested_limit: requested,
          targeted: stats.targeted,
          targeted_count: targetedIds.length,
        },
        cursor_after: {},
        records_seen: 0,
        records_changed: 0,
        errors: [],
      })
      .select("id")
      .single();
    if (runError) throw runError;
    runId = run.id;

    let selected: Bill[] = [];
    if (targetedIds.length) {
      const { data, error } = await db
        .from("bills")
        .select("id,legislature_number,session_code,bill_type,bill_number,bill_identifier,last_action_date")
        .in("id", targetedIds)
        .eq("legislature_number", 89)
        .limit(20);
      if (error) throw error;
      selected = (data || []) as Bill[];
      if (selected.length !== targetedIds.length) {
        throw new Error(`Targeted enrichment rejected: ${targetedIds.length - selected.length} bill ids were missing or outside legislature 89`);
      }
    } else {
      const { data, error } = await db.rpc("get_tlo_seed_enrichment_candidates", { p_limit: requested });
      if (error) throw error;
      selected = (data || []) as Bill[];
    }

    stats.selected = selected.length;
    const now = new Date().toISOString();

    for (const bill of selected) {
      try {
        const token = `${bill.bill_type.toUpperCase()}${bill.bill_number}`;
        const historyUrl = `https://capitol.texas.gov/BillLookup/History.aspx?LegSess=${bill.legislature_number}${bill.session_code}&Bill=${token}`;
        const page = await fetchHtml(historyUrl, 20_000);
        if (!page.ok) {
          stats.skipped_no_history++;
          stats.errors.push(`${bill.bill_identifier}: HTTP ${page.status}`);
          continue;
        }

        const caption = span(page.text, "lblCaptionText");
        const actions = historyActions(page.text);
        if (!caption || !actions.length) {
          stats.skipped_no_actions++;
          stats.errors.push(`${bill.bill_identifier}: missing parsed caption/actions`);
          continue;
        }

        const status = normalizedStatus(actions);
        const chronological = [...actions].reverse();
        const introducedDate = chronological.find((action) => /filed/i.test(action.text))?.date || chronological[0]?.date || null;
        const historyLast = actions[0]?.date || introducedDate;
        const lastActionDate = bill.last_action_date && historyLast
          ? (bill.last_action_date > historyLast ? bill.last_action_date : historyLast)
          : (bill.last_action_date || historyLast);

        const { error: billUpdateError } = await db
          .from("bills")
          .update({
            caption,
            current_status_code: status[0],
            current_status_label: status[1],
            current_status_description: actions[0]?.text || status[1],
            introduced_date: introducedDate,
            last_action_date: lastActionDate,
            passed_house_date: milestone(actions, /^Passed$/i, "house"),
            passed_senate_date: milestone(actions, /^Passed$/i, "senate"),
            sent_to_governor_date: milestone(actions, /sent to the governor/i),
            signed_date: milestone(actions, /signed by the governor/i),
            effective_date: effectiveDate(actions),
            vetoed_date: milestone(actions, /vetoed/i),
            became_law: status[2],
            source_url: historyUrl,
            bill_text_url: `https://capitol.texas.gov/BillLookup/Text.aspx?LegSess=${bill.legislature_number}${bill.session_code}&Bill=${token}`,
            last_synced_at: now,
            updated_at: now,
          })
          .eq("id", bill.id);
        if (billUpdateError) throw billUpdateError;

        for (let index = 0; index < actions.length; index++) {
          const action = actions[index];
          const { data: existing } = await db
            .from("bill_actions")
            .select("id")
            .eq("bill_id", bill.id)
            .eq("action_date", action.date)
            .eq("action_text", action.text)
            .limit(1)
            .maybeSingle();
          if (existing?.id) continue;
          const { error } = await db.from("bill_actions").insert({
            bill_id: bill.id,
            action_date: action.date,
            action_sequence: 800000 - index,
            chamber: action.chamber,
            action_code: "tlo-history",
            action_text: action.text,
            source_url: action.sourceUrl || historyUrl,
            updated_at: now,
          });
          if (error) throw error;
          stats.actions++;
        }

        const chamber = originatingChamber(bill.bill_type);
        const sponsorGroups = [
          ["lblAuthor", "author", chamber],
          ["lblCoauthor", "coauthor", chamber],
          ["lblSponsor", "sponsor", chamber === "house" ? "senate" : "house"],
          ["lblCosponsor", "cosponsor", chamber === "house" ? "senate" : "house"],
        ] as const;
        let sequence = 0;
        for (const group of sponsorGroups) {
          for (const name of span(page.text, group[0]).split("|").map((value) => value.trim()).filter(Boolean)) {
            const row = {
              bill_id: bill.id,
              sponsor_name: name,
              sponsor_slug: slug(name),
              sponsor_role: group[1],
              chamber: group[2],
              sequence: sequence++,
            };
            const { data: written, error } = await db
              .from("bill_sponsors")
              .upsert(row, {
                onConflict: "bill_id,representative_id,external_legislator_id,sponsor_name,sponsor_role",
                ignoreDuplicates: true,
              })
              .select("id");
            if (error) throw error;
            if ((written || []).length) stats.sponsors++;
            else stats.sponsors_existing++;
          }
        }

        for (const [index, committee] of committeeRecords(page.text).entries()) {
          const { data: existing } = await db
            .from("bill_committee_history")
            .select("id")
            .eq("bill_id", bill.id)
            .eq("committee_name", committee.name)
            .eq("source_url", historyUrl)
            .limit(1)
            .maybeSingle();
          if (existing?.id) continue;
          const { error } = await db.from("bill_committee_history").insert({
            bill_id: bill.id,
            chamber: committee.chamber,
            committee_name: committee.name,
            action_type: "committee-status",
            action_description: committee.status || "Committee record from Texas Legislature Online",
            sequence: index,
            source_url: historyUrl,
            updated_at: now,
          });
          if (error) throw error;
          stats.committees++;
        }

        stats.enriched++;
      } catch (error) {
        stats.errors.push(`${bill.bill_identifier}: ${errorMessage(error)}`);
      }
    }

    const completedAt = new Date().toISOString();
    const runStatus = stats.errors.length ? "completed_with_warnings" : "completed";
    if (runId) {
      const { error: finishError } = await db
        .from("legislative_sync_runs")
        .update({
          completed_at: completedAt,
          status: runStatus,
          cursor_after: {
            requested: stats.requested,
            targeted: stats.targeted,
            selected: stats.selected,
            enriched: stats.enriched,
            actions: stats.actions,
            sponsors: stats.sponsors,
            sponsors_existing: stats.sponsors_existing,
            committees: stats.committees,
            skipped_no_history: stats.skipped_no_history,
            skipped_no_actions: stats.skipped_no_actions,
          },
          records_seen: stats.selected,
          records_changed: stats.enriched,
          errors: stats.errors,
        })
        .eq("id", runId);
      if (finishError) throw finishError;
    }

    return Response.json({ ok: true, run_id: runId, stats });
  } catch (error) {
    const message = errorMessage(error);
    if (runId) {
      await db
        .from("legislative_sync_runs")
        .update({
          completed_at: new Date().toISOString(),
          status: "failed",
          cursor_after: {
            requested: stats.requested,
            targeted: stats.targeted,
            selected: stats.selected,
            enriched: stats.enriched,
            actions: stats.actions,
            sponsors: stats.sponsors,
            sponsors_existing: stats.sponsors_existing,
            committees: stats.committees,
          },
          records_seen: stats.selected,
          records_changed: stats.enriched,
          errors: [...stats.errors, message],
        })
        .eq("id", runId);
    }
    return Response.json({ ok: false, error: message, run_id: runId, stats }, { status: 500 });
  }
});
