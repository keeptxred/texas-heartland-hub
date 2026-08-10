const decodeEntities = (value) => value
  .replace(/&nbsp;|&#xa0;/gi, ' ')
  .replace(/&amp;/gi, '&')
  .replace(/&quot;/gi, '"')
  .replace(/&#39;|&apos;/gi, "'")
  .replace(/&lt;/gi, '<')
  .replace(/&gt;/gi, '>')
  .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));

export function htmlToText(html) {
  return decodeEntities(String(html))
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<br\s*\/?\s*>/gi, '\n')
    .replace(/<\/(p|div|tr|li|h[1-6]|table)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\r/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function extractElementById(html, id) {
  const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = `<([a-z0-9]+)\\b[^>]*\\bid\\s*=\\s*["']?${escaped}["']?[^>]*>([\\s\\S]*?)<\\/\\1>`;
  const match = String(html).match(new RegExp(pattern, 'i'));
  return match ? htmlToText(match[2]) : null;
}

function normalizeHeading(value) {
  return value.toUpperCase().replace(/[^A-Z0-9& ]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function splitSections(text, aliases) {
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
  const sections = {};
  let current = null;
  for (const line of lines) {
    const normalized = normalizeHeading(line);
    const found = Object.entries(aliases).find(([, names]) => names.some((name) => normalized === name || normalized.startsWith(`${name} `)));
    if (found) {
      current = found[0];
      sections[current] ||= [];
    } else if (current) {
      sections[current].push(line);
    }
  }
  return Object.fromEntries(Object.entries(sections).map(([key, value]) => [key, value.join('\n').trim()]).filter(([, value]) => value));
}

export function parseAnalysis(html) {
  const text = htmlToText(html);
  const sections = splitSections(text, {
    background_and_purpose: ['BACKGROUND AND PURPOSE', 'BACKGROUND / PURPOSE'],
    criminal_justice_impact: ['CRIMINAL JUSTICE IMPACT'],
    rulemaking_authority: ['RULEMAKING AUTHORITY'],
    analysis: ['ANALYSIS', 'SECTION BY SECTION ANALYSIS', 'BILL ANALYSIS'],
    comparison_of_original_and_substitute: ['COMPARISON OF ORIGINAL AND SUBSTITUTE'],
    committee_amendments: ['COMMITTEE AMENDMENTS'],
    statement_of_legislative_intent: ['STATEMENT OF LEGISLATIVE INTENT'],
    election_date: ['ELECTION DATE'],
  });
  const title = (text.match(/^(?:BILL|RESOLUTION) ANALYSIS$/m) || [])[0] || null;
  const version = (text.match(/\b(Committee Report \([^\n]+\)|As (?:Filed|Introduced|Engrossed|Enrolled|Amended))\b/i) || [])[0] || null;
  return { document_kind: 'analysis', title, version, sections, extracted_text: text };
}

export function parseFiscalNote(html) {
  const text = htmlToText(html);
  const date = (text.match(/\b(?:January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, \d{4}\b/) || [])[0] || null;
  const summary = extractElementById(html, 'divSumStmt');
  const general = extractElementById(html, 'divGenStmt');
  const localGovernmentImpact = extractElementById(html, 'divLocalGov');
  const sourceAgencies = extractElementById(html, 'divEditAgySource');
  const inRe = extractElementById(html, 'divEditInRe');
  const amounts = [...new Set((text.match(/\$[\d,]+(?:\.\d{2})?/g) || []))];
  return {
    document_kind: 'fiscal_note', date, in_re: inRe,
    summary, general_description: general,
    local_government_impact: localGovernmentImpact,
    source_agencies: sourceAgencies,
    monetary_amounts: amounts,
    no_state_fiscal_implication: /no fiscal implication to the state is anticipated/i.test(summary || text),
    no_local_fiscal_implication: /no fiscal implication to (?:units of )?local government is anticipated/i.test(localGovernmentImpact || text),
    extracted_text: text,
  };
}

function parseWitnessPerson(line) {
  const match = line.match(/^(.+?)(?:\s*\((.+)\))?$/);
  if (!match) return { name: line, organization: null };
  return { name: match[1].trim(), organization: match[2]?.trim() || null };
}

export function parseWitnessList(html) {
  const text = htmlToText(html);
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
  const hearingDate = (text.match(/\b(?:January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, \d{4}(?:\s*-\s*\d{1,2}:\d{2}\s*(?:AM|PM))?/i) || [])[0] || null;
  const committee = lines.find((line) => / Committee$/i.test(line) && !/REPORT/i.test(line)) || null;
  let testimonyType = null;
  let position = null;
  const witnesses = [];
  const ignored = /^(WITNESS LIST|H[BS]R? \d+|S[BS]R? \d+|HOUSE COMMITTEE REPORT|SENATE COMMITTEE REPORT|\d+)$/i;
  for (const line of lines) {
    if (/^(Testifying|Registering, but not testifying|Providing written testimony):?$/i.test(line)) { testimonyType = line.replace(/:$/, ''); continue; }
    const pos = line.match(/^(For|Against|On)\s*:?$/i);
    if (pos) { position = pos[1].toLowerCase(); continue; }
    if (!testimonyType || !position || ignored.test(line) || line === committee || line === hearingDate) continue;
    const person = parseWitnessPerson(line);
    witnesses.push({ ...person, position, testimony_type: testimonyType.toLowerCase() });
  }
  return { document_kind: 'witness_list', committee, hearing_date: hearingDate, witnesses, extracted_text: text };
}

export function parseOfficialDocument(documentType, html) {
  if (documentType === 'analysis') return parseAnalysis(html);
  if (documentType === 'fiscal_note') return parseFiscalNote(html);
  if (documentType === 'witness_list') return parseWitnessList(html);
  return { document_kind: documentType, extracted_text: htmlToText(html) };
}
