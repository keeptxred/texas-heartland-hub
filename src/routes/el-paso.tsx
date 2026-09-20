import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/el-paso")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `https://texasdefined.com/article/moving-to-el-paso-guide${location.searchStr || ""}`,
      statusCode: 301,
    });
  },
});
