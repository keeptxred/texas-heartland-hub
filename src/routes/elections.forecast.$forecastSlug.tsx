import { createFileRoute } from "@tanstack/react-router";
import records from "@/data/elections/2026/forecasts.json";
import {
  ElectionErrorState,
  ForecastDetailView,
  ElectionLayout,
  ElectionLoading,
  ElectionNavigation,
} from "@/components/elections";
import { useElectionForecast } from "@/hooks/elections";
import { ELECTION_ROUTES } from "@/lib/elections";
import { ElectionRepositoryProvider } from "@/lib/elections/repositories";
import { electionSlugs, isElectionSlug } from "@/types/elections";

export const Route = createFileRoute("/elections/forecast/$forecastSlug")({
  head: ({ params }) => {
    const record = records.find(
      (item) =>
        item.slug === params.forecastSlug &&
        item.publicationStatus === "published" &&
        item.verificationStatus === "verified",
    );
    const validSlug = isElectionSlug(params.forecastSlug);
    const indexable = validSlug && Boolean(record);
    const canonicalUrl = `https://keeptxred.com/elections/forecast/${params.forecastSlug}`;
    const recordName =
      record && "title" in record && typeof record.title === "string" && record.title ? record.title :
        record && "sourceName" in record && typeof record.sourceName === "string" && record.sourceName ? record.sourceName :
        "Texas Election Forecast";
    const description =
      record && "description" in record && typeof record.description === "string" && record.description
        ? record.description
        : "Review a published Texas election forecast, probabilities, methodology, and source.";
    const title = indexable
      ? `${recordName} | KeepTXRed Election Central`
      : "Election forecast not found | KeepTXRed";

    return {
      meta: [
        { title },
        { name: "description", content: description },
        {
          name: "robots",
          content: indexable ? "index, follow, max-image-preview:large" : "noindex, follow",
        },
        ...(indexable
          ? [
              { property: "og:title", content: title },
              { property: "og:description", content: description },
              { property: "og:url", content: canonicalUrl },
              { property: "og:type", content: "website" },
              { property: "og:site_name", content: "Keep TX Red" },
              { name: "twitter:card", content: "summary_large_image" },
              { name: "twitter:title", content: title },
              { name: "twitter:description", content: description },
              { property: "og:image", content: "https://keeptxred.com/images/elections/election-central-social.jpg" },
              { property: "og:image:width", content: "1200" },
              { property: "og:image:height", content: "630" },
              { property: "og:image:alt", content: "2026 Texas Election Central" },
              { name: "twitter:image", content: "https://keeptxred.com/images/elections/election-central-social.jpg" },
            ]
          : []),
      ],
      links: indexable ? [{ rel: "canonical", href: canonicalUrl }] : [],
      scripts: indexable
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "CreativeWork",
                name: recordName || "Texas election forecast",
                description,
                url: canonicalUrl,
                genre: "Election forecast",
                creator: {
                  "@type": "Organization",
                  name: "Keep TX Red",
                  url: "https://keeptxred.com",
                },
                isPartOf: {
                  "@type": "WebSite",
                  "@id": "https://keeptxred.com/#website",
                },
              }).replace(/</g, "\\u003c"),
            },
          ]
        : [],
    };
  },
  component: ElectionForecastDetailRoute,
});

function ElectionForecastDetailRoute() {
  const { forecastSlug } = Route.useParams();
  const validSlug = isElectionSlug(forecastSlug);
  const indexable =
    validSlug &&
    records.some(
      (item) =>
        item.slug === forecastSlug &&
        item.publicationStatus === "published" &&
        item.verificationStatus === "verified",
    );

  return (
    <ElectionRepositoryProvider>
      <ElectionLayout
        title="Texas Election Forecast"
        description="Published forecast details from KeepTXRed Election Central."
        indexable={indexable}
        canonicalUrl={
          indexable ? `https://keeptxred.com/elections/forecast/${forecastSlug}` : undefined
        }
        navigation={<ElectionNavigation currentPath={ELECTION_ROUTES.forecast} />}
      >
        {indexable ? (
          <ElectionForecastDetailData forecastSlug={forecastSlug} />
        ) : (
          <ElectionErrorState
            kind="not_found"
            title="Election forecast not found"
            message="This forecast URL is invalid. Return to the forecast list to browse published Texas election forecasts."
          />
        )}
      </ElectionLayout>
    </ElectionRepositoryProvider>
  );
}

function ElectionForecastDetailData({ forecastSlug }: { forecastSlug: string }) {
  const forecast = useElectionForecast({
    slug: electionSlugs.forecast(forecastSlug),
  });

  if (forecast.isLoading) {
    return <ElectionLoading variant="detail" label="Loading Texas election forecast details" />;
  }

  if (forecast.error) {
    return (
      <ElectionErrorState
        kind="service"
        title="Election forecast details could not be loaded"
        technicalMessage={forecast.error.message}
        retryAction={{ label: "Try again", onClick: () => void forecast.refetch() }}
      />
    );
  }

  if (forecast.isMissing || !forecast.data) {
    return (
      <ElectionErrorState
        kind="not_found"
        title="Election forecast not found"
        message="This forecast is not published or is no longer available."
      />
    );
  }

  return <ForecastDetailView forecast={forecast.data} />;
}
