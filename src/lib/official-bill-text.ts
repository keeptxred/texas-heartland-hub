const OFFICIAL_HOSTS = new Set(["capitol.texas.gov", "www.capitol.texas.gov"]);

export const MAX_OFFICIAL_BILL_TEXT_BYTES = 5 * 1024 * 1024;

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
      url.username === "" &&
      url.password === "" &&
      url.port === "" &&
      OFFICIAL_HOSTS.has(url.hostname.toLowerCase()) &&
      /^\/tlodocs\/[0-9A-Z]+\/billtext\/html\/[A-Z]+\d{5}[A-Z]\.html?$/i.test(url.pathname) &&
      url.search === "" &&
      url.hash === ""
    );
  } catch {
    return false;
  }
}

export function isAllowedOfficialBillTextContentType(value: string | null) {
  if (!value) return true;
  const type = value.split(";", 1)[0]?.trim().toLowerCase();
  return type === "text/html" || type === "text/plain" || type === "application/xhtml+xml";
}

export async function readResponseTextWithLimit(
  response: Response,
  maxBytes = MAX_OFFICIAL_BILL_TEXT_BYTES,
): Promise<string> {
  const declaredLength = Number(response.headers.get("content-length") ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw new RangeError("Official bill text exceeds the display limit.");
  }

  if (!response.body) return "";

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let text = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maxBytes) {
        await reader.cancel("response too large");
        throw new RangeError("Official bill text exceeds the display limit.");
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    return text;
  } finally {
    reader.releaseLock();
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
      if (!Number.isFinite(point) || point < 0 || point > 0x10ffff) return entity;
      try {
        return String.fromCodePoint(point);
      } catch {
        return entity;
      }
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
