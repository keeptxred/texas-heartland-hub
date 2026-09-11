import { createFileRoute } from "@tanstack/react-router";

const MANUAL_KIMMEL_TALARICO_IMAGE =
  "2026-09-11-jimmy-kimmel-won-t-air-james-talarico-interview-due-to-fcc-threats.webp";

function decodeBase64(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

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

        // A manually supplied editorial image can use the same canonical
        // article-image endpoint without requiring a separate public bucket.
        if (filename === MANUAL_KIMMEL_TALARICO_IMAGE) {
          const [{ default: part1 }, { default: part2 }] = await Promise.all([
            import("@/lib/manual-article-images/kimmel-talarico-fcc.webp.part1"),
            import("@/lib/manual-article-images/kimmel-talarico-fcc.webp.part2"),
          ]);
          return new Response(decodeBase64(part1 + part2), {
            status: 200,
            headers: {
              "Content-Type": "image/webp",
              "Cache-Control": "public, max-age=31536000, immutable",
            },
          });
        }

        if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
          return new Response("Not found", { status: 404 });
        }
        let buf: ArrayBuffer;
        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data, error } = await supabaseAdmin.storage
            .from("article-images")
            .download(filename);
          if (error || !data) return new Response("Not found", { status: 404 });
          buf = await data.arrayBuffer();
        } catch (err) {
          console.error("[article-image] download failed", filename, err);
          return new Response("Not found", { status: 404 });
        }
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