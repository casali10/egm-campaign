---
name: campaign-review
description: Check a TTRPG campaign document with fresh-context Goldfish reviewers against the run-readiness standard. Use `arc` for Continuity and Table critic, or `session <n>` for Substitute GM, Player's eye, and Difficulty.
---

# Campaign Review

You are the Elephant. You start Goldfish reviewers that see only the campaign
document, collect their findings, and help the game master (GM) decide what
to change. The reviewers never see this conversation.

## Arguments

`/campaign-review <file> <scope> [reviewers]`

- **`<file>`:** the campaign document. If missing, use the only file in
  `campaigns/`, else ask.
- **`<scope>`:**
  - `arc`: everything above `## Session Prep`.
  - `session <n>`: the `### Session <n>` section.
  - `all`: the arc pass, then a session pass for every session.
  - If missing, ask with one question.
- **`[reviewers]`:** optional names to override the default set, for example
  `difficulty` or `substitute-gm players-eye`.

## Reviewers

| Reviewer | Persona | Default pass |
| :--- | :--- | :--- |
| Continuity | `reviewers/continuity.md` | Arc |
| Table critic | `reviewers/table_critic.md` | Arc |
| Substitute GM | `reviewers/substitute_gm.md` | Session |
| Player's eye | `reviewers/players_eye.md` | Session |
| Difficulty | `reviewers/difficulty.md` | Session |

Every reviewer gets `standards/run-readiness-standard.md` as its standard.

## Workflow

### Step 1: Locate the target

Read the document. Find the line range for the scope:

- **Arc:** line 1 up to the line before `## Session Prep`.
- **Session `<n>`:** from `### Session <n>` up to the next `### Session`
  heading or the next `##` heading.

If `## Session Prep` or the session heading is missing, tell the GM and stop.
Suggest `/campaign-draft` to add it.

### Step 2: Start the reviewers

Start every reviewer for the pass in parallel with `egm_reviewer`, one call
each:

```text
Persona: <absolute path of reviewers/<file>.md>
Mode: REVIEW
ProjectRoot: <working directory>
TargetFile: <absolute path of the campaign document>
LineRange: <start>-<end>
TargetStandard: <absolute path of standards/run-readiness-standard.md>
GoldfishContext: []
Read your Persona file first and follow it.
```

For `all`, finish the arc pass (Steps 2–3) before starting session passes, so
arc fixes are in place first.

Do not edit the document while a reviewer is running.

### Step 3: Write the report

Wait for every reviewer in the pass. In this thread:

1. Merge findings that describe the same problem, keeping every reviewer
   name that raised it.
2. Order them Blockers, then Majors, then Nits.
3. Write `campaign_review_report.md` in the working directory:

```markdown
# Campaign Review: [Campaign Name], [Scope]

* **Document:** [path]
* **Date:** [YYYY-MM-DD]
* **Reviewers:** [names]

| # | Severity | Reviewers | Scope | Finding | Suggested fix | Decision |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Major | Player's eye | Session 3, Secrets | S2 can only surface at the shrine | Add a second source, for example the letter | Open |
```

If the report already exists, add a new dated section for this pass.

### Step 4: Decide

Tell the GM the report path and the two or three findings that matter most at
the table. Then ask one question:

- **Go through the findings:** for each Blocker and Major, propose a short
  fix and ask the GM to accept, change, or reject it. Record each decision in
  the report's Decision column, then edit the document for accepted fixes.
  Nits are listed but not walked through unless the GM asks.
- **Review again:** after fixes, rerun the same pass with fresh reviewers.
  Reviewers never resume; start new ones.
- **Stop here:** leave the report as written.

Stop after two rounds of a pass unless the GM asks for more. Repeated rounds
on session prep work against keeping prep short.
