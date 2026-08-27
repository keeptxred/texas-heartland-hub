import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { ExploreEntityCard as Entity } from "@/types/explore/public";

function destinationHref(entity: Entity) {
  switch (entity.entityType) {
    case "state_park":
      return `https://texasdefined.com/explore/state-park/${entity.slug}`;
    case "lake":
      return `https://texasdefined.com/explore/lake/${entity.slug}`;
    case "river":
      return `https://texasdefined.com/explore/river/${entity.slug}`;
    case "cavern":
      return `https://texasdefined.com/explore/cavern/${entity.slug}`;
    default:
      return `/explore/${entity.slug}`;
  }
}

export function ExploreEntityCard({ entity }: { entity: Entity }) {
  const href = destinationHref(entity);

  return (
    <Card className="group h-full overflow-hidden transition-shadow hover:shadow-md">
      {entity.heroImageUrl && (
        <a href={href} tabIndex={-1} aria-hidden="true">
          <img
            src={entity.heroImageUrl}
            alt={entity.heroImageAlt || entity.name}
            width={640}
            height={400}
            loading="lazy"
            className="aspect-[8/5] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </a>
      )}
      <CardContent className="flex h-full flex-col p-5">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{entity.entityType.replaceAll("_", " ")}</Badge>
          {entity.distanceKm != null && (
            <Badge variant="outline">{Math.round(entity.distanceKm)} km away</Badge>
          )}
        </div>
        <h3 className="mt-3 font-display text-2xl leading-tight">
          <a href={href} className="hover:text-primary focus-visible:outline-2">
            {entity.name}
          </a>
        </h3>
        {(entity.city || entity.county || entity.region) && (
          <p className="mt-1 text-sm text-muted-foreground">
            {[entity.city, entity.county && `${entity.county} County`, entity.region]
              .filter(Boolean)
              .join(" · ")}
          </p>
        )}
        {entity.summary && (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
            {entity.summary}
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-1">
          {entity.activities.slice(0, 3).map((activity) => (
            <Badge key={activity} variant="outline">
              {activity}
            </Badge>
          ))}
        </div>
        <a
          href={href}
          className="mt-5 inline-flex items-center gap-2 self-start font-semibold text-primary hover:underline"
          aria-label={`View visitor guide for ${entity.name}`}
        >
          View destination guide <ArrowRight className="size-4" aria-hidden="true" />
        </a>
      </CardContent>
    </Card>
  );
}
