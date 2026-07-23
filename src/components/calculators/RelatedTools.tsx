import React from "react";

import { calculators, CalculatorDirectoryItem } from "@/data/calculators";

interface ExplicitTool {
  title: string;
  url: string;
  description?: string;
}

interface RelatedToolsProps {
  currentSlug?: string;
  category?: CalculatorDirectoryItem["category"];
  limit?: number;
  tools?: ExplicitTool[];
}

export default function RelatedTools({
  currentSlug = "",
  category,
  limit = 4,
  tools,
}: RelatedToolsProps) {
  const relatedTools = tools?.map((tool, index) => ({
    id: `${tool.url}-${index}`,
    title: tool.title,
    description: tool.description ?? "Explore another Texas financial calculator.",
    slug: tool.url,
  })) ?? calculators
    .filter((tool) => tool.slug !== currentSlug)
    .filter((tool) => category ? tool.category === category : true)
    .slice(0, limit);

  if (!relatedTools.length) return null;

  return (
    <section className="mt-10 rounded-xl bg-gray-50 p-6">
      <h2 className="text-2xl font-bold text-gray-900">Related Texas Financial Tools</h2>
      <p className="mt-2 text-gray-600">
        Explore more calculators to better understand the costs of buying a home and relocating to Texas.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {relatedTools.map((tool) => (
          <a
            key={tool.id}
            href={tool.slug}
            className="rounded-lg border bg-white p-4 transition hover:shadow-md"
          >
            <h3 className="font-semibold text-gray-900">{tool.title}</h3>
            <p className="mt-1 text-sm text-gray-600">{tool.description}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
