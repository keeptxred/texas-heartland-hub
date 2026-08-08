<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Repository coding and CI rules

These rules apply to every human or AI coding agent working in this repository.

1. Do not merge or directly push changes that introduce a new syntax error, blocking ESLint error, TypeScript error, failing test, or failed production build.
2. Before publishing a code change, run the relevant validation sequence: lint, TypeScript/route generation, tests, and production build. Run domain validators for the area changed (SEO, elections, legislature, publication, shared platform, etc.).
3. Never silence a real correctness failure by broadly disabling a linter, test, type check, or validator. Narrow exceptions must be documented and limited to legacy/non-shipping tooling.
4. Treat `main` as a green baseline. Existing failures are repository debt to remove, not an acceptable reason to ignore new failures.
5. Inspect existing architecture, scripts, services, and workflows before adding a parallel implementation. Reuse or extend an existing path when practical.
6. Do not add a GitHub Actions workflow for a one-time repair, import, or migration. One-time work should be run locally or through an existing manual workflow unless it will be reused operationally.
7. Every recurring workflow must have the narrowest practical trigger/path filters, an appropriate timeout, and concurrency cancellation when overlapping runs would be wasteful.
8. Feature-branch work should be validated through pull-request checks. Repository-wide expensive validations should not run once for an unmerged branch push and then again for the same merge unless there is a documented reason.
9. Pin CI runtimes/toolchain versions when an unpinned `latest` release could make identical commits behave differently over time.
10. Generated or experimental utilities that are intentionally excluded from the blocking application lint gate must not be imported by production code or relied on at runtime. Promote them into the normal validation scope before they become operational dependencies.
11. Do not commit syntactically invalid temporary scripts. If a scratch script is worth committing, make it parse and document whether it is production, operational, or archival tooling.
12. Keep fixes scoped. Do not combine unrelated feature work with repository-health repairs unless the extra change is required to make the repository build or validate.
13. A workflow that writes or commits a file must not automatically trigger itself from that same output file or output directory. Scheduled/data-generating workflows should normally be schedule/manual only; if an output-trigger is genuinely required, document the loop-prevention mechanism.
14. Domain-specific validators must validate their domain. Do not rerun the repository-wide production build, full test suite, or global typecheck inside multiple specialty workflows when the central CI pipeline already owns those checks.
15. Validators must test behavior, structure, or manifest consistency rather than exact prose comments, obsolete literal release numbers, or retired file paths. Version checks should compare the repository's canonical manifests/contracts instead of duplicating version constants in validation scripts.
16. Network-dependent checks against third-party URLs must not be the only blocking PR signal for otherwise valid code. Keep structural/behavioral checks blocking and move broad live-link/browser discovery diagnostics to scheduled or manual workflows when external availability can create false failures.
17. Workflows that commit generated data to `main` must use a strict output allowlist and refuse publication if `main` advanced during generation. They must not mutate unrelated source code as part of a data refresh.
18. Do not use a scheduled data-generation workflow as a general-purpose build/test pipeline. Validate the generated domain output there; let normal CI validate application code changes.
19. Do not commit service-role keys, secret API keys, passwords, private tokens, or other credentials. Browser-exposed publishable identifiers/keys must be clearly intended for public client use; prefer deployment/environment configuration over adding new tracked `.env` values.
20. Before creating a new workflow, search `.github/workflows` for an existing job with the same responsibility. If two workflows would execute substantially the same validation, consolidate them instead.
