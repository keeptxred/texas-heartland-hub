import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/news/appraisal-protest-playbook")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/do/property-tax-protest${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
