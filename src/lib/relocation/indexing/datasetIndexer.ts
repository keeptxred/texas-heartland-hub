import type { DatasetIndexEntry } from "@/types/relocation/dataset";
import type { TextIndex } from "./indexTypes";
import { tokenizeSearchText } from "../search/searchNormalizer";
export function buildTextIndex(entries:DatasetIndexEntry[]):TextIndex{ const byToken=new Map<string,Set<string>>(); for(const entry of entries){ for(const token of tokenizeSearchText(entry.searchText)){ const ids=byToken.get(token)??new Set<string>(); ids.add(entry.id); byToken.set(token,ids); } } return {byToken,allIds:new Set(entries.map(entry=>entry.id))}; }
