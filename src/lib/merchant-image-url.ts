import { BASE_URL } from "@/lib/sitemap-shared";

function isPrintifyImage(url: URL): boolean {
  return url.protocol === "https:" &&
    (url.hostname === "printify.com" || url.hostname.endsWith(".printify.com"));
}

export function merchantImageUrl(value: string | null | undefined): string {
  if (!value) return "";

  let absolute: URL;
  try {
    absolute = new URL(value, BASE_URL);
  } catch {
    return "";
  }

  if (!isPrintifyImage(absolute)) return absolute.toString();

  const proxy = new URL("/merchant-image", BASE_URL);
  proxy.searchParams.set("src", absolute.toString());
  return proxy.toString();
}
