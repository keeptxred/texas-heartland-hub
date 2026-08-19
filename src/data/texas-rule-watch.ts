export type RuleWatchSource = {
  label: string;
  url: string;
  publisher: string;
  purpose: string;
};

export type RuleWatchStage = {
  stage: string;
  meaning: string;
  whatToCheck: string[];
};

export const RULE_WATCH_REVIEWED_AT = "2026-08-19";

export const RULE_WATCH_SOURCES: RuleWatchSource[] = [
  {
    label: "Texas Register — State Rules and Open Meetings",
    url: "https://www.sos.state.tx.us/texreg/index.shtml",
    publisher: "Texas Secretary of State",
    purpose: "Current and previous weekly Texas Register issues, search, indexes, and RSS feeds for state rulemaking and related notices.",
  },
  {
    label: "Current Texas Administrative Code",
    url: "https://www.sos.state.tx.us/tac/index.shtml",
    publisher: "Texas Secretary of State",
    purpose: "Current codified state agency rules after adoption; use the promulgating agency for interpretation or enforcement questions.",
  },
  {
    label: "Search the Texas Register",
    url: "https://texreg.sos.state.tx.us/public/regviewctx.search",
    publisher: "Texas Secretary of State",
    purpose: "Search Texas Register material from January 28, 2000 forward by text and publication context.",
  },
  {
    label: "Texas Register Back-Issue Archive",
    url: "https://www.sos.state.tx.us/texreg/backview/index.shtml",
    publisher: "Texas Secretary of State",
    purpose: "Review earlier Register issues when reconstructing a rule's proposal, adoption, withdrawal, emergency action, or review history.",
  },
];

export const RULE_WATCH_STAGES: RuleWatchStage[] = [
  {
    stage: "Proposed rule",
    meaning: "An agency has published proposed rule text or changes for public notice before final adoption.",
    whatToCheck: ["Agency and TAC citation", "What language changes", "Statutory authority", "Fiscal or public-benefit analysis", "Comment instructions and deadline"],
  },
  {
    stage: "Adopted rule",
    meaning: "An agency has completed adoption. The Texas Register notice explains the adoption and the rule is subsequently reflected in the Texas Administrative Code according to its effective status.",
    whatToCheck: ["Effective date", "Changes from proposal", "Agency response to comments", "Legal authority", "Affected people or businesses"],
  },
  {
    stage: "Emergency rule",
    meaning: "An agency has used the emergency-rule process rather than the ordinary proposal-to-adoption sequence.",
    whatToCheck: ["Emergency justification", "Effective period", "Affected regulated parties", "Whether a related permanent proposal follows"],
  },
  {
    stage: "Withdrawn rule",
    meaning: "A previously proposed rule or portion of a proposal has been withdrawn instead of adopted as proposed.",
    whatToCheck: ["Original proposal", "Scope of withdrawal", "Agency explanation", "Whether replacement language is later proposed"],
  },
  {
    stage: "Agency rule review",
    meaning: "An agency is reviewing existing rules to determine whether the reasons for adopting them continue to exist.",
    whatToCheck: ["Rules under review", "Comment window", "Agency findings", "Follow-on amendments or repeals"],
  },
];
