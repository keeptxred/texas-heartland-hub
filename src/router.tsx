import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { applyLeafOnlyParentHeadFixes } from "@/lib/leaf-only-parent-heads";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  applyLeafOnlyParentHeadFixes();
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
