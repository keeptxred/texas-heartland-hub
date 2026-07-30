import { createFileRoute } from "@tanstack/react-router";
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
    const validSlug = isElectionSlug(params.forecastSlug);
    const canonicalUrl = `https://keeptxred.com/elections/forecast/${params.forecastSlug}`;

    return {
      meta: [
        {
          title: validSlug
            ? "Texas Election Forecast | KeepTXRed Election Central"
            : "Invalid Election Forecast | KeepTXRed Election Central",
        },
        {
          name: "description",
          content: validSlug
            ? "Review a published Texas election forecast, probabilities, methodology, and source."
            : "The requested Texas election forecast URL is invalid.",
        },
        ...(validSlug
          ? [
              { name: "robots", content: "index, follow, max-image-preview:large" },
              { property: "og:url", content: canonicalUrl },
              { property: "og:type", content: "website" },
              { property: "og:site_name", content: "Keep TX Red" },
              { name: "twitter:card", content: "summary_large_image" },
            ]
          : [{ name: "robots", content: "noindex, nofollow" }]),
      ],
      links: validSlug ? [{ rel: "canonical", href: canonicalUrl }] : [],
    };
  },
  component: ElectionForecastDetailRoute,
});

function ElectionForecastDetailRoute() {
  const { forecastSlug } = Route.useParams();
  const validSlug = isElectionSlug(forecastSlug);

  return (
    <ElectionRepositoryProvider>
      <ElectionLayout
        title="Texas Election Forecast"
        description="Published forecast details from KeepTXRed Election Central."
        canonicalUrl={
          validSlug ? `https://keeptxred.com/elections/forecast/${forecastSlug}` : undefined
        }
        navigation={<ElectionNavigation currentPath={ELECTION_ROUTES.forecast} />}
      >
        {validSlug ? (
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
