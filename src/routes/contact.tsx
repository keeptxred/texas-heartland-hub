import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Keep TX Red" },
      { name: "description", content: "Send tips, corrections, or feedback to the Keep TX Red newsroom." },
      { property: "og:title", content: "Contact Keep TX Red" },
      { property: "og:description", content: "Send tips, corrections, or feedback to the Keep TX Red newsroom." },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <div className="border-b-2 border-foreground pb-4 mb-10">
        <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">★ Get In Touch</span>
        <h1 className="font-display text-5xl md:text-6xl tracking-tight mt-1">Contact the Newsroom</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          Tips, corrections, story ideas, or feedback — we read everything.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        <aside className="md:col-span-1 space-y-6 text-sm">
          <div>
            <h3 className="font-display text-xs tracking-[0.25em] uppercase text-primary mb-2">News Tips</h3>
            <p className="text-muted-foreground">tips@keeptxred.com</p>
          </div>
          <div>
            <h3 className="font-display text-xs tracking-[0.25em] uppercase text-primary mb-2">Corrections</h3>
            <p className="text-muted-foreground">corrections@keeptxred.com</p>
          </div>
          <div>
            <h3 className="font-display text-xs tracking-[0.25em] uppercase text-primary mb-2">General</h3>
            <p className="text-muted-foreground">hello@keeptxred.com</p>
          </div>
          <div>
            <h3 className="font-display text-xs tracking-[0.25em] uppercase text-primary mb-2">Mail</h3>
            <p className="text-muted-foreground">Keep TX Red<br />Austin, Texas</p>
          </div>
        </aside>

        <form
          className="md:col-span-2 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          {sent ? (
            <div className="border-2 border-primary bg-primary/5 p-6">
              <h2 className="font-display text-2xl tracking-tight">Message received.</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Thanks for writing. We'll be in touch if a response is warranted. Texas strong. ★
              </p>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Name" name="name" required />
                <Field label="Email" name="email" type="email" required />
              </div>
              <Field label="Subject" name="subject" required />
              <div>
                <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-foreground mb-2">Message</label>
                <textarea
                  required
                  rows={7}
                  className="w-full border border-border bg-background p-3 text-sm font-serif focus:outline-none focus:border-primary"
                />
              </div>
              <button
                type="submit"
                className="bg-primary text-primary-foreground font-display tracking-[0.2em] uppercase text-sm px-7 py-3 hover:bg-primary/90"
              >
                Send Message ★
              </button>
              <p className="text-xs text-muted-foreground">
                By submitting you agree to our <a href="/privacy" className="text-primary underline">privacy policy</a>.
              </p>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

function Field({ label, name, type = "text", required = false }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-foreground mb-2">{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        className="w-full border border-border bg-background p-3 text-sm font-serif focus:outline-none focus:border-primary"
      />
    </div>
  );
}