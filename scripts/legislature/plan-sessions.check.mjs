import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { currentLegislature, plannedSessions } from './plan-sessions.mjs';
describe('GitHub legislative quarterly planning', () => {
  it('increments Legislature when odd-year regular sessions begin', () => {
    assert.equal(currentLegislature(2026),89);
    assert.equal(currentLegislature(2027),90);
    assert.equal(currentLegislature(2029),91);
  });
  it('runs the current regular session daily', () => {
    assert.deepEqual(plannedSessions({year:2026}),['89R']);
    assert.deepEqual(plannedSessions({year:2027}),['90R']);
  });
  it('includes known called sessions and discovered future sessions quarterly', () => {
    assert.deepEqual(plannedSessions({year:2026,quarterly:true,directory:'89R\n891\n892\n893\n88R\n'}),['89R','891','892','893']);
    assert.deepEqual(plannedSessions({year:2027,quarterly:true,directory:'90R\n901\n902\n'}),['89R','891','892','90R','901','902']);
  });
});
