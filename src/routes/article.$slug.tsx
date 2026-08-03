import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/article/$slug')({
  beforeLoad: ({ params }) => {
    throw redirect({
      href: `/news/${encodeURIComponent(params.slug)}`,
      statusCode: 301,
    });
  },
});
