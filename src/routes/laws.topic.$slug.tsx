import { createFileRoute, notFound } from "@tanstack/react-router";
import { getLawTopic } from "@/data/law-topics";
import { LawTopicPage, lawTopicHead } from "@/components/law-topic-page";

export const Route = createFileRoute("/laws/topic/$slug")({
  loader: ({ params }) => {
    const topic = getLawTopic(params.slug);
    if (!topic) throw notFound();
    return { topic };
  },
  head: ({ loaderData }) => loaderData?.topic ? lawTopicHead(loaderData.topic) : {},
  component: LawTopicRoute,
});

function LawTopicRoute() {
  const { topic } = Route.useLoaderData();
  return <LawTopicPage topic={topic} />;
}
