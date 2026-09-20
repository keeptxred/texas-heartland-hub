import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SITE_URL } from "@/lib/seo";

const LIVE_TEST_RUN = "ktr-20260920-3f7a9d";

type TestStatus = {
  paid: boolean;
  webhookReceived: boolean;
  amountTotal?: number | null;
  status?: string;
  paymentStatus?: string;
};

export const Route = createFileRoute("/shop/live-payment-test")({
  validateSearch: (search: Record<string, unknown>) => ({
    run: typeof search.run === "string" ? search.run : undefined,
    session_id: typeof search.session_id === "string" ? search.session_id : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Live Payment Verification — Keep TX Red" },
      { name: "robots", content: "noindex,follow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/shop/live-payment-test` }],
  }),
  component: LivePaymentTestPage,
});

function LivePaymentTestPage() {
  const { run, session_id } = Route.useSearch();
  const validRun = run === LIVE_TEST_RUN;
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<TestStatus | null>(null);

  useEffect(() => {
    if (!validRun || !session_id) return;
    let cancelled = false;
    let attempts = 0;

    const poll = async () => {
      attempts += 1;
      try {
        const url = new URL("/api/public/payments/live-test", window.location.origin);
        url.searchParams.set("site", "ktr");
        url.searchParams.set("run", LIVE_TEST_RUN);
        url.searchParams.set("session_id", session_id);
        const response = await fetch(url, { headers: { accept: "application/json" }, cache: "no-store" });
        const payload = await response.json() as TestStatus & { ok?: boolean; error?: string };
        if (!response.ok || !payload.ok) throw new Error(payload.error || "Unable to verify payment.");
        if (cancelled) return;
        setStatus(payload);
        if ((!payload.paid || !payload.webhookReceived) && attempts < 15) {
          window.setTimeout(poll, 1500);
        }
      } catch (cause) {
        if (!cancelled) setError(cause instanceof Error ? cause.message : "Unable to verify payment.");
      }
    };

    void poll();
    return () => { cancelled = true; };
  }, [validRun, session_id]);

  async function startTest() {
    setWorking(true);
    setError("");
    try {
      const response = await fetch("/api/public/payments/live-test", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ site: "ktr", run: LIVE_TEST_RUN }),
      });
      const payload = await response.json() as { ok?: boolean; url?: string; error?: string };
      if (!response.ok || !payload.ok || !payload.url) {
        throw new Error(payload.error || "Unable to start live payment test.");
      }
      window.location.assign(payload.url);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to start live payment test.");
      setWorking(false);
    }
  }

  const complete = Boolean(status?.paid && status?.webhookReceived);

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-[900px] px-6 py-12">
          <div className="text-[11px] font-semibold tracking-[0.3em] uppercase text-primary mb-3">
            Keep TX Red Shop
          </div>
          <h1 className="font-display text-4xl md:text-5xl">50¢ Live Payment Verification</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/90">
            This is a one-time live Stripe diagnostic. It charges exactly $0.50 and does not create or ship merchandise.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[900px] px-6 py-12">
        {!validRun ? (
          <div className="rounded-2xl border border-border bg-card p-8">
            <h2 className="font-display text-2xl">This test link is invalid or expired.</h2>
            <Link to="/shop" search={{ category: undefined, collection: undefined, q: undefined, sort: undefined }} className="mt-6 inline-block font-semibold text-primary hover:underline">
              Return to the shop
            </Link>
          </div>
        ) : session_id ? (
          <div className="rounded-2xl border border-border bg-card p-8">
            <h2 className="font-display text-3xl">
              {complete ? "Live payment verified" : status?.paid ? "Payment received — checking webhook" : "Checking live payment"}
            </h2>
            <p className="mt-4 text-muted-foreground">
              {complete
                ? "Stripe confirms the 50¢ live payment and the production webhook received it. Printify fulfillment was intentionally suppressed."
                : "This page is checking Stripe and the production webhook. It may take a few seconds after checkout returns."}
            </p>
            {status ? (
              <div className="mt-6 grid gap-3 rounded-xl border border-border bg-muted/20 p-5 text-sm sm:grid-cols-2">
                <div><span className="text-muted-foreground">Payment:</span> <strong>{status.paid ? "Paid" : status.paymentStatus || "pending"}</strong></div>
                <div><span className="text-muted-foreground">Webhook:</span> <strong>{status.webhookReceived ? "Received" : "Waiting"}</strong></div>
                <div><span className="text-muted-foreground">Amount:</span> <strong>$0.50</strong></div>
                <div><span className="text-muted-foreground">Fulfillment:</span> <strong>Suppressed for test</strong></div>
              </div>
            ) : null}
            {error ? <p role="alert" className="mt-5 text-sm text-destructive">{error}</p> : null}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-8">
            <h2 className="font-display text-3xl">Ready to run the live KTR charge</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
              Clicking below opens Stripe’s live hosted checkout. Enter the card there. The charge is real and is exactly 50¢.
            </p>
            <button
              type="button"
              onClick={startTest}
              disabled={working}
              className="mt-7 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              {working ? "Opening Stripe…" : "Start 50¢ live KTR test"}
            </button>
            {error ? <p role="alert" className="mt-5 text-sm text-destructive">{error}</p> : null}
          </div>
        )}
      </section>
    </main>
  );
}
