import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/texas-resources/topic/$topicId')({
  beforeLoad: ({ params }) => {
    const target = `https://texasdefined.com/texas-resources?q=${encodeURIComponent(params.topicId)}`;
    if (typeof window !== 'undefined') window.location.replace(target);
    throw new Response(null, { status: 301, headers: { Location: target } });
  },
});
