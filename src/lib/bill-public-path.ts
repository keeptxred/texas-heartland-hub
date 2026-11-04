export type PublicBillPathIdentity = {
  legislature_number: number;
  session_code?: string | null;
  bill_type: string;
  bill_number: number;
};

export function normalizePublicBillSessionCode(value?: string | null) {
  const normalized = String(value ?? 'R').trim().toUpperCase();
  return normalized || 'R';
}

export function publicBillSessionLabel(legislature: number, value?: string | null) {
  const sessionCode = normalizePublicBillSessionCode(value);
  if (sessionCode === 'R') return `${legislature}(R) · Regular Session`;

  if (/^\d+$/.test(sessionCode)) {
    const number = Number(sessionCode);
    const mod100 = number % 100;
    const suffix = mod100 >= 11 && mod100 <= 13
      ? 'th'
      : number % 10 === 1
        ? 'st'
        : number % 10 === 2
          ? 'nd'
          : number % 10 === 3
            ? 'rd'
            : 'th';
    return `${legislature}(${sessionCode}) · ${number}${suffix} Called Session`;
  }

  return `${legislature}(${sessionCode}) · Session ${sessionCode}`;
}

export function publicBillPath(bill: PublicBillPathIdentity) {
  const legislature = Number(bill.legislature_number);
  const billType = String(bill.bill_type).trim().toLowerCase();
  const billNumber = Number(bill.bill_number);
  const sessionCode = normalizePublicBillSessionCode(bill.session_code);

  if (!Number.isInteger(legislature) || legislature < 1) throw new Error('Invalid legislature number');
  if (!billType) throw new Error('Invalid bill type');
  if (!Number.isInteger(billNumber) || billNumber < 1) throw new Error('Invalid bill number');

  if (sessionCode === 'R') {
    return `/bills/texas/${legislature}/${billType}/${billNumber}`;
  }

  return `/bills/texas/${legislature}/${sessionCode.toLowerCase()}/${billType}/${billNumber}`;
}

export function publicBillReferencePath(bill: PublicBillPathIdentity) {
  return `${publicBillPath(bill)}/reference.json`;
}

/** Share a bill inside the one indexable bills document. */
export function billSearchKey(bill: PublicBillPathIdentity): string {
  return `${bill.legislature_number}-${normalizePublicBillSessionCode(bill.session_code).toLowerCase()}-${String(bill.bill_type).trim().toLowerCase()}-${bill.bill_number}`;
}

export function billSearchPath(bill: PublicBillPathIdentity): string {
  return `/bills#bill=${billSearchKey(bill)}`;
}

export function parseBillSearchKey(value: string): PublicBillPathIdentity | null {
  const match = /^(\d{1,3})-(r|[1-9]\d{0,2})-([a-z]{1,8})-([1-9]\d{0,5})$/i.exec(value.trim());
  if (!match) return null;
  return { legislature_number: Number(match[1]), session_code: match[2].toUpperCase(), bill_type: match[3].toLowerCase(), bill_number: Number(match[4]) };
}
