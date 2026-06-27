import { createFileRoute } from "@tanstack/react-router";
import capitol from "@/assets/capitol.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Keep TX Red" },
      { name: "description", content: "Keep TX Red is an independent conservative news and taxpayer-tools site covering Texas politics, elections, and property tax policy." },
      { property: "og:title", content: "About Keep TX Red" },
      { property: "og:description", content: "Independent conservative coverage of Texas politics and policy." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">★ About</span>
      <h1 className="font-display text-5xl md:text-6xl tracking-tight mt-2 leading-none">
        DEFENDING THE <br />
        <span className="text-primary">LONE STAR STATE</span>
      </h1>

      <div className="aspect-video overflow-hidden my-10 bg-muted">
        <img src={capitol} alt="Texas State Capitol at dusk" loading="lazy" className="size-full object-cover" />
      </div>

      <div className="space-y-5 text-base leading-relaxed">
        <p className="text-lg">
          <strong>Keep TX Red</strong> is an independent Texas-focused news and analysis platform covering politics, policy, economy, and statewide issues. Our mission is to provide clear and accessible reporting on the developments shaping Texas.
        </p>
        <p className="text-muted-foreground">
          We exist to do three things: report the policy fights that matter, track every election that shapes the next decade of Texas, and arm taxpayers with the data they need to push back against runaway local government.
        </p>
        <h2 className="font-display text-3xl tracking-tight pt-4">What we cover</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
          <li>The Texas Legislature, special sessions, and the conservative caucus</li>
          <li>Border security and Operation Lone Star</li>
          <li>Property tax policy, appraisal caps, and ISD spending</li>
          <li>Parental rights and school board elections</li>
          <li>Energy, regulation, and the Texas economy</li>
        </ul>
        <h2 className="font-display text-3xl tracking-tight pt-4">Editorial independence</h2>
        <p className="text-muted-foreground">
          Keep TX Red is reader-supported and not authorized by any candidate or candidate's committee. Our property tax estimates draw from county appraisal district filings and Texas Comptroller data.
        </p>
      </div>
    </div>
  );
}