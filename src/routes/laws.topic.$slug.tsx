import { createFileRoute, notFound } from "@tanstack/react-router";
import { getLawTopicDetail } from "@/lib/law-library-route.functions";
import { LawTopicPage, lawTopicHead } from "@/components/law-topic-page";
import { isLawTopicIndexable } from "@/lib/law-topic-indexability";

export const Route = createFileRoute("/laws/topic/$slug")({
  loader: async ({ params }) => {
    const detail = await getLawTopicDetail({ data: { slug: params.slug } });
    if (!detail) throw notFound();
    return detail;
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
  const { topic, supportingGuides, editorials } = Route.useLoaderData();
  return <LawTopicPage topic={topic} supportingGuides={supportingGuides} editorials={editorials} />;
}
