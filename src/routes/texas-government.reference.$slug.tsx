import { createFileRoute, notFound } from "@tanstack/react-router";
import { SearchRecoveryAuthorityPage, searchRecoveryAuthorityHead } from "@/components/search-recovery-authority-page";
import { SEARCH_RECOVERY_AUTHORITY_GUIDES } from "@/data/search-recovery-authority";

export const Route = createFileRoute("/texas-government/reference/$slug")({
  loader: ({ params }) => {
    const guide = SEARCH_RECOVERY_AUTHORITY_GUIDES[params.slug];
    if (!guide) throw notFound();
    return guide;
  },
  head: ({ loaderData }) => loaderData
    ? searchRecoveryAuthorityHead(loaderData)
    : { meta: [{ title: "Texas government reference not found | Keep TX Red" }, { name: "robots", content: "noindex,follow" }] },
  component: ReferenceGuide,
});

function ReferenceGuide() {
  return <SearchRecoveryAuthorityPage guide={Route.useLoaderData()} />;
}
