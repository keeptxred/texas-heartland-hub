import { createFileRoute } from "@tanstack/react-router";
import { HubBreadcrumbs } from "@/components/hub-breadcrumbs";
import { buildSeo, SITE_URL } from "@/lib/seo";

const endorsements = [
  ["H", "Hazardous materials", "Required for placarded hazardous-material transportation. Federal security screening and additional testing apply."],
  ["N", "Tank vehicle", "Required to operate a qualifying tank vehicle."],
  ["P", "Passenger", "Required to operate a commercial vehicle designed to transport passengers."],
  ["S", "School bus", "Required for school-bus operation and normally paired with passenger authority."],
  ["T", "Double or triple trailers", "Required to tow two or three trailers when the operation falls within the endorsement rules."],
  ["X", "Tank and hazardous materials", "Combined authority for tank vehicles carrying placarded hazardous materials."],
] as const;

const faq = [
  { question: "Can I add a CDL endorsement without another road test?", answer: "It depends on the endorsement. Hazardous materials, tanker, and double or triple trailer endorsements are primarily knowledge-based, while passenger and school-bus endorsements normally require a commercial learner permit and skills testing in the appropriate vehicle." },
  { question: "Does a hazmat endorsement require a background check?", answer: "Yes. A hazardous-materials endorsement is subject to federal Transportation Security Administration security-threat assessment requirements in addition to state testing and eligibility rules." },
  { question: "Is the X endorsement the same as having H and N?", answer: "The X endorsement represents combined tank and hazardous-materials authority. The driver must satisfy the applicable testing and security requirements." },
  { question: "Can restrictions cancel out an endorsement?", answer: "A driver may hold an endorsement but still be limited by restrictions tied to the test vehicle, brakes, transmission, passenger operation, medical status, or other conditions." },
];

function CdlEndorsementsPage() {
  return (
    <main>
      <HubBreadcrumbs current="Texas CDL Endorsements" />
      <section className="border-b bg-muted/30"><div className="mx-auto max-w-5xl px-4 py-16 sm:py-20"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Commercial operating authority</p><h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl">Texas CDL Endorsements: H, N, P, S, T and X</h1><p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">A CDL class determines the size and configuration of vehicle you may operate. Endorsements add authority for passengers, school buses, tanks, hazardous materials, and multiple trailers.</p><div className="mt-8 flex flex-wrap gap-3"><a href="/dmv/cdl" className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Complete Texas CDL guide</a><a href="/dmv/cdl-classes" className="rounded-md border px-5 py-3 text-sm font-semibold">Compare CDL classes</a></div></div></section>
      <article className="mx-auto max-w-4xl space-y-10 px-4 py-14 leading-relaxed">
        <section><h2 className="text-3xl font-bold">Texas CDL endorsement chart</h2><div className="mt-6 grid gap-4 sm:grid-cols-2">{endorsements.map(([code, name, description]) => <div key={code} className="rounded-xl border bg-card p-5"><div className="flex items-center gap-3"><span className="rounded-md bg-primary px-3 py-1 text-lg font-bold text-primary-foreground">{code}</span><h3 className="text-xl font-bold">{name}</h3></div><p className="mt-4 text-muted-foreground">{description}</p></div>)}</div></section>
        <section><h2 className="text-3xl font-bold">Passenger and school-bus endorsements</h2><p className="mt-4">Adding P or S authority generally requires more than a written test. Applicants may need a commercial learner permit held for the required period, entry-level driver training from a registered provider, and skills testing in a representative passenger or school-bus vehicle. School-bus drivers may also face employer, education, criminal-history, medical, and local certification requirements beyond the CDL itself.</p></section>
        <section><h2 className="text-3xl font-bold">Hazardous materials endorsement</h2><p className="mt-4">The H endorsement permits placarded hazardous-material transportation. Applicants must pass the applicable knowledge test and complete the federal security-threat assessment. Entry-level driver training applies to first-time hazmat endorsement applicants. Renewal timing can be affected by the security-screening process, so begin early.</p></section>
        <section><h2 className="text-3xl font-bold">Tank and combination endorsements</h2><p className="mt-4">The N endorsement applies to qualifying tank vehicles. The X endorsement combines tank and hazardous-material authority. The T endorsement covers double or triple trailer operation. These endorsements do not override the underlying CDL class or vehicle restrictions.</p></section>
        <section><h2 className="text-3xl font-bold">Endorsements versus restrictions</h2><p className="mt-4">Endorsements expand authority; restrictions narrow it. Testing in a vehicle without full air brakes, a manual transmission, or a tractor-trailer connection can create restrictions. Passenger and school-bus applicants can also receive restrictions based on the test vehicle or permit conditions.</p></section>
        <section className="rounded-xl border bg-muted/20 p-6"><h2 className="text-2xl font-bold">Endorsement planning checklist</h2><ul className="mt-4 list-disc space-y-2 pl-6"><li>Confirm the CDL class first.</li><li>Identify cargo, passenger, tank, and trailer needs.</li><li>Check whether a CLP and 14-day holding period apply.</li><li>Complete ELDT when required.</li><li>Use a representative vehicle for skills testing.</li><li>Start hazmat security screening early.</li><li>Review the final license for unexpected restrictions.</li></ul></section>
        <section><h2 className="text-3xl font-bold">Frequently asked questions</h2><div className="mt-6 space-y-4">{faq.map((item) => <details key={item.question} className="rounded-xl border bg-card p-5"><summary className="cursor-pointer font-semibold">{item.question}</summary><p className="mt-3 text-muted-foreground">{item.answer}</p></details>)}</div></section>
        <p className="border-t pt-8 text-sm text-muted-foreground">Endorsement, testing, security-screening, and training rules can change. Confirm current requirements with Texas DPS, FMCSA, and TSA before applying.</p>
      </article>
    </main>
  );
}

export const Route = createFileRoute("/dmv/cdl-endorsements")({
  head: () => { const seo = buildSeo({ title: "Texas CDL Endorsements: H, N, P, S, T and X", description: "Understand Texas CDL endorsements for hazardous materials, tanks, passengers, school buses, and double or triple trailers.", path: "/dmv/cdl-endorsements", type: "article", keywords: "Texas CDL endorsements, hazmat endorsement Texas, passenger endorsement Texas, school bus endorsement Texas, tanker endorsement" }); return { meta: seo.meta, links: seo.links, scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: "Texas CDL Endorsements", url: `${SITE_URL}/dmv/cdl-endorsements` }) }, { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) }) }] }; },
  component: CdlEndorsementsPage,
});