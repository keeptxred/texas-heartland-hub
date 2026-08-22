# Cloudflare vision equals-verdict recovery evidence

Production backlog review found a failed image row where the Cloudflare validator output was semantically positive but used `=` separators instead of `:` separators:

- `matches=true`
- `photorealistic=true`
- a positive courthouse reason

The strict parser correctly rejected the unrecognized presentation, but the image itself had already passed the substantive story-match and photorealism decision according to the validator output. The remediation in this branch normalizes only `Matches`, `Photorealistic`, and `Reason` label separators from `=` to `:` before passing the result to the existing strict parser. It does not infer missing fields, convert a negative into a positive, or bypass the existing requirement that both booleans be true.
