import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/news/moving-to-el-paso-guide")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/article/moving-to-el-paso-guide${location.searchStr || ""}`,
      statusCode: 301,
      reloadDocument: true,
    });
  },
  component: () => null,
});
