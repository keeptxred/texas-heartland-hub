import { createFileRoute } from '@tanstack/react-router';
import { publisherResponse } from '@/lib/publisher/mcp.server';

// Also declared in the router manifest for route/link tooling. The Worker entry
// serves this before editorial URL middleware, using the same implementation.
export const Route = createFileRoute('/publisher/connect')({
  server: { handlers: { GET: async ({ request }) => (await publisherResponse(request, undefined))! } },
});
