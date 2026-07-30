import type { ExploreEntityCard } from "@/types/explore/public";

export function ExploreMap({ entity }: { entity: ExploreEntityCard }) {
  if (entity.latitude == null || entity.longitude == null) return null;
  const delta = 0.08;
  const bbox = [
    entity.longitude - delta,
    entity.latitude - delta,
    entity.longitude + delta,
    entity.latitude + delta,
  ].join(",");
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${encodeURIComponent(`${entity.latitude},${entity.longitude}`)}`;
  return (
    <div className="overflow-hidden rounded-lg border">
      <iframe
        title={`Map showing ${entity.name}`}
        src={src}
        loading="lazy"
        className="h-80 w-full"
        referrerPolicy="no-referrer"
      />
      <a
        href={`https://www.openstreetmap.org/?mlat=${entity.latitude}&mlon=${entity.longitude}#map=12/${entity.latitude}/${entity.longitude}`}
        target="_blank"
        rel="noreferrer"
        className="block p-3 text-sm font-medium text-primary hover:underline"
      >
        Open map and directions
      </a>
    </div>
  );
}
