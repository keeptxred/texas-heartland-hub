import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { ExploreEntityCard as Entity } from "@/types/explore/public";

export function ExploreEntityCard({ entity }: { entity: Entity }) {
  return (
    <Card className="group h-full overflow-hidden transition-shadow hover:shadow-md">
      {entity.heroImageUrl && (
        <Link to="/explore/$slug" params={{ slug: entity.slug }} tabIndex={-1} aria-hidden="true">
          <img
            src={entity.heroImageUrl}
            alt={entity.heroImageAlt || entity.name}
            width={640}
            height={400}
            loading="lazy"
            className="aspect-[8/5] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </Link>
      )}
      <CardContent className="flex h-full flex-col p-5">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{entity.entityType.replaceAll("_", " ")}</Badge>
          {entity.distanceKm != null && (
            <Badge variant="outline">{Math.round(entity.distanceKm)} km away</Badge>
          )}
        </div>
        <h3 className="mt-3 font-display text-2xl leading-tight">
          <Link
            to="/explore/$slug"
            params={{ slug: entity.slug }}
            className="hover:text-primary focus-visible:outline-2"
          >
            {entity.name}
          </Link>
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
        <Link
          to="/explore/$slug"
          params={{ slug: entity.slug }}
          className="mt-5 inline-flex items-center gap-2 self-start font-semibold text-primary hover:underline"
          aria-label={`View visitor guide for ${entity.name}`}
        >
          View destination guide <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </CardContent>
    </Card>
  );
}
