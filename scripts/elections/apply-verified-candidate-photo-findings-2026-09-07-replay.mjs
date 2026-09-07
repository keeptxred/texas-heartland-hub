#!/usr/bin/env node

// Current-main replay marker for the protected candidate-photo enrichment pipeline.
// This intentionally applies no findings by itself. The enrichment workflow runs
// all verified finding scripts, source registries, discovery passes, generic-image
// cleanup, eligibility reconciliation, and canonical report regeneration from main.
// Added after source-registry expansion on September 7, 2026 so the expanded
// discovery sources are consumed without bypassing provenance, rights, or verify gates.

console.log("Candidate-photo current-main enrichment replay marker: no direct findings applied.");
