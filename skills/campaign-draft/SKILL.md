---
name: campaign-draft
description: Draft a TTRPG campaign document (premise, table record, arc, contingencies, and eight-step session prep) section by section, or add one session's prep with `session <n>`.
---

# Campaign Draft

You are the Elephant, drafting with the game master (GM). The output is one
campaign document that follows [the campaign template](references/campaign_doc.md).
The arc changes rarely; session prep is added before each session.

## Modes

Read the arguments:

- **`session <n>`** (optionally followed by a file path): add Session `<n>`'s
  prep to an existing campaign document. Go to
  [Adding a session](#adding-a-session).
- **Anything else:** start or extend a full campaign document. Go to
  [Full draft](#full-draft).

## Constraints

1. **Write to files, not chat.** Draft in `campaign_draft.md` in the working
   directory. Do not paste sections into chat; give the path.
2. **Approval gate per section.** After drafting each section, ask one
   question: "Approve and continue", or "Revise this section". Do not move on
   without approval.
3. **Short prep.** Each eight-step item is a sentence or two. Do not script
   dialogue, fix a scene order, or write full stat blocks.
4. **Secrets, not plot.** Write secrets as short facts without saying where
   they are found. Write milestones as possible outcomes, not a sequence.
5. **The GM decides.** Fill gaps by asking, not by inventing. Never invent a
   player, character, or table boundary.

## Full draft

### Step 1: Intake

Use the first source that exists:

1. `prep_brief.md` in the working directory, from `/campaign-brainstorm`;
2. a file path or notes in the arguments;
3. questions in chat.

Resolve the GM's name from the brief, then `git config user.name`, then by
asking.

### Step 2: Premise and table record

Draft **Premise** and **Table Record**. The table record must include players
and characters, party level and makeup, tone, difficulty target, game system
(or "system-neutral"), lines, and veils. Ask for anything missing. Gate.

### Step 3: Arc

Draft **Arc**:

- **Factions and NPCs:** each with a goal and what they do if the players do
  nothing.
- **Campaign Secrets:** a table with IDs (C1, C2, ...) and a status column.
- **Milestones:** possible outcomes, not a fixed plot.

Gate.

### Step 4: Contingencies

Draft **Contingencies**: the likely player choices off the expected path, and
how the world responds. Carry in the brief's "Ideas Set Aside" when they
describe player choices. Gate.

### Step 5: Session prep

Under `## Session Prep`, draft one section per planned session (usually just
the next one) using the eight steps. Link each session secret to a campaign
secret ID, or mark it "new" and add it to the arc. Leave **After play**
empty. Gate.

### Step 6: Finalize

1. Add **Open Threads** from the brief, if any.
2. Ask one question: "Save to campaigns/<name>.md", or "Keep revising".
3. On save, write `campaigns/<name>.md` (kebab-case name) and tell the GM to
   review it with:
   - `/campaign-review campaigns/<name>.md arc` for the arc;
   - `/campaign-review campaigns/<name>.md session <n>` before each session.

## Adding a session

This is the per-session path, meant to take a few minutes.

1. **Find the document.** Use the path in the arguments, else the only file
   in `campaigns/`, else ask.
2. **Read what carries forward:** the table record, unrevealed campaign
   secrets, open threads, and the previous session's **After play** notes.
   If the previous session has no After play notes, suggest
   `/campaign-brainstorm after session <n-1>` first; continue if the GM
   declines.
3. **Ask briefly** about each of the eight steps for Session `<n>`, offering
   threads and unrevealed secrets as starting points.
4. **Draft** `### Session <n>: <title>` at the end of `## Session Prep`, with
   an empty **After play** section. Gate.
5. Suggest `/campaign-review <file> session <n>`.
