import { sourceUrlSupportsPrimaryRecord } from "@/data/source-authority";
import type { ResearchPacket } from "./newsroom-research-packet";

/** The publisher's address is NOT the article's location.
 * Local station syndication can contain entirely national AP copy. In this
 * case the old classifier gave a British court item Texas relevance 100.
 * Read factual article text, not the source label, promotional footer, or
 * unrelated description scraped from a different page.
 */
const TEXAS_FOCUSED_EVENT = /\b(?:texas|houston|dallas|fort worth|arlington|austin|san antonio|el paso|odessa|midland|lubbock|amarillo|waco|tyler|kilgore|lufkin|nacogdoches|college station|bryan|beaumont|port arthur|galveston|corpus christi|harlingen|brownsville|mcallen|laredo|san marcos|georgetown|round rock|plano|frisco|killeen|abilene|longview|weatherford|bastrop|fredericksburg|east texas|west texas|north texas|south texas|central texas|texas hill country|texas panhandle|rio grande valley|bexar county|harris county|tarrant county|travis county|collin county|denton county|ector county|dallas county|txdot|ercot|texas legislature|texas governor)\b/i;
const TEXAS_OFFICIAL_HOST = /(?:^|\.)(?:texas\.gov|tx\.gov|texasattorneygeneral\.gov|dps\.texas\.gov|gov\.texas\.gov|capitol\.texas\.gov|sos\.state\.tx\.us|houstontx\.gov|arlingtontx\.gov)$/i;

/** Preserve every established editorial gate; this only rejects an observed
 * clear false-positive KTR public-safety category prior to any AI charge.
 */
export function newsroomPacketHasTexasIncidentEvidence(packet: ResearchPacket): boolean {
  if (packet.pillar !== "texas-law-enforcement-public-safety") return true;
  const lead = packet.sources.map((source) =>
    `${String(source.title ?? "")} ${String(source.extractedBody ?? "").slice(0, 650)}`,
  ).join(" ");
  if (TEXAS_FOCUSED_EVENT.test(`${packet.subject} ${lead}`)) return true;
  return packet.sources.some((source) => {
    try {
      const hostname = new URL(source.url).hostname.toLowerCase();
      return TEXAS_OFFICIAL_HOST.test(hostname) &&
        sourceUrlSupportsPrimaryRecord(source.url, source.source);
    } catch {
      return false;
    }
  });
}

/** Scraped feed descriptions have occasionally contained an entirely
 * different local report. Require distinctive cross-title entity continuity
 * before including description as corroborating prose in the research packet.
 */
export function sourceDescriptionMatchesHeadline(title: string, description: string): boolean {
  const words = (value: string) => new Set(
    String(value).normalize("NFKD").toLowerCase().match(/[a-z]{4,}/g)
      ?.filter((w) => !/^(?:news|newspaper|report|reports|video|latest|updated|texas|local|more|said|from|with|that|this|have|were|been|after|could|would|about|into|near|first|story|today|monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/.test(w)) ?? [],
  );
  const headline = words(title);
  if (headline.size < 2) return false;
  const summary = words(description);
  const shared = [...headline].filter((word) => summary.has(word)).length;
  return shared >= 2 || (headline.size <= 3 && shared === headline.size);
}
