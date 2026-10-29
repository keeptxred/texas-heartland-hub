# Chat recovery and durable execution checkpoints — KeepTXRed

This protocol prevents lost execution state when a ChatGPT conversation becomes unresponsive (including “Unknown error”). It **does not depend on the old chat responding** to a handoff request. It applies to multi-step/long-running engineering, content-authority, SEO, data, and operational projects.

## Durable source of truth

An **open GitHub issue titled `[checkpoint] <specific project>`** is the authoritative, continually updated recovery record for that project. Issues are editable without committing application code or triggering production deployment. Use GitHub's “Chat continuation checkpoint” issue template in `.github/ISSUE_TEMPLATE/chat-checkpoint.md`. Use **one issue per distinct ongoing project**, not one per chat or per batch. Search open and recently closed checkpoint issues before creating another; reuse the existing issue if the user is continuing the same project.

Coordinate shared-backend changes with TexasDefined using links to the relevant issue/PR; do not open duplicate cross-repository work.

The issue must record:
1. Original objective, scoped requirements, explicit exclusions and approvals (link to chat if available, never require it).
2. Checkpoint timestamp in UTC; current branch and **actual verified** commit SHA, PR links, CI run IDs, and deployment evidence.
3. Work completed with evidence, separated into **changed / checked / merged / deployed / production-verified** (never collapse these states).
4. Numbered unfinished actions, current blockers, unverified hypotheses, and the **single exact next action**.
5. Constraints and known traps, e.g. no full-site repeat audits, no Cloudflare reconnect/poll loops, no secrets.

The GitHub issue, not a static status file on a feature branch, is the immediate recovery record. Feature-branch notes may supplement it, but unmerged files can disappear or become stale.

## Update cadence — mandatory for agents

- **Before** a substantial multi-batch task: find the existing project checkpoint or create it, record original scope and initial verification. Link it in the first project PR.
- **During** work: update the issue **after every meaningful completed batch** and **before risky, lengthy, or context-intensive operations**, with proof and remaining tasks. Do not postpone state persistence until the end.
- **At PR/CI/merge/deploy boundaries**: update with exact evidence and distinguish each stage; the PR body should include `Checkpoint: #<issue-number>` to make the issue discoverable.
- **When blocked**: write the exact blocker once, retain unfinished tasks; continue independent work. Never report pending steps as done.
- **At full completion**: close the checkpoint only after all scoped work and required production acceptance are proved. Leave it open otherwise.
- Update the same issue in place rather than appending a huge stream of duplicated reports. Comments may preserve important incident history, but the issue body remains current and concise.
- Avoid secret values, customer data, home addresses, API tokens and unredacted logs in issues.

## New-chat recovery without the old conversation

User may say **“Recover the stalled KeepTXRed chat about <topic> and continue.”** No original prompt or generated handoff is required.

1. Read `AGENTS.md`, this protocol, and search the repository's open `[checkpoint]` issues by project/topic and recent update time.
2. Read the selected issue, linked PRs/commits/CI runs, and relevant files. If the issue was not created, reconstruct **only the relevant task** from available prior-chat context and recent GitHub evidence, then create a catch-up checkpoint. Explicitly flag any missing original requirement.
3. Reconcile checkpoint claims with current `main`, branch, PR and deployed evidence. An outdated checkpoint is a lead, **not proof**; do not repeat completed work or infer deployment from merge.
4. Resume the issue's next incomplete action in bounded batches; update the same issue throughout.
5. Do not request a handoff from the failed chat, restart from the original prompt, perform a broad website audit, introduce new credentials, or loop on CI or Cloudflare.
6. For changes spanning KeepTXRed and TexasDefined, cross-link both repos' relevant issues and PRs and use existing deployment pipelines.

## What is and isn't automatic

This is a **repository-enforced agent operating procedure**, not a claim that ChatGPT can listen to every conversation or silently save state. GitHub preserves each checkpoint when the agent **actually writes it**. Therefore agents must create/update the issue early and often; GitHub commits and Actions provide independent evidence of code changes, not the full intent or outstanding work of a chat. No cron, paid service, or extra site-wide scan is necessary.

## Copy-and-paste recovery instruction

> Recover the stalled KeepTXRed project on [topic]. Search this repository's latest relevant open `[checkpoint]` GitHub issue, read linked PRs/CI/deployments, reconcile only changed facts, and continue the unfinished steps. If the checkpoint is missing, reconstruct from available prior context plus GitHub without asking me to reproduce the initial prompt. Update the GitHub checkpoint before and after each batch. Do not redo completed work, start a broad audit, or get stuck in Cloudflare/polling loops.
