import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/texas-resources/type/$type')({
  beforeLoad: ({ params }) => {
    const target = `https://texasdefined.com/texas-resources?q=${encodeURIComponent(params.type)}`;
    if (typeof window !== 'undefined') window.location.replace(target);
    throw new Response(null, { status: 301, headers: { Location: target } });
  },
});
