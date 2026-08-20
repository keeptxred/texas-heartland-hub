import { createFileRoute, notFound } from "@tanstack/react-router";
import { getLawTopic } from "@/data/law-topics";
import { LawTopicPage, lawTopicHead } from "@/components/law-topic-page";
import { isLawTopicIndexable } from "@/lib/law-topic-indexability";

export const Route = createFileRoute("/laws/topic/$slug")({
  loader: ({ params }) => {
    const topic = getLawTopic(params.slug);
    if (!topic) throw notFound();
    return { topic };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.topic) return { meta: [{ name: "robots", content: "noindex,follow" }] };
    const head = lawTopicHead(loaderData.topic);
    const robots = isLawTopicIndexable(loaderData.topic)
      ? "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
      : "noindex,follow";
    return {
      ...head,
      meta: head.meta.map((item) => item.name === "robots" ? { ...item, content: robots } : item),
    };
  },
  component: LawTopicRoute,
});

function LawTopicRoute() {
  const { topic } = Route.useLoaderData();
  return <LawTopicPage topic={topic} />;
}
