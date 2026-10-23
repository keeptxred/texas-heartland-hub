import { createFileRoute } from "@tanstack/react-router";

// Retire the initial shared-token path: all publication now uses the private
// OAuth MCP workflow with a persisted approved plan and duplicate protection.
function retired() {
  return Response.json(
    {
      ok: false,
      error: "Use the private publisher MCP connection",
      connection: "https://keeptxred.com/publisher/connect",
    },
    { status: 410, headers: { "Cache-Control": "no-store" } },
  );
}
export const Route = createFileRoute("/api/admin/printify-publish")({
  server: { handlers: { GET: retired, POST: retired } },
});
