export type KtrFacebookAttentionPost = {
  category: string;
  title: string;
  message: string;
  trafficPath?: string;
};

const SITE_URL = "https://keeptxred.com";

// Social-native prompts for KeepTXRed. These are intentionally short and
// discussion-first. They are not article ideas and do not require publication
// as standalone site content. Some include a relevant KTR destination to turn
// Facebook reach into site traffic without forcing a link into every post.
export const KTR_FACEBOOK_ATTENTION_POSTS: readonly KtrFacebookAttentionPost[] = [
  { category: "Texas politics", title: "One Texas reform", message: "If the Texas Legislature could pass only ONE major reform next session, what should it be?", trafficPath: "/texas-politics" },
  { category: "Texas politics", title: "Property tax pressure", message: "What would make the biggest difference to your Texas property-tax bill: lower rates, tighter spending limits, bigger exemptions, or something else?" },
  { category: "Texas politics", title: "Local control", message: "Where should Texas draw the line between local control and statewide rules? What issue best shows the tension?", trafficPath: "/texas-government" },
  { category: "Texas politics", title: "School choice", message: "What should Texas parents have the most control over in their child's education?", trafficPath: "/issues/texas-school-choice-esas" },
  { category: "Texas politics", title: "Parental rights", message: "Which school decisions should always require meaningful parental input?", trafficPath: "/issues/parental-rights-texas-schools" },
  { category: "Texas politics", title: "Border priorities", message: "Which border-policy outcome should Texas leaders prioritize most: security, faster legal processing, trade efficiency, local costs, or something else?", trafficPath: "/issues/texas-border-security-operation-lone-star" },
  { category: "Texas politics", title: "Election confidence", message: "Which election safeguard matters most for public confidence: voter ID, paper records, audits, chain of custody, faster counting, or something else?", trafficPath: "/issues/texas-election-law" },
  { category: "Texas politics", title: "Texas energy mix", message: "What should Texas prioritize most for long-term electric reliability: natural gas, nuclear, renewables, storage, transmission, or a broader mix?", trafficPath: "/issues/ercot-grid-reliability" },
  { category: "Texas politics", title: "State spending", message: "If Texas had to protect one area of state spending and cut another, what would you protect first?" },
  { category: "Texas politics", title: "Federal versus state", message: "What issue best illustrates the tension between Texas authority and federal power?", trafficPath: "/texas-government" },
  { category: "Texas politics", title: "Texas leadership", message: "Which Texas elected office has more influence than most voters realize?", trafficPath: "/texas-government" },
  { category: "Texas politics", title: "Political figure", message: "Which Texas political figure from the last 50 years had the biggest impact on the state?", trafficPath: "/texas-political-figures" },

  { category: "Constitution", title: "First Amendment", message: "Which First Amendment freedom do Americans take most for granted today?" },
  { category: "Constitution", title: "Second Amendment", message: "What should responsible gun ownership mean in practice beyond simply following the law?" },
  { category: "Constitution", title: "Tenth Amendment", message: "What is the best modern example of why the Tenth Amendment still matters?" },
  { category: "Constitution", title: "Originalism", message: "When judges interpret the Constitution, how much weight should original public meaning carry versus modern circumstances?" },
  { category: "Constitution", title: "Electoral College", message: "Keep it, reform it, or replace it: what is your view of the Electoral College and why?" },
  { category: "Constitution", title: "Executive orders", message: "Do presidents rely too much on executive orders? Where should Congress draw the line?" },
  { category: "Constitution", title: "Privacy", message: "Which privacy protection needs the most attention today: phones, financial data, location tracking, cameras, or government databases?" },
  { category: "Constitution", title: "Free speech", message: "Where is the hardest free-speech line to draw: schools, workplaces, social platforms, protests, or public institutions?" },
  { category: "Constitution", title: "Property rights", message: "What is the biggest property-rights issue facing Texans where you live: taxes, eminent domain, land use, water, mineral rights, or something else?" },
  { category: "Constitution", title: "Jury duty", message: "Jury duty: civic burden, civic privilege, or both?" },
  { category: "Constitution", title: "Federalism", message: "Which decisions should clearly belong to states instead of Washington?" },
  { category: "Constitution", title: "Civic literacy", message: "What is one constitutional concept every high-school graduate should understand before voting?" },

  { category: "Texas history", title: "Alamo story", message: "What is one Alamo fact or story you think every Texan should know?" },
  { category: "Texas history", title: "Texas Republic", message: "Which part of the Republic of Texas era deserves more attention in Texas classrooms?" },
  { category: "Texas history", title: "Come and Take It", message: "What does 'Come and Take It' mean to Texans today: history, attitude, political symbol, or all three?" },
  { category: "Texas history", title: "Sam Houston", message: "Which Sam Houston decision had the biggest long-term impact on Texas?" },
  { category: "Texas history", title: "Texas Rangers history", message: "Which chapter of Texas Rangers history should be taught more fully?" },
  { category: "Texas history", title: "Spindletop", message: "How much of modern Texas was shaped by Spindletop and the oil boom that followed?", trafficPath: "/issues/texas-oil-gas-federal-regulation" },
  { category: "Texas history", title: "Texas frontier", message: "Which Texas frontier story best captures the grit people still associate with the state?" },
  { category: "Texas history", title: "Texas courthouses", message: "Which Texas county courthouse is the most impressive you've seen?" },
  { category: "Texas history", title: "Texas monument", message: "What Texas monument or landmark gives you the strongest sense of state history?" },
  { category: "Texas history", title: "Military Texans", message: "Which Texan from U.S. military history deserves to be better known nationally?" },
  { category: "Texas history", title: "Oilfield family", message: "Does your family have a roughneck, refinery, pipeline, drilling, or oilfield story?" },
  { category: "Texas history", title: "Cattle drives", message: "What part of the old Texas cattle-drive era still shows up in Texas culture today?" },
  { category: "Texas history", title: "Historic church", message: "What historic Texas church or congregation has the most interesting story in your area?" },
  { category: "Texas history", title: "Texas town history", message: "What small Texas town has a history that deserves more attention?" },
  { category: "Texas history", title: "Texas museum", message: "Which Texas museum has one artifact or exhibit every Texan should see?" },
  { category: "Texas history", title: "Historic photo", message: "If you could see one moment in Texas history photographed in modern high resolution, what would it be?" },
  { category: "Texas history", title: "Texas founder", message: "Which early Texas leader should more people know by name?" },
  { category: "Texas history", title: "Texas landmark", message: "What historic Texas site is absolutely worth the drive?" },

  { category: "Economy", title: "Texas economy", message: "What is the single biggest reason businesses keep moving to or expanding in Texas?" },
  { category: "Economy", title: "Small business pressure", message: "What is the biggest obstacle facing a small Texas business right now: taxes, regulation, labor, insurance, rent, financing, or something else?" },
  { category: "Economy", title: "Inflation hit", message: "Which everyday expense has changed your household budget the most over the last few years?" },
  { category: "Economy", title: "Housing costs", message: "What is driving housing costs most where you live in Texas: land, construction, taxes, insurance, zoning, demand, or interest rates?" },
  { category: "Economy", title: "Deregulation", message: "Where has deregulation clearly helped consumers — and where do you think guardrails still matter?" },
  { category: "Economy", title: "Minimum wage", message: "Should wage policy be set nationally, by states, locally, or mostly by the market?" },
  { category: "Economy", title: "National debt", message: "If Washington got serious about the national debt, where would you start: spending cuts, entitlement reform, tax changes, growth, or all of the above?" },
  { category: "Economy", title: "Tariffs", message: "Are tariffs worth higher prices if they bring more manufacturing back to America? Where is your line?" },
  { category: "Economy", title: "Worker freedom", message: "What does worker freedom mean to you: the right to organize, the right not to join, both, or something else?" },
  { category: "Economy", title: "Gig work", message: "For gig workers, what matters more: flexibility or traditional employee protections?" },
  { category: "Economy", title: "Texas manufacturing", message: "What industry should Texas work hardest to bring onshore over the next decade?" },
  { category: "Economy", title: "Generational wealth", message: "What financial habit do you wish you had learned at 18?" },
  { category: "Economy", title: "College value", message: "At today's prices, what makes a four-year college degree worth the cost?" },
  { category: "Economy", title: "Trade school", message: "Which skilled trade offers the best opportunity in Texas right now?" },
  { category: "Economy", title: "Texas no-income-tax model", message: "What is the biggest advantage — or tradeoff — of Texas not having a state individual income tax?" },

  { category: "Energy", title: "Texas grid", message: "What change would make you most confident in the Texas electric grid before the next major freeze or heat wave?", trafficPath: "/issues/ercot-grid-reliability" },
  { category: "Energy", title: "Nuclear power", message: "Should Texas build more nuclear power plants? Why or why not?", trafficPath: "/issues/ercot-grid-reliability" },
  { category: "Energy", title: "Wind and solar", message: "What role should wind and solar play in the Texas grid ten years from now?", trafficPath: "/issues/ercot-grid-reliability" },
  { category: "Energy", title: "Natural gas", message: "How important should natural gas remain to Texas electric reliability over the next decade?", trafficPath: "/issues/ercot-grid-reliability" },
  { category: "Energy", title: "Transmission", message: "Texas is growing fast. What matters more for the grid right now: more generation or more transmission?", trafficPath: "/issues/ercot-grid-reliability" },
  { category: "Energy", title: "Energy independence", message: "What does American energy independence actually require today?", trafficPath: "/issues/texas-oil-gas-federal-regulation" },
  { category: "Energy", title: "Oil and gas balance", message: "How should Texas balance oil-and-gas growth with land, water, and air concerns?", trafficPath: "/issues/texas-oil-gas-federal-regulation" },
  { category: "Energy", title: "Backup power", message: "After recent Texas weather disasters, what backup-power lesson should every household take seriously?" },
  { category: "Energy", title: "Generator question", message: "If you own a home generator, what made you finally decide it was worth the cost?" },
  { category: "Energy", title: "Electric bill", message: "What has been the biggest surprise on your Texas electric bill: usage, delivery charges, plan structure, or something else?" },

  { category: "Education", title: "Life skills", message: "What practical life skill should every Texas public school teach before graduation?" },
  { category: "Education", title: "Civics", message: "What is one thing every Texas high-school graduate should understand about state government?", trafficPath: "/texas-government" },
  { category: "Education", title: "Phonics", message: "Parents and teachers: what reading method have you seen work best for kids who are struggling?" },
  { category: "Education", title: "College alternatives", message: "For an 18-year-old today, when is trade school or an apprenticeship a better choice than a four-year degree?" },
  { category: "Education", title: "Homeschooling", message: "Families who homeschool: what was the biggest reason you chose it — and what surprised you afterward?" },
  { category: "Education", title: "Charter schools", message: "What should Texas measure when deciding whether a charter school is succeeding?" },
  { category: "Education", title: "Student debt", message: "What should young Texans know about college debt before signing their first student-loan paperwork?" },
  { category: "Education", title: "School discipline", message: "What is one school-discipline rule that worked when you were a kid and still makes sense today?" },
  { category: "Education", title: "Phones in school", message: "Should Texas schools restrict student phones during the school day?" },
  { category: "Education", title: "Homework", message: "Parents and teachers: does homework still help, or do kids already have enough structured time?" },

  { category: "Family and community", title: "Family dinner", message: "How many nights a week does your family actually sit down for dinner together — and does it still matter?" },
  { category: "Family and community", title: "Chores", message: "What chore taught you the most responsibility when you were growing up?" },
  { category: "Family and community", title: "Grandparents", message: "What lesson, saying, recipe, or tradition did your grandparents pass down that you still keep?" },
  { category: "Family and community", title: "Manners", message: "Which old-fashioned manners should make a comeback?" },
  { category: "Family and community", title: "Volunteerism", message: "What local volunteer group in your Texas community deserves more recognition?" },
  { category: "Family and community", title: "Youth sports", message: "What should youth sports teach first: winning, discipline, teamwork, resilience, or something else?" },
  { category: "Family and community", title: "Digital childhood", message: "What is one phone or social-media rule more families should adopt?" },
  { category: "Family and community", title: "Community tradition", message: "What local tradition makes your Texas town feel like a real community?" },
  { category: "Family and community", title: "Fourth of July", message: "What makes a great hometown Fourth of July celebration?" },
  { category: "Family and community", title: "Neighborhood", message: "What is one simple thing that makes a neighborhood feel more connected?" },

  { category: "Media literacy", title: "Headline framing", message: "What is the fastest way you spot a headline that is trying to persuade instead of inform?" },
  { category: "Media literacy", title: "Primary sources", message: "Before sharing a political story, do you look for the original speech, bill, court filing, or data?" },
  { category: "Media literacy", title: "Corrections", message: "Should news outlets make corrections as prominent as the original mistake?" },
  { category: "Media literacy", title: "Polls", message: "What makes you trust or distrust a political poll: sample size, wording, sponsor, methodology, track record, or something else?" },
  { category: "Media literacy", title: "Algorithms", message: "How much do social-media and search algorithms shape the political news people see?" },
  { category: "Media literacy", title: "Citizen journalism", message: "Has citizen journalism made local news better, worse, or simply faster?" },
  { category: "Media literacy", title: "Fact checks", message: "What should a trustworthy fact-check always show its readers?" },
  { category: "Media literacy", title: "Anonymous sources", message: "When should a news organization use anonymous sources — and when should readers be skeptical?" },
  { category: "Media literacy", title: "Local news", message: "What is one local issue that deserves more reporting in your part of Texas?" },
  { category: "Media literacy", title: "Read past headline", message: "Be honest: how often do you read the full story before reacting to the headline?" },

  { category: "Self reliance", title: "Texas homestead", message: "What self-reliance skill should every Texan know, even in the suburbs?" },
  { category: "Self reliance", title: "Three-day outage", message: "If the power went out for three days, what item would you be happiest you already had?" },
  { category: "Self reliance", title: "Water storage", message: "How much emergency water do you keep at home — if any?" },
  { category: "Self reliance", title: "Ham radio", message: "Any ham-radio operators here? What made you get licensed, and is it still worth learning?" },
  { category: "Self reliance", title: "Truck essentials", message: "What is one thing every Texan should keep in the truck year-round?" },
  { category: "Self reliance", title: "First aid", message: "What first-aid skill should everyone know before an emergency happens?" },
  { category: "Self reliance", title: "Backyard food", message: "If you had to produce one food at home, would you choose a garden, fruit trees, chickens, or something else?" },
  { category: "Self reliance", title: "Storm prep", message: "What Texas storm-prep purchase have you never regretted?" },
  { category: "Self reliance", title: "Flashlights", message: "What is the most overlooked item in a home emergency kit?" },
  { category: "Self reliance", title: "Freezer strategy", message: "What is your best trick for protecting food during a long power outage?" },
  { category: "Self reliance", title: "Home skills", message: "What home-repair skill has saved you the most money over the years?" },
  { category: "Self reliance", title: "Weather radio", message: "Do you still keep a dedicated weather radio, or do you rely entirely on your phone?" },

  { category: "Texas culture", title: "High school football", message: "What is the best Texas high-school football tradition in your town?" },
  { category: "Texas culture", title: "Stockyards", message: "Fort Worth Stockyards fans: what is the one thing a first-time visitor should not miss?" },
  { category: "Texas culture", title: "Brisket debate", message: "Brisket debate: bark, smoke ring, tenderness, seasoning, or fat render — what matters most?" },
  { category: "Texas culture", title: "BBQ order", message: "You walk into a Texas BBQ joint with one plate. What are you ordering?" },
  { category: "Texas culture", title: "Honky tonk", message: "What Texas honky-tonk belongs on every country-music fan's bucket list?" },
  { category: "Texas culture", title: "Texas brand", message: "What independent Texas brand has earned your loyalty?" },
  { category: "Texas culture", title: "Rodeo", message: "What is your favorite rodeo tradition or event?" },
  { category: "Texas culture", title: "Texas truck", message: "What makes a truck a 'Texas truck' to you: capability, ranch use, road trips, style, or just attitude?" },
  { category: "Texas culture", title: "A&M tradition", message: "Aggies: which Texas A&M tradition best explains the school to somebody who has never been there?" },
  { category: "Texas culture", title: "Sunday drive", message: "What historic Texas town makes the best Sunday-drive destination?" },
  { category: "Texas culture", title: "Western film", message: "What classic Western should every Texan watch at least once?" },
  { category: "Texas culture", title: "Chuckwagon", message: "What old-school Texas or trail recipe still deserves a place at the table today?" },
  { category: "Texas culture", title: "Small town", message: "What small Texas town deserves way more attention?" },
  { category: "Texas culture", title: "Texas diner", message: "Name a family-owned Texas diner you'd drive an hour to visit again." },
  { category: "Texas culture", title: "Friday night lights", message: "What Texas town does Friday-night football better than anybody?" },
  { category: "Texas culture", title: "Country song", message: "What country song instantly feels like Texas to you?" },
  { category: "Texas culture", title: "Texas food", message: "If a visitor could try only ONE Texas food, what are you serving them?" },
  { category: "Texas culture", title: "Texas road", message: "What Texas highway or back road has the best scenery?" },
  { category: "Texas culture", title: "Texas state park", message: "Which Texas state park would you recommend to somebody who has never visited one?" },
  { category: "Texas culture", title: "Texas courthouse square", message: "Which Texas town has the best courthouse square?" },
  { category: "Texas culture", title: "Texas festival", message: "What small-town Texas festival is actually worth planning a trip around?" },
  { category: "Texas culture", title: "Texas phrase", message: "What Texas saying do you use without even thinking about it?" },
  { category: "Texas culture", title: "Texas weather", message: "What temperature officially counts as 'cold' in Texas?" },
  { category: "Texas culture", title: "Texas county", message: "What Texas county are you checking in from today?" },
  { category: "Texas culture", title: "Texas hometown", message: "Without naming it, describe your Texas hometown and let everybody guess." },
  { category: "Texas culture", title: "Texas roadside", message: "What roadside stop should every Texas road trip include?" },
  { category: "Texas culture", title: "Texas tradition", message: "What Texas tradition would you never want to see disappear?" },
  { category: "Texas culture", title: "Texas working land", message: "What does ranching or farming contribute to Texas culture that city residents sometimes miss?" },
  { category: "Texas culture", title: "Texas outdoors", message: "Hunting, fishing, hiking, ranching, boating, camping — which Texas outdoor tradition is yours?" },
  { category: "Texas culture", title: "Texas Gulf", message: "What is your favorite stretch of the Texas Gulf Coast?" },
  { category: "Texas culture", title: "Texas family trip", message: "Where is the best Texas place to take kids for a weekend that doesn't require a theme park?" },

  { category: "Foreign policy", title: "Critical supply chains", message: "Which products or industries are too strategically important for America to depend heavily on foreign suppliers?" },
  { category: "Foreign policy", title: "China question", message: "What China-related issue should concern Americans most: trade, Taiwan, technology, supply chains, military power, or something else?" },
  { category: "Foreign policy", title: "Deterrence", message: "What does 'peace through strength' require in practice today?" },
  { category: "Foreign policy", title: "Defense manufacturing", message: "Should Texas push harder to bring defense manufacturing and critical supply chains into the state?" },
  { category: "Foreign policy", title: "Foreign aid", message: "What conditions should Congress attach to U.S. foreign aid?" },
  { category: "Foreign policy", title: "Cybersecurity", message: "Which part of U.S. infrastructure worries you most in a major cyberattack: power, water, banking, hospitals, communications, or transportation?" },
  { category: "Foreign policy", title: "Military intervention", message: "What test should the United States meet before committing troops to a foreign conflict?" },
  { category: "Foreign policy", title: "Shipping chokepoints", message: "How much attention should Americans pay to overseas shipping chokepoints that affect prices at home?" },

  { category: "Faith and civic life", title: "Religious liberty", message: "Where do you think the hardest modern religious-liberty questions are showing up?" },
  { category: "Faith and civic life", title: "Faith service", message: "Which faith-based charity or local ministry in Texas is doing work more people should know about?" },
  { category: "Faith and civic life", title: "Stewardship", message: "What does good stewardship of Texas land and natural resources look like to you?" },
  { category: "Faith and civic life", title: "Founding ideas", message: "Which founding idea matters most today: liberty, self-government, religious freedom, property rights, or civic duty?" },
  { category: "Faith and civic life", title: "Western civilization", message: "Which book, speech, law, or historical event best explains the Western idea of individual liberty?" },
  { category: "Faith and civic life", title: "Church architecture", message: "What Texas church building has the most beautiful architecture you've seen?" },
  { category: "Faith and civic life", title: "Community service", message: "What is one local need churches, nonprofits, and neighbors can address better together?" },
  { category: "Faith and civic life", title: "Civic duty", message: "Beyond voting, what civic duty do Americans neglect the most?" },
] as const;

function hash32(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/https?:\/\/\S+/g, " ").replace(/[^a-z0-9]+/g, " ").trim();
}

export function formatKtrFacebookAttentionMessage(post: KtrFacebookAttentionPost): string {
  if (!post.trafficPath) return post.message;
  return `${post.message}\n\nRead more on Keep TX Red:\n${SITE_URL}${post.trafficPath}`;
}

export function selectKtrFacebookAttentionPost(args: {
  seed: string;
  dateKey: string;
  slot: number;
  recentMessages: readonly string[];
}): KtrFacebookAttentionPost | null {
  if (KTR_FACEBOOK_ATTENTION_POSTS.length === 0) return null;
  const recent = new Set(args.recentMessages.map(normalize).filter(Boolean));
  const start = hash32(`${args.seed}:${args.dateKey}:${args.slot}:ktr-attention`) % KTR_FACEBOOK_ATTENTION_POSTS.length;

  for (let offset = 0; offset < KTR_FACEBOOK_ATTENTION_POSTS.length; offset += 1) {
    const candidate = KTR_FACEBOOK_ATTENTION_POSTS[(start + offset) % KTR_FACEBOOK_ATTENTION_POSTS.length];
    const formatted = formatKtrFacebookAttentionMessage(candidate);
    if (!recent.has(normalize(formatted)) && !recent.has(normalize(candidate.message))) return candidate;
  }
  return null;
}
