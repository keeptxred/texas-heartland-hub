import type { PolicyTracker } from "@/data/policy-trackers";
import { POLICY_TRACKERS } from "@/data/policy-trackers";

const base = POLICY_TRACKERS.find((tracker) => tracker.slug === "state-budget");
if (!base) throw new Error("Missing state-budget policy tracker");

export const POLICY_TRACKER_WAVE21_UPGRADE: PolicyTracker = {
  ...base,
  updated: "2026-08-29",
  currentStatus:
    "The 2026–27 appropriations framework remains the baseline for current Texas state spending, but an enacted biennial budget is not the same as cash actually spent. KTR tracks appropriations, revenue certification, supplemental changes, federal and dedicated funds, agency transfers, one-time capital commitments, reserves, and measurable program outcomes separately so headline totals do not obscure which money is recurring or what taxpayers received for it.",
  keyFacts: [
    ...base.keyFacts,
    "An introduced appropriations bill, conference report, enacted appropriation, Comptroller certification, agency operating budget, transfer authority, supplemental appropriation, encumbrance, and actual expenditure are separate fiscal stages.",
    "General Revenue, General Revenue-Dedicated accounts, federal funds, other funds, constitutional funds, bond proceeds, and local or pass-through money have different legal restrictions and should not be combined without identifying the fund basis.",
    "One-time capital, disaster, infrastructure, or reserve spending can materially raise a biennial total without creating the same ongoing obligation as recurring payroll, entitlement, grant, or operating-program growth.",
  ],
  context: [
    ...base.context,
    "Texas budgeting begins with available revenue and constitutional constraints, but the headline appropriations number is only one layer. The Comptroller's revenue estimate and certification address available resources under applicable law, while the Legislature decides appropriations across funds and agencies. Federal money, dedicated accounts, constitutional funds, fees, and other sources can support programs outside a simple General Revenue comparison. KTR will identify the fund type and biennium before describing spending growth so unlike totals are not compared as though they represent the same taxpayer obligation.",
    "Appropriation authority is also different from expenditure. A bill can authorize an agency to spend up to a stated amount, subject to riders, transfer authority, matching requirements, or other conditions, while actual spending can be lower or occur on a different schedule. Some capital projects span multiple years and some programs return or lapse balances. The tracker will distinguish appropriated, budgeted, obligated, transferred, encumbered, and spent amounts when records support those stages rather than using the enacted ceiling as proof that every dollar was consumed.",
    "Baseline comparisons need to separate recurring and one-time items. A biennium with a large infrastructure, disaster, property-tax, pension, water, broadband, or capital commitment can show rapid total growth even if recurring agency operations changed less. Conversely, a temporary grant can expire while a new recurring salary or entitlement obligation remains. KTR will identify one-time versus ongoing components and will show whether a policy creates a future biennial commitment instead of judging fiscal restraint solely from the top-line percentage change.",
    "Population and inflation can provide useful context but should not become an automatic spending target. Some state costs scale with population, caseload, construction prices, or wages, while others depend on policy choices, federal requirements, debt service, or program design. A per-capita adjustment can clarify one trend but can hide changes in service intensity or eligibility. The tracker will show nominal totals alongside relevant denominators where useful and will avoid claiming that spending is justified merely because it grew no faster than a broad economic measure.",
    "Supplemental appropriations and transfer authority matter because the original General Appropriations Act is not the last fiscal action in a biennium. Lawmakers can address prior obligations, disasters, caseloads, capital needs, or new priorities through supplemental bills, while agencies can have limited authority to transfer funds or use riders. KTR will preserve the original appropriation, later amendment, funding source, and effective period so a program's final budget is not frozen at the number adopted at the start of the cycle.",
    "Reserves and constitutional funds should be reported by purpose and access rules. The Economic Stabilization Fund, dedicated infrastructure funds, and other constitutional or statutory accounts can hold large balances, but availability can depend on formulas, votes, constitutional language, or specific authorized uses. A balance is not equivalent to unrestricted checking-account cash, and depositing money into a fund is different from appropriating it for a project. The tracker will identify the governing rule and transaction before labeling reserves as spent, idle, or available.",
    "Agency performance is the accountability side of budgeting. Appropriations can fund staff, contracts, grants, benefits, construction, technology, or local pass-through programs, and each should be connected where possible to outputs and outcomes. More money can reflect a larger caseload or higher service level without proving efficiency; a lower appropriation can reflect a completed project rather than a cut in ongoing service. KTR will connect major spending changes to performance measures, audit findings, procurement records, staffing, service volumes, and other evidence rather than treating the budget itself as proof of results.",
    "The durable fiscal test is whether Texas maintains structural balance, transparent reserves, manageable commitments, and measurable value while limiting unnecessary recurring growth. Useful evidence includes revenue estimates, certification documents, appropriations, supplemental bills, agency operating budgets, federal-fund changes, reserve balances, debt and capital commitments, audits, contracts, and program outcomes. KTR's editorial preference for spending restraint will remain separate from the factual accounting needed to show where money came from, where it went, and what changed because of it.",
  ],
  watchFor: [
    ...base.watchFor,
    "Final agency spending and performance records that distinguish appropriated authority from transfers, encumbrances, expenditures, lapsed balances, contracts, staffing, and measured program outcomes",
    "Next-cycle revenue estimates and Legislative Appropriations Requests showing which 2026–27 one-time items expire and which spending increases become recurring baseline commitments",
  ],
};

export const WAVE21_INDEXABLE_POLICY_TRACKER_SLUG = POLICY_TRACKER_WAVE21_UPGRADE.slug;
