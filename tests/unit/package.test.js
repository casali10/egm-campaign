/**
 * Package checks: the host registers every skill, every persona and standard a
 * skill names exists, and `package.json` `files` matches what ships.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import * as host from '../../host/skills-host.js'

const ROOT = host.ROOT
const EXPECTED_SKILLS = ['campaign-brainstorm', 'campaign-draft', 'campaign-review']
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))

/** List files under a package directory as package-relative POSIX paths. */
function listFiles(directory) {
  return readdirSync(join(ROOT, directory), { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => relative(ROOT, join(entry.parentPath, entry.name)).split(sep).join('/'))
    .sort()
}

test('apply registers every campaign skill with the preamble', () => {
  const registered = []
  const ctx = {
    effect: (callback) => callback(),
    skills: { register: (skill) => { registered.push(skill); return () => {} } },
  }
  const log = console.log
  console.log = () => {}
  try {
    host.apply(ctx)
  } finally {
    console.log = log
  }
  assert.deepEqual(registered.map((skill) => skill.name), EXPECTED_SKILLS)
  for (const skill of registered) {
    assert.ok(skill.content.startsWith('<dsh_integration>'), `${skill.name} preamble`)
    assert.ok(skill.content.includes(`Package root: ${ROOT}`), `${skill.name} root`)
    assert.ok(skill.content.includes('egm_reviewer'), `${skill.name} names egm_reviewer`)
    assert.equal(skill.invocation.userInvocable, true)
    assert.equal(skill.invocation.modelInvocable, false)
  }
})

test('parseSkillDocument rejects unsupported frontmatter', () => {
  assert.throws(() => host.parseSkillDocument('---\ndescription: >-\n  folded\n---\nbody'), /unsupported/u)
  assert.deepEqual(host.parseSkillDocument('---\nname: "a-b"\n---\nbody').meta, { name: 'a-b' })
})

test('every persona, standard, and reference a skill names exists', () => {
  const pattern = /`((?:reviewers|lenses|standards)\/[a-z_-]+\.md)`|\]\((references\/[a-z_]+\.md)\)/gu
  for (const name of EXPECTED_SKILLS) {
    const directory = join(ROOT, 'skills', name)
    const text = readFileSync(join(directory, 'SKILL.md'), 'utf8')
    const found = [...text.matchAll(pattern)]
    assert.ok(found.length > 0, `${name} names at least one file`)
    for (const [, packagePath, localPath] of found) {
      const target = packagePath === undefined ? join(directory, localPath) : join(ROOT, packagePath)
      assert.ok(existsSync(target), `${name}: ${packagePath ?? localPath} is missing`)
    }
  }
})

test('every reviewer and lens has frontmatter, a role, and an output format', () => {
  for (const path of [...listFiles('reviewers'), ...listFiles('lenses')]) {
    const { meta, body } = host.parseSkillDocument(readFileSync(join(ROOT, path), 'utf8'))
    assert.match(meta.name ?? '', /^campaign-[a-z-]+$/u, `${path} name`)
    assert.ok((meta.description ?? '') !== '', `${path} description`)
    for (const heading of ['# Core Mandates', '# Role', '# Instructions', '# Output Format']) {
      assert.ok(body.includes(heading), `${path} has ${heading}`)
    }
  }
})

test('package.json files lists exactly the shipped content', () => {
  const shipped = ['host', 'skills', 'reviewers', 'lenses', 'standards'].flatMap(listFiles)
  const listed = pkg.files.map((path) => path.replace(/^\.\//u, ''))
  const missing = shipped.filter((path) => !listed.includes(path))
  assert.deepEqual(missing, [], 'shipped files missing from package.json files')
  for (const path of listed) assert.ok(existsSync(join(ROOT, path)), `${path} is listed but missing`)
})
