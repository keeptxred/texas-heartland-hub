type NewsroomSection = {
  heading?: unknown;
  paragraphs?: unknown;
  [key: string]: unknown;
};

type NewsroomBodyJson = {
  sections?: unknown;
  [key: string]: unknown;
};

export function normalizeNewsroomWhyThisMatters(bodyJson: unknown, body: string | null | undefined): {
  bodyJson: unknown;
  body: string | null | undefined;
  changed: boolean;
} {
  let changed = false;
  let nextBodyJson = bodyJson;

  if (bodyJson && typeof bodyJson === "object" && !Array.isArray(bodyJson)) {
    const record = bodyJson as NewsroomBodyJson;
    if (Array.isArray(record.sections)) {
      const sections = record.sections.map((raw) => {
        if (!raw || typeof raw !== "object" || Array.isArray(raw)) return raw;
        const section = raw as NewsroomSection;
        if (typeof section.heading === "string" && /^texas relevance$/i.test(section.heading.trim())) {
          changed = true;
          return { ...section, heading: "Why This Matters" };
        }
        return raw;
      });
      if (changed) nextBodyJson = { ...record, sections };
    }
  }

  let nextBody = body;
  if (typeof body === "string" && /texas relevance/i.test(body)) {
    const replaced = body.replace(/\bTexas relevance\b/gi, "Why This Matters");
    if (replaced !== body) changed = true;
    nextBody = replaced;
  }

  return { bodyJson: nextBodyJson, body: nextBody, changed };
}
