import type { RelocationSEO } from "@/types/relocation/seo";
export function toMetaTags(seo:RelocationSEO){ return [{title:seo.title},{name:"description",content:seo.description},{name:"robots",content:seo.noIndex?"noindex, nofollow":"index, follow"},{property:"og:title",content:seo.title},{property:"og:description",content:seo.description}]; }
