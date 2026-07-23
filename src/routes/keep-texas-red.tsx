import { createFileRoute, Link } from "@tanstack/react-router";
import heroFlag from "@/assets/hero-flag.jpg";

const URL = "https://www.keeptxred.com/keep-texas-red";
const TITLE = "Keep Texas Red | What It Means and Why Texans Support It";
const DESC =
  "An in-depth, evergreen guide to what Keep Texas Red means — covering Texas history, economy, border, energy, constitutional rights, education, elections, business, agriculture, military, and infrastructure.";

export const Route = createFileRoute("/keep-texas-red")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "keywords", content: "Keep Texas Red, Keep TX Red, Texas Politics, Texas Conservative News, Texas Elections, Texas Economy, Texas Border, Texas Energy, Texas Government" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
      { property: "og:image", content: heroFlag },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: heroFlag },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: TITLE,
          description: DESC,
          image: [heroFlag],
          datePublished: "2026-06-27",
          dateModified: "2026-06-27",
          author: { "@type": "Organization", name: "Keep TX Red Editorial Team" },
          publisher: {
            "@type": "NewsMediaOrganization",
            name: "Keep TX Red",
            url: "https://www.keeptxred.com/",
            logo: { "@type": "ImageObject", url: "https://www.keeptxred.com/favicon.ico" },
          },
          mainEntityOfPage: { "@type": "WebPage", "@id": URL },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.keeptxred.com/" },
            { "@type": "ListItem", position: 2, name: "Keep Texas Red", item: URL },
          ],
        }),
      },
    ],
  }),
  component: KeepTexasRedPage,
});

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="font-display text-3xl md:text-4xl tracking-tight mt-12 mb-4 border-b border-border pb-2 scroll-mt-24">
      {children}
    </h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="font-serif text-base md:text-lg leading-relaxed text-foreground mb-4">{children}</p>;
}

function KeepTexasRedPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-14">
      <nav aria-label="Breadcrumb" className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-primary">Keep Texas Red</span>
      </nav>

      <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary">★ Pillar Guide</span>
      <h1 className="font-display text-4xl md:text-6xl tracking-tight leading-[1.05] mt-2">
        Keep Texas Red: What It Means and Why Texans Support It
      </h1>
      <p className="mt-4 text-lg md:text-xl text-muted-foreground leading-snug font-serif italic">
        A comprehensive guide to the political, economic, and cultural forces that keep Texas the largest reliably conservative state in the country — and what's at stake going forward.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground border-y border-border py-3">
        <span className="font-semibold text-foreground">By Keep TX Red Editorial Team</span>
        <span>•</span>
        <span>Updated <time dateTime="2026-06-27">June 27, 2026</time></span>
        <span>•</span>
        <span>18 min read</span>
        <span>•</span>
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">★ Pillar Guide</span>
      </div>

      <div className="aspect-[16/9] overflow-hidden bg-muted my-8 border-2 border-foreground/10">
        <img src={heroFlag} alt="Texas state flag waving against a clear sky" className="size-full object-cover" width={1280} height={720} />
      </div>

      <div className="bg-muted/40 border border-border p-5 mb-8 text-sm">
        <p className="font-semibold uppercase tracking-wider text-[10px] text-primary mb-2">On this page</p>
        <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-1 list-disc pl-5">
          <li><a href="#history" className="hover:text-primary">Texas History</a></li>
          <li><a href="#economy" className="hover:text-primary">Texas Economy</a></li>
          <li><a href="#border" className="hover:text-primary">Border Policy</a></li>
          <li><a href="#energy" className="hover:text-primary">Energy Production</a></li>
          <li><a href="#rights" className="hover:text-primary">Constitutional Rights</a></li>
          <li><a href="#education" className="hover:text-primary">Education</a></li>
          <li><a href="#elections" className="hover:text-primary">Elections</a></li>
          <li><a href="#business" className="hover:text-primary">Business Climate</a></li>
          <li><a href="#agriculture" className="hover:text-primary">Agriculture</a></li>
          <li><a href="#military" className="hover:text-primary">Military Presence</a></li>
          <li><a href="#infrastructure" className="hover:text-primary">Infrastructure</a></li>
          <li><a href="#faq" className="hover:text-primary">Frequently Asked Questions</a></li>
        </ul>
      </div>

      <P>
        "Keep Texas Red" is more than a campaign slogan. It is shorthand for a worldview — a belief that the policies which built modern Texas (limited government, low taxes, secure borders, strong energy production, parental rights, and an unapologetic defense of constitutional liberties) are the same policies that will keep Texas the freest and most prosperous state in the country. For more than two decades, Texas voters have backed that worldview at the ballot box, electing conservative majorities to the Legislature, statewide offices, the U.S. Senate, and the presidency.
      </P>
      <P>
        Texas Conservative News outlets — including Keep TX Red — exist because the issues that matter most to Texans (property taxes, the southern border, the power grid, school choice, election integrity, and gun rights) are too often filtered through a national lens that doesn't reflect how things actually work in the Lone Star State. This pillar guide unpacks what "Keep Texas Red" really means, why Texans of every background continue to support it, and where the next decade of Texas Politics is headed.
      </P>

      <H2 id="history">Texas History: A State Built on Independence</H2>
      <P>
        No American state has a founding story quite like Texas. From 1836 to 1845, Texas was its own country — the Republic of Texas — with its own president, currency, navy, and foreign embassies. When Texas joined the Union, it did so on its own terms, retaining the right to its public lands and a long memory of self-government. That history is not a museum piece. It still shapes how Texans think about Austin, Washington, and the proper limits of any government's power.
      </P>
      <P>
        For most of the twentieth century, Texas was a one-party Democratic state, but a conservative one. The realignment of the 1980s and 1990s — accelerated by Ronald Reagan, George W. Bush, and a generation of conservative voters who left the Democratic Party as it moved left — turned Texas into the largest reliably Republican state in the country. Since 1994, every Texas governor has been a Republican. Since 2002, Republicans have held every statewide elected office. The legislative majorities have not been close.
      </P>
      <P>
        That history matters because "Keep Texas Red" is not a fight to <em>change</em> Texas. It is a fight to <em>conserve</em> what works — and to push back when activist judges, federal agencies, or out-of-state donors try to remake Texas into something other than what its voters keep choosing.
      </P>

      <H2 id="economy">The Texas Economy: The Model Other States Try to Copy</H2>
      <P>
        If Texas were a country, it would have one of the ten largest economies in the world. The Texas Economy crossed $2 trillion in gross state product in the mid-2020s, anchored by oil and gas, advanced manufacturing, semiconductors, logistics, agriculture, finance, and a tech sector that has been steadily migrating from California and the Northeast. The state has led the nation in job creation for most of the last fifteen years.
      </P>
      <P>
        Two structural decisions explain most of it. First, Texas has no state income tax. The state funds itself through sales tax, property tax, severance taxes on oil and gas, franchise tax on businesses, and federal transfers — leaving paychecks larger and creating one of the most competitive business tax environments in the country. Second, the regulatory burden is comparatively light. Permitting moves faster, lawsuits are harder to weaponize after a generation of tort reform, and labor law gives employers and workers more flexibility than most coastal states.
      </P>
      <P>
        The trade-off is real and conservatives are honest about it: with no income tax, property taxes do more of the work, and that has become the single largest pocketbook issue for Texas homeowners. Every recent Texas Legislature has wrestled with appraisal caps, homestead exemption increases, and school-district compression — the heart of any serious property tax relief plan.
      </P>

      <H2 id="border">Texas Border Policy: The Front Line of a National Crisis</H2>
      <P>
        Texas shares 1,254 miles of border with Mexico — more than any other state. When federal enforcement fails, Texas absorbs the consequences first: in its hospitals, its schools, its rural counties, and its law enforcement budgets. That is why the Texas Border has become the defining issue of Texas Politics for the last decade.
      </P>
      <P>
        Operation Lone Star, launched in 2021, deployed Texas Department of Public Safety troopers and the Texas National Guard to the border in unprecedented numbers, built new physical barriers, and made historical use of state trespassing laws to fill an enforcement vacuum. Voters across South Texas — including in counties that had voted Democratic for a century — moved sharply right in response. Border security is no longer a wedge issue in Texas. It is a consensus issue, and the political map reflects that.
      </P>
      <P>
        The constitutional fight over how much border enforcement a state may do on its own is ongoing, and Keep TX Red will keep tracking it. But the political reality is settled: Texans, Republican and Democrat alike, want a secure border, and Texas Government will keep acting on that mandate as long as Washington does not.
      </P>

      <H2 id="energy">Texas Energy: Powering America, Defending Reliability</H2>
      <P>
        Texas Energy is the backbone of the American economy. The Permian Basin in West Texas is now the most productive oilfield in the world, supplying a meaningful share of U.S. crude and natural gas. The Gulf Coast refineries process and export petroleum products to the entire planet. Texas is also, perhaps surprisingly to outsiders, the nation's largest producer of wind power and one of its largest producers of solar.
      </P>
      <P>
        Reliability is the conservative throughline. After Winter Storm Uri in 2021, ERCOT — the grid operator that runs most of Texas — became a household word. The Legislature passed weatherization mandates, expanded dispatchable generation incentives, and pushed back on policies that would subsidize intermittent power at the expense of grid stability. The fight is not against renewables; it is against pretending that the grid can run on weather-dependent sources alone.
      </P>
      <P>
        Energy policy is also national security policy. Every barrel produced in Texas is a barrel not bought from regimes hostile to American interests. Keep Texas Red means keeping America energy-dominant.
      </P>

      <H2 id="rights">Constitutional Rights: Speech, Religion, and the Second Amendment</H2>
      <P>
        Texas takes the Bill of Rights seriously and codifies it aggressively. Constitutional carry, enacted in 2021, lets qualifying Texans carry a handgun without a permit. Castle doctrine and stand-your-ground are written firmly into state law. Religious liberty has its own statutory framework in the Texas Religious Freedom Restoration Act, with strong protections for churches, religious schools, and faith-based ministries.
      </P>
      <P>
        Free speech, parental rights, due process for the accused, and protections against compelled government messaging are recurring themes of every Texas Legislature. When Washington overreaches — on guns, on speech, or on regulatory mandates — Texas Attorney General lawsuits are usually first in line.
      </P>

      <H2 id="education">Education: School Choice, Local Control, and Parental Rights</H2>
      <P>
        Public schools educate roughly 5.5 million Texas students across more than 1,200 independent school districts. Texas spends tens of billions of dollars per year on K-12 education, with funding split between local property taxes and state aid through the school finance formula. School board elections in Texas are non-partisan in name only — they are some of the most contested local races in the state.
      </P>
      <P>
        In 2025, Texas joined the growing list of states with a meaningful school choice program: Education Savings Accounts (ESAs) that follow the child, available first to families with the greatest need and expanding from there. Conservatives view ESAs as the natural extension of the basic principle that parents — not bureaucracies — direct their children's education. Combined with new transparency requirements for curriculum and library content, parental rights are now a structural part of Texas education law, not just a slogan.
      </P>

      <H2 id="elections">Texas Elections: Integrity, Access, and the Map Ahead</H2>
      <P>
        Texas Elections are governed by a system that is, by design, one of the more secure in the country: photo ID at the polls, robust signature verification on mail ballots (which are limited to specific qualifying categories), paper-trail voting equipment, and post-election audits. Voter registration is straightforward and free; early voting runs for roughly two weeks before every election, including weekends.
      </P>
      <P>
        Turnout in Texas has climbed steadily, especially in suburban counties that grew explosively over the last decade. The political map keeps shifting in conservative directions in places like South Texas, while the state's largest urban cores trend more Democratic. Statewide, the conservative coalition has held — and the 2026 primary cycle is already shaping up to test how durable it is in the suburbs.
      </P>
      <P>
        For a deeper, evergreen reference, see our voter guide and elections coverage on the <Link to="/elections" className="text-primary underline">Texas Elections</Link> hub and the <Link to="/representatives" className="text-primary underline">Texas Representatives</Link> directory.
      </P>

      <H2 id="business">Business Climate: Why Companies Keep Moving to Texas</H2>
      <P>
        Tesla, Oracle, Charles Schwab, Hewlett Packard Enterprise, Caterpillar, and dozens of smaller relocations did not move to Texas by accident. They moved for the same reasons families do: no income tax, lower cost of living than coastal alternatives, a deep labor market, sensible regulation, and a state government that does not treat employers as adversaries. The Texas Permanent University Fund and other long-horizon state investments — built largely on energy royalties — back research and infrastructure at scale that few states can match.
      </P>
      <P>
        That growth is not without friction. Housing prices in the major metros have risen sharply, water and transportation infrastructure are under pressure, and small towns adjacent to fast-growing suburbs are wrestling with zoning and identity. Conservative policy answers tend to favor local control, faster permitting, and skepticism of top-down state mandates — even when the state happens to be Texas.
      </P>

      <H2 id="agriculture">Agriculture: The Original Texas Economy</H2>
      <P>
        Texas leads the nation in cattle, cotton, sheep, goats, mohair, and hay production, with more than 240,000 working farms and ranches across nearly 130 million acres. Agriculture is not just a sector; in much of rural Texas it is the local economy. Right-to-farm protections, water rights tied to property ownership, and a deep suspicion of federal land-use mandates are bipartisan in most rural counties — and they are bedrock conservative principles statewide.
      </P>
      <P>
        Drought, water policy, and the long-term reliability of the Edwards and Ogallala aquifers are existential issues for Texas agriculture. The Legislature's growing investment in water infrastructure through the Texas Water Fund is one of the most consequential, least-covered policy stories in the state.
      </P>

      <H2 id="military">Military Presence: Texas as a National Security Asset</H2>
      <P>
        Texas hosts more active-duty military personnel and major installations than nearly any other state: Fort Cavazos (formerly Fort Hood), Joint Base San Antonio, Naval Air Station Corpus Christi, Dyess Air Force Base, Sheppard Air Force Base, and Fort Bliss, among others. Tens of thousands of veterans return to Texas every year, drawn by no income tax on military pay, strong veteran services, and a culture that genuinely respects military service.
      </P>
      <P>
        The defense industry — from Lockheed Martin's F-35 line in Fort Worth to a sprawling network of aerospace, cybersecurity, and unmanned-systems contractors — is a major piece of the Texas Economy. Keep Texas Red means continuing to build out that ecosystem, not winding it down.
      </P>

      <H2 id="infrastructure">Infrastructure: Building for the Next 30 Million Texans</H2>
      <P>
        Texas added roughly four million residents in the 2010s and is on track to add millions more this decade. Roads, ports, water, broadband, and the electric grid are all under structural pressure. The Texas Department of Transportation runs one of the largest highway programs in the country; the Port of Houston is among the busiest in the world; Texas leads the nation in broadband expansion funding deployments.
      </P>
      <P>
        Infrastructure is where conservative principles meet practical engineering. Build first, regulate carefully, fund through user fees and dedicated revenue rather than general taxation, and resist the temptation to copy the planning fads of states that are losing population for a reason.
      </P>

      <H2 id="faq">Frequently Asked Questions</H2>
      <dl className="space-y-5">
        <div>
          <dt className="font-semibold text-foreground mb-1">What does "Keep Texas Red" actually mean?</dt>
          <dd className="text-muted-foreground leading-relaxed">It is a shorthand for keeping the conservative governing coalition in power in Texas — the coalition that has delivered low taxes, secure borders, energy dominance, school choice, and strong constitutional protections. It is a political identity as much as a slogan.</dd>
        </div>
        <div>
          <dt className="font-semibold text-foreground mb-1">Is Texas really at risk of "turning blue"?</dt>
          <dd className="text-muted-foreground leading-relaxed">Statewide elections in Texas have been won by Republicans by mid-to-high single digits in recent cycles. South Texas has trended sharply more conservative, while urban cores trend more Democratic. The map is dynamic, but the statewide majority has held — and the 2026 cycle will test the suburbs again.</dd>
        </div>
        <div>
          <dt className="font-semibold text-foreground mb-1">Why is property tax such a big issue if Texas is "low tax"?</dt>
          <dd className="text-muted-foreground leading-relaxed">No state income tax shifts more of the funding burden onto property tax, especially school-district maintenance and operations rates. That is why every recent Legislature has passed appraisal caps, homestead exemption increases, and tax rate compression — and why the fight continues.</dd>
        </div>
        <div>
          <dt className="font-semibold text-foreground mb-1">How does Texas Energy fit into "Keep Texas Red"?</dt>
          <dd className="text-muted-foreground leading-relaxed">Texas produces more oil, gas, wind, and solar than any other state. Conservatives view energy as both an economic engine and a national-security asset, and they prioritize reliability and dispatchable power on the ERCOT grid.</dd>
        </div>
        <div>
          <dt className="font-semibold text-foreground mb-1">What is Operation Lone Star?</dt>
          <dd className="text-muted-foreground leading-relaxed">Operation Lone Star is the state-led border security mission launched in 2021 that deployed Texas DPS troopers and the Texas National Guard to the southern border. It has reshaped the political map of South Texas. Read our full <Link to="/news/$slug" params={{ slug: "operation-lone-star" }} className="text-primary underline">Operation Lone Star</Link> coverage.</dd>
        </div>
        <div>
          <dt className="font-semibold text-foreground mb-1">How do I check my Texas voter registration?</dt>
          <dd className="text-muted-foreground leading-relaxed">Use the Texas Secretary of State's <a href="https://www.sos.state.tx.us/elections/voter/reqvr.shtml" target="_blank" rel="noopener noreferrer" className="text-primary underline">voter registration lookup</a>, or see our <Link to="/register-to-vote" className="text-primary underline">Register to Vote</Link> page for step-by-step instructions.</dd>
        </div>
      </dl>

      <section className="mt-12">
        <h2 className="font-display text-xl tracking-tight mb-3">Keep going</h2>
        <ul className="space-y-2 text-sm">
          <li><Link to="/news" className="text-primary hover:underline">→ Read the latest Texas news</Link></li>
          <li><Link to="/texas-politics" className="text-primary hover:underline">→ Texas Politics section</Link></li>
          <li><Link to="/texas-economy" className="text-primary hover:underline">→ Texas Economy section</Link></li>
          <li><Link to="/elections" className="text-primary hover:underline">→ Texas Elections hub</Link></li>
          <li><Link to="/tax-calculator" className="text-primary hover:underline">→ Property tax calculator by county</Link></li>
          <li><Link to="/about" className="text-primary hover:underline">→ About Keep TX Red</Link></li>
        </ul>
      </section>
    </article>
  );
}
