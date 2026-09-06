#!/usr/bin/env node

// Materialization replay trigger.
//
// The verified candidate-photo materialization workflow applies every
// apply-verified-candidate-photo-findings-*.mjs script from current main.
// This no-op file intentionally matches that protected workflow path so the
// already-reviewed Andrew Turner and Detrick DeBurr findings merged after the
// last canonical report are replayed from the latest main without weakening
// any identity, provenance, rights, generic-image, eligibility, or branch
// protection gates.

console.log("Replay current-main verified candidate-photo findings.");
