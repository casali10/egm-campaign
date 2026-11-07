/**
 * Plugin checks: manifests agree, every Claude adapter points at an existing
 * persona, every file a skill names exists, and personas keep their shape.
 *
 * Run with `node --test tests/unit/plugin.test.mjs`. Plain Node >= 22, no
 * dependencies.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
const EXPECTED_SKILLS = ['campaign-brainstorm', 'campaign-draft', 'campaign-review']

const readJson = (path) => JSON.parse(readFileSync(join(ROOT, path), 'utf8'))
const read = (path) => readFileSync(join(ROOT, path), 'utf8')

/** Return the single-line frontmatter fields of a Markdown file. */
function frontmatter(source) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/u.exec(source)
  assert.ok(match, 'file starts with frontmatter')
  return Object.fromEntries(match[1].split(/\r?\n/u)
    .map((line) => /^([A-Za-z0-9_-]+):[ \t]*(.*)$/u.exec(line))
    .filter(Boolean)
    .map(([, key, value]) => [key, value.trim()]))
}

test('manifests share identity and version', () => {
  const root = readJson('plugin.json')
  const claude = readJson('.claude-plugin/plugin.json')
  const marketplace = readJson('.claude-plugin/marketplace.json')
  for (const key of ['name', 'version', 'description', 'license', 'repository']) {
    assert.deepEqual(claude[key], root[key], `.claude-plugin/plugin.json ${key}`)
  }
  assert.equal(marketplace.plugins[0].name, root.name)
  assert.equal(marketplace.plugins[0].description, root.description)
})

test('every persona has a Claude adapter, listed in the manifest, with matching identity', () => {
  const personas = readdirSync(join(ROOT, 'agents')).filter((file) => file.endsWith('.md')).sort()
  const listed = readJson('.claude-plugin/plugin.json').agents
  assert.deepEqual(listed, personas.map((file) => `./.claude-plugin/agents/${file}`))
  for (const file of personas) {
    const persona = frontmatter(read(`agents/${file}`))
    const adapterSource = read(`.claude-plugin/agents/${file}`)
    const adapter = frontmatter(adapterSource)
    assert.equal(adapter.name, persona.name, `${file} name`)
    assert.equal(adapter.description, persona.description, `${file} description`)
    assert.equal(adapter.tools, '[Read, Grep, Glob]', `${file} is read-only`)
    assert.equal(adapter.omitClaudeMd, 'true', `${file} omits CLAUDE.md`)
    assert.ok(adapterSource.includes(`\${CLAUDE_PLUGIN_ROOT}/agents/${file}`), `${file} adapter points at its persona`)
  }
})

test('every persona has a role and an output format', () => {
  for (const file of readdirSync(join(ROOT, 'agents'))) {
    const source = read(`agents/${file}`)
    assert.match(frontmatter(source).name ?? '', /^campaign-[a-z-]+$/u, `${file} name`)
    for (const heading of ['# Core Mandates', '# Role', '# Instructions', '# Output Format']) {
      assert.ok(source.includes(heading), `${file} has ${heading}`)
    }
  }
})

test('skills are user-invoked and every file they name exists', () => {
  assert.deepEqual(readdirSync(join(ROOT, 'skills')).sort(), EXPECTED_SKILLS)
  const pattern = /`((?:agents|resources)\/[a-z_/-]+\.md)`|\]\((references\/[a-z_]+\.md)\)/gu
  for (const name of EXPECTED_SKILLS) {
    const source = read(`skills/${name}/SKILL.md`)
    const meta = frontmatter(source)
    assert.equal(meta.name, name)
    assert.equal(meta['disable-model-invocation'], 'true', `${name} is user-invoked`)
    for (const [, rootPath, localPath] of source.matchAll(pattern)) {
      const target = rootPath === undefined ? join(ROOT, 'skills', name, localPath) : join(ROOT, rootPath)
      assert.ok(existsSync(target), `${name}: ${rootPath ?? localPath} is missing`)
    }
  }
})
