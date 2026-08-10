import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/texas-data/$datasetSlug')({
  beforeLoad: ({ params }) => {
    const target = `https://texasdefined.com/texas-data/${encodeURIComponent(params.datasetSlug)}`;
    if (typeof window !== 'undefined') window.location.replace(`${target}${window.location.search}`);
    throw new Response(null, { status: 301, headers: { Location: target } });
  },
});
