import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Keep TX Red" },
      { name: "description", content: "How keeptxred.com collects, uses, and protects your information." },
      { property: "og:title", content: "Privacy Policy — Keep TX Red" },
      { property: "og:description", content: "How keeptxred.com collects, uses, and protects your information." },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const updated = "January 2026";
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <div className="border-b-2 border-foreground pb-4 mb-10">
        <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">★ Legal</span>
        <h1 className="font-display text-5xl md:text-6xl tracking-tight mt-1">Privacy Policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: {updated}</p>
      </div>

      <div className="prose-like space-y-8 font-serif text-base leading-relaxed text-foreground/90">
        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">Who We Are</h2>
          <p>
            Keep TX Red ("we," "us," or "our") operates keeptxred.com — an independent conservative news and civic-tools site for Texans. This page is maintained by the site owner to explain, in plain language, what information we collect and how we use it.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">Information We Collect</h2>
          <p>We try to collect as little as possible. The categories are:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li><strong>Usage data:</strong> pages visited, referring site, device type, and approximate location derived from IP address.</li>
            <li><strong>Voluntary submissions:</strong> anything you type into the contact form, newsletter signup, or property-tax calculator (the calculator runs in your browser — values are not stored on our servers).</li>
            <li><strong>Cookies:</strong> small files used to remember preferences and measure traffic. You can disable them in your browser.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">How We Use It</h2>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Operate, secure, and improve the site.</li>
            <li>Respond to messages you send us.</li>
            <li>Measure which articles and tools are useful.</li>
          </ul>
          <p className="mt-2">We do not sell your personal information.</p>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">Third-Party Services</h2>
          <p>
            We rely on standard hosting, analytics, and content-delivery providers to run the site. These providers process technical data on our behalf under their own privacy terms. News links on the site point to third-party publishers whose privacy policies govern your visit once you leave keeptxred.com.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">Advertising & Google AdSense</h2>
          <p>
            Keep TX Red uses Google AdSense to display advertisements. Google and its partners may use cookies and device identifiers to serve ads based on your prior visits to this and other websites. You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Ads Settings</a> or <a href="https://www.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-primary underline">aboutads.info</a>. Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to our website.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">Cookies</h2>
          <p>
            We and our advertising partners (including Google) use cookies and similar technologies to measure traffic, remember preferences, and serve advertising. You can control or disable cookies through your browser settings; some site features may stop working if cookies are disabled.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">Your Choices</h2>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>You may use the site without providing any personal information.</li>
            <li>You may request that we delete a message you sent us by emailing the address below.</li>
            <li>You may disable cookies in your browser; some features may stop working.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">Children</h2>
          <p>This site is intended for adults. We do not knowingly collect personal information from children under 13.</p>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">Changes</h2>
          <p>We may update this policy from time to time. Material changes will be noted at the top of this page with a revised date.</p>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">Contact</h2>
          <p>
            Questions about this policy? Reach us through the <a href="/contact" className="text-primary underline underline-offset-4">contact page</a>.
          </p>
        </section>
      </div>
    </div>
  );
}