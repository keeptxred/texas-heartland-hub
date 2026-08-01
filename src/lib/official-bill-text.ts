const OFFICIAL_HOSTS = new Set(["capitol.texas.gov", "www.capitol.texas.gov"]);

export type OfficialBillDocument = { label: string; url: string };

export function introducedBillTextUrl(sessionCode: string, billType: string, billNumber: number) {
  const session = sessionCode.toUpperCase().replace(/[^0-9A-Z]/g, "");
  const type = billType.toUpperCase().replace(/[^A-Z]/g, "");
  return `https://capitol.texas.gov/tlodocs/${session}/billtext/html/${type}${String(billNumber).padStart(5, "0")}I.htm`;
}

export function isAllowedOfficialBillTextUrl(value: string) {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      OFFICIAL_HOSTS.has(url.hostname.toLowerCase()) &&
      /^\/tlodocs\/[0-9A-Z]+\/billtext\/html\/[A-Z]+\d{5}[A-Z]\.html?$/i.test(url.pathname)
    );
  } catch {
    return false;
  }
}

function decodeEntities(value: string) {
  const named: Record<string, string> = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: '"',
  };
  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, code: string) => {
    if (code[0] === "#") {
      const hex = code[1]?.toLowerCase() === "x";
      const point = Number.parseInt(code.slice(hex ? 2 : 1), hex ? 16 : 10);
      return Number.isFinite(point) ? String.fromCodePoint(point) : entity;
    }
    return named[code.toLowerCase()] ?? entity;
  });
}

export function officialHtmlToText(html: string) {
  const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;
  return decodeEntities(
    body
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<!--([\s\S]*?)-->/g, "")
      .replace(/<(?:br|hr)\b[^>]*>/gi, "\n")
      .replace(/<\/(?:div|p|pre|h[1-6]|li|tr|table|section|article)>/gi, "\n")
      .replace(/<li\b[^>]*>/gi, "• ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\r/g, "")
    .replace(/[\t ]+\n/g, "\n")
    .replace(/\n[\t ]+/g, "\n")
    .replace(/[\t ]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
