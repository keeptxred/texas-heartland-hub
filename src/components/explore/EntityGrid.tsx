import { ExploreEntityCard } from "./EntityCard";
import type { ExploreEntityCard as Entity } from "@/types/explore/public";

export function EntityGrid({
  items,
  empty = "No published destinations match these filters.",
}: {
  items: Entity[];
  empty?: string;
}) {
  if (!items.length) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
        {empty}
      </div>
    );
  }
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <ExploreEntityCard key={item.id} entity={item} />
      ))}
    </div>
  );
}
