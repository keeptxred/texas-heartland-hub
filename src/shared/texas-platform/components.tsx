import { Link } from '@tanstack/react-router';
import {
  Building2,
  Calculator,
  Compass,
  Home,
  Landmark,
  MapPinned,
  Scale,
  Search,
  Truck,
  WalletCards,
  type LucideIcon,
} from 'lucide-react';
import type { SharedJourney, SharedResource, SharedTopic } from './registry';

const ICONS: Record<SharedResource['icon'], LucideIcon> = {
  home: Home,
  landmark: Landmark,
  truck: Truck,
  calculator: Calculator,
  scale: Scale,
  wallet: WalletCards,
  map: MapPinned,
  compass: Compass,
  building: Building2,
  search: Search,
};

export function SharedResourceCard({ resource, cta = 'Open resource' }: { resource: SharedResource; cta?: string }) {
  const Icon = ICONS[resource.icon];
  return (
    <Link to={resource.route} className="group rounded-xl border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md">
      <Icon className="size-6 text-primary" />
      <h2 className="mt-4 text-lg font-bold">{resource.title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{resource.description}</p>
      <span className="mt-4 block text-sm font-semibold text-primary group-hover:underline">{cta} →</span>
    </Link>
  );
}

export function SharedJourneyCard({ journey }: { journey: SharedJourney }) {
  const Icon = ICONS[journey.icon];
  return (
    <a href={`https://texasdefined.com/texas-resources#journey-${journey.id}`} className="group rounded-xl border bg-card p-6 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md">
      <Icon className="size-7 text-primary" />
      <h2 className="mt-4 text-xl font-bold">{journey.title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{journey.description}</p>
      <span className="mt-5 block text-sm font-bold text-primary group-hover:underline">Start this journey →</span>
    </a>
  );
}

export function SharedTopicCard({ topic, resources }: { topic: SharedTopic; resources: SharedResource[] }) {
  const Icon = ICONS[topic.icon];
  return (
    <section className="flex min-h-full flex-col rounded-xl border bg-card p-6 transition hover:border-primary">
      <Icon className="size-7 text-primary" />
      <h2 className="mt-4 font-display text-2xl">{topic.title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{topic.description}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {resources.map((resource) => (
          <Link key={`${topic.id}-${resource.id}`} to={resource.route} className="rounded-full border px-3 py-1.5 text-sm font-semibold hover:border-primary hover:text-primary">
            {resource.title}
          </Link>
        ))}
      </div>
      <a href={`https://texasdefined.com/texas-resources#topic-${topic.id}`} className="mt-auto pt-6 text-sm font-bold text-primary hover:underline">{topic.cta} →</a>
    </section>
  );
}
