export const normalizeSearchText = (value: string) => value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
export const tokenizeSearchText = (value: string) => normalizeSearchText(value).split(" ").filter(Boolean);
