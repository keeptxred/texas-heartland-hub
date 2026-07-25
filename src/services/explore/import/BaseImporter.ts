import { createHash } from "node:crypto";
import { importEntityDraftSchema } from "@/schemas/explore/import.schema";
import type {
  ImportConnector,
  ImportContext,
  ImportEntityDraft,
  ImportSourceConfig,
  ImportSourceType,
  ImportValidationIssue,
} from "@/types/explore/import";

export abstract class BaseImporter<TRaw = unknown> implements ImportConnector<TRaw> {
  abstract readonly sourceType: ImportSourceType;

  protected constructor(protected readonly config: ImportSourceConfig) {}

  async download(context: ImportContext): Promise<unknown> {
    const url = new URL(this.config.endpoint);
    for (const [key, value] of Object.entries(this.config.query ?? {}))
      url.searchParams.set(key, value);
    if (this.config.cursor?.value)
      url.searchParams.set(this.config.cursor.field, this.config.cursor.value);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.timeoutMs ?? 30_000);
    const signal = context.signal
      ? AbortSignal.any([context.signal, controller.signal])
      : controller.signal;

    try {
      const response = await this.withRetry(async () => {
        const result = await fetch(url, { headers: await this.buildHeaders(), signal });
        if (!result.ok) {
          const body = await result.text().catch(() => "");
          throw new Error(
            `Import download failed (${result.status} ${result.statusText})${body ? `: ${body.slice(0, 500)}` : ""}`,
          );
        }
        return result;
      });
      const contentType = response.headers.get("content-type") ?? "";
      return contentType.includes("json") ? response.json() : response.text();
    } finally {
      clearTimeout(timeout);
    }
  }

  abstract parse(payload: unknown, context: ImportContext): Promise<TRaw[]>;
  abstract normalize(record: TRaw, context: ImportContext): Promise<ImportEntityDraft>;

  validate(record: ImportEntityDraft): ImportValidationIssue[] {
    const parsed = importEntityDraftSchema.safeParse(record);
    if (parsed.success) return [];
    return parsed.error.issues.map((issue) => ({
      code: issue.code,
      message: issue.message,
      path: issue.path.join("."),
      severity: "error" as const,
    }));
  }

  checksum(record: ImportEntityDraft): string {
    return createHash("sha256")
      .update(
        this.stableStringify({
          externalId: record.externalId,
          entityType: record.entityType,
          name: record.name,
          description: record.description ?? null,
          latitude: record.latitude ?? null,
          longitude: record.longitude ?? null,
          address: record.address ?? null,
          taxonomy: [...(record.taxonomy ?? [])].sort(),
          relationships: record.relationships ?? [],
          media: record.media ?? [],
          sourceUpdatedAt: record.sourceUpdatedAt ?? null,
          sourceUrl: record.sourceUrl ?? null,
          metadata: record.metadata ?? {},
        }),
      )
      .digest("hex");
  }

  protected async buildHeaders(): Promise<HeadersInit> {
    const headers = new Headers(this.config.headers);
    headers.set("accept", headers.get("accept") ?? "application/json");
    const auth = this.config.auth;
    if (!auth || auth.type === "none") return headers;
    if (!auth.secretName) throw new Error(`Missing secretName for ${auth.type} authentication`);
    const secret = this.readSecret(auth.secretName);
    if (auth.type === "bearer") headers.set("authorization", `Bearer ${secret}`);
    if (auth.type === "api-key") headers.set("x-api-key", secret);
    if (auth.type === "basic") headers.set("authorization", `Basic ${btoa(secret)}`);
    return headers;
  }

  protected readSecret(name: string): string {
    const runtime = globalThis as typeof globalThis & {
      Deno?: { env?: { get?: (key: string) => string | undefined } };
      process?: { env?: Record<string, string | undefined> };
    };
    const value = runtime.Deno?.env?.get?.(name) ?? runtime.process?.env?.[name];
    if (!value) throw new Error(`Required import secret ${name} is not configured`);
    return value;
  }

  private async withRetry<T>(operation: () => Promise<T>): Promise<T> {
    const retry = this.config.retry ?? { attempts: 3, baseDelayMs: 500, maxDelayMs: 10_000 };
    let lastError: unknown;
    for (let attempt = 1; attempt <= retry.attempts; attempt += 1) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        if (attempt === retry.attempts) break;
        const delay = Math.min(retry.maxDelayMs, retry.baseDelayMs * 2 ** (attempt - 1));
        await new Promise((resolve) =>
          setTimeout(resolve, delay + Math.floor(Math.random() * 250)),
        );
      }
    }
    throw lastError instanceof Error ? lastError : new Error(String(lastError));
  }

  private stableStringify(value: unknown): string {
    if (Array.isArray(value))
      return `[${value.map((item) => this.stableStringify(item)).join(",")}]`;
    if (value && typeof value === "object") {
      return `{${Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, item]) => `${JSON.stringify(key)}:${this.stableStringify(item)}`)
        .join(",")}}`;
    }
    return JSON.stringify(value);
  }
}
