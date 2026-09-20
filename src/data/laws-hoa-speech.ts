import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const HOA_SPEECH_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-hoa-political-signs-law": {
    slug: "texas-hoa-political-signs-law",
    title: "Texas HOA Political Sign Rules: When Associations Must Allow Election Signs",
    dek: "Texas Election Code Section 259.002 explained, including the 90-day pre-election window, 10-day post-election protection, size and placement limits, and when an HOA may remove a sign.",
    updated: "2026-08-13", pillarLabel: "Texas Laws", pillarHref: "/laws", guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Election Code Section 259.002 generally prevents an HOA from banning signs for a candidate or election measure beginning 90 days before the election and continuing through the period before the 10th day after election day.",
      "An HOA may require election signs to be ground-mounted and may limit an owner to one sign for each candidate or measure.",
      "The statute allows restrictions on signs that are larger than four feet by six feet, violate law, threaten safety, contain specified nonstandard materials, or have other listed characteristics.",
      "An HOA may remove a sign displayed in violation of a restrictive covenant that Section 259.002 permits the association to enforce.",
    ],
    intro: ["Texas protects a homeowner's ability to display candidate and ballot-measure signs during a defined election period, but the protection is not unlimited.", "The current political-sign statute is in Election Code Section 259.002; it was transferred from Property Code Section 202.009 in 2019."],
    sections: [
      { heading: "The protected election window", paragraphs: ["Section 259.002 generally bars an HOA from adopting or enforcing a covenant that prohibits a qualifying candidate or measure sign on or after the 90th day before the election or before the 10th day after election day."] },
      { heading: "Ground mounting and one-sign limits are allowed", paragraphs: ["The statute permits a covenant requiring the sign to be ground-mounted and permits a limit of one sign for each candidate or measure."] },
      { heading: "Some signs may still be prohibited", paragraphs: ["The statute allows restrictions on specified sign characteristics, including signs larger than four feet by six feet, signs that threaten public health or safety, signs that violate law, and signs using certain nonstandard materials, attachments, sounds, or distracting features."] },
      { heading: "Removal depends on a permitted restriction", paragraphs: ["Section 259.002 allows the HOA to remove a sign displayed in violation of a restrictive covenant that the statute itself permits. A disagreement should therefore be analyzed against both the association's covenant and the statutory list of allowed restrictions."] },
    ],
    faq: [
      { q: "How early can I put up a political sign in a Texas HOA?", a: "Section 259.002 protects qualifying candidate and measure signs beginning on the 90th day before the election, subject to the statute's permitted restrictions." },
      { q: "Can a Texas HOA limit political sign size?", a: "Yes. The statute permits a covenant prohibiting a sign larger than four feet by six feet and permits several other specified restrictions." },
      { q: "How long after an election is a political sign protected?", a: "The statute's protected period extends through the time before the 10th day after election day." },
    ],
    sources: [
      { label: "Texas Election Code § 259.002", url: "https://statutes.capitol.texas.gov/?artSec=259.002&chapter=EL.259&code=EL&tab=1" },
      { label: "Texas Ethics Commission — Election Code Chapter 259", url: "https://www.ethics.state.tx.us/statutes/title15.php" },
    ],
    related: [{ label: "Texas HOA flag rules", href: "/guides/texas-hoa-flag-display-law" }, { label: "Texas HOA powers", href: "/guides/texas-hoa-powers-guide" }, { label: "Texas HOA laws", href: "/guides/texas-hoa-laws-guide" }],
  },
  "texas-hoa-flag-display-law": {
    slug: "texas-hoa-flag-display-law",
    title: "Texas HOA Flag Laws: U.S., Texas and Military Flag Display Rights",
    dek: "Texas Property Code Section 202.012 explained, including protected flags, reasonable flagpole and maintenance rules, front-yard flagpoles, lighting, setbacks, and HOA common-property limits.",
    updated: "2026-08-13", pillarLabel: "Texas Laws", pillarHref: "/laws", guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Section 202.012 generally prevents a property owners' association from prohibiting or effectively prohibiting display of the U.S. flag, Texas flag, or an official or replica flag of a branch of the U.S. armed forces.",
      "An HOA may adopt reasonable rules addressing flag and flagpole condition, materials, location, size, lighting, setbacks, and external-halyard noise.",
      "The association's rules may not prevent at least one qualifying flagpole per property, including a front-yard freestanding pole no more than 20 feet high subject to zoning, easements, and setbacks, or an attached pole allowed by the statute.",
      "An HOA may prohibit a displayed flag or flagpole from being located on property owned or maintained by the association or owned in common by association members.",
    ],
    intro: ["Texas gives homeowners specific statutory protection for several patriotic flag displays while still allowing HOAs to regulate the manner of display.", "The practical line is between a rule that reasonably regulates the flag or flagpole and one that prohibits, restricts, or effectively prevents a display protected by Section 202.012."],
    sections: [
      { heading: "Which flags are protected", paragraphs: ["Section 202.012 protects display of the United States flag, the Texas flag, and official or replica flags of branches of the United States armed forces, subject to the reasonable regulations the section permits."] },
      { heading: "Reasonable flag and flagpole rules are allowed", paragraphs: ["The HOA may regulate flagpole materials and finish, flag size, lighting, flagpole size and location, maintenance, zoning and setback compliance, and reasonable noise control for an external halyard."] },
      { heading: "At least one qualifying flagpole must remain possible", paragraphs: ["The association may regulate flagpoles but may not prevent at least one flagpole per property that fits one of the statutory options: a qualifying front-yard freestanding pole no more than 20 feet high or a qualifying pole attached to the owner's residential structure."] },
      { heading: "Common property can be treated differently", paragraphs: ["Section 202.012 permits restrictions that prohibit owners from locating a displayed flag or flagpole on association-owned or association-maintained property or property owned in common by association members."] },
    ],
    faq: [
      { q: "Can a Texas HOA ban the U.S. flag?", a: "Generally no. Section 202.012 prevents an HOA from prohibiting or effectively prohibiting display of the U.S. flag, subject to the reasonable regulations allowed by the statute." },
      { q: "Can a Texas HOA regulate a flagpole?", a: "Yes. The statute permits reasonable rules on materials, size, location, lighting, maintenance, setbacks, and noise, but the rules may not prevent at least one qualifying flagpole per property." },
      { q: "Does Texas law protect every type of flag from HOA rules?", a: "No. Section 202.012 specifically protects the U.S. flag, Texas flag, and official or replica flags of branches of the U.S. armed forces. Other displays may be governed by different laws or the association's valid restrictions." },
    ],
    sources: [{ label: "Texas Property Code § 202.012", url: "https://statutes.capitol.texas.gov/?artSec=202.012&chapter=PR.202&code=PR&tab=1" }],
    related: [{ label: "Texas HOA political signs", href: "/guides/texas-hoa-political-signs-law" }, { label: "Texas HOA powers", href: "/guides/texas-hoa-powers-guide" }, { label: "Texas HOA laws", href: "/guides/texas-hoa-laws-guide" }],
  },
};
