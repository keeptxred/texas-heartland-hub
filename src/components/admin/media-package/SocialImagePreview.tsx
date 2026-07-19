import { MEDIA_TEMPLATES } from "./TemplateSelector";
import type { MediaPackage, MediaTemplateId } from "./types";

export function SocialImagePreview({
  pkg,
  templateId,
}: {
  pkg: MediaPackage;
  templateId: MediaTemplateId;
}) {
  const tpl = MEDIA_TEMPLATES.find((t) => t.id === templateId) ?? MEDIA_TEMPLATES[0];
  return (
    <div
      className="relative w-full aspect-square max-w-[420px] text-white overflow-hidden"
      style={{ backgroundColor: tpl.bg }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-2"
        style={{ backgroundColor: tpl.accent }}
      />
      <div className="p-6 flex flex-col h-full justify-between">
        <div>
          <div
            className="inline-block text-[10px] font-bold uppercase tracking-[0.25em] px-2 py-1 mb-4"
            style={{ backgroundColor: tpl.accent }}
          >
            {tpl.tag}
          </div>
          <h3 className="font-display text-2xl leading-tight mb-3 line-clamp-4">
            {pkg.headline}
          </h3>
          <p className="text-sm text-white/80 leading-snug line-clamp-4">
            {pkg.subheadline}
          </p>
        </div>
        <div className="flex items-end justify-between text-[10px] uppercase tracking-widest">
          <div className="text-white/60">{pkg.source}</div>
          <div className="text-right">
            <div className="font-display text-sm" style={{ color: tpl.accent }}>
              {pkg.brand}
            </div>
            <div className="text-white/60">{pkg.url}</div>
          </div>
        </div>
      </div>
    </div>
  );
}