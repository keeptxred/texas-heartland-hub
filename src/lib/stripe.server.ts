import Stripe from "stripe";

const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`${key} is not configured`);
  return value;
};

export type StripeEnv = "sandbox" | "live";

export function normalizeStripeEnv(value: unknown): StripeEnv {
  if (value === "sandbox" || value === "live") return value;
  throw new Error("Invalid Stripe environment.");
}

export function validateStripeSecretKeyForEnvironment(
  env: StripeEnv,
  value: string,
): string {
  const key = value.trim();
  const allowedPrefixes =
    env === "sandbox" ? ["sk_test_", "rk_test_"] : ["sk_live_", "rk_live_"];

  if (!allowedPrefixes.some((prefix) => key.startsWith(prefix))) {
    const variable =
      env === "sandbox" ? "STRIPE_SANDBOX_SECRET_KEY" : "STRIPE_LIVE_SECRET_KEY";
    const mode = env === "sandbox" ? "test-mode" : "live-mode";
    throw new Error(`${variable} must contain a ${mode} Stripe secret key.`);
  }

  return key;
}

export function getStripeSecretKey(env: StripeEnv): string {
  const resolvedEnvironment = normalizeStripeEnv(env);
  const variable =
    resolvedEnvironment === "sandbox"
      ? "STRIPE_SANDBOX_SECRET_KEY"
      : "STRIPE_LIVE_SECRET_KEY";

  return validateStripeSecretKeyForEnvironment(
    resolvedEnvironment,
    getEnv(variable),
  );
}

export function createStripeClient(env: StripeEnv): Stripe {
  const resolvedEnvironment = normalizeStripeEnv(env);
  const stripe = new Stripe(getStripeSecretKey(resolvedEnvironment), {
    apiVersion: "2026-03-25.dahlia",
    maxNetworkRetries: 2,
  });

  // This Stripe account/API version uses the newer `embedded_page` value.
  // Normalize the legacy app constant at the client boundary so every direct
  // Checkout Session create call uses the mode Stripe currently accepts.
  const createCheckoutSession = stripe.checkout.sessions.create.bind(
    stripe.checkout.sessions,
  );
  (stripe.checkout.sessions as any).create = (params: any, options?: any) =>
    createCheckoutSession(
      params?.ui_mode === "embedded"
        ? { ...params, ui_mode: "embedded_page" }
        : params,
      options,
    );

  return stripe;
}

export function getStripeErrorMessage(error: unknown): string {
  if (error && typeof error === "object") {
    const e = error as {
      message?: string;
      type?: string;
      code?: string;
      raw?: { message?: string; type?: string; code?: string };
    };
    const message = e.raw?.message ?? e.message;
    if (message) return message;
  }
  return "Stripe request failed";
}

export async function verifyWebhook(
  req: Request,
  env: StripeEnv,
): Promise<{ type: string; data: { object: any }; id?: string }> {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();
  const secret =
    env === "sandbox"
      ? getEnv("PAYMENTS_SANDBOX_WEBHOOK_SECRET")
      : getEnv("PAYMENTS_LIVE_WEBHOOK_SECRET");

  if (!signature || !body) throw new Error("Missing signature or body");

  let timestamp: string | undefined;
  const v1Signatures: string[] = [];
  for (const part of signature.split(",")) {
    const [key, value] = part.split("=", 2);
    if (key === "t") timestamp = value;
    if (key === "v1") v1Signatures.push(value);
  }
  if (!timestamp || v1Signatures.length === 0) throw new Error("Invalid signature format");

  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (age > 300) throw new Error("Webhook timestamp too old");

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signed = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${timestamp}.${body}`),
  );
  const expected = Buffer.from(new Uint8Array(signed)).toString("hex");
  if (!v1Signatures.includes(expected)) throw new Error("Invalid webhook signature");

  return JSON.parse(body);
}
