export interface Coordinates { latitude: number; longitude: number; }
export interface RelocationLocation { id: string; name: string; city?: string; county?: string; state: "TX"; zipCodes: string[]; coordinates?: Coordinates; slug: string; }
