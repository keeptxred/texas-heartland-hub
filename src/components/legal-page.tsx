import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function LegalPage({
  title,
  description,
  updated = "July 24, 2026",
  children,
}: {
  title: string;
  description: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-14">
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link to="/" className="hover:text-primary">Home</Link></li>
          <li aria-hidden>/</li>
          <li><Link to="/shop" className="hover:text-primary">Shop</Link></li>
          <li aria-hidden>/</li>
          <li className="font-medium text-foreground">{title}</li>
        </ol>
      </nav>

      <header className="mb-10 border-b-2 border-foreground pb-5">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">★ Shop Policies</span>
        <h1 className="mt-1 font-display text-4xl tracking-tight md:text-6xl">{title}</h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">{description}</p>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: {updated}</p>
      </header>

      <article className="space-y-8 font-serif text-base leading-relaxed text-foreground/90 [&_h2]:mb-2 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:tracking-tight [&_h2]:text-foreground [&_h3]:mb-2 [&_h3]:font-display [&_h3]:text-xl [&_li]:ml-6 [&_li]:list-disc [&_ul]:space-y-1 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4">
        {children}
      </article>

      <aside className="mt-12 rounded-xl border border-border bg-secondary/40 p-6">
        <h2 className="font-display text-xl">Need help with an order?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Send us your order number and a clear description of the issue through our contact page.
        </p>
        <Link
          to="/contact"
          className="mt-4 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Contact Keep TX Red
        </Link>
      </aside>
    </main>
  );
}
