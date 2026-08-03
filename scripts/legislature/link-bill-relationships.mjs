#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const billId = process.argv.find((arg) => arg.startsWith('--bill-id='))?.split('=')[1] || null;

if (!url || !serviceKey) {
  console.error('Missing SUPABASE_URL (or VITE_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data, error } = await supabase.rpc('refresh_bill_relationships', {
  p_bill_id: billId,
});

if (error) {
  console.error('Bill relationship refresh failed:', error.message);
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, billId, result: data }, null, 2));
