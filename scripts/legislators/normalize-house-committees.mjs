function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function looksLikeCommitteeRecord(value) {
  return isObject(value) && (
    typeof value.committeeName === "string"
    || typeof value.name === "string"
    || typeof value.committee === "string"
  );
}

function findCommitteeArray(value, depth = 0) {
  if (depth > 3) return null;
  if (Array.isArray(value)) {
    if (value.length === 0 || value.every(looksLikeCommitteeRecord)) return value;
    return null;
  }
  if (!isObject(value)) return null;

  for (const key of ["committees", "memberCommittees", "data", "results", "items"]) {
    if (!(key in value)) continue;
    const found = findCommitteeArray(value[key], depth + 1);
    if (found) return found;
  }

  for (const nested of Object.values(value)) {
    const found = findCommitteeArray(nested, depth + 1);
    if (found) return found;
  }
  return null;
}

export function normalizeHouseCommitteePayload(payload) {
  const rows = findCommitteeArray(payload);
  if (!rows) {
    const shape = isObject(payload) ? Object.keys(payload).sort().join(",") : typeof payload;
    throw new Error(`Texas House committee API returned an unsupported payload shape: ${shape || "empty object"}`);
  }

  return rows.map((row) => {
    const committeeName = String(row.committeeName ?? row.name ?? row.committee ?? "").trim();
    if (!committeeName) {
      throw new Error("Texas House committee API returned a committee row without a name");
    }
    const position = String(row.position ?? row.role ?? row.memberPosition ?? "").trim();
    return { committeeName, position };
  });
}
