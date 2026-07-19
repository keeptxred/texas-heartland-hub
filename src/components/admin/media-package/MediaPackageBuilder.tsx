import { useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import type { SavedPackage } from "@/services/contentPackages";
import { useBrandSettings } from "@/lib/brand-settings";
import { TemplateSelector } from "./TemplateSelector";
import { SocialImagePreview } from "./SocialImagePreview";
import { ReelBlueprintPreview } from "./ReelBlueprintPreview";
import { buildMediaPackage, type MediaTemplateId } from "./types";

export function MediaPackageBuilder({ row }: { row: SavedPackage }) {
  const [generated, setGenerated] = useState(false);
  const [templateId, setTemplateId] = useState<MediaTemplateId>(guessTemplate(row));
  const brand = useBrandSettings();
  const pkg = useMemo(() => buildMediaPackage(row, brand), [row, brand]);
  const imageRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    if (!imageRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(imageRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });
      const date = new Date().toISOString().slice(0, 10);
      const link = document.createElement("a");
      link.download = `keeptxred-social-${date}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export social image", err);
    } finally {
      setDownloading(false);
    }
  }

  if (!generated) {
    return (
      <div className="border border-dashed border-border p-4 flex items-center justify-between">
        <div>
          <div className="font-display text-sm uppercase tracking-widest">Media Package</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            Turn this saved package into a social image + reel blueprint.
          </div>
        </div>
        <button
          type="button"
          onClick={() => setGenerated(true)}
          className="text-[11px] uppercase tracking-widest px-3 py-2 bg-primary text-primary-foreground border-2 border-primary"
        >
          Generate Media Package
        </button>
      </div>
    );
  }

  return (
    <div className="border border-border bg-muted/30 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm uppercase tracking-widest">Media Package</h3>
        <button
          type="button"
          onClick={() => setGenerated(false)}
          className="text-[11px] underline text-muted-foreground"
        >
          Close
        </button>
      </div>
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
          Template
        </div>
        <TemplateSelector value={templateId} onChange={setTemplateId} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
            Social Image Preview
          </div>
          <div ref={imageRef}>
            <SocialImagePreview pkg={pkg} templateId={templateId} />
          </div>
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="mt-2 text-[11px] uppercase tracking-widest px-3 py-2 bg-primary text-primary-foreground border-2 border-primary disabled:opacity-60"
          >
            {downloading ? "Preparing…" : "Download Image"}
          </button>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
            Reel Blueprint
          </div>
          <ReelBlueprintPreview pkg={pkg} />
        </div>
      </div>
    </div>
  );
}

function guessTemplate(row: SavedPackage): MediaTemplateId {
  const c = (row.category || "").toLowerCase();
  const t = (row.source_title || "").toLowerCase();
  if (/tax|property/.test(c + " " + t)) return "tax";
  if (/elect|ballot|vote/.test(c + " " + t)) return "election";
  if (/econ|business|jobs|energy/.test(c + " " + t)) return "economy";
  if (/politic|legis|governor|senate|house/.test(c + " " + t)) return "politics";
  return "breaking";
}