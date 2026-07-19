import { Fragment, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  ContentPackagePreview,
  buildPackage,
  type ContentPackage,
} from "@/components/admin/ContentPackagePreview";
import { generateContentPackage, type ContentAIResult } from "@/services/contentAI";
import { quickPublishToFacebook } from "@/services/quickPublish";

type FeedItem = {
  id: number;
  title: string;
  source: string;
  pub_date: string;
};

type Scored = FeedItem & {
  texasScore: number;
  breakingScore: number;
  socialScore: number;
  total: number;
};

const TEXAS_TOPICS = /\b(tax|taxes|election|elections|law|laws|border|economy|economic|public safety|police|crime)\b/i;
const OFFICIAL_SOURCES = /(governor|texas\.gov|office of the governor|attorney general|texas tribune official|state of texas)/i;
const BREAKING_WORDS = /\b(breaking|signs|declares|announces|emergency|ruling|election|law|veto|appoints)\b/i;
const SOCIAL_TOPICS = /\b(election|elections|tax|taxes|border|crime|governor|abbott|hurricane|storm|shooting|flood)\b/i;

function hoursSince(iso: string): number {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return Infinity;
  return (Date.now() - t) / 3_600_000;
}

function score(item: FeedItem): Scored {
  const title = item.title ?? "";
  const source = item.source ?? "";
  const hrs = hoursSince(item.pub_date);

  let texas = 0;
  if (/\btexas\b/i.test(title)) texas += 30;
  if (OFFICIAL_SOURCES.test(source)) texas += 20;
  if (TEXAS_TOPICS.test(title)) texas += 20;
  if (hrs <= 24) texas += 10;

  let breaking = 0;
  if (BREAKING_WORDS.test(title)) breaking += 30;
  if (hrs <= 12) breaking += 20;

  let social = 0;
  if (SOCIAL_TOPICS.test(title)) social += 30;
  if (breaking >= 30) social += 20;

  return { ...item, texasScore: texas, breakingScore: breaking, socialScore: social, total: texas + breaking + social };
}

function recommendation(total: number): { label: string; tone: string } {
  if (total >= 80) return { label: "Create Social Package", tone: "text-emerald-600" };
  if (total >= 60) return { label: "Review", tone: "text-amber-600" };
  return { label: "Monitor", tone: "text-muted-foreground" };
}

export function ContentOpportunityPanel() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actions, setActions] = useState<Record<number, "package" | "ignored">>({});
  const [packages, setPackages] = useState<Record<number, ContentPackage>>({});
  const [openId, setOpenId] = useState<number | null>(null);
  const [ai, setAi] = useState<Record<number, ContentAIResult>>({});
  const [aiLoading, setAiLoading] = useState<Record<number, boolean>>({});
  const [aiError, setAiError] = useState<Record<number, string>>({});
  const [publishing, setPublishing] = useState<Record<number, boolean>>({});
  const [publishMsg, setPublishMsg] = useState<Record<number, { ok: boolean; text: string }>>({});

  async function quickPost(r: Scored) {
    setPublishing((s) => ({ ...s, [r.id]: true }));
    setPublishMsg((s) => ({ ...s, [r.id]: { ok: false, text: "" } }));
    try {
      const res = await quickPublishToFacebook({
        headline: r.title,
        source: r.source,
        feed_item_id: r.id,
      });
      if (res.ok) {
        setPublishMsg((s) => ({ ...s, [r.id]: { ok: true, text: "Published to Facebook" } }));
        setActions((s) => ({ ...s, [r.id]: "ignored" }));
      } else {
        setPublishMsg((s) => ({ ...s, [r.id]: { ok: false, text: res.error } }));
      }
    } catch (e) {
      setPublishMsg((s) => ({
        ...s,
        [r.id]: { ok: false, text: e instanceof Error ? e.message : "Publish failed" },
      }));
    } finally {
      setPublishing((s) => ({ ...s, [r.id]: false }));
    }
  }

  async function runAI(r: Scored) {
    setAiLoading((s) => ({ ...s, [r.id]: true }));
    setAiError((s) => ({ ...s, [r.id]: "" }));
    try {
      const result = await generateContentPackage({
        headline: r.title,
        source: r.source,
        publishedAt: r.pub_date,
      });
      setAi((s) => ({ ...s, [r.id]: result }));
    } catch (e) {
      setAiError((s) => ({
        ...s,
        [r.id]: e instanceof Error ? e.message : "AI generation failed",
      }));
    } finally {
      setAiLoading((s) => ({ ...s, [r.id]: false }));
    }
  }

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("texas_news_feed")
        .select("id,title,source,pub_date")
        .order("pub_date", { ascending: false })
        .limit(50);
      if (!active) return;
      setItems((data ?? []) as FeedItem[]);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const scored = useMemo(
    () => items.map(score).sort((a, b) => b.total - a.total),
    [items],
  );

  return (
    <div className="border-2 border-foreground/10 bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-xl">Content Opportunities</h2>
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          AI runs only on Generate Package click
        </span>
      </div>
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : scored.length === 0 ? (
        <div className="text-sm text-muted-foreground">No recent feed items.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border">
                <th className="py-2 pr-2">Headline</th>
                <th className="py-2 pr-2">Source</th>
                <th className="py-2 pr-2">Published</th>
                <th className="py-2 pr-2 text-right">TX</th>
                <th className="py-2 pr-2 text-right">Break</th>
                <th className="py-2 pr-2 text-right">Social</th>
                <th className="py-2 pr-2">Action</th>
                <th className="py-2 pr-2" />
              </tr>
            </thead>
            <tbody>
              {scored.slice(0, 25).map((r) => {
                const rec = recommendation(r.total);
                const state = actions[r.id];
                const isOpen = openId === r.id && !!packages[r.id];
                return (
                  <Fragment key={r.id}>
                  <tr className="border-b border-border/50 align-top">
                    <td className="py-2 pr-2 max-w-[24rem]">
                      <div className="font-medium leading-snug truncate">{r.title}</div>
                    </td>
                    <td className="py-2 pr-2 text-[11px] text-muted-foreground">{r.source}</td>
                    <td className="py-2 pr-2 text-[11px] text-muted-foreground whitespace-nowrap">
                      {new Date(r.pub_date).toLocaleString("en-US", { timeZone: "America/Chicago" })}
                    </td>
                    <td className="py-2 pr-2 text-right tabular-nums">{r.texasScore}</td>
                    <td className="py-2 pr-2 text-right tabular-nums">{r.breakingScore}</td>
                    <td className="py-2 pr-2 text-right tabular-nums">{r.socialScore}</td>
                    <td className={`py-2 pr-2 text-[11px] font-bold uppercase tracking-widest ${rec.tone}`}>
                      {rec.label}
                    </td>
                    <td className="py-2 pr-2 whitespace-nowrap">
                      {state === "package" ? (
                        <button
                          type="button"
                          onClick={() => setOpenId(isOpen ? null : r.id)}
                          className="text-[11px] underline text-emerald-600"
                        >
                          {isOpen ? "Hide Draft" : "View Draft"}
                        </button>
                      ) : state === "ignored" ? (
                        <div className="flex flex-col gap-1">
                          <span className="text-[11px] text-muted-foreground">Done</span>
                          {publishMsg[r.id]?.text ? (
                            <span className={`text-[10px] ${publishMsg[r.id].ok ? "text-emerald-600" : "text-red-600"}`}>
                              {publishMsg[r.id].text}
                            </span>
                          ) : null}
                        </div>
                      ) : (
                        <div className="flex flex-col items-start gap-1">
                          <button
                            type="button"
                            disabled={!!publishing[r.id]}
                            onClick={() => void quickPost(r)}
                            className="px-3 py-1 bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-widest disabled:opacity-60"
                          >
                            {publishing[r.id] ? "Posting…" : "Post to Facebook"}
                          </button>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setActions((s) => ({ ...s, [r.id]: "package" }));
                                setPackages((p) => ({ ...p, [r.id]: buildPackage(r) }));
                                setOpenId(r.id);
                                void runAI(r);
                              }}
                              className="text-[11px] underline text-primary"
                            >
                              Generate Package
                            </button>
                            <button
                              type="button"
                              onClick={() => setActions((s) => ({ ...s, [r.id]: "ignored" }))}
                              className="text-[11px] underline text-muted-foreground"
                            >
                              Ignore
                            </button>
                          </div>
                          {publishMsg[r.id]?.text ? (
                            <span className={`text-[10px] ${publishMsg[r.id].ok ? "text-emerald-600" : "text-red-600"}`}>
                              {publishMsg[r.id].text}
                            </span>
                          ) : null}
                        </div>
                      )}
                    </td>
                  </tr>
                  {isOpen && packages[r.id] ? (
                    <tr>
                      <td colSpan={8} className="pb-4">
                        <ContentPackagePreview
                          item={r}
                          pkg={packages[r.id]}
                          onClose={() => setOpenId(null)}
                          ai={ai[r.id]}
                          aiLoading={!!aiLoading[r.id]}
                          aiError={aiError[r.id]}
                          onRegenerate={() => runAI(r)}
                        />
                      </td>
                    </tr>
                  ) : null}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}