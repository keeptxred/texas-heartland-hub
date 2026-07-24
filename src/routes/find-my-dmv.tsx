import { createFileRoute } from "@tanstack/react-router";
import { VehicleRegistrationGuide } from "@/components/vehicle-registration-guide";

export const Route = createFileRoute("/find-my-dmv")({
  head: () => ({
    meta: [
      {
        title: "Register a Vehicle in Texas: Fee Estimator & County Office Finder | Keep TX Red",
      },
      {
        name: "description",
        content:
          "Estimate Texas new-resident vehicle registration fees, review the 30-day registration and 90-day license deadlines, open official forms, and find your county tax office.",
      },
    ],
    links: [{ rel: "canonical", href: "https://www.keeptxred.com/find-my-dmv" }],
  }),
  component: VehicleRegistrationGuide,
});
