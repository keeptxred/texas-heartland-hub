import { createServerFn } from "@tanstack/react-start";
import { loadStateDistrictDetail, loadStateDistrictDirectory } from "@/lib/state-districts.server";

export const getStateDistrictDirectory = createServerFn({ method: "GET" }).handler(async () => {
  return loadStateDistrictDirectory();
});

export const getStateDistrictDetail = createServerFn({ method: "GET" })
  .validator((data: { slug: string }) => ({ slug: data.slug.trim().toLowerCase().slice(0, 80) }))
  .handler(async ({ data }) => {
    return loadStateDistrictDetail(data.slug);
  });
