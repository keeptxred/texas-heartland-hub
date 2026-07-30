import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Download, ExternalLink } from "lucide-react";
import { formatDatasetValue, getTexasDataset } from "@/data/texas-data-center";

export const Route = createFileRoute("/texas-data/$datasetSlug")({
  loader: ({ params }) => {
    const dataset = getTexasDataset(params.datasetSlug);
    if (!dataset) throw notFound();
    return dataset;
  },
  head: ({ loaderData }) => {
    const dataset = loaderData;
    const canonical = `https://keeptxred.com/texas-data/${dataset.slug}`;
    return {
      meta: [
        { title: `${dataset.title} | Texas Data Center` },
        { name: "description", content: dataset.description },
        { property: "og:title", content: dataset.title },
        { property: "og:description", content: dataset.description },
        { property: "og:url", content: canonical },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: canonical }],
      scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@graph": [{ "@type": "Dataset", name: dataset.title, description: dataset.description, url: canonical, dateModified: dataset.updated, temporalCoverage: String(dataset.year), spatialCoverage: { "@type": "Place", name: "Texas" }, creator: { "@type": "Organization", name: "Keep TX Red", url: "https://keeptxred.com" }, publisher: { "@type": "Organization", name: "Keep TX Red", url: "https://keeptxred.com" }, isAccessibleForFree: true, variableMeasured: dataset.category, measurementTechnique: dataset.methodology, citation: dataset.sourceUrl }, { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://keeptxred.com" }, { "@type": "ListItem", position: 2, name: "Texas Data Center", item: "https://keeptxred.com/texas-data" }, { "@type": "ListItem", position: 3, name: dataset.title, item: canonical }] }] }).replace(/</g, "\\u003c") }],
    };
  },
  component: DatasetPage,
});

function csvCell(value: string | number) {
  let text = String(value);
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

function DatasetPage() {
  const dataset = Route.useLoaderData();
  const sorted = [...dataset.rows].sort((a, b) => b.value - a.value);
  const maximum = Math.max(...sorted.map((row) => row.value), 1);
  const downloadCsv = () => {
    const lines = [["Rank", "Name", "Value", "Previous value", "Data year", "Source"], ...sorted.map((row, index) => [index + 1, row.label, row.value, row.previous ?? "", dataset.year, dataset.sourceName])];
    const blob = new Blob([lines.map((line) => line.map(csvCell).join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `keeptxred-texas-${dataset.slug}-${dataset.year}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return <div className="mx-auto max-w-6xl px-4 py-10">
    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground"><Link to="/">Home</Link><span className="mx-2">/</span><Link to="/texas-data">Texas Data Center</Link><span className="mx-2">/</span><span>{dataset.title}</span></nav>
    <header className="mt-8 border-b pb-8"><span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{dataset.category}</span><h1 className="mt-4 max-w-4xl font-display text-5xl tracking-tight">{dataset.title}</h1><p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">{dataset.description}</p><div className="mt-6 flex flex-wrap items-center gap-3 text-sm"><span className="rounded-md border px-3 py-2">Data year: {dataset.year}</span><span className="rounded-md border px-3 py-2">Updated: {dataset.updated}</span><button type="button" onClick={downloadCsv} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground"><Download className="size-4" />Download CSV</button></div></header>
    <section className="mt-10"><h2 className="font-display text-3xl">Ranking</h2><p className="mt-2 text-sm text-muted-foreground">Values are ranked highest to lowest. Missing records are excluded rather than counted as zero.</p><div className="mt-5 overflow-x-auto rounded-xl border"><table className="w-full text-sm"><thead className="bg-muted/50 text-left"><tr><th scope="col" className="p-4">Rank</th><th scope="col" className="p-4">Name</th><th scope="col" className="p-4 text-right">Value</th><th scope="col" className="p-4">Context</th></tr></thead><tbody>{sorted.map((row, index) => <tr key={row.label} className="border-t"><td className="p-4 font-semibold">{index + 1}</td><td className="p-4">{row.slug ? <a href={`/county-elections?county=${encodeURIComponent(row.slug)}`} className="font-semibold text-primary hover:underline">{row.label}</a> : <span className="font-semibold">{row.label}</span>}</td><td className="p-4 text-right tabular-nums">{formatDatasetValue(row.value, dataset.unit)}</td><td className="p-4 text-muted-foreground">{row.note ?? (row.previous !== undefined ? `Previous: ${formatDatasetValue(row.previous, dataset.unit)}` : "—")}</td></tr>)}</tbody></table></div></section>
    <section className="mt-12"><h2 className="font-display text-3xl">Visual comparison</h2><div className="mt-5 space-y-4 rounded-xl border p-6">{sorted.slice(0, 10).map((row) => <div key={row.label}><div className="mb-1 flex justify-between gap-4 text-sm"><span className="font-medium">{row.label}</span><span className="tabular-nums">{formatDatasetValue(row.value, dataset.unit)}</span></div><div className="h-3 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(3, (row.value / maximum) * 100)}%` }} /></div></div>)}</div></section>
    {dataset.trend && <section className="mt-12"><h2 className="font-display text-3xl">Historical trend</h2><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{dataset.trend.map((point, index) => { const prior = dataset.trend?.[index - 1]; return <div key={point.year} className="rounded-xl border p-5"><div className="text-sm text-muted-foreground">{point.year}</div><div className="mt-2 font-display text-3xl">{formatDatasetValue(point.value, dataset.unit)}</div>{prior && <div className="mt-2 text-xs text-muted-foreground">Change: {formatDatasetValue(point.value - prior.value, dataset.unit)}</div>}</div>; })}</div></section>}
    <section className="mt-12 grid gap-6 lg:grid-cols-2"><div className="rounded-xl border p-6"><h2 className="font-display text-3xl">Methodology</h2><p className="mt-4 leading-7 text-muted-foreground">{dataset.methodology}</p><a href={dataset.sourceUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 font-semibold text-primary hover:underline">{dataset.sourceName}<ExternalLink className="size-4" /></a></div><div className="rounded-xl border p-6"><h2 className="font-display text-3xl">Related Texas pages</h2><h3 className="mt-5 font-semibold">Representatives</h3><div className="mt-2 flex flex-col gap-2">{dataset.relatedRepresentatives.map((item) => <a key={item.href} href={item.href} className="text-primary hover:underline">{item.label}</a>)}</div><h3 className="mt-5 font-semibold">Legislation and laws</h3><div className="mt-2 flex flex-col gap-2">{dataset.relatedLegislation.map((item) => <a key={item.href} href={item.href} className="text-primary hover:underline">{item.label}</a>)}</div></div></section>
  </div>;
}
