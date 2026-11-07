// Copyright 2026 Nicolas Casali
// SPDX-License-Identifier: Apache-2.0
//
// Adapted from dsh-egm adapters/dsh/skills-host.js (https://github.com/dryw/dsh-egm,
// Apache-2.0). Changed: registers the campaign skills, simplified frontmatter
// parser, new integration preamble. See NOTICE.

/**
 * Host plugin for dsh-egm-campaign.
 *
 * Registers the three campaign skills in the DeepSeek Harness skill registry.
 * Each skill body is prefixed with a short `<dsh_integration>` preamble that
 * states the package root and how to start a Goldfish reviewer. Reviewers run
 * through dsh-egm's `egm_reviewer` tool, which this package does not
 * reimplement: install dsh-egm in the same profile.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const name = 'dsh-egm-campaign'

/** The plugin stays inactive when the Harness composes no skill registry. */
export const inject = ['skills']

// This module lives in host/, so the package root is one level up.
export const ROOT = fileURLToPath(new URL('../', import.meta.url))
const SKILLS_DIR = join(ROOT, 'skills')
const SKILL_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u

/**
 * Parse the frontmatter of one of this package's SKILL.md files.
 *
 * The package authors its own skills, so only single-line `key: value` pairs
 * (optionally quoted) are supported; anything else is a packaging error.
 * @param {string} source raw SKILL.md text.
 * @returns {{ meta: Record<string, string>, body: string }} metadata and Markdown body.
 */
export function parseSkillDocument(source) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/u.exec(source)
  if (match === null) return { meta: {}, body: source.trim() }
  const meta = {}
  for (const line of match[1].split(/\r?\n/u)) {
    if (line.trim() === '') continue
    const pair = /^([A-Za-z0-9_-]+):[ \t]*(.*)$/u.exec(line)
    if (pair === null) throw new Error(`unsupported frontmatter line: ${JSON.stringify(line)}`)
    let value = pair[2].trim()
    if (/^(["']).*\1$/u.test(value)) value = value.slice(1, -1)
    meta[pair[1]] = value
  }
  return { meta, body: source.slice(match[0].length).trim() }
}

/**
 * Build the harness preamble for one campaign skill.
 * @param {string} skillDirectory absolute directory containing SKILL.md.
 * @returns {string} preamble inserted before the skill instructions.
 */
export function integrationPreamble(skillDirectory) {
  return [
    '<dsh_integration>',
    'This is a dsh-egm-campaign skill running on DeepSeek Harness.',
    `Package root: ${ROOT}`,
    `This skill's directory: ${skillDirectory}`,
    'Resolve `reviewers/...`, `lenses/...` and `standards/...` against the package root; resolve `references/...` against this skill\'s directory.',
    'Start every Goldfish reviewer or lens with `egm_reviewer({ description, prompt })` from dsh-egm. It starts a fresh, read-only child that sees none of this conversation. If the tool is missing, stop and tell the user to install dsh-egm in this profile; a review in this context is not a Goldfish review. Never use `subagent`, `subagent_fork` or `send_message` for a Goldfish.',
    'Every Goldfish prompt starts with the line `Persona: <absolute path of the persona file under the package root>`, then names Mode, ProjectRoot and GoldfishContext, and in REVIEW mode also TargetFile, LineRange and TargetStandard. Tell the child to read its Persona file first and follow it; do not paste or summarize the persona.',
    'Interactive gates use `ask_user_question` with label/description option objects; never add a `(Recommended)` prefix.',
    'Write briefs, campaign documents and review reports to the project working directory, never into this package.',
    '</dsh_integration>',
  ].join('\n')
}

/**
 * Load one skill directory into a Harness skill registration.
 * @param {string} directoryName name of the directory under `skills/`.
 * @returns {object} arguments for `ctx.skills.register`.
 */
export function loadBundledSkill(directoryName) {
  const directory = join(SKILLS_DIR, directoryName)
  const skillPath = join(directory, 'SKILL.md')
  const { meta, body } = parseSkillDocument(readFileSync(skillPath, 'utf8'))

  if (meta.name === undefined || !SKILL_NAME.test(meta.name)) {
    throw new Error(`${skillPath}: missing or invalid kebab-case "name"`)
  }
  if (meta.name !== directoryName) {
    throw new Error(`${skillPath}: name "${meta.name}" does not match its directory "${directoryName}"`)
  }
  if (meta.description === undefined || meta.description === '') {
    throw new Error(`${skillPath}: missing "description"`)
  }
  if (body === '') throw new Error(`${skillPath}: empty skill body`)

  return {
    name: meta.name,
    description: meta.description,
    content: `${integrationPreamble(directory)}\n\n${body}`,
    invocation: { modelInvocable: false, userInvocable: true },
    source: 'bundled',
    path: skillPath,
    resourceBase: { kind: 'directory', path: ROOT },
    metadata: { license: 'Apache-2.0' },
  }
}

/**
 * Register every campaign skill.
 * @param {import('@deepseek-ai/cordis').Context} ctx owning plugin context.
 */
export function apply(ctx) {
  const directories = readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()

  for (const directoryName of directories) {
    const skill = loadBundledSkill(directoryName)
    ctx.effect(() => ctx.skills.register(skill))
  }
  console.log(`[dsh-egm-campaign] registered ${directories.length} campaign skill(s)`)
}
