import { createServerFn } from "@tanstack/react-start";

export type PublicGovernmentGraphLink = {
  label: string;
  href: string;
  kind: "policy" | "government" | "law" | "data" | "legislature" | "election" | "editorial" | "reference";
};

type GraphInput = {
  text: string;
  limit?: number;
  excludeHrefs?: string[];
};

export const getGovernmentGraphLinksForText = createServerFn({ method: "POST" })
  .validator((data: GraphInput) => ({
    text: String(data.text ?? "").slice(0, 60_000),
    limit: Math.max(1, Math.min(8, Number(data.limit) || 6)),
    excludeHrefs: Array.isArray(data.excludeHrefs)
      ? data.excludeHrefs.filter((href): href is string => typeof href === "string").slice(0, 20)
      : [],
  }))
  .handler(async ({ data }) => {
    if (!data.text.trim()) return [] as PublicGovernmentGraphLink[];
    const { getGovernmentGraphLinks } = await import("@/lib/government-graph");
    return getGovernmentGraphLinks(data.text, data.limit, data.excludeHrefs).map(({ label, href, kind }) => ({
      label,
      href,
      kind,
    })) as PublicGovernmentGraphLink[];
  });
