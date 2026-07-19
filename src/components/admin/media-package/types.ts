import type { SavedPackage } from "@/services/contentPackages";
import type { BrandSettings } from "@/lib/brand-settings";

export type MediaTemplateId = "breaking" | "politics" | "election" | "economy" | "tax";

export type MediaPackage = {
  headline: string;
  subheadline: string;
  source: string;
  brand: string;
  url: string;
  logoUrl: string;
  footerText: string;
  reel: {
    hook: string;
    mainStory: string[];
    closing: string;
    caption: string;
    hashtags: string;
  };
};

export function buildMediaPackage(row: SavedPackage, brand: BrandSettings): MediaPackage {
  const headline = (row.seo_title || row.source_title || "").trim();
  const subheadline = (row.seo_description || row.facebook_hook || "").trim();
  const sourceHost = safeHost(row.source_url) || "KeepTXRed";
  const script = row.instagram_script || row.facebook_body || "";
  const points = splitPoints(script);
  return {
    headline,
    subheadline,
    source: `Source: ${sourceHost}`,
    brand: brand.brandName,
    url: brand.websiteUrl,
    logoUrl: brand.logoUrl,
    footerText: brand.footerText,
    reel: {
      hook: row.instagram_hook || row.facebook_hook || headline,
      mainStory: points,
      closing: row.facebook_cta || brand.socialCta,
      caption: row.instagram_caption || row.facebook_body || "",
      hashtags: row.instagram_hashtags || row.facebook_hashtags || "",
    },
  };
}

function safeHost(url: string | null): string {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function splitPoints(text: string): string[] {
  const parts = text
    .split(/\n+|(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const picked = parts.slice(0, 4);
  return picked.length > 0 ? picked : [text.trim()].filter(Boolean);
}