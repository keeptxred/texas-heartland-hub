import { describe,it,expect } from 'vitest';
import {
  decideVerifiedRetentionFallback as decide, RECOVERY_AFTER_MS,
} from './should-run-verified-retention.mjs';

const nowMs = Date.parse('2026-10-28T03:25:00Z');
const baseline = {
  eventName:'workflow_run',sourceEvent:'schedule',sourceBranch:'main',
  sourceRepository:'keeptxred/texas-heartland-hub',nowMs,
};
describe('serialized GitHub cold archive schedule recovery',()=>{
  it('starts trusted fallback when GitHub schedule missed for over 90 minutes',()=>{
    expect(decide({...baseline,latestSuccessAt:'2026-10-28T01:26:00Z'}).run).toBe(true);
    expect(decide({...baseline,latestSuccessAt:null}).run).toBe(true);
  });
  it('skips recent success to prevent unnecessary archive writes',()=>{
    expect(decide({...baseline,latestSuccessAt:'2026-10-28T02:27:00Z'}).run).toBe(false);
    expect(decide({...baseline,latestSuccessAt:new Date(nowMs - RECOVERY_AFTER_MS + 1000).toISOString()}).run).toBe(false);
  });
  it('keeps the existing direct schedule, push and authorized manual triggers',()=>{
    for(const eventName of ['schedule','push','workflow_dispatch']){
      expect(decide({...baseline,eventName,latestSuccessAt:null}).run).toBe(true);
    }
  });
  it('refuses external, branch or nonscheduled workflow_run origins',()=>{
    for(const change of [
      {sourceEvent:'pull_request'},
      {sourceEvent:'workflow_dispatch'},
      {sourceBranch:'feature/unknown'},
      {sourceRepository:'untrusted/fork'},
      {eventName:'pull_request'},
    ]) expect(()=>decide({...baseline,latestSuccessAt:null,...change})).toThrow();
  });
  it('fails closed when the latest completion timestamp cannot be trusted',()=>{
    expect(()=>decide({...baseline,latestSuccessAt:'not-a-date'})).toThrow();
    expect(()=>decide({...baseline,latestSuccessAt:'2026-10-29T03:25:00Z'})).toThrow();
  });
});
