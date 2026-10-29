/**
 * Texas Legislature status classification. These are different legal instruments:
 * HB/SB can become statutes; HCR/SCR and HR/SR are resolutions; HJR/SJR propose
 * constitutional changes and never become statutes by legislative adoption.
 * Only official action descriptions determine terminal states.
 */
export const STATUTE_TYPES = new Set(['hb', 'sb']);
export const RESOLUTION_TYPES = new Set(['hr', 'sr', 'hcr', 'scr', 'hjr', 'sjr']);
export const isTexasStatuteBill = (type) => STATUTE_TYPES.has(String(type || '').toLowerCase());

export function normalizeTexasBillStatus(billType, actions) {
  const type = String(billType || '').toLowerCase();
  const lines = (actions || []).map((action) => String(action.action_text || action.text || '').trim().toLowerCase());
  const has = (pattern) => lines.some((line) => pattern.test(line));
  const result = (code, label, becameLaw = false) => ({ code, label, becameLaw });

  if (type === 'hr' || type === 'sr') {
    if (has(/\b(?:read\s*(?:&|and)\s*adopted|adopted(?:\s+by\s+(?:the\s+)?(?:house|senate))?|resolution adopted)\b/i))
      return result('adopted', 'Adopted');
    if (has(/referred to|committee/i)) return result('in-committee', 'In committee');
    return result('filed', 'Filed');
  }

  if (type === 'hcr' || type === 'scr') {
    if (has(/signed by the governor|governor signed/i))
      return result('signed-resolution', 'Signed by governor (resolution)');
    if (has(/vetoed by the governor/i)) return result('vetoed', 'Vetoed');
    if (has(/\badopted\b|passed (?:house|senate)|(?:house|senate) passage reported/i))
      return result('adopted', 'Adopted by legislature');
    if (has(/referred to|committee/i)) return result('in-committee', 'In committee');
    return result('filed', 'Filed');
  }

  if (type === 'hjr' || type === 'sjr') {
    if (has(/filed with (?:the )?secretary of state|submitted to (?:the )?voters/i))
      return result('proposed-amendment', 'Proposed constitutional amendment');
    if (has(/\badopted\b|passed (?:house|senate)|(?:house|senate) passage reported/i))
      return result('passed', 'Passed legislature (joint resolution)');
    if (has(/referred to|committee/i)) return result('in-committee', 'In committee');
    return result('filed', 'Filed');
  }

  if (has(/vetoed by the governor/i)) return result('vetoed', 'Vetoed');
  if (has(/signed by the governor|governor signed/i)) return result('signed', 'Signed by governor', true);
  if (has(/became law|filed without (?:the governor'?s )?signature/i))
    return result('became-law', 'Became law', true);
  if (has(/^effective (?:on\b|immediately\b)/i)) return result('effective', 'Effective', true);
  if (has(/sent to the governor|presented to (?:the )?governor/i))
    return result('sent-to-governor', 'Sent to governor');
  if (has(/passed senate|passed house|(?:house|senate) passage reported/i))
    return result('passed', 'Passed a chamber');
  if (has(/referred to|committee/i)) return result('in-committee', 'In committee');
  return result('filed', 'Filed');
}
