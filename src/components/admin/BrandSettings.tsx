import { useEffect, useState } from "react";
import {
  DEFAULT_BRAND_SETTINGS,
  loadBrandSettings,
  saveBrandSettings,
  type BrandSettings as BrandSettingsType,
} from "@/lib/brand-settings";

export function BrandSettings() {
  const [values, setValues] = useState<BrandSettingsType>(DEFAULT_BRAND_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setValues(loadBrandSettings());
  }, []);

  function update<K extends keyof BrandSettingsType>(key: K, val: BrandSettingsType[K]) {
    setValues((v) => ({ ...v, [key]: val }));
    setSaved(false);
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    saveBrandSettings(values);
    setSaved(true);
  }

  function reset() {
    setValues(DEFAULT_BRAND_SETTINGS);
    saveBrandSettings(DEFAULT_BRAND_SETTINGS);
    setSaved(true);
  }

  return (
    <div className="border-2 border-foreground/10 bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-xl">Brand Settings</h2>
        <button type="button" onClick={reset} className="text-[11px] underline text-muted-foreground">
          Reset to defaults
        </button>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Used by the Media Package Builder and any other admin tools that render branding.
      </p>
      <form onSubmit={save} className="grid gap-3 sm:grid-cols-2">
        <Field label="Brand Name">
          <input
            type="text"
            value={values.brandName}
            onChange={(e) => update("brandName", e.target.value)}
            className="w-full border border-border bg-white px-2 py-1.5 text-sm"
          />
        </Field>
        <Field label="Website URL">
          <input
            type="text"
            value={values.websiteUrl}
            onChange={(e) => update("websiteUrl", e.target.value)}
            className="w-full border border-border bg-white px-2 py-1.5 text-sm"
          />
        </Field>
        <Field label="Logo URL (placeholder)" full>
          <input
            type="text"
            value={values.logoUrl}
            onChange={(e) => update("logoUrl", e.target.value)}
            placeholder="https://… (upload coming soon)"
            className="w-full border border-border bg-white px-2 py-1.5 text-sm"
          />
          {values.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={values.logoUrl}
              alt="Brand logo preview"
              className="mt-2 h-10 object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="mt-2 h-10 w-32 border border-dashed border-border flex items-center justify-center text-[10px] uppercase tracking-widest text-muted-foreground">
              Logo
            </div>
          )}
        </Field>
        <Field label="Footer Text" full>
          <textarea
            value={values.footerText}
            onChange={(e) => update("footerText", e.target.value)}
            rows={2}
            className="w-full border border-border bg-white px-2 py-1.5 text-sm"
          />
        </Field>
        <Field label="Default Social CTA" full>
          <textarea
            value={values.socialCta}
            onChange={(e) => update("socialCta", e.target.value)}
            rows={2}
            className="w-full border border-border bg-white px-2 py-1.5 text-sm"
          />
        </Field>
        <div className="sm:col-span-2 flex items-center gap-3">
          <button
            type="submit"
            className="text-[11px] uppercase tracking-widest px-3 py-2 bg-primary text-primary-foreground border-2 border-primary"
          >
            Save Settings
          </button>
          {saved ? <span className="text-[11px] text-emerald-600">Saved</span> : null}
        </div>
      </form>
    </div>
  );
}

function Field({ label, full = false, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
        {label}
      </div>
      {children}
    </label>
  );
}