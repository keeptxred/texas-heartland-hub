import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { subscribeNewsletter } from "@/lib/newsletter.functions";

type Props = {
  sourcePage?: string;
  compact?: boolean;
};

export function NewsletterSignup({ sourcePage, compact = false }: Props) {
  const subscribe = useServerFn(subscribeNewsletter);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "loading") return;
    setState("loading");
    try {
      const res = await subscribe({ data: { email, source_page: sourcePage ?? null } });
      if (res.ok) {
        setState("ok");
        setMessage(res.alreadySubscribed ? "You're already on the list — thanks!" : "Thanks! You're on the list.");
        setEmail("");
      } else {
        setState("error");
        setMessage(res.error ?? "Something went wrong.");
      }
    } catch {
      setState("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <section
      className={
        compact
          ? "rounded-md border border-border bg-muted/40 p-5"
          : "rounded-md border border-border bg-muted/40 p-7"
      }
      aria-labelledby="newsletter-heading"
    >
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Newsletter</span>
      <h3
        id="newsletter-heading"
        className={
          compact
            ? "font-sans text-lg font-semibold mt-1 text-foreground"
            : "font-sans text-2xl font-semibold mt-1 text-foreground"
        }
      >
        Get Texas updates delivered weekly.
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Independent Texas reporting on politics, policy, and daily life. One email a week. Unsubscribe anytime.
      </p>
      <form onSubmit={onSubmit} className="mt-4 flex flex-col sm:flex-row gap-3">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-md border border-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="inline-flex items-center justify-center bg-primary text-primary-foreground px-5 py-2 text-sm font-medium rounded-md hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          {state === "loading" ? "Subscribing…" : "Subscribe"}
        </button>
      </form>
      {message && (
        <p
          className={
            state === "ok"
              ? "mt-3 text-sm text-primary"
              : state === "error"
                ? "mt-3 text-sm text-destructive"
                : "mt-3 text-sm text-muted-foreground"
          }
          role="status"
        >
          {message}
        </p>
      )}
    </section>
  );
}