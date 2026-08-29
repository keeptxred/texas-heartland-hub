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
