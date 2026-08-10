export interface PollingReferenceSource {
  name: string;
  url: string;
  role: "primary" | "aggregator" | "academic";
  description: string;
}

/**
 * Public reference points used to discover and cross-check Texas polling.
 * Aggregator values are never silently substituted for original poll records.
 */
export const TEXAS_POLLING_REFERENCE_SOURCES: readonly PollingReferenceSource[] = [
  {
    name: "RealClearPolling — Texas U.S. Senate",
    url: "https://www.realclearpolling.com/elections/senate/2026/texas",
    role: "aggregator",
    description:
      "Race index used to identify newly published Texas Senate polls and compare published poll coverage.",
  },
  {
    name: "RealClearPolling — Texas Governor",
    url: "https://www.realclearpolling.com/polls/governor/general/2026/texas/abbott-vs-hinojosa",
    role: "aggregator",
    description:
      "Race page used to cross-check the public Texas governor polling landscape.",
  },
  {
    name: "Texas Politics Project",
    url: "https://texaspolitics.utexas.edu/polling",
    role: "academic",
    description:
      "University of Texas polling archive and analysis used to locate original releases and methodology.",
  },
  {
    name: "Original pollster releases",
    url: "https://keeptxred.com/elections/methodology",
    role: "primary",
    description:
      "KeepTXRed publishes a poll only after checking the original topline or methodology release.",
  },
] as const;

