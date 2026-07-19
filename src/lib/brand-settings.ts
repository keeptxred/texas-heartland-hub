import { useEffect, useState } from "react";

export type BrandSettings = {
  logoUrl: string;
  brandName: string;
  websiteUrl: string;
  footerText: string;
  socialCta: string;
};

export const DEFAULT_BRAND_SETTINGS: BrandSettings = {
  logoUrl: "",
  brandName: "KEEP TX RED",
  websiteUrl: "keeptxred.com",
  footerText: "© Keep Texas Red — Texas news, politics, and policy.",
  socialCta: "Follow @KeepTXRed for more Texas coverage.",
};

const STORAGE_KEY = "ktr-brand-settings";

export function loadBrandSettings(): BrandSettings {
  if (typeof window === "undefined") return DEFAULT_BRAND_SETTINGS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_BRAND_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<BrandSettings>;
    return { ...DEFAULT_BRAND_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_BRAND_SETTINGS;
  }
}

export function saveBrandSettings(next: BrandSettings): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("ktr-brand-settings-changed"));
}

export function useBrandSettings(): BrandSettings {
  const [settings, setSettings] = useState<BrandSettings>(DEFAULT_BRAND_SETTINGS);
  useEffect(() => {
    setSettings(loadBrandSettings());
    const onChange = () => setSettings(loadBrandSettings());
    window.addEventListener("ktr-brand-settings-changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("ktr-brand-settings-changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);
  return settings;
}