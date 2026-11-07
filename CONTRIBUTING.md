# Contributing to EGM Campaign Prep

Thanks for helping. This is a small, early project (0.2.0), so the most useful
contributions come from real tables: prep that failed in play, reviewers that
missed something, and findings that were wrong or just noise.

## Ways to help

| Contribution | How |
| :--- | :--- |
| A finding that was wrong, noisy, or missed | Open an issue. Include the scope (`arc` or `session <n>`), the reviewer, and what happened at the table. |
| Pilot results | Open an issue with your planted flaws and what each reviewer caught. See [Pilot](README.md#pilot). |
| A typo, broken link, or unclear instruction | Open a pull request directly. |
| A new reviewer, lens, or skill | Open an issue first (see below). |
| Support for another harness | Open an issue describing what you tested and what broke. |

For a usage question, open an issue and say it's a question.

## Before you start

Open a pull request directly for small fixes: wording, links, typos, and
test additions.

For anything that changes how a session is prepped or reviewed, open an issue
first. That includes:

- a new reviewer or lens;
- a change to a skill's workflow;
- a change to the [run-readiness standard](resources/document_standards/run-readiness-standard.md).

Say what goes wrong at the table without the change, and how you'd know it
helped. A new reviewer earns its place only if it finds something the
existing ones miss, the same bar as the pilot.

## Design principles

- **The GM decides.** Skills ask; they don't invent players, characters, or
  table boundaries.
- **Short prep.** The eight steps are the minimum and the goal. A change that
  makes prep longer needs a reason it pays off at the table.
- **Files, not chat.** Briefs, campaign documents, and reports go to files.
- **Goldfish stay fresh.** Reviewers read only the document and never see the
  conversation. Keep them read-only.

## Layout

| You're changing | Edit |
| :--- | :--- |
| A reviewer or lens | `agents/<name>.md`, the canonical persona |
| How Claude Code loads it | `.claude-plugin/agents/<name>.md`, a thin read-only adapter |
| A skill | `skills/<skill>/SKILL.md` and its `references/` templates |
| What "run-ready" means | `resources/document_standards/run-readiness-standard.md` |
| Name, version, or agent list | `plugin.json` and `.claude-plugin/plugin.json` (kept in sync) |

### Adding a reviewer or lens

1. Write the persona in `agents/`. Lenses use the `lens_` prefix. The
   frontmatter `name` must start with `campaign-`. The persona needs
   `# Core Mandates`, `# Role`, `# Instructions`, and `# Output Format`
   headings.
2. Add an adapter with the same file name in `.claude-plugin/agents/`. Match
   the persona's `name` and `description`, use `tools: [Read, Grep, Glob]` and
   `omitClaudeMd: true`, and point at
   `${CLAUDE_PLUGIN_ROOT}/agents/<name>.md`.
3. List the adapter in `.claude-plugin/plugin.json` under `agents`, in sorted
   order.
4. Add it to the skill that starts it (the lens table in `campaign-brainstorm`
   or the reviewer table in `campaign-review`) and to the README tables.
5. If the file is derived from the Elephant-Goldfish Model, add it to
   [NOTICE](NOTICE) with what changed.

The tests check steps 1–3.

## Writing style

- Use plain words and short sentences, and say what to do.
- Describe the eight prep steps in your own words. Don't quote *The Lazy
  Dungeon Master*.
- Keep test campaigns and examples original. Don't paste text from published
  adventures.

## Tests

```sh
node --test tests/unit/plugin.test.mjs
```

This needs Node 22 or newer, with no dependencies. The tests check that:

- the manifests agree;
- every persona has an adapter that is read-only and listed in the manifest;
- every persona has its required headings;
- skills are user-invoked, and every file a skill names exists.

The tests can't tell whether a reviewer is any good. For a change to a persona
or skill, also run it on a short campaign. Say in the pull request what it
found before and after the change.

## Pull requests

- Use a short title that starts with a verb, in sentence case. For example:
  "Add a pacing lens to campaign-brainstorm".
- Explain what changed and why, and link the issue if there is one.
- Make sure the tests pass.
- Add a line to [CHANGELOG.md](CHANGELOG.md) under the unreleased version for
  anything a GM would notice.

AI-assisted contributions are welcome, but a human must author each pull
request. You should have read the change, tested it, and be able to explain
it yourself.

## License

By contributing, you agree that your contribution is licensed under the
[Apache License 2.0](LICENSE), the same license as the project. There is no
separate contributor agreement.
