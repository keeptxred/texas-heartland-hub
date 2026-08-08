export const normalizeTexasZip=(value:string)=>value.replace(/\D/g,"").slice(0,5);
export const isValidTexasZip=(value:string)=>/^(7[3-9]|8[0-8])\d{3}$/.test(normalizeTexasZip(value));
