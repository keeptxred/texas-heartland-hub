import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-import-secret",
};
const allowedDocumentTypes = new Set(["history", "bill_text", "analysis", "fiscal_note", "witness_list"]);
type JsonRecord = Record<string, unknown>;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function text(value: unknown) { return typeof value === "string" ? value : ""; }
function integer(value: unknown) { return Number.isInteger(value) ? Number(value) : null; }
const sessionPattern = /^(\d{2})(R|\d+)$/;
function parseSession(value: unknown) {
  const match = sessionPattern.exec(text(value));
  if (!match) return null;
  return { legislature_number: Number(match[1]), session_code: match[2] };
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !anonKey || !serviceKey) return json({ error: "Database configuration is missing" }, 500);

  const service = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const configuredSecret = Deno.env.get("LEGISLATIVE_DOCUMENT_IMPORT_SECRET");
  const directSecret = request.headers.get("x-import-secret");
  const directAuthorized = Boolean(configuredSecret && directSecret && configuredSecret === directSecret);
  if (!directAuthorized) {
    const authorization = request.headers.get("authorization") || "";
    const token = authorization.replace(/^Bearer\s+/i, "");
    if (!token) return json({ error: "Authentication required" }, 401);
    const authClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: `Bearer ${token}` } }, auth: { persistSession: false } });
    const { data: authData, error: authError } = await authClient.auth.getUser(token);
    if (authError || !authData.user) return json({ error: "Invalid authenticated session" }, 401);
    const { data: isAdmin, error: roleError } = await service.rpc("has_role", { _user_id: authData.user.id, _role: "admin" });
    if (roleError || !isAdmin) return json({ error: "Administrator role required" }, 403);
  }

  let body: JsonRecord;
  try { body = await request.json(); } catch { return json({ error: "Invalid JSON" }, 400); }
  const session = parseSession(body.session);
  if (!session) return json({ error: "Unsupported session identifier" }, 400);
  if (body.action === "refresh-latest") {
    const identities = Array.isArray(body.records) ? body.records.filter(isRecord) : [];
    if (!identities.length || identities.length > 100) return json({ error: "refresh-latest requires between 1 and 100 bill records" }, 400);
    const billIds: string[] = [];
    for (const billType of [...new Set(identities.map((record) => text(record.bill_type)))]) {
      const numbers = identities.filter((record) => record.bill_type === billType).map((record) => integer(record.bill_number)).filter((value): value is number => value !== null);
      const { data, error } = await service.from("bills").select("id").eq("legislature_number", session.legislature_number).eq("session_code", session.session_code).eq("bill_type", billType).in("bill_number", numbers);
      if (error) return json({ error: error.message }, 500);
      for (const bill of data || []) billIds.push(bill.id);
    }
    for (let index = 0; index < billIds.length; index += 10) {
      const results = await Promise.all(billIds.slice(index, index + 10).map((billId) => service.rpc("refresh_bill_document_latest_flags", { p_bill_id: billId })));
      const failure = results.find((result) => result.error)?.error;
      if (failure) return json({ error: failure.message, refreshed: index }, 500);
    }
    return json({ action: "refresh-latest", status: "completed", refreshed: billIds.length });
  }
  const mode = body.mode === "live" ? "live" : "dry-run";
  const records = Array.isArray(body.records) ? body.records.filter(isRecord) : [];
  if (!records.length || records.length > 100) return json({ error: "records must contain between 1 and 100 items" }, 400);
  if (body.schema_version !== 1) return json({ error: "Unsupported batch schema or session" }, 400);

  const counts: JsonRecord = { seen: records.length, imported: 0, updated: 0, skipped: 0, missing_bill: 0, errors: 0, reports: 0, bills: 0, by_document_type: {} };
  const errors: Array<{ source_record_key: string; error: string }> = [];
  const documentRecords = records.filter((record) => record.kind === "document");
  const reportRecords = records.filter((record) => record.kind === "report");
  const billRecords = records.filter((record) => record.kind === "bill");
  if (documentRecords.length + reportRecords.length + billRecords.length !== records.length) return json({ error: "Every record kind must be bill, document, or report" }, 400);

  if (billRecords.length) {
    if (documentRecords.length || reportRecords.length) return json({ error: "Bill batches cannot mix record kinds" }, 400);
    const existingBills = new Set<string>();
    for (const billType of [...new Set(billRecords.map((record) => text(record.bill_type)))]) {
      const numbers = billRecords.filter((record) => record.bill_type === billType).map((record) => integer(record.bill_number)).filter((value): value is number => value !== null);
      const { data, error } = await service.from("bills").select("bill_type,bill_number").eq("legislature_number", session.legislature_number).eq("session_code", session.session_code).eq("bill_type", billType).in("bill_number", numbers);
      if (error) return json({ error: error.message }, 500);
      for (const bill of data || []) existingBills.add(`${bill.bill_type}:${bill.bill_number}`);
    }
    const rows = billRecords.map(({ kind: _kind, source_record_key: _sourceRecordKey, ...row }) => row);
    const missingRows = rows.filter((row) => !existingBills.has(`${row.bill_type}:${row.bill_number}`));
    counts.imported = missingRows.length;
    counts.skipped = rows.length - missingRows.length;
    counts.bills = rows.length;
    if (mode === "live" && missingRows.length) {
      const { error } = await service.from("bills").insert(missingRows);
      if (error) return json({ error: error.message, counts }, 500);
    }
    return json({ mode, batch_index: integer(body.batch_index), counts, errors });
  }

  const billMap = new Map<string, string>();
  for (const billType of [...new Set(documentRecords.map((record) => text(record.bill_type)))]) {
    const numbers = [...new Set(documentRecords.filter((record) => record.bill_type === billType).map((record) => integer(record.bill_number)).filter((value): value is number => value !== null))];
    if (!billType || !numbers.length) continue;
    const { data, error } = await service.from("bills").select("id,bill_type,bill_number").eq("legislature_number", session.legislature_number).eq("session_code", session.session_code).eq("bill_type", billType).in("bill_number", numbers);
    if (error) return json({ error: error.message }, 500);
    for (const bill of data || []) billMap.set(`${bill.bill_type}:${bill.bill_number}`, bill.id);
  }

  async function existing(table: string, keys: string[]) {
    if (!keys.length) return new Map<string, string>();
    const { data, error } = await service.from(table).select("source_record_key,content_hash").eq("source_key", "texas-legislature-online-local").in("source_record_key", keys);
    if (error) throw error;
    return new Map((data || []).map((row) => [row.source_record_key, row.content_hash]));
  }

  try {
    const existingDocuments = await existing("bill_documents", documentRecords.map((record) => text(record.source_record_key)));
    const existingReports = await existing("legislative_report_indexes", reportRecords.map((record) => text(record.source_record_key)));
    const documentUpserts: JsonRecord[] = [];
    const reportUpserts: JsonRecord[] = [];
    const now = new Date().toISOString();

    for (const record of documentRecords) {
      const sourceRecordKey = text(record.source_record_key);
      const documentType = text(record.document_type);
      const billId = billMap.get(`${text(record.bill_type)}:${integer(record.bill_number)}`);
      if (!sourceRecordKey || !allowedDocumentTypes.has(documentType)) { counts.errors = Number(counts.errors) + 1; errors.push({ source_record_key: sourceRecordKey, error: "Invalid document identity or type" }); continue; }
      if (!billId) { counts.missing_bill = Number(counts.missing_bill) + 1; continue; }
      const previousHash = existingDocuments.get(sourceRecordKey);
      if (previousHash === record.content_hash) { counts.skipped = Number(counts.skipped) + 1; continue; }
      if (previousHash) counts.updated = Number(counts.updated) + 1; else counts.imported = Number(counts.imported) + 1;
      const byType = counts.by_document_type as JsonRecord;
      byType[documentType] = Number(byType[documentType] || 0) + 1;
      const { kind: _kind, ...row } = record;
      documentUpserts.push({ ...row, bill_id: billId, last_seen_at: now, last_imported_at: now });
    }
    for (const record of reportRecords) {
      const sourceRecordKey = text(record.source_record_key);
      if (!sourceRecordKey) { counts.errors = Number(counts.errors) + 1; errors.push({ source_record_key: "", error: "Invalid report identity" }); continue; }
      const previousHash = existingReports.get(sourceRecordKey);
      if (previousHash === record.content_hash) { counts.skipped = Number(counts.skipped) + 1; continue; }
      if (previousHash) counts.updated = Number(counts.updated) + 1; else counts.imported = Number(counts.imported) + 1;
      counts.reports = Number(counts.reports) + 1;
      const { kind: _kind, ...row } = record;
      reportUpserts.push({ ...row, last_seen_at: now, last_imported_at: now });
    }

    if (mode === "live" && Number(counts.missing_bill) > 0) {
      return json({ error: "Batch rejected atomically because one or more bill records are missing", counts, errors }, 409);
    }

    if (mode === "live") {
      if (documentUpserts.length) {
        const { error } = await service.from("bill_documents").upsert(documentUpserts, { onConflict: "source_key,source_record_key" });
        if (error) throw error;
      }
      if (reportUpserts.length) {
        const { error } = await service.from("legislative_report_indexes").upsert(reportUpserts, { onConflict: "source_key,source_record_key" });
        if (error) throw error;
      }
    }
    return json({ mode, batch_index: integer(body.batch_index), counts, errors });
  } catch (error) {
    const message = error instanceof Error ? error.message : isRecord(error) && typeof error.message === "string" ? error.message : JSON.stringify(error);
    return json({ error: message, counts, errors }, 500);
  }
});
