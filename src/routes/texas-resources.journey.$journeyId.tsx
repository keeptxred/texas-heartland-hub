import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/texas-resources/journey/$journeyId')({
  beforeLoad: ({ params }) => {
    const target = `https://texasdefined.com/texas-resources?q=${encodeURIComponent(params.journeyId)}`;
    if (typeof window !== 'undefined') window.location.replace(target);
    throw new Response(null, { status: 301, headers: { Location: target } });
  },
});
