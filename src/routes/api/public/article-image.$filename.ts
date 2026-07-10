import { createFileRoute } from "@tanstack/react-router";

// Public passthrough for AI-generated article featured images stored in the
// private "article-images" Supabase bucket. Gives every image a clean,
// SEO-friendly URL like /api/public/article-image/texas-property-tax.png.
export const Route = createFileRoute("/api/public/article-image/$filename")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const filename = params.filename;
        if (!/^[a-z0-9-]+\.(png|jpg|jpeg|webp)$/i.test(filename)) {
          return new Response("Bad filename", { status: 400 });
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.storage
          .from("article-images")
          .download(filename);
        if (error || !data) return new Response("Not found", { status: 404 });
        const buf = await data.arrayBuffer();
        const type = filename.toLowerCase().endsWith(".png")
          ? "image/png"
          : filename.toLowerCase().endsWith(".webp")
          ? "image/webp"
          : "image/jpeg";
        return new Response(buf, {
          status: 200,
          headers: {
            "Content-Type": type,
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});