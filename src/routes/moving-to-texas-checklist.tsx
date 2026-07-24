import { createFileRoute } from "@tanstack/react-router";
import { MovingChecklist } from "@/components/moving-checklist";

export const Route = createFileRoute("/moving-to-texas-checklist")({
  head: () => ({
    meta: [
      { title: "Interactive Moving to Texas Checklist | Keep TX Red" },
      {
        name: "description",
        content:
          "Build a personalized Texas moving checklist with calculated target dates for vehicle registration, driver licensing, utilities, schools, voting, and homestead filing.",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://www.keeptxred.com/moving-to-texas-checklist",
      },
    ],
  }),
  component: MovingChecklist,
});
