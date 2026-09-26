import { expect, test } from 'vitest';
import fs from 'node:fs';
const sql=fs.readFileSync('supabase/migrations/20260926204000_preserve_canonical_pro_sports_duplicate.sql','utf8');
test('pro sports duplicate guard preserves the lowest-id canonical row',()=>{
 expect(sql).toContain('f.id < new.id');
 expect(sql).toContain('duplicate_title_quarantine');
 expect(sql).toContain("new.target_site := 'review'");
 expect(sql).toContain('source_contamination');
 expect(sql).toContain('internal_slug is null and texasdefined_slug is null');
 expect(sql).not.toContain('delete from public.texas_news_feed');
});
