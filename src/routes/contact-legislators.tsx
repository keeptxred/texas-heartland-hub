import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, SectionCard } from "@/components/page-hero";
import { US_SENATORS, STATE_LEADERSHIP } from "@/data/representatives";

export const Route = createFileRoute("/contact-legislators")({
  head: () => ({
    meta: [
      { title: "Contact Your Legislators — Keep TX Red" },
      { name: "description", content: "Phone scripts, email templates, and direct numbers to reach your Texas legislators on the bills that matter." },
      { property: "og:title", content: "Contact Your Legislators" },
    ],
    links: [{ rel: "canonical", href: "/contact-legislators" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Make the Call" title="CONTACT YOUR" highlight="LEGISLATORS" description="One well-placed phone call from a constituent counts more than a thousand petitions. Here's how to make yours count." />
      <div className="mx-auto max-w-5xl px-4 py-14 space-y-6">
        <SectionCard title="The 60-Second Script">
          <p className="italic border-l-4 border-primary pl-4">
            "Hi, my name is [Name] and I'm a constituent from [City, ZIP]. I'm calling to urge [Senator/Representative Last Name] to <strong>support / oppose</strong> [Bill Number — short description]. This issue matters to my family because [one sentence]. Can I get the [Senator/Representative]'s position on this bill? Thank you."
          </p>
          <p className="text-xs text-muted-foreground">Stay polite. Get the staffer's name. Note the date in case you need to follow up.</p>
        </SectionCard>

        <SectionCard title="When to Call vs. Email">
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Call</strong> when a vote is in the next 5 business days — phones get tallied.</li>
            <li><strong>Email</strong> for record. Use the official contact form, not generic addresses.</li>
            <li><strong>Show up</strong> at the Capitol committee hearings for the biggest fights — testimony cards count.</li>
          </ul>
        </SectionCard>

        <div className="border-2 border-foreground/10 bg-card p-6 md:p-7">
          <h2 className="font-display text-3xl tracking-tight mb-4">Direct Lines</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            {[...US_SENATORS, ...STATE_LEADERSHIP].map((r) => (
              <div key={r.name} className="flex justify-between gap-4 border-b border-foreground/10 pb-2">
                <div>
                  <p className="font-semibold">{r.name}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">{r.office}</p>
                </div>
                <p className="font-mono text-sm whitespace-nowrap">{r.phoneDC || r.phoneTX}</p>
              </div>
            ))}
          </div>
          <Link to="/representatives" className="inline-block mt-5 text-xs font-bold uppercase tracking-widest text-primary hover:underline">Full Directory →</Link>
        </div>
      </div>
    </>
  );
}