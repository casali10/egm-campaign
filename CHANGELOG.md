# Changelog

## 0.2.0 (unreleased)

- Retargeted from dsh-egm to a standalone plugin in the Elephant-Goldfish
  Model layout, starting with Claude Code. Renamed to `egm-campaign`.
- Personas moved to `agents/` (lenses prefixed `lens_`), the standard to
  `resources/document_standards/`. Read-only Claude Code adapters in
  `.claude-plugin/agents/`.
- Goldfish start through the harness's own subagent tool instead of dsh-egm's
  `egm_reviewer`. The DeepSeek Harness host and npm manifest are removed.

## 0.1.0

- First version for dsh-egm: `/campaign-brainstorm` (with the
  `after session <n>` debrief), `/campaign-draft` (with `session <n>`), and
  `/campaign-review`.
- Five reviewers (Substitute GM, Player's eye, Continuity, Table critic,
  Difficulty), seven brainstorm lenses, and the run-readiness standard.
