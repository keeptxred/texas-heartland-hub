import { Helmet } from "react-helmet-async";
import { buildElectionSeo, buildElectionWebPageSchema, ELECTION_ROUTES } from "@/lib/elections";
import { getFeaturedCandidateProfile } from "@/lib/elections/featuredCandidateProfiles";
import type { CandidateDetail, RaceDetail } from "@/types/elections";

export interface CandidateDetailSeoProps {
  candidate: CandidateDetail;
  race: RaceDetail | null;
}

function safePublicUrl(value: string | null | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export function CandidateDetailSeo({ candidate, race }: CandidateDetailSeoProps) {
  const featuredProfile = getFeaturedCandidateProfile(candidate.fullName);
  const pathname = ELECTION_ROUTES.candidate(candidate.slug);
  const description =
    candidate.biography ??
    featuredProfile?.biography ??
    `Review verified election information for ${candidate.fullName}${race ? ` in the ${race.name}` : ""}.`;
  const usableImage =
    candidate.imageRights?.usageStatus === "approved"
      ? candidate.imageUrl
      : featuredProfile?.imageUrl ?? null;
  const metadata = buildElectionSeo({
    title: candidate.fullName,
    description,
    pathname,
    pageType: "candidate",
    image: usableImage ?? undefined,
    imageAlt: candidate.imageAltText ?? `Portrait of ${candidate.fullName}`,
    publishedTime: candidate.publishedAt ?? undefined,
    modifiedTime: candidate.updatedAt,
  });
  const webPageSchema = buildElectionWebPageSchema({
    name: candidate.fullName,
    description,
    pathname,
    pageType: "candidate",
    datePublished: candidate.publishedAt ?? undefined,
    dateModified: candidate.updatedAt,
    breadcrumbs: [
      { name: "Election Central", pathname: ELECTION_ROUTES.root },
      { name: "Election candidates", pathname: ELECTION_ROUTES.candidates },
      { name: candidate.fullName, pathname },
    ],
  });
  const sameAs = [
    candidate.websiteUrl,
    candidate.campaignUrl,
    candidate.socialLinks.facebookUrl,
    candidate.socialLinks.xUrl,
    candidate.socialLinks.instagramUrl,
    candidate.socialLinks.youtubeUrl,
    candidate.socialLinks.linkedinUrl,
    ...(featuredProfile?.sameAs ?? []),
  ].flatMap((value) => {
    const url = safePublicUrl(value);
    return url ? [url] : [];
  });
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: candidate.fullName,
    url: metadata.canonicalUrl,
    ...(usableImage ? { image: usableImage } : {}),
    ...(race?.officeName ? { jobTitle: `Candidate for ${race.officeName}` } : {}),
    ...(featuredProfile?.occupation
      ? {
          hasOccupation: {
            "@type": "Occupation",
            name: featuredProfile.occupation,
          },
        }
      : {}),
    ...(featuredProfile?.education.length
      ? {
          alumniOf: featuredProfile.education.map((education) => ({
            "@type": "EducationalOrganization",
            name: education,
          })),
        }
      : {}),
    affiliation: {
      "@type": "Organization",
      name: candidate.partyLabel ?? candidate.party,
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };

  return (
    <Helmet>
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      <meta name="robots" content={metadata.robots} />
      <meta property="og:type" content={metadata.openGraph.type} />
      <meta property="og:title" content={metadata.openGraph.title} />
      <meta property="og:description" content={metadata.openGraph.description} />
      <meta property="og:url" content={metadata.openGraph.url} />
      <meta property="og:site_name" content={metadata.openGraph.siteName} />
      {metadata.openGraph.image ? (
        <meta property="og:image" content={metadata.openGraph.image} />
      ) : null}
      <meta name="twitter:card" content={metadata.twitter.card} />
      <meta name="twitter:title" content={metadata.twitter.title} />
      <meta name="twitter:description" content={metadata.twitter.description} />
      {metadata.twitter.image ? (
        <meta name="twitter:image" content={metadata.twitter.image} />
      ) : null}
      <script type="application/ld+json">
        {JSON.stringify([webPageSchema, personSchema]).replace(/</g, "\\u003c")}
      </script>
    </Helmet>
  );
}

export default CandidateDetailSeo;
