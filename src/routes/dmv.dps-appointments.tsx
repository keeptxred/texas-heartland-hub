import { createFileRoute } from "@tanstack/react-router";
import { HubBreadcrumbs } from "@/components/hub-breadcrumbs";
import { buildSeo, SITE_URL } from "@/lib/seo";

const faq = [
  {
    question: "Do I need an appointment at a Texas DPS driver license office?",
    answer:
      "Texas DPS says all in-office driver license and identification card services are handled by scheduled appointment. Limited same-day appointments may appear online at many locations, but availability is not guaranteed.",
  },
  {
    question: "How far in advance can I schedule a Texas DPS appointment?",
    answer:
      "Texas DPS allows driver license appointments to be scheduled up to six months, or 180 days, in advance through Texas Scheduler.",
  },
  {
    question: "Can I use a DPS office outside my county?",
    answer:
      "Yes. Texas DPS says customers may use any driver license office. Checking nearby offices can be useful when the closest location has no acceptable dates.",
  },
  {
    question: "What happens if I am late for my DPS appointment?",
    answer:
      "DPS says appointments are cancelled after 30 minutes. Customers should arrive no earlier than 30 minutes before the scheduled time.",
  },
];

function DpsAppointmentsPage() {
  return (
    <main>
      <HubBreadcrumbs current="Texas DPS Appointments" />

      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Texas driver license office guide</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl">How to Schedule a Texas DPS Appointment</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Use the official Texas Scheduler, compare nearby offices, look for limited same-day openings, prepare the right documents, and avoid common appointment mistakes.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="https://www.txdpsscheduler.com/" rel="noreferrer" className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Open Texas Scheduler</a>
            <a href="/dmv/driver-license-documents" className="rounded-md border px-5 py-3 text-sm font-semibold hover:bg-muted">Review required documents</a>
          </div>
        </div>
      </section>

      <article className="mx-auto max-w-4xl space-y-10 px-4 py-14 text-base leading-relaxed">
        <section>
          <h2 className="text-3xl font-bold">Start with the official Texas Scheduler</h2>
          <p className="mt-4">
            Texas DPS handles all in-office driver license and identification card services by scheduled appointment. Use the official <a className="text-primary underline underline-offset-4" href="https://www.txdpsscheduler.com/" rel="noreferrer">Texas Scheduler</a> rather than a third-party booking service. The scheduler asks what service you need, checks whether the transaction may be completed online, and displays available offices and times.
          </p>
          <p className="mt-4">
            First-time applicants, people transferring an out-of-state license, and customers who must present original documents generally need an office visit. Many routine renewals, replacements, and address changes may be available through Texas by Texas, or TxT, without an appointment.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold">How to book the appointment</h2>
          <ol className="mt-5 list-decimal space-y-3 pl-6">
            <li>Open Texas Scheduler and select the driver license or ID service you need.</li>
            <li>Enter the requested identifying information. New Texas residents and first-time customers can still use the scheduler.</li>
            <li>Search your preferred office, then check nearby offices if the date is too far away.</li>
            <li>Select an available time and provide a valid email address or mobile number for notices.</li>
            <li>Save the confirmation details and review the document requirements before the appointment.</li>
          </ol>
          <p className="mt-4">
            DPS allows appointments to be scheduled up to six months in advance. If the service you need is not shown, DPS instructs customers to choose “Service Not Listed.”
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold">What to do when no appointments are available</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border bg-card p-5"><h3 className="font-bold">Check other offices</h3><p className="mt-2 text-sm text-muted-foreground">You may use any Texas driver license office. Expanding the search beyond your county can reveal earlier openings.</p></div>
            <div className="rounded-xl border bg-card p-5"><h3 className="font-bold">Look for same-day openings</h3><p className="mt-2 text-sm text-muted-foreground">DPS says most offices release a limited number of additional appointments throughout the day. They fill quickly and must be scheduled online.</p></div>
            <div className="rounded-xl border bg-card p-5"><h3 className="font-bold">Check for cancellations</h3><p className="mt-2 text-sm text-muted-foreground">Appointments can reappear when another customer cancels or reschedules.</p></div>
            <div className="rounded-xl border bg-card p-5"><h3 className="font-bold">Test online eligibility</h3><p className="mt-2 text-sm text-muted-foreground">A renewal, replacement, or address change may not require an office visit at all.</p></div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold">Limited walk-in and same-day service</h2>
          <p className="mt-4">
            Do not plan on traditional walk-in service. DPS states that in-office services are appointment-based. A customer who arrives without an appointment may be directed to a self-service kiosk to schedule an available same-day appointment or a future appointment. A same-day slot is not guaranteed.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold">When to arrive and what to bring</h2>
          <p className="mt-4">
            DPS says to arrive no earlier than 30 minutes before the appointment. An appointment may be cancelled if you are more than 30 minutes late. Bring the confirmation, required identity and residency documents, any current license or ID, required application materials, corrective lenses when applicable, and an accepted payment method.
          </p>
          <p className="mt-4">
            Requirements depend on the service. Use the <a className="text-primary underline underline-offset-4" href="/dmv/driver-license-documents">Texas driver license document guide</a> and the official DPS REAL ID document checker before leaving home. Original or certified documents may be required; a phone photo or ordinary photocopy may not be accepted.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold">Changing, cancelling, or confirming an appointment</h2>
          <ul className="mt-5 list-disc space-y-2 pl-6">
            <li>Return to Texas Scheduler to confirm the appointment details.</li>
            <li>Rescheduling and confirming a new time automatically cancels the existing appointment.</li>
            <li>You may schedule again immediately after cancelling.</li>
            <li>Email or text notifications are optional, but DPS recommends providing a valid email address.</li>
          </ul>
        </section>

        <section className="rounded-xl border bg-muted/20 p-6">
          <h2 className="text-2xl font-bold">Appointment-day checklist</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-6">
            <li>Confirm the office address, date, time, and service type.</li>
            <li>Check whether the transaction can be completed online instead.</li>
            <li>Bring every required original or certified document.</li>
            <li>Arrive within the permitted 30-minute early window.</li>
            <li>Bring payment and any glasses, contacts, forms, certificates, or vehicle documents required for your service.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-3xl font-bold">Related Keep TX Red guides</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              ["Complete Texas Driver License Guide", "/dmv/driver-license"],
              ["Driver License Document Checklist", "/dmv/driver-license-documents"],
              ["Texas REAL ID Guide", "/dmv/real-id"],
              ["Texas Driver License Renewal", "/dmv/driver-license-renewal"],
              ["Replace a Lost or Stolen License", "/dmv/replace-lost-license"],
              ["Texas DMV vs. DPS", "/dmv/texas-dmv-vs-dps"],
            ].map(([title, href]) => <a key={href} href={href} className="rounded-xl border bg-card p-5 font-semibold hover:shadow-md">{title}<span className="mt-2 block text-sm text-primary">Open guide →</span></a>)}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold">Frequently asked questions</h2>
          <div className="mt-6 space-y-4">{faq.map((item) => <details key={item.question} className="rounded-xl border bg-card p-5"><summary className="cursor-pointer font-semibold">{item.question}</summary><p className="mt-3 text-muted-foreground">{item.answer}</p></details>)}</div>
        </section>

        <p className="border-t pt-8 text-sm text-muted-foreground">Appointment availability, office procedures, accepted payments, and document requirements can change. Confirm your appointment and transaction through Texas Scheduler and the Texas Department of Public Safety before traveling.</p>
      </article>
    </main>
  );
}

export const Route = createFileRoute("/dmv/dps-appointments")({
  head: () => {
    const seo = buildSeo({
      title: "Texas DPS Appointment Guide: Schedule, Same-Day Slots & Documents",
      description: "Schedule a Texas DPS driver license appointment, find same-day openings, compare offices, prepare documents, and avoid appointment-day mistakes.",
      path: "/dmv/dps-appointments",
      type: "article",
      keywords: "Texas DPS appointment, Texas driver license appointment, Texas Scheduler, DPS same day appointment, Texas driver license office",
    });
    return {
      meta: seo.meta,
      links: seo.links,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: "How to Schedule a Texas DPS Appointment", url: `${SITE_URL}/dmv/dps-appointments`, isPartOf: { "@type": "WebSite", name: "Keep TX Red", url: SITE_URL } }) },
        { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) }) },
        { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` }, { "@type": "ListItem", position: 2, name: "Texas DMV & Driver Services", item: `${SITE_URL}/dmv` }, { "@type": "ListItem", position: 3, name: "Texas DPS Appointments", item: `${SITE_URL}/dmv/dps-appointments` }] }) },
      ],
    };
  },
  component: DpsAppointmentsPage,
});
