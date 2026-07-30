export const ELECTION_INTERNAL_LINKS = {
  registerToVote: "/register-to-vote",
  texasPolitics: "/texas-politics",
  texasLaws: "/laws",
  contactLegislators: "/contact-legislators",
  getInvolved: "/get-involved",
  livingInTexas: "/living-in-texas",
  texasNews: "/texas-news",
} as const;

export const ELECTION_CORE_RESOURCES = [
  {
    title: "How to register to vote in Texas",
    description: "Review eligibility, deadlines, and the steps required to register before an election.",
    href: ELECTION_INTERNAL_LINKS.registerToVote,
    eyebrow: "Voting guide",
  },
  {
    title: "Texas election laws and rules",
    description: "Understand the laws that govern voting, elections, ballots, and election administration in Texas.",
    href: ELECTION_INTERNAL_LINKS.texasLaws,
    eyebrow: "Texas laws",
  },
  {
    title: "Texas politics coverage",
    description: "Follow policy debates, elected officials, campaigns, and political developments across the state.",
    href: ELECTION_INTERNAL_LINKS.texasPolitics,
    eyebrow: "Politics",
  },
  {
    title: "Contact your Texas legislators",
    description: "Find practical guidance for reaching state lawmakers about issues that matter to you.",
    href: ELECTION_INTERNAL_LINKS.contactLegislators,
    eyebrow: "Civic action",
  },
  {
    title: "Get involved in Texas",
    description: "Explore ways to participate locally, support causes, and stay engaged beyond Election Day.",
    href: ELECTION_INTERNAL_LINKS.getInvolved,
    eyebrow: "Participation",
  },
  {
    title: "Living in Texas",
    description: "Connect election issues with the taxes, services, communities, and policies affecting daily life.",
    href: ELECTION_INTERNAL_LINKS.livingInTexas,
    eyebrow: "Texas living",
  },
] as const;
