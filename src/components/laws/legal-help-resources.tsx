/** Neutral Texas legal assistance options. No commercial referrals or legal advice. */
export function LegalHelpResources() {
  return (
    <section className="mt-12 rounded-xl border border-border bg-muted/20 p-6" aria-labelledby="texas-legal-help-heading">
      <h2 id="texas-legal-help-heading" className="font-display text-2xl tracking-tight">Need help with a specific legal problem?</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
        These law guides explain the general legal framework, not the outcome of an individual case.
        Court deadlines, filed documents, orders and specific facts can change what you need to do.
        The independent resources below can help you find trustworthy information or a qualified lawyer.
      </p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-3">
        <li>
          <a href="https://www.sll.texas.gov/faqs/free-legal-help/" target="_blank" rel="noopener noreferrer" className="block h-full rounded-lg border bg-background p-4 hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
            <span className="block font-semibold text-primary">Texas State Law Library ↗</span>
            <span className="mt-2 block text-xs leading-5 text-muted-foreground">State-published guidance on legal aid, clinics and hotlines.</span>
          </a>
        </li>
        <li>
          <a href="https://texaslawhelp.org/" target="_blank" rel="noopener noreferrer" className="block h-full rounded-lg border bg-background p-4 hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
            <span className="block font-semibold text-primary">TexasLawHelp.org ↗</span>
            <span className="mt-2 block text-xs leading-5 text-muted-foreground">Nonprofit legal information and self-help resources; eligibility for representation varies.</span>
          </a>
        </li>
        <li>
          <a href="https://www.texasbar.com/AM/Template.cfm?Section=Lawyer_Referral_Service_LRIS_" target="_blank" rel="noopener noreferrer" className="block h-full rounded-lg border bg-background p-4 hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
            <span className="block font-semibold text-primary">State Bar of Texas referral service ↗</span>
            <span className="mt-2 block text-xs leading-5 text-muted-foreground">Find a lawyer referral program; consultations and legal representation may involve fees.</span>
          </a>
        </li>
      </ul>
      <p className="mt-4 text-xs leading-6 text-muted-foreground">These are external public-service resources, not paid endorsements. Keep TX Red does not select a lawyer, assess eligibility for legal aid, or provide legal representation.</p>
    </section>
  );
}
