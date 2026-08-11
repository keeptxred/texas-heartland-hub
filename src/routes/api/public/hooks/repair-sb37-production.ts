import { createFileRoute } from "@tanstack/react-router";
import { stripLowValueInternalLinks } from "@/lib/content-quality";

const SLUG = "2026-08-09-sb37-texas-university-oversight";
const FEATURED_IMAGE = "https://upload.wikimedia.org/wikipedia/commons/a/a3/UT-Austin-Tower.jpg";

const BODY = {
  updated: "2026-08-11",
  intro: [
    "Texas public universities are moving deeper into implementation of [Senate Bill 37](/bills/texas/89/sb/37), a sweeping higher-education governance law that shifts more authority over curriculum and university decision-making toward governor-appointed governing boards.",
    "The law requires recurring reviews of general education curriculum, gives boards broader influence over academic programs and faculty governance, and creates new oversight mechanisms through the Texas Higher Education Coordinating Board. University leaders say implementation is underway, while faculty members and students have argued that the new structure can encourage self-censorship and weaken academic independence.",
  ],
  sections: [
    {
      heading: "What SB 37 changes",
      paragraphs: [
        "Senate Bill 37 changes the balance of authority inside Texas public universities by assigning governing boards a more direct role in reviewing curriculum, academic programs and faculty governance. The practical effect is that regents will not simply approve budgets and senior administrators; they will also have recurring responsibilities tied to what universities require students to study and how academic programs are evaluated.",
        "The law also expands oversight beyond the core curriculum. Boards must review low-enrollment minor degree and certificate programs and consider whether those offerings have enough student demand, academic value or workforce justification to continue. Supporters say that can reduce unnecessary costs and sharpen institutional priorities. Critics say a political governing board may not be the right body to make judgments that have traditionally rested with faculty and academic administrators.",
      ],
    },
    {
      heading: "The January 2027 curriculum review",
      paragraphs: [
        "The first major implementation deadline arrives January 1, 2027, when governing boards must complete and certify their initial general-education curriculum reviews. That process is supposed to examine whether required courses are foundational, whether they prepare students for civic and professional life, whether they align with accreditation expectations, and whether they add unnecessary cost or time to a degree.",
        "Those certifications will matter because they will provide the first statewide evidence of how individual university systems interpret their new authority. A narrow review could leave most existing requirements intact while improving documentation. A more aggressive review could remove or replace courses, change how core requirements are organized, or push universities toward a smaller set of classes that boards view as essential.",
      ],
    },
    {
      heading: "Supporters emphasize accountability",
      paragraphs: [
        "Supporters of SB 37 argue that publicly funded universities should answer more directly to governing boards appointed through the state's elected leadership. They contend that regents already carry fiduciary responsibility for institutions and therefore should have meaningful authority over the academic structures that drive tuition costs, graduation requirements and long-term program growth.",
        "That argument is especially important in a state where lawmakers regularly debate tuition, workforce preparation and whether university programs reflect the needs of Texas employers. From that perspective, recurring curriculum and program reviews are intended to force clearer explanations for why particular courses or credentials are required and whether students receive enough value for the time and money they spend earning them.",
      ],
    },
    {
      heading: "Critics warn about political pressure",
      paragraphs: [
        "Faculty members and higher-education advocates have raised a different concern: governing boards are political bodies, not academic departments. They argue that expanded board authority may cause professors, department chairs and administrators to anticipate political objections even when no board has formally ordered a course or program to change. That kind of anticipatory caution is the basis of the self-censorship concerns raised during the law's implementation.",
        "The dispute is therefore not only about which courses survive a review. It is also about who has the final say when academic judgment and political accountability point in different directions. Universities will have to show that they can comply with the statute while still preserving accreditation standards, legitimate research and the subject-matter expertise required to run complex degree programs.",
      ],
    },
    {
      heading: "What students and families may notice",
      paragraphs: [
        "For students, the most visible effects may eventually appear in core course requirements, the availability of certain minors and certificates, and the sequence of classes needed to graduate. Families comparing universities may also see systems explain more clearly why particular programs exist, what they cost to operate and how they connect to workforce demand or broader educational goals.",
        "The impact will not be identical at every campus because each governing board will make its own decisions inside the framework established by the Legislature. Large systems may preserve a wider range of programs because enrollment can support them, while smaller institutions may face more pressure to consolidate low-enrollment offerings or share courses across campuses.",
      ],
    },
    {
      heading: "What to watch next",
      paragraphs: [
        "The January 2027 compliance reports are the next major milestone. They should show which core requirements were retained, changed or removed and how governing boards explain those decisions. Texans should also watch meeting agendas and board materials because the most consequential choices may emerge through ordinary governance votes rather than a single statewide announcement.",
        "The longer-term test is whether SB 37 produces clearer, less costly academic pathways without narrowing legitimate scholarship or turning routine curriculum decisions into political contests. That judgment will require evidence from multiple university systems over several academic cycles, including changes in graduation requirements, program closures, accreditation findings and student outcomes.",
      ],
    },
  ],
  faq: [
    {
      q: "What does Texas Senate Bill 37 do?",
      a: "SB 37 expands governing-board oversight of public university curriculum, academic programs and faculty governance and requires recurring reviews of general education and certain low-enrollment programs.",
    },
    {
      q: "When is the first SB 37 core curriculum review due?",
      a: "The initial general-education curriculum review must be completed and certified by January 1, 2027.",
    },
    {
      q: "Who conducts the curriculum review under SB 37?",
      a: "The governing boards of Texas public university systems are responsible for the review, with oversight mechanisms involving the Texas Higher Education Coordinating Board.",
    },
  ],
  sources: [
    { label: "Texas Legislature Online", url: "https://capitol.texas.gov/" },
    { label: "Texas Tribune — source report", url: "https://www.texastribune.org/2026/07/28/university-texas-law-scrutiny-update-testimony-censorship-2/" },
  ],
  keyTakeaways: [
    "SB 37 gives governing boards a larger recurring role in curriculum and academic-program oversight.",
    "The first general-education curriculum review must be certified by January 1, 2027.",
    "Supporters emphasize accountability and cost; critics emphasize academic independence and political pressure.",
    "The first compliance reports will show how broadly regents use the authority granted by the law.",
  ],
};

async function repair() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const sanitizedBody = stripLowValueInternalLinks(BODY);
  const { data, error } = await supabaseAdmin
    .from("daily_articles")
    .update({
      body_json: sanitizedBody as never,
      featured_image_url: FEATURED_IMAGE,
      image_alt_text: "University of Texas at Austin tower and Littlefield Fountain, representing Texas public university governance under SB 37.",
    })
    .eq("slug", SLUG)
    .select("slug,body_json,featured_image_url,image_alt_text")
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error(`Article ${SLUG} was not found in production.`);

  const serialized = JSON.stringify(data.body_json);
  return {
    ok: true,
    slug: data.slug,
    featured_image_url: data.featured_image_url,
    image_alt_text: data.image_alt_text,
    generic_texas_news_link_present: /\[Texas\]\((?:https?:\/\/(?:www\.)?keeptxred\.com)?\/texas-news\/?\)/i.test(serialized),
    section_count: Array.isArray((data.body_json as { sections?: unknown[] } | null)?.sections)
      ? (data.body_json as { sections: unknown[] }).sections.length
      : 0,
  };
}

export const Route = createFileRoute("/api/public/hooks/repair-sb37-production")({
  server: {
    handlers: {
      GET: async () => {
        try {
          return Response.json(await repair(), { headers: { "cache-control": "no-store" } });
        } catch (error) {
          return Response.json(
            { ok: false, error: error instanceof Error ? error.message : String(error) },
            { status: 500, headers: { "cache-control": "no-store" } },
          );
        }
      },
    },
  },
});
