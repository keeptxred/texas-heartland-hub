import type { RelocationLocation } from "./location";
export interface RelocationDataset<T extends RelocationLocation> { id: string; name: string; version: string; updatedAt: string; items: T[]; }
export interface DatasetIndexEntry { id: string; searchText: string; city?: string; county?: string; zipCodes: string[]; }
