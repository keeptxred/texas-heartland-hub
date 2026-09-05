import { createFileRoute } from "@tanstack/react-router";
import { verifyGitHubActionsOidc } from "@/lib/github-actions-oidc";
import { validateImageMatchesArticle } from "@/lib/featured-image-cloudflare";
import type { SubjectExtract } from "@/lib/featured-image-core";

const OIDC_AUDIENCE = "keeptxred-newsroom";
const REPOSITORY = "keeptxred/texas-heartland-hub";
const WORKFLOW_PATH = ".github/workflows/openai-article-image-recovery.yml";
const BUCKET = "article-images";
const MAX_IMAGE_BYTES = 15 * 1024 * 1024;

const SUBJECTS: Record<string, SubjectExtract> = {
  "2026-09-04-denton-191-turtles-shipment": {
    title: "Denton wildlife shipment inspection",
    firstParagraph: "",
    entities: [],
    locations: ["Denton, Texas"],
    domain: "general",
    concreteSubject: "A real handheld documentary photograph inside an ordinary Texas parcel-shipping inspection workspace. A slightly cluttered examination table holds scuffed cardboard shipping cartons, ventilated reptile transport carriers, a used digital parcel scale, disposable nitrile gloves, packing tape, and paperwork with writing out of focus. Natural mixed fluorescent and window lighting, visible cardboard fibers, scratched plastic, imperfect shadows, uneven object spacing, realistic optical depth, and ordinary workspace wear. No distressed or injured animals, no identifiable people, and no dramatic law-enforcement staging.",
  },
  "2026-09-04-texas-food-insecurity-one-in-five": {
    title: "Texas food bank grocery packing line",
    firstParagraph: "",
    entities: [],
    locations: ["Texas"],
    domain: "general",
    concreteSubject: "A real documentary photograph inside a busy Texas food-bank grocery-packing area. Open family food boxes are actively being filled with canned vegetables, soup, rice, beans, boxed pasta, cereal, and fresh produce. Rolling warehouse carts and pallet racks of groceries fill the middle distance. Several anonymous adult volunteers are shown from the side or back sorting groceries in ordinary work clothes and gloves. Natural warehouse lighting, realistic skin and cardboard texture, shelf clutter, imperfect box alignment, scuffed concrete floor, ordinary shadows, and true photographic depth of field. No posed faces and no readable logos.",
  },
};

function bearerToken(request: Request): string | null {
  const match = (request.headers.get("authorization") ?? "").match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

async function sha256Hex(bytes: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (value) => value.toString(16).padStart(2, "0")).join("");
}

async function recover(request: Request): Promise<Response> {
  const token = bearerToken(request);
  if (!token) return Response.json({ ok: false, error: "Missing GitHub Actions OIDC token" }, { status: 401 });

  try {
    await verifyGitHubActionsOidc({
      token,
      audience: OIDC_AUDIENCE,
      repository: REPOSITORY,
      workflowPath: WORKFLOW_PATH,
    });
  } catch (error) {
    return Response.json({ ok: false, error: "GitHub Actions OIDC verification failed", detail: error instanceof Error ? error.message : String(error) }, { status: 403 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ ok: false, error: "Invalid multipart request" }, { status: 400 });
  }

  const slugValue = form.get("slug");
  const imageValue = form.get("image");
  const expectedShaValue = form.get("image_sha256");
  if (typeof slugValue !== "string" || !SUBJECTS[slugValue]) {
    return Response.json({ ok: false, error: "Slug is not eligible for bounded OpenAI article-image recovery" }, { status: 400 });
  }
  if (!(imageValue instanceof File) || imageValue.size <= 0 || imageValue.size > MAX_IMAGE_BYTES) {
    return Response.json({ ok: false, error: "JPEG image is required and must be within the size limit" }, { status: 400 });
  }
  if (imageValue.type !== "image/jpeg" || !/\.jpe?g$/i.test(imageValue.name)) {
    return Response.json({ ok: false, error: "Recovery asset must be a JPEG" }, { status: 400 });
  }
  if (typeof expectedShaValue !== "string" || !/^[a-f0-9]{64}$/i.test(expectedShaValue)) {
    return Response.json({ ok: false, error: "Image SHA-256 is required" }, { status: 400 });
  }

  const bytesBuffer = await imageValue.arrayBuffer();
  const actualSha = await sha256Hex(bytesBuffer);
  if (actualSha.toLowerCase() !== expectedShaValue.toLowerCase()) {
    return Response.json({ ok: false, error: "Generated article image changed in transit" }, { status: 409 });
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: row, error: rowError } = await supabaseAdmin
    .from("daily_articles")
    .select("slug,title,category,featured_image_url,published_at")
    .eq("slug", slugValue)
    .maybeSingle();
  if (rowError || !row || !row.published_at) {
    return Response.json({ ok: false, error: "Published article not found" }, { status: 404 });
  }
  if (row.featured_image_url && !String(row.featured_image_url).includes("/images/news/generated/")) {
    return Response.json({ ok: true, skipped: true, reason: "Article already has a non-legacy hero", slug: slugValue });
  }

  const bytes = new Uint8Array(bytesBuffer);
  const verdict = await validateImageMatchesArticle(bytes, SUBJECTS[slugValue]);
  if (!verdict.matches) {
    return Response.json({
      ok: false,
      error: `openai-gpt-image-2 rejected by cloudflare-vision: ${verdict.reason}`.slice(0, 1000),
    }, { status: 422 });
  }

  const filename = `${slugValue}.jpg`;
  const { error: uploadError } = await supabaseAdmin.storage.from(BUCKET).upload(filename, bytes, {
    contentType: "image/jpeg",
    cacheControl: "public, max-age=31536000, immutable",
    upsert: true,
  });
  if (uploadError) return Response.json({ ok: false, error: uploadError.message }, { status: 500 });

  const url = `/api/public/article-image/${filename}`;
  const alt = `Editorial news photograph for Keep TX Red article: ${row.title}${row.category ? ` — ${row.category}` : ""}`;
  return Response.json({
    ok: true,
    slug: slugValue,
    url,
    alt,
    image_sha256: actualSha,
    validation: verdict.reason,
  });
}

export const Route = createFileRoute("/api/public/hooks/openai-article-image-recovery")({
  server: { handlers: { POST: async ({ request }) => recover(request) } },
});
