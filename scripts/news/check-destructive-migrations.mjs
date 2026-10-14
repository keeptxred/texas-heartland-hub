#!/usr/bin/env node
/**
 * Inspect only newly changed SQL migrations. Historic migrations may contain
 * destructive operations; they are not an instruction to rerun or delete data.
 * Published URLs require explicit archival and redirect handling, never
 * a silent bulk DELETE/TRUNCATE/DROP from a newly shipped migration.
 */
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

export function removeComments(sql) {
  return sql.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/--[^\r\n]*/g, " ");
}

export function unsafeStatements(sql) {
  const cleaned = removeComments(sql);
  // Match across newlines and quoting. Include unqualified table names.
  const pattern = /\b(?:delete\s+from|truncate\s+(?:table\s+)?|drop\s+table\s+(?:if\s+exists\s+)?)(?:(?:"?public"?\s*\.\s*)?)"?daily_articles"?(?=\s|;|,|$)/gi;
  return [...cleaned.matchAll(pattern)].map((m) => m[0].replace(/\s+/g, " ").trim());
}

if (process.argv.includes("--self-test")) {
  assert.deepEqual(unsafeStatements("DELETE FROM public.daily_articles WHERE kind='news';").length, 1);
  assert.deepEqual(unsafeStatements("delete \n from \n \"public\".\"daily_articles\";").length, 1);
  assert.deepEqual(unsafeStatements("TRUNCATE TABLE daily_articles;").length, 1);
  assert.deepEqual(unsafeStatements("DROP TABLE IF EXISTS public.daily_articles;").length, 1);
  assert.deepEqual(unsafeStatements("-- DELETE FROM public.daily_articles\n SELECT 1;"), []);
  assert.deepEqual(unsafeStatements("/* DROP TABLE daily_articles */ UPDATE public.daily_articles SET title = 'ok'").length, 0);
  console.log("News deletion migration gate self-tests passed.");
} else {
  const files = process.argv.slice(2);
  let blocked = false;
  for (const file of files) {
    if (!/\.sql$/i.test(file)) continue;
    const matches = unsafeStatements(readFileSync(file, "utf8"));
    for (const statement of matches) {
      console.error("BLOCKED destructive published-news migration: " + file + " -> " + statement);
      blocked = true;
    }
  }
  if (blocked) {
    console.error("Published news cannot be bulk-deleted from migration SQL. Use a separately reviewed, URL-preserving archival and redirect procedure.");
    process.exitCode = 1;
  } else {
    console.log("No destructive daily_articles statements in " + files.length + " changed migration(s).");
  }
}