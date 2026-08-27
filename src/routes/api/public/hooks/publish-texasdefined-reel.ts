import { createFileRoute } from "@tanstack/react-router";
import {
  normalizeHostedReelUrl,
  publishFacebookReel,
  TEXASDEFINED_FACEBOOK_PLATFORM,
  TEXASDEFINED_REEL_CONFIRMATION,
  validateReelFile,
  type ReelSource,
} from "@/lib/facebook-reels";

function authOk(token: string): boolean {
  const expected = process.env.ADMIN_PASSCODE ?? "keeptxred";
  return token === expected;
}

type ParsedRequest = {
  token: string;
  confirmation: string;
  title: string;
  description: string;
  source: ReelSource | null;
};

async function parseRequest(request: Request): Promise<ParsedRequest> {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.toLowerCase().includes("multipart/form-data")) {
    const form = await request.formData();
    const file = form.get("video");
    let source: ReelSource | null = null;
    if (file instanceof File && file.size > 0) {
      const validationError = validateReelFile(file);
      if (validationError) throw new Error(validationError);
      source = {
        kind: "file",
        bytes: await file.arrayBuffer(),
        size: file.size,
        contentType: file.type,
        filename: file.name,
      };
    } else {
      const hostedUrl = normalizeHostedReelUrl(form.get("video_url"));
      if (hostedUrl) source = { kind: "url", url: hostedUrl };
    }
    return {
      token: String(form.get("token") ?? ""),
      confirmation: String(form.get("confirmation") ?? ""),
      title: String(form.get("title") ?? ""),
      description: String(form.get("description") ?? ""),
      source,
    };
  }

  const body = (await request.json()) as Record<string, unknown>;
  const hostedUrl = normalizeHostedReelUrl(body.video_url);
  return {
    token: typeof body.token === "string" ? body.token : "",
    confirmation: typeof body.confirmation === "string" ? body.confirmation : "",
    title: typeof body.title === "string" ? body.title : "",
    description: typeof body.description === "string" ? body.description : "",
    source: hostedUrl ? { kind: "url", url: hostedUrl } : null,
  };
}

async function publishTexasDefinedReel(request: Request): Promise<Response> {
  let parsed: ParsedRequest;
  try {
    parsed = await parseRequest(request);
  } catch (error) {
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : "Invalid Reel request." },
      { status: 400 },
    );
  }

  if (!authOk(parsed.token)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (parsed.confirmation !== TEXASDEFINED_REEL_CONFIRMATION) {
    return Response.json(
      {
        ok: false,
        error: `Publishing requires exact confirmation: ${TEXASDEFINED_REEL_CONFIRMATION}`,
      },
      { status: 400 },
    );
  }
  if (!parsed.source) {
    return Response.json(
      { ok: false, error: "Provide either a public HTTPS video_url or an MP4/MOV file in the video field." },
      { status: 400 },
    );
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: connection, error: connectionError } = await supabaseAdmin
    .from("social_connections")
    .select("account_id,access_token,connection_status")
    .eq("platform", TEXASDEFINED_FACEBOOK_PLATFORM)
    .maybeSingle();

  if (connectionError) {
    return Response.json({ ok: false, error: connectionError.message }, { status: 500 });
  }
  if (
    !connection ||
    connection.connection_status !== "CONNECTED" ||
    !connection.account_id ||
    !connection.access_token
  ) {
    return Response.json(
      {
        ok: false,
        error: "TexasDefined Facebook Page is not connected.",
        requires_connection: true,
      },
      { status: 503 },
    );
  }

  try {
    const result = await publishFacebookReel({
      pageId: String(connection.account_id),
      pageToken: String(connection.access_token),
      source: parsed.source,
      title: parsed.title,
      description: parsed.description,
    });

    return Response.json({
      ok: true,
      published: true,
      video_id: result.videoId,
      source_type: parsed.source.kind,
    });
  } catch (error) {
    console.error(
      "[publish-texasdefined-reel] Facebook publish failed",
      error instanceof Error ? error.message : String(error),
    );
    return Response.json(
      {
        ok: false,
        published: false,
        error: error instanceof Error ? error.message : "Facebook Reel publishing failed.",
      },
      { status: 502 },
    );
  }
}

export const Route = createFileRoute("/api/public/hooks/publish-texasdefined-reel")({
  server: {
    handlers: {
      POST: ({ request }) => publishTexasDefinedReel(request),
    },
  },
});
