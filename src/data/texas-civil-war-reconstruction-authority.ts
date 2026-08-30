import type { PoliticalHistoryAuthorityPage } from "./texas-political-history-authority";

const REVIEWED = "2026-08-30";
const POLITICS_HUB = "/texas-politics";
const GOVERNMENT_HUB = "/texas-government";
const CONSTITUTIONAL_HISTORY = "/texas-politics/texas-constitutional-history";
const REPUBLIC_HISTORY = "/texas-politics/republic-of-texas-government-history";
const RECONSTRUCTION_REPUBLICANS = "/texas-politics/reconstruction-republicans";

const COMMON_SOURCES = [
  { href: "https://www.tsl.texas.gov/treasures/constitution/index.html", label: "Texas State Library and Archives Commission: Texas constitutional history" },
  { href: "https://www.tsl.texas.gov/arc/legislative-records", label: "Texas State Library and Archives Commission: legislative records" },
  { href: "https://www.tshaonline.org/handbook/entries/reconstruction", label: "Handbook of Texas: Reconstruction" },
  { href: "https://www.tshaonline.org/handbook/entries/civil-war", label: "Handbook of Texas: Civil War" },
  { href: "https://www.tshaonline.org/handbook/entries/constitutional-conventions", label: "Handbook of Texas: constitutional conventions" },
];

export const TEXAS_SECESSION_CONVENTION_1861: PoliticalHistoryAuthorityPage = {
  slug: "texas-secession-convention-1861",
  title: "Texas Secession Convention of 1861: Delegates, Ordinance and State Power",
  seoTitle: "Texas Secession Convention of 1861: Ordinance, Delegates and Government | KeepTXRed",
  description: "A source-backed guide to the Texas Secession Convention of 1861, its ordinance, referendum, conflict with Governor Sam Houston and transfer of Texas into the Confederacy.",
  eyebrow: "Texas secession and Civil War government",
  intro: "Texas entered 1861 with a functioning state government under the Constitution of 1845, a Unionist governor in Sam Houston and a rapidly intensifying sectional crisis. The Secession Convention became the institution through which secessionists attempted to speak for the state outside the ordinary legislative process. Its delegates drafted an ordinance of secession, submitted it to voters, reconvened after ratification and then reshaped the state's constitutional allegiance to the United States. The convention also collided directly with Houston, who rejected the legal authority of the Confederate transition and refused to swear a required loyalty oath.",
  shortAnswer: "The Texas Secession Convention assembled in Austin on January 28, 1861. On February 1 delegates adopted an ordinance declaring that Texas's federal relationship with the United States was dissolved, subject to a statewide vote. Voters approved secession on February 23, and the ordinance took effect March 2. The convention then approved joining the Confederate States of America and required state officers to take an oath to the Confederacy. Governor Sam Houston refused; the convention declared his office vacant and Lieutenant Governor Edward Clark became governor. The episode demonstrates how an extraordinary convention displaced ordinary constitutional channels during a political emergency and changed the legal allegiance of Texas government before the Civil War began in earnest.",
  reviewed: REVIEWED,
  timeline: [
    { year: "December 1860", event: "Secessionists organize for a convention", meaning: "Local meetings and petitions build pressure for an extraordinary statewide convention after Abraham Lincoln's election." },
    { year: "January 21, 1861", event: "Texas Legislature authorizes cooperation", meaning: "Lawmakers recognize the convention process while attempting to preserve a role for state institutions." },
    { year: "January 28, 1861", event: "Convention assembles in Austin", meaning: "Delegates meet outside the ordinary legislative structure to decide Texas's relationship with the Union." },
    { year: "February 1, 1861", event: "Ordinance of secession adopted", meaning: "Delegates vote to dissolve the federal relationship, but make the action subject to popular ratification." },
    { year: "February 23, 1861", event: "Voters approve secession", meaning: "The referendum supplies popular approval for the ordinance by a large statewide majority." },
    { year: "March 2, 1861", event: "Secession ordinance takes effect", meaning: "Texas formally treats its Union relationship as ended on the anniversary of Texas independence." },
    { year: "March 16, 1861", event: "Houston refuses Confederate oath", meaning: "The convention declares the governorship vacant after Sam Houston will not swear allegiance to the Confederacy." },
    { year: "March 1861", event: "Edward Clark assumes governorship", meaning: "The lieutenant governor takes executive power as the Confederate constitutional transition is completed." },
  ],
  sections: [
    { heading: "1. The convention arose because secessionists did not trust ordinary state government to move fast enough", paragraphs: [
      "Abraham Lincoln's election in November 1860 accelerated a crisis that Texas institutions had not resolved. Governor Sam Houston opposed immediate secession and resisted calls for a convention, arguing for Unionist alternatives and warning about the cost of war. Secessionist organizers therefore used county meetings, petitions and a separately elected convention to create an extraordinary political body. The Legislature eventually cooperated with the process, but the convention was not simply another legislative session. It claimed a constituent power to alter the state's fundamental political relationship with the United States.",
      "That distinction matters because the central question was not an ordinary statute. Delegates asserted authority to decide whether the compact joining Texas to the Union continued to bind the state. Their logic drew on nineteenth-century ideas of state sovereignty and convention government, while opponents argued that the United States Constitution did not permit unilateral secession. The convention therefore combined constitutional theory, electoral politics and revolutionary action. It was simultaneously a legal proceeding in Texas and a direct challenge to federal constitutional supremacy." ] },
    { heading: "2. Delegates adopted secession but deliberately sent the ordinance to voters", paragraphs: [
      "On February 1 the convention approved an ordinance declaring the federal relationship between Texas and the other states dissolved. The vote among delegates was overwhelmingly in favor, but convention leaders still submitted the measure to a statewide referendum. That step gave the secession movement a broader democratic claim than delegate action alone. The campaign that followed was intense, and the electorate approved the ordinance on February 23 by a large margin, though pockets of Unionist opposition remained in parts of the state.",
      "The ordinance took effect March 2, 1861, the twenty-fifth anniversary of the Texas Declaration of Independence. The symbolism was intentional. Secessionists presented withdrawal from the United States as another assertion of Texas sovereignty. Yet the legal setting was fundamentally different from 1836: Texas was already a constitutional state in a federal union, and federal officials rejected the premise that a state could leave by unilateral act. The resulting dispute would ultimately be resolved by war and, after the war, by federal constitutional doctrine." ] },
    { heading: "3. The convention moved quickly from secession to Confederate affiliation", paragraphs: [
      "The convention did not intend to create a second independent Republic of Texas. Delegates linked Texas to the emerging Confederate government, selected representatives to Confederate institutions and revised the state's constitutional language to reflect the new allegiance. Texas government remained recognizably Texan—governor, Legislature, courts and county offices continued—but the superior constitutional relationship shifted from the United States to the Confederate States under the secessionist program.",
      "That transition created immediate administrative questions involving federal property, military installations, customs, arsenals and the status of officers who had sworn oaths under the United States. Confederate and Texas authorities moved to secure federal posts and supplies. The convention's work therefore reached far beyond rhetoric. It changed the legal assumptions under which officials acted and placed the state's military, financial and executive machinery on a wartime footing even before large-scale combat reached Texas." ] },
    { heading: "4. Sam Houston's removal exposed the collision between convention authority and elected office", paragraphs: [
      "Houston had been elected governor by Texas voters, but the convention demanded that state officials swear loyalty to the Confederacy. Houston refused. He did not deny that a majority of Texans had voted for secession; instead he rejected the convention's power to compel him to abandon his existing oath and warned that secession would bring enormous destruction. His refusal created an institutional confrontation over whether an extraordinary convention could effectively unseat a governor chosen under the standing state constitution.",
      "The convention declared the office vacant and Lieutenant Governor Edward Clark assumed the governorship. Houston did not use force to resist. The transfer demonstrated the convention's practical supremacy in the revolutionary moment, but it also left an enduring example of the danger inherent when emergency political bodies claim authority over established constitutional offices. For modern readers, the episode is useful precisely because it separates popularity, legal continuity and institutional power: all three were contested at once." ] },
    { heading: "5. The convention changed Texas government without erasing the state itself", paragraphs: [
      "Secession did not dissolve Texas's internal government. The state continued collecting revenue, electing or appointing officials, operating courts, calling militia and passing laws. What changed was the external constitutional order and the demands of war. The state became one component of the Confederacy while maintaining its own institutions, just as it had been one state within the United States. The 1861 constitutional revisions and wartime statutes adjusted those institutions to the new political alignment.",
      "This continuity is why the convention belongs inside a government-history authority cluster rather than only military history. The Civil War transformed executive power, conscription, finance, public safety and relations between Austin and local communities. After Confederate defeat, federal authorities treated the secession government as legally defective and required a new path back to representation. The convention's acts therefore set up the constitutional problems addressed by the 1866 and 1869 conventions and eventually the post-Reconstruction Constitution of 1876." ] },
  ],
  sources: COMMON_SOURCES,
  relatedLinks: [
    { href: "/texas-politics/constitution-of-1861-texas", label: "Texas Constitution of 1861", description: "How the state charter was rewritten for Confederate allegiance." },
    { href: "/texas-politics/texas-government-during-civil-war", label: "Texas government during the Civil War", description: "How wartime demands changed executive, legislative and local government." },
    { href: CONSTITUTIONAL_HISTORY, label: "Texas constitutional history", description: "The full sequence of Texas constitutional charters." },
    { href: REPUBLIC_HISTORY, label: "Republic of Texas government", description: "The earlier independent-government period often invoked by secessionists." },
    { href: GOVERNMENT_HUB, label: "Texas government today", description: "Current institutions descended from the nineteenth-century state framework." },
  ],
  faqs: [
    { question: "When did Texas vote to secede?", answer: "The convention adopted its ordinance on February 1, 1861. Texas voters approved it on February 23, and the ordinance took effect on March 2, 1861." },
    { question: "Why did Sam Houston leave the governorship?", answer: "Houston refused to take the loyalty oath required by the secession convention for Confederate allegiance. The convention declared the office vacant and Lieutenant Governor Edward Clark assumed the governorship." },
    { question: "Did the convention abolish Texas state government?", answer: "No. Texas retained its governor, Legislature, courts and local institutions, but changed its claimed constitutional allegiance from the United States to the Confederacy." },
  ],
};

export const CONSTITUTION_OF_1861_TEXAS: PoliticalHistoryAuthorityPage = {
  slug: "constitution-of-1861-texas",
  title: "Texas Constitution of 1861: Confederate-Era Government and Constitutional Change",
  seoTitle: "Texas Constitution of 1861: Confederate Government, Changes and History | KeepTXRed",
  description: "A source-backed explanation of the Texas Constitution of 1861, how it altered the 1845 charter for Confederate allegiance and how state institutions operated under it.",
  eyebrow: "Texas constitutional history",
  intro: "The Texas Constitution of 1861 did not invent an entirely new state government. It revised the Constitution of 1845 so Texas could operate as a member of the Confederate States of America. The familiar branches of government remained, as did many existing rights and offices, but references to the United States were replaced, Confederate allegiance was recognized and constitutional language was adjusted to the political assumptions of secession. The document is therefore best understood as a continuity charter produced by revolution: it preserved Texas institutions while changing the sovereign framework around them.",
  shortAnswer: "After Texans approved secession, the 1861 convention amended the state constitution to remove or alter provisions tied to the United States and to recognize Texas's place in the Confederacy. The governor, Legislature and judiciary continued to exist, and much of the 1845 structure remained intact. The constitution also reflected the slaveholding order that underlay secession and the Confederate political system. It governed Texas through the Civil War until Confederate defeat made the secession-era constitutional order untenable. Federal restoration policy then required new constitutional action, leading first to the Convention and Constitution of 1866 and later to the Reconstruction Constitution of 1869.",
  reviewed: REVIEWED,
  timeline: [
    { year: "1845", event: "Texas adopts its first state constitution", meaning: "The 1845 charter supplies most of the institutional framework later modified in 1861." },
    { year: "February 1861", event: "Secession convention approves withdrawal", meaning: "Delegates begin aligning Texas law with the emerging Confederate constitutional order." },
    { year: "March 1861", event: "Confederate allegiance replaces Union allegiance", meaning: "State constitutional language is revised while the basic state institutions continue." },
    { year: "1861", event: "Edward Clark becomes governor", meaning: "The executive transition after Sam Houston's refusal occurs under the new secessionist order." },
    { year: "1861–1863", event: "Francis Lubbock governs during expanding war", meaning: "Conscription, military supply and Confederate coordination become central state concerns." },
    { year: "1863–1865", event: "Pendleton Murrah serves as wartime governor", meaning: "Texas government operates as Confederate military fortunes deteriorate." },
    { year: "June 1865", event: "Confederate government collapses in Texas", meaning: "Union occupation makes the 1861 constitutional framework politically and legally unsustainable." },
    { year: "1866", event: "A new constitution replaces the wartime charter", meaning: "Texas begins formal restoration under presidential Reconstruction with a postwar constitutional convention." },
  ],
  sections: [
    { heading: "1. The 1861 document was a revision of the statehood constitution, not a clean-sheet charter", paragraphs: [
      "Texas had operated under the Constitution of 1845 since joining the United States. When secessionists prevailed in 1861, they needed a constitutional framework that would preserve the functioning state while changing its external allegiance. The convention therefore revised the existing charter rather than reconstructing every institution from the ground up. The Legislature remained bicameral, the governor remained the chief executive within the state and the judicial system continued under Texas authority.",
      "That continuity made practical sense. Courts still had cases, counties still needed officials, taxes still had to be collected and laws still had to be enforced. A revolutionary change in sovereignty did not eliminate the administrative needs of a large state. The constitution therefore shows how political revolutions often rely on inherited institutions even while repudiating the previous national framework. The same Texas offices could serve under the Union in 1860 and under the Confederacy in 1861 because the underlying state machinery remained largely recognizable." ] },
    { heading: "2. The central constitutional change was allegiance", paragraphs: [
      "References that assumed membership in the United States were removed or altered, and the constitutional relationship was redirected toward the Confederate States. That shift affected oaths, legal assumptions and the authority under which officials acted. In theory, Texas was no longer exercising powers reserved to a state within the United States but powers of a state within the Confederate federation. The secession convention treated that change as legitimate because it claimed Texas retained ultimate sovereignty to withdraw from the earlier Union.",
      "The United States government rejected that theory, and postwar constitutional law rejected secession as a lawful path out of the Union. But during the war, Texas officials operated on the Confederate premise. Understanding the charter on its own terms helps explain why wartime governors and legislators viewed Confederate military obligations, conscription and supply as constitutional state responsibilities even when those policies produced conflict inside Texas." ] },
    { heading: "3. The constitution reflected the slaveholding political order behind secession", paragraphs: [
      "The 1861 constitutional order cannot be separated from slavery. Texas's declaration explaining the causes of secession explicitly defended a social and economic system based on enslaved labor, and Confederate constitutional arrangements protected slavery. The Texas charter operated within that order. Enslaved people remained excluded from citizenship and political participation, while the legal system protected slave property and the racial hierarchy embedded in antebellum law.",
      "That fact matters for institutional history because emancipation after Confederate defeat was not simply a social change outside government. It destroyed a fundamental legal assumption of the 1861 regime. Any postwar constitution had to address freedom, civil status, labor, rights and the relationship between former Confederate officials and restored federal authority. The constitutional break after 1865 was therefore much deeper than the textual change from United States to Confederate allegiance four years earlier." ] },
    { heading: "4. Wartime government expanded practical state responsibilities even without creating a stronger constitutional executive", paragraphs: [
      "The written charter preserved familiar limits, but wartime conditions pushed state officials into extraordinary questions involving militia, conscription, frontier defense, supply, transportation and public order. Governors Francis Lubbock and Pendleton Murrah worked with Confederate authorities while also defending Texas interests. The Legislature addressed military support, finance and internal security. County and local institutions had to implement policies whose burdens fell directly on households and communities.",
      "This gap between formal constitutional structure and wartime practice is important. A constitution may remain stable on paper while the effective scope of government changes dramatically because of emergency conditions. Texas did not become a centralized state simply because it joined the Confederacy, but wartime necessity increased the importance of executive coordination and military administration. Those experiences later fed postwar arguments over whether Reconstruction government concentrated too much authority in Austin." ] },
    { heading: "5. Confederate defeat ended the constitutional system even before a replacement charter was ready", paragraphs: [
      "By spring 1865 the Confederacy was collapsing. Governor Murrah and other officials left as Union authority reached Texas, and federal military occupation displaced the secession-era political order. The 1861 constitution could no longer provide a workable claim to lawful government because it rested on Confederate allegiance. President Andrew Johnson appointed Andrew J. Hamilton provisional governor and directed Texas toward a convention that would repudiate secession, recognize emancipation and reorganize civil government.",
      "The transition highlights the temporary character of the 1861 charter. It is historically important not because it created today's system but because it shows the state government operating through an attempted change in sovereignty and then being forced back into the Union constitutional order after military defeat. The 1866 and 1869 constitutions that followed were competing answers to the question of what restored Texas government should look like." ] },
  ],
  sources: COMMON_SOURCES,
  relatedLinks: [
    { href: "/texas-politics/texas-secession-convention-1861", label: "Texas Secession Convention", description: "The extraordinary convention that produced the Confederate transition." },
    { href: "/texas-politics/texas-government-during-civil-war", label: "Texas government during the Civil War", description: "How the constitutional structure functioned under wartime pressure." },
    { href: "/texas-politics/constitution-of-1866-texas", label: "Texas Constitution of 1866", description: "The first postwar attempt to restore civil government." },
    { href: CONSTITUTIONAL_HISTORY, label: "Texas constitutional history", description: "The sequence from the Republic through the current 1876 charter." },
    { href: GOVERNMENT_HUB, label: "Texas government today", description: "Modern institutions descended from the state constitutional system." },
  ],
  faqs: [
    { question: "Was the 1861 Texas Constitution completely new?", answer: "No. It largely revised the 1845 state constitution so Texas institutions could operate under Confederate rather than United States allegiance." },
    { question: "How long did the 1861 Constitution govern Texas?", answer: "It operated during the Civil War period and became untenable after Confederate defeat in 1865. A new postwar constitution followed in 1866." },
    { question: "Did Texas keep its state institutions after secession?", answer: "Yes. The governor, Legislature, courts and local institutions continued, although they acted within the Confederate constitutional order and under wartime demands." },
  ],
};

export const TEXAS_GOVERNMENT_DURING_CIVIL_WAR: PoliticalHistoryAuthorityPage = {
  slug: "texas-government-during-civil-war",
  title: "Texas Government During the Civil War: Governors, Legislature and Wartime Power",
  seoTitle: "Texas Government During the Civil War: Governors, Legislature and State Power | KeepTXRed",
  description: "A source-backed guide to how Texas state government operated during the Civil War, including Governors Clark, Lubbock and Murrah, conscription, frontier defense, finance and Confederate coordination.",
  eyebrow: "Texas Civil War government",
  intro: "Texas experienced less sustained battlefield occupation than many Confederate states, but its government was transformed by war. Three governors served after Sam Houston's removal: Edward Clark, Francis R. Lubbock and Pendleton Murrah. The Legislature confronted military supply, frontier defense, conscription, currency disruption and assistance to soldiers' families. Confederate law increasingly reached into local life, while state officials sometimes cooperated with and sometimes resisted Richmond. The result was a wartime government that retained normal constitutional offices but operated under pressures far beyond anything the statehood constitution had anticipated.",
  shortAnswer: "From 1861 to 1865 Texas retained its governor, Legislature, courts and counties while functioning as a Confederate state. Edward Clark completed the executive transition after Sam Houston's removal. Francis Lubbock strongly supported Confederate mobilization and conscription. Pendleton Murrah served through the final war years and the collapse of Confederate authority. State government raised troops, supported frontier defense, managed supply and finance problems and implemented laws affecting manpower and property. Tension developed when Confederate conscription and military authority conflicted with state control. After Confederate defeat, Murrah left Texas and federal forces established authority, ending the wartime state government and beginning Reconstruction.",
  reviewed: REVIEWED,
  timeline: [
    { year: "March 1861", event: "Edward Clark becomes governor", meaning: "Sam Houston's refusal of a Confederate oath transfers the executive office to the lieutenant governor." },
    { year: "November 1861", event: "Francis Lubbock takes office", meaning: "A strong Confederate supporter becomes governor as mobilization expands." },
    { year: "1862", event: "Confederate conscription begins", meaning: "Mandatory military service increases direct friction between national military needs, state authority and local communities." },
    { year: "1862–1863", event: "Frontier and internal-security pressures intensify", meaning: "Texas must balance Confederate demands with protection of its own exposed western frontier and internal dissent." },
    { year: "November 1863", event: "Pendleton Murrah becomes governor", meaning: "The state enters its final wartime administration as Confederate prospects worsen." },
    { year: "1864", event: "Supply and finance problems deepen", meaning: "Inflation, transportation constraints and manpower shortages challenge state and local administration." },
    { year: "April–May 1865", event: "Confederate military collapse reaches Texas", meaning: "News of surrender elsewhere undermines the legitimacy and capacity of Texas Confederate government." },
    { year: "June 1865", event: "Union authority is established", meaning: "Murrah departs and federal military power opens the postwar Reconstruction period." },
  ],
  sections: [
    { heading: "1. Texas remained a constitutional state even as war redirected nearly every major policy", paragraphs: [
      "The Civil War did not suspend ordinary Texas offices. Governors were elected or succeeded under state law, legislators met, courts operated when conditions allowed and counties continued basic administration. Yet the war changed the subject matter of government. Recruitment, military organization, frontier protection, transportation, food, finance and the welfare of soldiers' families became dominant concerns. The machinery of a peacetime state had to serve a conflict involving national survival for the Confederacy.",
      "Texas's distance from the main eastern battlefields reduced some forms of destruction, but it also gave the state distinctive strategic roles. Texas supplied men, livestock and matériel, maintained routes toward Mexico and defended a long frontier. Government therefore faced simultaneous outward and inward obligations. Leaders were expected to support Confederate strategy while ensuring that Texas communities were not stripped of all manpower or left exposed to frontier threats." ] },
    { heading: "2. Governors Clark, Lubbock and Murrah represented different stages of the wartime state", paragraphs: [
      "Edward Clark entered office because the secession convention declared Sam Houston's governorship vacant. His brief administration oversaw the early transition from Union state to Confederate state. Francis Lubbock, elected later in 1861, became closely associated with vigorous mobilization. He supported Confederate conscription and worked to increase Texas's contribution to the war, reflecting the belief that the state could survive only if the Confederacy survived.",
      "Pendleton Murrah took office in late 1863, when military conditions were more difficult and public strain was deeper. His administration confronted shortages, desertion, frontier defense and growing uncertainty about Confederate durability. The progression from Clark to Lubbock to Murrah is therefore more than a list of governors: it tracks the movement from revolutionary enthusiasm through mass mobilization to institutional collapse." ] },
    { heading: "3. Conscription tested the boundary between Confederate and state authority", paragraphs: [
      "The Confederate Conscription Act of 1862 asserted national authority over military manpower. Supporters argued that centralized recruitment was necessary because voluntary enlistment could no longer sustain the armies. Critics objected to exemptions, administrative abuses and the displacement of state control over militia. In Texas, these disputes intersected with frontier defense, where residents argued that removing local men could leave settlements vulnerable.",
      "State officials negotiated, protested and cooperated depending on the issue. This was a federalism dispute inside the Confederacy: a government formed partly in the name of states' rights still claimed substantial national war powers. For Texas government history, the lesson is that constitutional structure does not prevent intergovernmental conflict. Emergency demands can push a central government to assert authority that state leaders view as necessary in principle but excessive in application." ] },
    { heading: "4. Finance and supply made local administration part of the war effort", paragraphs: [
      "War finance affected nearly every household. Confederate currency depreciated, prices rose and transportation networks became strained. State and county governments dealt with taxation, procurement, relief and the movement of military supplies. Families of soldiers often depended on local assistance, while farms and ranches faced labor shortages and requisitions. Government became visible not only through military orders but through everyday questions about food, horses, clothing and money.",
      "Texas's connection to Mexico also mattered. Trade through the Rio Grande provided a route for cotton exports and imported goods despite the Union blockade, making border commerce strategically important. State policy existed within a larger Confederate economy, but Texas geography gave officials special concerns that Richmond could not fully manage from afar. Those circumstances reinforced the recurring tension between centralized military policy and local knowledge." ] },
    { heading: "5. Confederate defeat produced an institutional vacuum that Reconstruction had to fill", paragraphs: [
      "By 1865 the legal assumptions of wartime government were collapsing. Confederate armies surrendered in the eastern and trans-Mississippi theaters, and Union forces moved to establish authority in Texas. Governor Murrah left for Mexico rather than preside over a federally controlled transition. The state still had communities, courts, records and local officials, but the Confederate constitutional basis under which the government had operated was no longer recognized by victorious federal authorities.",
      "That vacuum explains the first Reconstruction steps. President Andrew Johnson appointed Andrew J. Hamilton provisional governor, and Texans were directed toward a convention that could repudiate secession and reorganize civil government. The war therefore ended not only with military defeat but with a constitutional problem: who had lawful authority to govern Texas, who could vote or hold office, and what rights emancipation required the state to recognize. Those questions dominate the 1866 and 1869 constitutional periods." ] },
  ],
  sources: COMMON_SOURCES,
  relatedLinks: [
    { href: "/texas-politics/texas-secession-convention-1861", label: "Texas Secession Convention", description: "How Texas entered the Confederate constitutional order." },
    { href: "/texas-politics/constitution-of-1861-texas", label: "Texas Constitution of 1861", description: "The charter under which wartime institutions operated." },
    { href: "/texas-politics/texas-reconstruction-government", label: "Texas Reconstruction government", description: "How federal restoration reshaped state authority after defeat." },
    { href: CONSTITUTIONAL_HISTORY, label: "Texas constitutional history", description: "The constitutional sequence before and after the war." },
    { href: GOVERNMENT_HUB, label: "Texas government today", description: "Current institutions shaped by the postwar constitutional settlement." },
  ],
  faqs: [
    { question: "Who governed Texas during the Civil War?", answer: "After Sam Houston's removal, Edward Clark served briefly, followed by Francis R. Lubbock and then Pendleton Murrah through the final wartime period." },
    { question: "Did Texas state government shut down during the war?", answer: "No. The governor, Legislature, courts and counties continued, but wartime military, finance and supply issues dominated government." },
    { question: "Why did Confederate conscription cause conflict in Texas?", answer: "Conscription asserted national Confederate control over manpower while Texas leaders and communities worried about state militia authority, frontier defense, exemptions and local needs." },
  ],
};

export const TEXAS_RECONSTRUCTION_GOVERNMENT: PoliticalHistoryAuthorityPage = {
  slug: "texas-reconstruction-government",
  title: "Texas Reconstruction Government: Military Rule, Readmission and State Power",
  seoTitle: "Texas Reconstruction Government: Military Rule, Readmission and State Power | KeepTXRed",
  description: "A source-backed guide to Texas government during Reconstruction, from provisional rule and the 1866 convention through military administration, the 1869 Constitution and readmission in 1870.",
  eyebrow: "Texas Reconstruction government",
  intro: "Confederate defeat did not automatically restore Texas to ordinary participation in the United States. Between 1865 and 1870 the state moved through presidential Reconstruction, a provisional governorship, a new constitution, congressional Reconstruction, military supervision, voter registration, another constitutional convention and eventual readmission to congressional representation. At the same time emancipation transformed the legal status of hundreds of thousands of Texans, and Black men entered the electorate and public office. Reconstruction was therefore a struggle over both federal-state relations and the basic definition of citizenship inside Texas government.",
  shortAnswer: "President Andrew Johnson appointed Andrew J. Hamilton provisional governor in 1865 and required Texas to reorganize civil government. The 1866 convention repudiated secession and recognized emancipation but did not satisfy the later requirements imposed by Congress. Under the Reconstruction Acts, Texas became part of the Fifth Military District with Louisiana, voter registration was supervised and former Confederates faced political disabilities. A convention drafted the Constitution of 1869, which expanded state authority and recognized a new electorate that included Black men. Republican Edmund J. Davis became governor. Texas ratified the Fourteenth and Fifteenth Amendments and regained congressional representation in 1870. Reconstruction politics then remained fiercely contested until Democrats returned to statewide control in 1874 and wrote the Constitution of 1876.",
  reviewed: REVIEWED,
  timeline: [
    { year: "June 1865", event: "Federal authority reaches Texas", meaning: "Union military power ends the Confederate state government's practical control." },
    { year: "June 1865", event: "Andrew J. Hamilton appointed provisional governor", meaning: "Presidential Reconstruction begins reorganizing civil government under federal conditions." },
    { year: "1866", event: "Postwar constitutional convention meets", meaning: "Texas repudiates secession and creates a new charter, but federal policy soon becomes more demanding." },
    { year: "March 1867", event: "Reconstruction Acts impose military administration", meaning: "Texas enters the Fifth Military District and political restoration becomes subject to congressional requirements." },
    { year: "1868–1869", event: "Reconstruction convention drafts new constitution", meaning: "Delegates address suffrage, education, executive power and state institutions under federal supervision." },
    { year: "1869", event: "Voters ratify Constitution of 1869", meaning: "A new legal framework supports readmission and a broader electorate." },
    { year: "January 1870", event: "Edmund J. Davis becomes governor", meaning: "Republican state government begins under the Reconstruction constitution." },
    { year: "March 30, 1870", event: "Texas readmitted to congressional representation", meaning: "Federal recognition completes the formal restoration process, though political conflict continues." },
  ],
  sections: [
    { heading: "1. Reconstruction began because military defeat left no accepted civilian constitutional order", paragraphs: [
      "When Confederate authority collapsed in Texas, the state could not simply resume its old relationship with Washington. The federal government considered secession legally ineffective but still required former Confederate states to establish governments compatible with emancipation and restored national authority. President Andrew Johnson appointed Andrew J. Hamilton provisional governor in June 1865 and directed the state toward a convention. This first phase, often called presidential Reconstruction, attempted a relatively rapid restoration through state action supervised by the executive branch.",
      "The core difficulty was that the prewar political order had depended on slavery, and the wartime order had repudiated federal allegiance. Restoring government required answers to questions that were both constitutional and practical: Were former Confederate leaders eligible for office? What civil rights did freedpeople possess? Who could vote? Which debts were valid? How would courts treat contracts and property arrangements rooted in slavery? Reconstruction was therefore government reconstruction in the literal sense." ] },
    { heading: "2. The 1866 settlement proved too limited for the Republican Congress", paragraphs: [
      "Texas delegates met in 1866, acknowledged the end of slavery and attempted to restore state government. James W. Throckmorton became governor under the new constitution. But national politics changed rapidly. Republicans in Congress concluded that presidential Reconstruction did not adequately protect freedpeople or create loyal governments. Congress enacted the Reconstruction Acts over President Johnson's veto and placed former Confederate states, including Texas, under military supervision.",
      "Texas and Louisiana formed the Fifth Military District. Military commanders gained authority over the restoration process, and federal rules governed voter registration and eligibility. The state government's autonomy was therefore sharply limited. Throckmorton was removed by military authority in 1867, and Elisha M. Pease was appointed governor. This period became a central historical grievance for later Democrats, who portrayed Reconstruction as coercive centralized rule." ] },
    { heading: "3. A new electorate transformed Texas politics", paragraphs: [
      "Congressional Reconstruction enfranchised Black men while temporarily restricting some former Confederates. The new electorate changed convention politics, party organization and public office. Black Texans participated as voters, delegates, legislators and local officials. Their participation was not symbolic. It affected education, civil rights, taxation and the organization of the Republican Party in Texas, whose early coalition included Black voters, white Unionists and newcomers from other states.",
      "That transformation generated intense resistance. Violence, intimidation and political exclusion became recurring tools in the struggle over Reconstruction. Government therefore had to address not merely electoral procedure but whether newly recognized citizens could safely exercise political rights. The conflict between formal constitutional guarantees and real-world enforcement became one of the defining issues of the period and remains essential context for later voting-rights history." ] },
    { heading: "4. The Constitution of 1869 strengthened state institutions in ways opponents associated with centralized rule", paragraphs: [
      "The 1868–1869 convention produced a constitution that expanded public education, strengthened executive and administrative capacity and reflected the requirements of congressional Reconstruction. The charter supported a government capable of enforcing new statewide policies in a society undergoing enormous legal change. That centralizing tendency was defended as necessary to protect rights and rebuild institutions, but it became politically toxic among opponents who preferred stronger local control and narrower executive power.",
      "Republican Edmund J. Davis won the governorship in the election held under the new framework. His administration became especially controversial for policing, election administration and executive authority. Supporters viewed stronger state institutions as necessary in the face of violence and resistance; opponents viewed them as evidence of Reconstruction excess. Those competing interpretations later shaped the deliberate weakening and fragmentation of state power in the Constitution of 1876." ] },
    { heading: "5. Readmission in 1870 ended formal restoration but not Reconstruction politics", paragraphs: [
      "Texas met federal conditions that included ratification of the Fourteenth and Fifteenth Amendments, and Congress restored the state's representation in 1870. Formal readmission did not end the political struggle. Republican government remained in power in Austin, while Democrats rebuilt organization and challenged Reconstruction policies. By the 1873 election, Democrats had won statewide control, and Richard Coke eventually took office in January 1874 after a tense transition with the Davis administration.",
      "The next constitutional convention was therefore shaped by reaction. Delegates in 1875 sought to prevent the concentration of authority they associated with Reconstruction government. The resulting Constitution of 1876 dispersed executive power, constrained spending, limited regular legislative sessions and embedded numerous policy restrictions in constitutional text. Modern Texas government still carries that institutional reaction, making Reconstruction indispensable to understanding why state power is divided the way it is today." ] },
  ],
  sources: COMMON_SOURCES,
  relatedLinks: [
    { href: "/texas-politics/constitution-of-1866-texas", label: "Texas Constitution of 1866", description: "The first postwar constitutional settlement." },
    { href: "/texas-politics/constitution-of-1869-texas", label: "Texas Constitution of 1869", description: "The congressional Reconstruction charter." },
    { href: RECONSTRUCTION_REPUBLICANS, label: "Republicans during Reconstruction", description: "Party organization, Black political leadership and the Davis era." },
    { href: CONSTITUTIONAL_HISTORY, label: "Texas constitutional history", description: "How Reconstruction connects to the 1876 constitutional reaction." },
    { href: GOVERNMENT_HUB, label: "Texas government today", description: "The modern divided-power system shaped by the post-Reconstruction settlement." },
  ],
  faqs: [
    { question: "When was Texas readmitted after the Civil War?", answer: "Congress restored Texas to representation on March 30, 1870, after the state met Reconstruction requirements including ratification of the Fourteenth and Fifteenth Amendments." },
    { question: "Was Texas under military rule during Reconstruction?", answer: "Yes. Under the Reconstruction Acts, Texas and Louisiana formed the Fifth Military District and federal military commanders supervised important parts of political restoration." },
    { question: "Why does Reconstruction matter to modern Texas government?", answer: "The Constitution of 1876 was written partly in reaction to Reconstruction-era centralization, so today's fragmented executive and many constitutional limits reflect that political memory." },
  ],
};

export const CONSTITUTION_OF_1866_TEXAS: PoliticalHistoryAuthorityPage = {
  slug: "constitution-of-1866-texas",
  title: "Texas Constitution of 1866: Presidential Reconstruction and the First Postwar Charter",
  seoTitle: "Texas Constitution of 1866: Reconstruction, Emancipation and State Government | KeepTXRed",
  description: "A source-backed guide to the Texas Constitution of 1866, the first postwar attempt to restore civil government after Confederate defeat and emancipation.",
  eyebrow: "Texas Reconstruction constitutions",
  intro: "The Constitution of 1866 was Texas's first attempt to rebuild state government after the Confederacy collapsed. Written under presidential Reconstruction, it repudiated secession, acknowledged the end of slavery and reorganized civil authority under conditions set by President Andrew Johnson. Yet it stopped short of the broader political transformation that congressional Republicans soon demanded. As a result, the charter had a short life. Its importance lies in showing the gap between the restoration policy pursued by the White House in 1865–1866 and the more sweeping Reconstruction program Congress imposed beginning in 1867.",
  shortAnswer: "Texas delegates met in 1866 under provisional Governor Andrew J. Hamilton to create a constitution acceptable for restoration to the Union. The document declared secession null, recognized emancipation and adjusted state institutions to the postwar legal order. James W. Throckmorton was elected governor under the charter. But the constitution did not establish Black male suffrage, and congressional Republicans concluded that former Confederate states had not created governments that adequately protected freedpeople or national authority. The Reconstruction Acts of 1867 placed Texas under military supervision, Throckmorton was removed, and a new convention drafted the Constitution of 1869. The 1866 charter therefore represents an interrupted first restoration rather than the final postwar settlement.",
  reviewed: REVIEWED,
  timeline: [
    { year: "June 1865", event: "Andrew J. Hamilton appointed provisional governor", meaning: "Federal executive policy begins organizing a loyal civilian state government." },
    { year: "February 1866", event: "Constitutional convention assembles", meaning: "Delegates take up secession, emancipation, state offices and restoration to the Union." },
    { year: "1866", event: "Secession repudiated", meaning: "The convention rejects the legal basis of the Confederate-era withdrawal." },
    { year: "1866", event: "Emancipation incorporated into state law", meaning: "The new charter accepts the destruction of slavery as part of the postwar order." },
    { year: "June 1866", event: "Voters ratify the constitution", meaning: "Texas attempts to resume ordinary civil government under presidential Reconstruction." },
    { year: "August 1866", event: "James W. Throckmorton becomes governor", meaning: "An elected state administration replaces provisional executive rule." },
    { year: "March 1867", event: "Congress passes Reconstruction Acts", meaning: "The federal restoration framework changes and the 1866 settlement loses controlling status." },
    { year: "1867", event: "Throckmorton removed by military authority", meaning: "Congressional Reconstruction displaces the government created under the 1866 charter." },
  ],
  sections: [
    { heading: "1. The 1866 convention tried to restore Texas quickly under President Johnson's policy", paragraphs: [
      "President Andrew Johnson favored rapid restoration of former Confederate states through provisional governors, loyalty requirements and state conventions. In Texas he appointed Andrew J. Hamilton, a Unionist, to guide the transition. Delegates called under that framework had to confront the most immediate legal consequences of defeat. The state could not maintain its secession ordinance or preserve slavery, and it needed a constitution that would permit normal elections, courts and legislation to resume.",
      "The convention therefore operated with a practical restoration goal. It did not begin from the assumption that every aspect of antebellum Texas government should be replaced. Like the 1861 convention, it preserved much inherited structure. But unlike 1861, it had to reverse a failed constitutional revolution and reattach Texas government to the United States under federal conditions." ] },
    { heading: "2. Repudiating secession was necessary, but it did not settle every consequence of the war", paragraphs: [
      "The convention declared the secession ordinance null and accepted the end of slavery. Those steps were indispensable to any restoration. Yet deeper questions remained. Emancipation had transformed labor and civil status for formerly enslaved Texans, but the state political system did not immediately recognize Black male suffrage or full political equality. Former Confederate elites also sought to regain control of state institutions quickly.",
      "This tension explains why the 1866 constitution looked more acceptable to President Johnson than to congressional Republicans. Johnson's approach emphasized restoration of loyal state governments. Congress increasingly emphasized enforceable civil and political rights and doubted whether governments dominated by former Confederates would protect freedpeople. The constitution became caught between those competing national visions." ] },
    { heading: "3. The charter restored elected civil government but did not end federal scrutiny", paragraphs: [
      "Voters ratified the constitution and elected James W. Throckmorton governor. Texas therefore appeared to be moving back toward ordinary state government, with elected executive and legislative institutions replacing provisional administration. Courts and local offices could be reorganized, laws enacted and the practical work of government resumed under a postwar charter.",
      "But federal recognition was not solely a Texas decision. Congress controlled seating of representatives and senators and could impose conditions on former Confederate states. The political status of Texas therefore remained contingent. This is an important feature of Reconstruction federalism: a state could possess functioning local institutions while still lacking full participation in national legislative government." ] },
    { heading: "4. Congressional Reconstruction overtook the 1866 settlement", paragraphs: [
      "The 1866 congressional elections strengthened Republicans opposed to Johnson's restoration policy. Congress then enacted the Reconstruction Acts in 1867 over presidential vetoes. These laws treated the existing southern governments as provisional, divided the South into military districts and established new requirements for voter registration and constitutional conventions. Texas was paired with Louisiana in the Fifth Military District.",
      "The shift meant that the 1866 constitution no longer represented the final route to readmission. Military authority could remove officials, and Throckmorton was removed in 1867. A new political electorate was organized under federal law, including Black men who had been excluded from voting under the earlier settlement. The state was directed toward another constitutional convention." ] },
    { heading: "5. The short life of the charter makes it a useful marker between two Reconstruction strategies", paragraphs: [
      "The Constitution of 1866 governed during a narrow window between Confederate defeat and congressional Reconstruction. Its institutional significance lies less in long-term structural innovations than in the political assumptions it embodied: rapid restoration, preservation of much existing state machinery, formal acceptance of emancipation and limited political transformation. Those assumptions proved unacceptable to the congressional majority.",
      "The Constitution of 1869 emerged from a different framework emphasizing broader suffrage, stronger state institutions and federal enforcement. The contrast between the two documents shows why Reconstruction cannot be treated as one single policy. Texas passed through competing federal programs before readmission, and the 1876 constitution would later react against the government associated with the second phase." ] },
  ],
  sources: COMMON_SOURCES,
  relatedLinks: [
    { href: "/texas-politics/texas-reconstruction-government", label: "Texas Reconstruction government", description: "The wider political transition surrounding the 1866 charter." },
    { href: "/texas-politics/constitution-of-1869-texas", label: "Texas Constitution of 1869", description: "The congressional Reconstruction constitution that replaced the 1866 settlement." },
    { href: "/texas-politics/texas-government-during-civil-war", label: "Civil War government", description: "The wartime constitutional order that collapsed in 1865." },
    { href: CONSTITUTIONAL_HISTORY, label: "Texas constitutional history", description: "All major Texas constitutions in sequence." },
    { href: GOVERNMENT_HUB, label: "Texas government today", description: "Current institutions ultimately rooted in the post-Reconstruction charter." },
  ],
  faqs: [
    { question: "Why did Texas write a constitution in 1866?", answer: "Confederate defeat invalidated the secession-era order, and President Andrew Johnson required a restored civil government that repudiated secession and accepted emancipation." },
    { question: "Why did the 1866 Constitution last such a short time?", answer: "Congress rejected the broader presidential Reconstruction settlement and imposed military reconstruction and new political requirements beginning in 1867." },
    { question: "Did the 1866 Constitution give Black men voting rights?", answer: "No. The failure to create a broader political settlement was one reason congressional Republicans demanded a new Reconstruction process." },
  ],
};

export const CONSTITUTION_OF_1869_TEXAS: PoliticalHistoryAuthorityPage = {
  slug: "constitution-of-1869-texas",
  title: "Texas Constitution of 1869: Reconstruction Government, Education and Executive Power",
  seoTitle: "Texas Constitution of 1869: Reconstruction Government and Executive Power | KeepTXRed",
  description: "A source-backed guide to the Texas Constitution of 1869, its Reconstruction-era expansion of state authority, public education, suffrage and the government of Edmund J. Davis.",
  eyebrow: "Texas Reconstruction constitutions",
  intro: "The Constitution of 1869 was written under congressional Reconstruction and became the governing charter for Texas's readmission to congressional representation. It recognized a transformed electorate, provided stronger state institutions and created a framework for public education and administration that opponents later condemned as excessively centralized. Republican Edmund J. Davis governed under this constitution, and disputes over his administration became inseparable from disputes over the charter itself. The Constitution of 1876 would be designed in substantial part as a reaction against this Reconstruction model.",
  shortAnswer: "Delegates elected under the Reconstruction Acts met in 1868–1869 and produced a constitution that reflected federal readmission requirements and the political participation of Black men. The charter strengthened executive and administrative authority, supported a statewide public-school system and operated within a broader Reconstruction framework of civil and political rights. Voters ratified it in 1869, and Edmund J. Davis became governor. Texas ratified the Fourteenth and Fifteenth Amendments and was readmitted to congressional representation in 1870. Democrats returned to statewide power after the 1873 election and soon called the 1875 convention, whose Constitution of 1876 dispersed executive authority and imposed tighter limits on government.",
  reviewed: REVIEWED,
  timeline: [
    { year: "1867", event: "Reconstruction Acts reshape restoration", meaning: "Texas enters military reconstruction and must organize a new constitutional convention under federal rules." },
    { year: "1868", event: "Convention begins", meaning: "Delegates elected by the Reconstruction electorate start drafting a new state charter." },
    { year: "1869", event: "Convention completes constitution", meaning: "The document establishes the framework for restored government and readmission." },
    { year: "1869", event: "Voters ratify charter", meaning: "Texas approves the new constitution and holds elections under its provisions." },
    { year: "January 1870", event: "Edmund J. Davis takes office", meaning: "Republican executive government begins under the Reconstruction constitution." },
    { year: "March 1870", event: "Texas regains congressional representation", meaning: "Readmission restores formal participation in national legislative government." },
    { year: "1873", event: "Democrats win statewide election", meaning: "The political coalition opposed to Reconstruction government gains control." },
    { year: "1875–1876", event: "New convention replaces the charter", meaning: "Delegates write a constitution intended to constrain the kind of state power associated with the 1869 regime." },
  ],
  sections: [
    { heading: "1. The 1869 charter came from congressional rather than presidential Reconstruction", paragraphs: [
      "The constitutional process that produced the 1869 document differed fundamentally from the 1866 convention. Congress had enacted the Reconstruction Acts, military officials supervised the restoration framework and voter registration included Black men while temporarily excluding some former Confederates. The convention electorate was therefore broader and politically different from the one that produced the first postwar charter.",
      "That changed who could influence the constitutional agenda. Republican delegates, including representatives of the newly enfranchised Black electorate, supported stronger guarantees for a reconstructed political order. Debates were contentious and the convention itself experienced factional conflict, but the resulting constitution reflected the federal conditions Texas had to meet for readmission." ] },
    { heading: "2. Education became a major statewide constitutional responsibility", paragraphs: [
      "Reconstruction Republicans viewed public education as a central institution of freedom and state development. The 1869 constitution provided for a more organized statewide school system and stronger state responsibility than many opponents preferred. In a state where educational opportunity had been highly unequal and where formerly enslaved children had been denied legal access to schooling, public education was directly connected to the meaning of emancipation.",
      "The school provisions also became part of the broader argument about centralization. Supporters saw statewide standards and administration as necessary to build a functioning system across unequal local communities. Critics saw taxes, bureaucracy and state supervision as intrusions on local control. That same structural argument—state capacity versus decentralized authority—would reappear when the 1875 convention rewrote the constitution." ] },
    { heading: "3. Executive and administrative power became the most politically explosive feature", paragraphs: [
      "The 1869 framework permitted stronger centralized administration than later Texans would accept under the 1876 constitution. Governor Edmund J. Davis used state authority in areas including policing and election administration during a period of serious political violence. To supporters, the capacity to enforce law and protect political rights was indispensable. To opponents, the same tools represented partisan coercion and executive overreach.",
      "This disagreement shaped Texas constitutional memory. The later plural executive, limited appointments and detailed restraints of the 1876 charter were not abstract design preferences. They were responses to a recent government whose opponents believed had concentrated too much authority in the governor and state administration. Understanding the 1869 constitution therefore explains structural features that still distinguish Texas from states with stronger unified executives." ] },
    { heading: "4. The constitution provided the legal vehicle for readmission", paragraphs: [
      "Ratification of a federally acceptable constitution was one of the conditions for restoration of congressional representation. Texas also had to ratify constitutional amendments protecting citizenship and voting rights. With those requirements met, Congress restored representation in 1870. The state had again become a fully participating member of the Union in formal political terms, even though federal troops and Reconstruction enforcement remained part of the wider southern landscape.",
      "The significance of readmission was institutional. Texas representatives and senators could again sit in Congress, and the state government possessed a constitution recognized within the federal framework. Yet formal restoration did not resolve partisan conflict over who should control the state or how much power that government should exercise." ] },
    { heading: "5. Democratic restoration turned the 1869 charter into the target of the next constitutional convention", paragraphs: [
      "Democrats rebuilt political strength and won the 1873 statewide election. Richard Coke's eventual accession to the governorship symbolized the end of Republican statewide control. The new majority regarded many Reconstruction institutions as illegitimate or excessive and sought a constitutional structure that would prevent a similar concentration of authority in the future.",
      "The convention of 1875 answered that demand. Delegates limited executive power, dispersed statewide authority among separately elected officers, constrained spending and debt and restricted legislative sessions. Voters ratified the Constitution of 1876, which remains the foundation of Texas government. In that sense, the 1869 constitution survives indirectly: many features of modern Texas government are designed specifically not to resemble it." ] },
  ],
  sources: COMMON_SOURCES,
  relatedLinks: [
    { href: "/texas-politics/texas-reconstruction-government", label: "Texas Reconstruction government", description: "Military administration, readmission and the broader federal-state transition." },
    { href: "/texas-politics/constitution-of-1866-texas", label: "Texas Constitution of 1866", description: "The earlier presidential Reconstruction settlement." },
    { href: "/texas-politics/texas-constitutional-convention-1875", label: "Texas Constitutional Convention of 1875", description: "The convention that reacted against the 1869 government." },
    { href: RECONSTRUCTION_REPUBLICANS, label: "Republicans during Reconstruction", description: "The political coalition and leaders who operated under the charter." },
    { href: CONSTITUTIONAL_HISTORY, label: "Texas constitutional history", description: "How the 1869 charter fits the full constitutional sequence." },
  ],
  faqs: [
    { question: "Why was the Texas Constitution of 1869 controversial?", answer: "Opponents associated it with Reconstruction, stronger executive administration, statewide policing and education policies they viewed as excessively centralized." },
    { question: "Did the 1869 Constitution help Texas regain representation in Congress?", answer: "Yes. Ratifying a federally acceptable constitution and meeting Reconstruction requirements were central steps toward congressional readmission in 1870." },
    { question: "How did the 1869 Constitution influence the Constitution of 1876?", answer: "The 1876 convention deliberately dispersed and limited state power in reaction to institutions and policies associated with the Reconstruction charter." },
  ],
};

export const TEXAS_CONSTITUTIONAL_CONVENTION_1875: PoliticalHistoryAuthorityPage = {
  slug: "texas-constitutional-convention-1875",
  title: "Texas Constitutional Convention of 1875: The Governmental Reset Behind the 1876 Constitution",
  seoTitle: "Texas Constitutional Convention of 1875: Origins of the 1876 Constitution | KeepTXRed",
  description: "A source-backed guide to the Texas Constitutional Convention of 1875, why delegates rejected Reconstruction-era centralization and how they designed the governmental framework still used today.",
  eyebrow: "Texas constitutional convention of 1875",
  intro: "The Texas Constitutional Convention of 1875 is the institutional hinge between Reconstruction government and modern Texas. Democratic leaders who had regained statewide control wanted a charter that would prevent the concentration of executive and administrative authority they associated with the Constitution of 1869 and Governor Edmund J. Davis. Delegates responded by dividing power, limiting government, restricting legislative sessions, constraining debt and preserving numerous elected offices. Voters ratified the resulting Constitution of 1876, and despite hundreds of amendments its basic architecture still defines Texas government.",
  shortAnswer: "After Democrats returned to statewide power, Texas voters authorized a constitutional convention that met in Austin from September to November 1875. The delegates were determined to replace the Reconstruction Constitution of 1869. They produced a charter that weakened the governor relative to many states, established a plural executive of separately elected statewide officers, limited regular legislative sessions, imposed restrictions on debt and taxation, protected local control and placed many policy rules directly in constitutional text. Voters ratified the new constitution in February 1876, and it took effect that spring. The convention's reaction to Reconstruction explains why modern Texas government remains unusually fragmented and constitutionally detailed.",
  reviewed: REVIEWED,
  timeline: [
    { year: "1873", event: "Democrats win statewide elections", meaning: "The anti-Reconstruction coalition gains the political power needed to pursue constitutional replacement." },
    { year: "January 1874", event: "Richard Coke takes office", meaning: "The transition from Davis to Democratic government ends Republican statewide control." },
    { year: "1875", event: "Voters authorize a convention", meaning: "Texans formally open the process of replacing the Reconstruction charter." },
    { year: "September 6, 1875", event: "Convention assembles in Austin", meaning: "Delegates begin rewriting the structure and limits of state government." },
    { year: "November 24, 1875", event: "Convention adjourns", meaning: "The completed constitution is sent to voters for ratification." },
    { year: "February 15, 1876", event: "Voters ratify the constitution", meaning: "Texas approves the charter that remains the basis of state government." },
    { year: "April 18, 1876", event: "Constitution takes effect", meaning: "The new plural-executive and limited-government framework becomes operative." },
    { year: "1876–present", event: "Amendments modify but do not replace the charter", meaning: "Texas repeatedly updates the document while retaining its core institutional design." },
  ],
  sections: [
    { heading: "1. The convention was a reaction to Reconstruction government, not merely a routine constitutional update", paragraphs: [
      "Delegates came to Austin with vivid memories of the Davis administration and the Constitution of 1869. Democrats and many conservative voters associated Reconstruction with military intervention, centralized policing, higher taxes, public debt and stronger executive authority. Whether every charge was fair mattered less politically than the shared determination to ensure that future governors could not wield comparable institutional power.",
      "The convention therefore began from suspicion rather than administrative ambition. Its central design problem was how to constrain government after a period its dominant coalition viewed as abusive. This helps explain why the resulting constitution contains so many limits, offices and detailed rules. Delegates preferred to lock restrictions into the constitution rather than leave broad discretion to future legislatures or executives." ] },
    { heading: "2. The plural executive deliberately prevented the governor from controlling a unified cabinet", paragraphs: [
      "Texas already had a tradition of electing statewide officials, but the 1876 framework entrenched a system in which major executive authority is divided among offices with their own electoral mandates. The governor possesses vetoes, appointments and special-session power, but does not simply hire and fire every major statewide executive officer. Attorneys general, comptrollers, land commissioners and other constitutional officers operate from separate legal bases.",
      "This fragmentation is one of the convention's clearest legacies. It can make coordinated administration more difficult, but that difficulty was partly the point. Delegates valued barriers against concentrated power. Modern disputes over whether a governor can direct another statewide official often trace back to this constitutional decision to create overlapping rather than hierarchical executive authority." ] },
    { heading: "3. Legislative limits made time and constitutional detail central to Texas policymaking", paragraphs: [
      "The constitution preserved a bicameral Legislature but limited regular sessions and embedded restrictions on subjects such as debt, taxation and appropriations. By placing policy constraints in constitutional text, delegates reduced legislative flexibility. Future lawmakers could not simply repeal a constitutional rule by ordinary majority vote; many changes would require another statewide constitutional amendment.",
      "The resulting system made the constitution unusually long and amendment-heavy over time. As Texas grew, voters repeatedly adjusted the charter rather than replace it. Today's biennial legislative rhythm, special-session politics and dense constitutional ballot all reflect the institutional choices made in 1875." ] },
    { heading: "4. Local control and elected offices reflected distrust of centralized administration", paragraphs: [
      "The convention favored local and electoral checks on state authority. Counties, courts and locally elected officers retained important roles. Many officials who might be appointed elsewhere were made directly accountable to voters. This arrangement distributed power geographically as well as institutionally, reducing the ability of one statewide administration to remake local government through appointments.",
      "The tradeoff is complexity. Texas voters select a large number of officials, and responsibility can be difficult to assign when powers overlap. Yet the system makes sense when viewed through the convention's historical objective. Delegates were less concerned with managerial simplicity than with preventing centralized domination. The modern structure is therefore a constitutional expression of nineteenth-century political memory." ] },
    { heading: "5. The 1876 Constitution survived because Texans amended it instead of replacing it", paragraphs: [
      "Voters ratified the convention's work in February 1876 and the charter took effect in April. Texas has since transformed from a rural post-Reconstruction state into a massive industrial and metropolitan economy, but the same constitution remains in force. Courts, finance, terms of office, local government and specialized programs have been adjusted through amendments, sometimes extensively.",
      "A major attempted rewrite in 1974 failed to produce a replacement. That failure reinforced the pattern of incremental constitutional change. The 1875 convention therefore continues to shape daily political reporting: the governor's limits, legislative schedule, elected judiciary, plural executive and constitutional-amendment elections all arise from the framework delegates built in explicit reaction to Reconstruction-era government." ] },
  ],
  sources: COMMON_SOURCES,
  relatedLinks: [
    { href: "/texas-politics/constitution-of-1869-texas", label: "Texas Constitution of 1869", description: "The Reconstruction charter the convention set out to replace." },
    { href: "/texas-politics/texas-reconstruction-government", label: "Texas Reconstruction government", description: "The political experience that shaped the delegates' distrust of centralized authority." },
    { href: CONSTITUTIONAL_HISTORY, label: "Texas constitutional history", description: "The complete sequence leading to the current charter." },
    { href: "/texas-government/history", label: "History of Texas government", description: "How the 1876 framework shaped modern state institutions." },
    { href: GOVERNMENT_HUB, label: "Texas government today", description: "The offices and powers that still operate under the convention's design." },
  ],
  faqs: [
    { question: "Why did Texas hold a constitutional convention in 1875?", answer: "The new Democratic majority wanted to replace the Reconstruction Constitution of 1869 and sharply limit the centralized state power associated with that era." },
    { question: "What did the 1875 convention change about the governor?", answer: "Its constitution dispersed executive authority among separately elected officials and limited the governor's ability to control a unified statewide administration." },
    { question: "Is the Constitution written in 1875 still in effect?", answer: "Yes. Voters ratified it in 1876, and although it has been amended many times, it remains the foundation of Texas state government." },
  ],
};

export const TEXAS_CIVIL_WAR_RECONSTRUCTION_AUTHORITY_PAGES = [
  TEXAS_SECESSION_CONVENTION_1861,
  CONSTITUTION_OF_1861_TEXAS,
  TEXAS_GOVERNMENT_DURING_CIVIL_WAR,
  TEXAS_RECONSTRUCTION_GOVERNMENT,
  CONSTITUTION_OF_1866_TEXAS,
  CONSTITUTION_OF_1869_TEXAS,
  TEXAS_CONSTITUTIONAL_CONVENTION_1875,
] as const;
