#!/usr/bin/env node

// Protected current-main replay marker for candidate-photo enrichment.
// This file intentionally applies no portrait findings by itself.
// Its candidate-photo input path is used only to invoke the existing verified
// enrichment pipeline after the post-verify workflow-run dispatch bridge is live.
// All provenance, rights, generic-image, eligibility, and branch-protection gates
// remain enforced by the existing candidate-photo workflows and validation scripts.

console.log("Candidate-photo post-verify bridge replay marker: no direct findings applied.");
