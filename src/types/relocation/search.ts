import type { RelocationLocation } from "./location";
export type SearchSortDirection = "asc" | "desc";
export interface SearchFilters { city?: string; county?: string; zipCode?: string; [key: string]: string | number | boolean | undefined; }
export interface SearchRequest { query: string; filters?: SearchFilters; page?: number; pageSize?: number; sortBy?: string; sortDirection?: SearchSortDirection; }
export interface SearchResult<T extends RelocationLocation = RelocationLocation> { item: T; score: number; matchedFields: string[]; distanceMiles?: number; }
export interface SearchResponse<T extends RelocationLocation = RelocationLocation> { results: SearchResult<T>[]; total: number; page: number; pageSize: number; }
