import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/texas-resources')({
  beforeLoad: () => {
    if (typeof window !== 'undefined') {
      const target = new URL('https://texasdefined.com/texas-resources');
      target.search = window.location.search;
      window.location.replace(target.toString());
    }
    throw new Response(null, { status: 301, headers: { Location: 'https://texasdefined.com/texas-resources' } });
  },
});
