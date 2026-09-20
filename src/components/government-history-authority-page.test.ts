import { describe, expect, it } from "vitest";
import { getGovernmentHistoryRelatedLinks } from "./government-history-authority-page";
import {
  TEXAS_COUNTY_GOVERNMENT_HISTORY,
  TEXAS_COUNTY_SHERIFF_HISTORY,
  TEXAS_JP_CONSTABLE_HISTORY,
} from "@/data/texas-local-government-authority";
import { TEXAS_MUNICIPAL_GOVERNMENT_HISTORY } from "@/data/texas-municipal-government-authority";

const POLICING_HREF = "/news/texas-policing-agencies-compared";

describe("government history policing relationships", () => {
  it.each([
    TEXAS_COUNTY_GOVERNMENT_HISTORY,
    TEXAS_COUNTY_SHERIFF_HISTORY,
    TEXAS_JP_CONSTABLE_HISTORY,
    TEXAS_MUNICIPAL_GOVERNMENT_HISTORY,
  ])("adds the policing comparison to $slug", (page) => {
    expect(getGovernmentHistoryRelatedLinks(page).map((link) => link.href)).toContain(POLICING_HREF);
  });
});
