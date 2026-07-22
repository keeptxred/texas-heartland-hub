import type { RelocationSEO } from "@/types/relocation/seo";
export const buildRelocationSEO=(input:RelocationSEO):RelocationSEO=>({...input,title:input.title.includes("Keep TX Red")?input.title:`${input.title} | Keep TX Red`});
