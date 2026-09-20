import { createStripeClient } from "@/lib/stripe.server";

export type StripeSandboxBindings = {
  publishable_key: boolean;
  secret_key: boolean;
  webhook_secret: boolean;
};

export type StripeSandboxProbe = {
  ok: boolean;
  error_type: string | null;
  error_code: string | null;
};

export function getStripeSandboxBindings(
  env: Record<string, string | undefined> = process.env,
): StripeSandboxBindings {
  const publishableKey = env.STRIPE_SANDBOX_PUBLISHABLE_KEY?.trim() ?? "";
  const secretKey = env.STRIPE_SANDBOX_SECRET_KEY?.trim() ?? "";
  const webhookSecret = env.PAYMENTS_SANDBOX_WEBHOOK_SECRET?.trim() ?? "";

  return {
    publishable_key: publishableKey.startsWith("pk_test_"),
    secret_key:
      secretKey.startsWith("sk_test_") || secretKey.startsWith("rk_test_"),
    webhook_secret: webhookSecret.startsWith("whsec_"),
  };
}

function safeStripeError(error: unknown): Pick<StripeSandboxProbe, "error_type" | "error_code"> {
  if (!error || typeof error !== "object") {
    return { error_type: "unknown_error", error_code: null };
  }

  const candidate = error as {
    type?: unknown;
    code?: unknown;
    message?: unknown;
    raw?: { type?: unknown; code?: unknown };
  };
  const type = candidate.raw?.type ?? candidate.type;
  const code = candidate.raw?.code ?? candidate.code;

  if (typeof type === "string" || typeof code === "string") {
    return {
      error_type: typeof type === "string" ? type.slice(0, 80) : null,
      error_code: typeof code === "string" ? code.slice(0, 80) : null,
    };
  }

  const message = typeof candidate.message === "string" ? candidate.message : "";
  if (message.includes("STRIPE_SANDBOX_SECRET_KEY is not configured")) {
    return { error_type: "configuration_error", error_code: "secret_not_configured" };
  }
  if (message.includes("must contain a test-mode Stripe secret key")) {
    return { error_type: "configuration_error", error_code: "wrong_secret_mode" };
  }

  return { error_type: "unknown_error", error_code: null };
}

export async function probeStripeSandbox(): Promise<StripeSandboxProbe> {
  try {
    const stripe = createStripeClient("sandbox");
    await stripe.checkout.sessions.list({ limit: 1 });
    return { ok: true, error_type: null, error_code: null };
  } catch (error) {
    return { ok: false, ...safeStripeError(error) };
  }
}
