import { z } from "zod";
import { authenticated, oauth, RESOURCE, SCOPE } from "./auth.server";
import { advance, kindSchema, prepare, Printify } from "./printify.server";
import { environment, json, PublisherError, requestJson, Store } from "./store.server";

const schema = (properties: Record<string, unknown>, required: string[] = []) => ({
  type: "object",
  properties,
  required,
  additionalProperties: false,
});
const text = { type: "string" };
const job = { type: "string", pattern: "^[A-Za-z0-9_-]{8,64}$" };
const kind = { type: "string", enum: ["shirt", "sticker"] };
const outputSchema = { type: "object", additionalProperties: true };
const securitySchemes = [{ type: "oauth2", scopes: [SCOPE] }];
function tool(
  name: string,
  title: string,
  description: string,
  inputSchema: unknown,
  readOnly: boolean,
  meta = {},
) {
  return {
    name,
    title,
    description,
    inputSchema,
    outputSchema,
    securitySchemes,
    annotations: {
      readOnlyHint: readOnly,
      destructiveHint: !readOnly,
      openWorldHint: true,
      idempotentHint: true,
    },
    _meta: { securitySchemes, ...meta },
  };
}
export const tools = [
  tool(
    "publisher_catalog",
    "Inspect publishing setup",
    "Read connected Printify shop, channel, configured shirt/sticker defaults and existing template products. Do this before setup or publication. Never invent provider or variant IDs.",
    schema({}),
    true,
  ),
  tool(
    "configure_product",
    "Set product defaults",
    "With explicit user approval, copy blueprint, provider, enabled variants and retail prices from an existing approved Printify template product. Validate against live catalog and save defaults. Does not create products.",
    schema({ kind, template_product_id: text, approved: { const: true, type: "boolean" } }, [
      "kind",
      "template_product_id",
      "approved",
    ]),
    false,
  ),
  tool(
    "prepare_products",
    "Prepare approved artwork",
    "Require exactly 13 unique, buyer-relevant descriptive tags (at most 20 characters each) for every new Etsy listing; internal hp-* reconciliation tags never occupy an Etsy search slot. Use only artwork the user has approved. Transfers the attached print-ready PNG securely from ChatGPT to Printify and returns exact variants, prices, placement and website destination for review. Creates no products/listings. Keep job_id stable across retries. Never invent file URLs. If the generated image is unavailable as a file, ask the user to attach the approved PNG.",
    schema(
      {
        job_id: job,
        artwork: schema({ download_url: text, file_id: text, mime_type: text, file_name: text }, [
          "download_url",
          "file_id",
        ]),
        title: text,
        description: text,
        tags: { type: "array", items: text, minItems: 13, maxItems: 13 },
        products: { type: "array", items: kind, minItems: 1, maxItems: 2, uniqueItems: true },
        website: { type: "string", enum: ["keeptxred", "texasdefined", "none"] },
        artwork_approved: { type: "boolean", const: true },
      },
      ["job_id", "artwork", "title", "description", "tags", "products", "website", "artwork_approved"],
    ),
    false,
    { "openai/fileParams": ["artwork"] },
  ),
  tool(
    "publish_products",
    "Publish approved products",
    "After the user explicitly approves the prepared plan, create the products, publish eligible Etsy products, and sync the selected website. Use the approval_token from prepare_products. Report success only when verified=true. A pending or uncertain result requires check_publication; never create a new job to bypass an uncertain operation.",
    schema({ job_id: job, approval_token: text, approved: { type: "boolean", const: true } }, [
      "job_id",
      "approval_token",
      "approved",
    ]),
    false,
  ),
  tool(
    "check_publication",
    "Reconcile and verify publication",
    "Resume an approved job, reconcile uncertain Printify creation, sync outstanding website data, and check public Etsy/website links. May complete previously approved writes. Return pending honestly when external publication or verification is unavailable.",
    schema({ job_id: job }, ["job_id"]),
    false,
  ),
];
const callSchema = z.object({ name: z.string(), arguments: z.unknown().optional() });
async function execute(store: Store, subject: string, name: string, args: unknown) {
  if (name === "publisher_catalog") {
    z.object({})
      .strict()
      .parse(args ?? {});
    return new Printify(store).overview();
  }
  if (name === "configure_product") {
    const input = z
      .object({
        kind: kindSchema,
        template_product_id: z.string().regex(/^[a-zA-Z0-9_-]{1,100}$/),
        approved: z.literal(true),
      })
      .strict()
      .parse(args);
    return new Printify(store).configure(input.kind, input.template_product_id);
  }
  if (name === "prepare_products") return prepare(store, subject, args);
  if (name === "publish_products") {
    const input = z
      .object({ job_id: z.string(), approval_token: z.string().min(1), approved: z.literal(true) })
      .strict()
      .parse(args);
    return advance(store, subject, input.job_id, input.approval_token);
  }
  if (name === "check_publication") {
    const input = z.object({ job_id: z.string() }).strict().parse(args);
    return advance(store, subject, input.job_id);
  }
  throw new PublisherError("Unknown tool");
}
export async function publisherResponse(
  request: Request,
  rawEnv: unknown,
): Promise<Response | null> {
  const path = new URL(request.url).pathname;
  if (
    !(
      path === "/api/publisher/mcp" ||
      path.startsWith("/publisher/oauth/") ||
      path.startsWith("/.well-known/oauth-") ||
      path === "/publisher/connect"
    )
  )
    return null;
  const store = new Store(environment(rawEnv));
  try {
    if (path === "/publisher/connect") {
      return new Response(
        '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Heartland Publisher connection</title><main><h1>Heartland Publisher</h1><p>Private ChatGPT connection for approved artwork, Printify, Etsy, and your website stores.</p><p>In ChatGPT plugin settings, create a private MCP connection using:</p><code>https://keeptxred.com/api/publisher/mcp</code><p>Choose OAuth and Client ID Metadata Document (CIMD). Authorize on KeepTXRed.com using your administrator passcode. Then select the plugin in your conversation.</p><p>First inspect publishing setup and select approved existing shirt/sticker templates. Approve your artwork and the prepared prices, variants, print placement, and destination before publishing. Pending does not mean live.</p></main></html>',
        {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "no-store",
            "X-Robots-Tag": "noindex",
            "Content-Security-Policy":
              "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
          },
        },
      );
    }
    const auth = await oauth(request, store);
    if (auth) return auth;
    const origin = request.headers.get("origin");
    if (origin && !["https://chatgpt.com", "https://keeptxred.com"].includes(origin))
      throw new PublisherError("Origin not allowed", 403);
    const subject = await authenticated(request, store);
    if (request.method !== "POST")
      return json({ error: "Use stateless Streamable HTTP POST" }, 405, { Allow: "POST" });
    if (!request.headers.get("content-type")?.includes("application/json"))
      throw new PublisherError("application/json required", 415);
    const message = z
      .object({
        jsonrpc: z.literal("2.0"),
        id: z.union([z.string(), z.number()]).optional(),
        method: z.string(),
        params: z.unknown().optional(),
      })
      .parse(await requestJson(request));
    if (message.id === undefined) return new Response(null, { status: 202 });
    const reply = (result: unknown) => json({ jsonrpc: "2.0", id: message.id, result });
    if (message.method === "initialize") {
      const params = z.object({ protocolVersion: z.string() }).passthrough().parse(message.params);
      return reply({
        protocolVersion: ["2025-03-26", "2025-06-18", "2025-11-25"].includes(params.protocolVersion)
          ? params.protocolVersion
          : "2025-11-25",
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: "heartland-publisher", version: "2.0.0" },
        instructions:
          "Private approved-artwork publisher. Inspect catalog first. Get user approval of artwork, then prepare a stable job and review exact variants/prices/destinations before publishing. Never claim live until verified=true. Poll check_publication for pending jobs; do not change job_id to retry a mutation.",
      });
    }
    if (message.method === "ping") return reply({});
    if (message.method === "tools/list") return reply({ tools });
    if (message.method === "tools/call") {
      const call = callSchema.parse(message.params);
      try {
        const result = await execute(store, subject, call.name, call.arguments);
        return reply({
          content: [{ type: "text", text: JSON.stringify(result) }],
          structuredContent: result,
        });
      } catch (error) {
        const detail =
          error instanceof z.ZodError
            ? "Invalid tool arguments: " +
              error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")
            : error instanceof PublisherError
              ? error.message
              : "Publishing operation failed; check status before retrying. No success is assumed.";
        return reply({ isError: true, content: [{ type: "text", text: detail }] });
      }
    }
    return json({
      jsonrpc: "2.0",
      id: message.id,
      error: { code: -32601, message: "Method not found" },
    });
  } catch (error) {
    const status = error instanceof PublisherError ? error.status : 400;
    return json(
      { error: error instanceof PublisherError ? error.message : "Invalid request" },
      status,
      status === 401
        ? {
            "WWW-Authenticate": `Bearer resource_metadata="https://keeptxred.com/.well-known/oauth-protected-resource/api/publisher/mcp", scope="${SCOPE}"`,
          }
        : {},
    );
  }
}
