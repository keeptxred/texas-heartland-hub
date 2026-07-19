import { useState } from "react";
import type { ContentAIResult } from "@/services/contentAI";

type SourceItem = {
  id: number;
  title: string;
  source: string;
  pub_date: string;
};

export type ContentPackage = {
  facebook: { hook: string; body: string; cta: string; hashtags: string[] };
  instagram: { hook: string; script: string; caption: string; hashtags: string[] };
  web: { seoTitle: string; metaDescription: string; internalLinks: { label: string; href: string }[] };
};

const STOPWORDS = new Set([
  "the","a","an","and","or","but","of","in","on","for","to","from","by","with","as","at","is","are","was","were","be","been","being","this","that","these","those","it","its","after","before","over","under","new","says","said","will","has","have","had","not","no","texas","texans",
]);

function keywords(title: string, max = 5): string[] {
  return Array.from(
    new Set(
      title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 3 && !STOPWORDS.has(w)),
    ),
  ).slice(0, max);
}

function tagify(words: string[], extras: string[] = []): string[] {
  const tags = words.map((w) => `#${w.replace(/[^a-z0-9]/g, "")}`).filter(Boolean);
  return Array.from(new Set([...extras, ...tags])).slice(0, 8);
}

function truncate(s: string, n: number): string {
  return s.length <= n ? s : s.slice(0, n - 1).trimEnd() + "…";
}

export function buildPackage(item: SourceItem): ContentPackage {
  const title = item.title.trim();
  const kws = keywords(title);
  const baseTags = ["#KeepTexasRed", "#Texas"];

  return {
    facebook: {
      hook: `🚨 ${truncate(title, 90)}`,
      body: `${title}. Reported by ${item.source}. Here's what Texans need to know and why it matters for our communities right now.`,
      cta: "Read the full breakdown on KeepTXRed.com — and share with a fellow Texan.",
      hashtags: tagify(kws, baseTags),
    },
    instagram: {
      hook: `You won't believe what just happened in Texas…`,
      script:
        `[0-3s] Hook: "${truncate(title, 80)}"\n` +
        `[3-15s] Context: Explain the who, what, and where in plain language.\n` +
        `[15-35s] Why it matters: Impact on Texas families, taxes, or safety.\n` +
        `[35-45s] CTA: "Follow @KeepTXRed for the full story — link in bio."`,
      caption: `${truncate(title, 140)}\n\nFull story on KeepTXRed.com. Source: ${item.source}.`,
      hashtags: tagify(kws, [...baseTags, "#TexasNews", "#Reels"]),
    },
    web: {
      seoTitle: truncate(`${title} | Keep TX Red`, 60),
      metaDescription: truncate(
        `${title}. Get the Texas angle, key facts, and what it means for you — from Keep TX Red.`,
        158,
      ),
      internalLinks: [
        { label: "Happening Now", href: "/happening-now" },
        { label: "Texas News", href: "/texas-news" },
        { label: "Elections", href: "/elections" },
        { label: "Laws", href: "/laws" },
      ],
    },
  };
}

export function ContentPackagePreview({
  item,
  pkg,
  onClose,
  ai,
  aiLoading = false,
  aiError = "",
  onRegenerate,
}: {
  item: SourceItem;
  pkg: ContentPackage;
  onClose: () => void;
  ai?: ContentAIResult;
  aiLoading?: boolean;
  aiError?: string;
  onRegenerate?: () => void;
}) {
  return (
    <div className="mt-3 border-2 border-primary/40 bg-white p-4 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-primary">★ Draft Package</div>
          <div className="text-sm font-medium leading-snug">{item.title}</div>
          <div className="text-[11px] text-muted-foreground">{item.source}</div>
        </div>
        <div className="flex items-center gap-3">
          {onRegenerate ? (
            <button
              type="button"
              onClick={onRegenerate}
              disabled={aiLoading}
              className="text-[11px] underline text-primary disabled:opacity-50"
            >
              {aiLoading ? "Generating…" : ai ? "Regenerate with AI" : "Generate with AI"}
            </button>
          ) : null}
          <button type="button" onClick={onClose} className="text-[11px] underline text-muted-foreground">
            Close
          </button>
        </div>
      </div>

      {aiError ? (
        <div className="text-[11px] text-destructive border border-destructive/40 bg-destructive/5 p-2">
          {aiError}
        </div>
      ) : null}

      {aiLoading && !ai ? (
        <div className="text-sm text-muted-foreground">Generating AI content package…</div>
      ) : null}

      {ai ? (
        <div className="space-y-4">
          <Section title="AI · Facebook Post">
            <CopyField label="Hook" value={ai.facebookPost.hook} />
            <CopyField label="Body" value={ai.facebookPost.body} multiline />
            <CopyField label="Call to Action" value={ai.facebookPost.callToAction} />
            <CopyField label="Hashtags" value={ai.facebookPost.hashtags.join(" ")} />
          </Section>
          <Section title="AI · Instagram Reel">
            <CopyField label="3-Second Hook" value={ai.instagramReel.hook} />
            <CopyField label="Script" value={ai.instagramReel.script} multiline />
            <CopyField label="Caption" value={ai.instagramReel.caption} multiline />
            <CopyField label="Hashtags" value={ai.instagramReel.hashtags.join(" ")} />
          </Section>
          <Section title="AI · SEO Package">
            <CopyField label="SEO Title" value={ai.seoPackage.title} />
            <CopyField label="Meta Description" value={ai.seoPackage.metaDescription} multiline />
            <CopyField label="Suggested Keywords" value={ai.seoPackage.suggestedKeywords.join(", ")} />
          </Section>
        </div>
      ) : null}

      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground pt-2 border-t border-border">
        Rule-based fallback
      </div>

      <Section title="Facebook Post">
        <Field label="Hook" value={pkg.facebook.hook} />
        <Field label="Body" value={pkg.facebook.body} />
        <Field label="CTA" value={pkg.facebook.cta} />
        <Field label="Hashtags" value={pkg.facebook.hashtags.join(" ")} />
      </Section>

      <Section title="Instagram Reel">
        <Field label="3-Second Hook" value={pkg.instagram.hook} />
        <Field label="Script (30–45s)" value={pkg.instagram.script} multiline />
        <Field label="Caption" value={pkg.instagram.caption} multiline />
        <Field label="Hashtags" value={pkg.instagram.hashtags.join(" ")} />
      </Section>

      <Section title="Website Enhancements">
        <Field label="SEO Title" value={pkg.web.seoTitle} />
        <Field label="Meta Description" value={pkg.web.metaDescription} />
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
            Internal Links
          </div>
          <ul className="text-sm list-disc pl-5">
            {pkg.web.internalLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="underline text-primary">{l.label}</a>{" "}
                <span className="text-[11px] text-muted-foreground">{l.href}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <p className="text-[11px] text-muted-foreground">
        Preview only. Nothing is published or stored in the database.
      </p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-border p-3 space-y-2">
      <h3 className="font-display text-sm uppercase tracking-widest">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, value, multiline = false }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</div>
      {multiline ? (
        <pre className="text-sm whitespace-pre-wrap font-sans mt-0.5">{value}</pre>
      ) : (
        <div className="text-sm mt-0.5">{value}</div>
      )}
    </div>
  );
}

function CopyField({ label, value, multiline = false }: { label: string; value: string; multiline?: boolean }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</div>
        <button
          type="button"
          onClick={copy}
          className="text-[10px] uppercase tracking-widest underline text-primary"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      {multiline ? (
        <pre className="text-sm whitespace-pre-wrap font-sans mt-0.5">{value}</pre>
      ) : (
        <div className="text-sm mt-0.5">{value}</div>
      )}
    </div>
  );
}