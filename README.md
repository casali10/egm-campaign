# EGM Campaign Prep

Tabletop RPG campaign prep with the
[Elephant-Goldfish Model](https://github.com/google/elephant-goldfish-model)
(EGM).

A game master (GM) preps with a lot of private context, like EGM's Elephant.
Prep usually fails because it only works in its author's head. This plugin
adds Goldfish reviewers that see only the page: a substitute GM, the players,
a continuity reader, a critic who knows the table, and a difficulty check.

The prep format follows the eight steps of Mike Shea's
[Lazy Dungeon Master](https://slyflourish.com/eight_steps_2023.html) method.

> **Status:** 0.2.0, early. Built for Claude Code first. The layout follows
> EGM's, so other harnesses may work, but they are untested. The pilot
> (below) decides whether the reviewers earn their place.

## Install (Claude Code)

```sh
claude plugin marketplace add casali10/egm-campaign
claude plugin install egm-campaign@egm-campaign
```

Skills are namespaced in Claude Code: `/egm-campaign:campaign-brainstorm`,
`/egm-campaign:campaign-draft`, and `/egm-campaign:campaign-review`. This
plugin does not need EGM installed.

Install the whole plugin. The skills read `agents/` and `resources/` at run
time.

## When to use it

Not the full cycle every session. The arc changes rarely; each session gets
ordinary prep plus a quick check.

| When | Run | Effort |
| :--- | :--- | :--- |
| Campaign start, or a big turn | `campaign-brainstorm`, `campaign-draft`, then `campaign-review <file> arc` | An evening |
| Before each session | `campaign-draft session <n>`, then `campaign-review <file> session <n>` | Normal prep plus a few minutes |
| After each session | `campaign-brainstorm after session <n>` | A few minutes |
| When stuck | `campaign-brainstorm <one session's pitch>` | Occasional |

## Skills

- **`campaign-brainstorm`:** clarifying questions over the eight steps, then
  seven lenses in parallel, then `prep_brief.md`. With `after session <n>`,
  a debrief whose questions come from that session's planned secrets, hooks,
  and scenes; it updates the secrets table and open threads.
- **`campaign-draft`:** a campaign document built section by section with an
  approval gate after each: premise and table record, arc, contingencies,
  and session prep. With `session <n>`, it adds one session.
- **`campaign-review`:** starts the reviewers for the `arc` or a
  `session <n>` pass, writes `campaign_review_report.md`, and walks the GM
  through Blockers and Majors.

## Reviewers

| Reviewer | Stands in for | Prep steps | Pass |
| :--- | :--- | :--- | :--- |
| Substitute GM | A GM with no briefing | 2, 5–7 | Session |
| Player's eye | The players | 3, 4 | Session |
| Difficulty | A GM who has run this party before | 3, 7, 8 | Session |
| Continuity | A reader of the whole arc | 4, 6 | Arc |
| Table critic | A GM who knows the group | 1, 2, 8 | Arc |

All five use [the run-readiness standard](resources/document_standards/run-readiness-standard.md).
"Enough" prep is the eight-step minimum: a missing essential is Major, and
over-prep is a Nit unless it buries an essential.

## Layout

Same shape as EGM:

| Path | Contents |
| :--- | :--- |
| `skills/` | The three skills and their templates |
| `agents/` | The five reviewers and seven brainstorm lenses (canonical personas) |
| `resources/document_standards/` | The run-readiness standard |
| `.claude-plugin/` | Claude Code manifest, marketplace entry, and read-only agent adapters |
| `plugin.json` | Portable manifest |

Other creative domains, such as fiction writing, could follow the same shape:
reviewers, lenses, a draft template, and a standard.

## Pilot

Before relying on it: write a short campaign (an arc and two sessions) with
eight planted flaws, at least one per reviewer, plus a few held-out flaws
from another GM who has not read the personas. Run the arc and session passes
once with no fixes, and compare against one plain session given the same
checklists, scored blind. Keep a reviewer only if it finds something the
plain session misses.

## Tests

```sh
node --test tests/unit/plugin.test.mjs
```

## Contributing

Issues and pull requests are welcome, and reports from real tables most of
all. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Credits

- **[Elephant-Goldfish Model](https://github.com/google/elephant-goldfish-model)**,
  Copyright Google LLC: the Elephant and Goldfish method, the plugin layout,
  and the persona and skill structure this plugin adapts.
- **[dsh-egm](https://github.com/dryw/dsh-egm)** by dryw: an earlier version
  of this plugin targeted dsh-egm, and its feedback shaped the design. No
  dsh-egm code remains.
- **[Lazy Dungeon Master](https://slyflourish.com/eight_steps_2023.html)** by
  Mike Shea (Sly Flourish): the eight prep steps, described here in original
  words.

[NOTICE](NOTICE) lists every derived file and what changed. This plugin is
not affiliated with or endorsed by Google, dryw, or Sly Flourish, and is not
an officially supported Google product.

## License

Apache 2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
