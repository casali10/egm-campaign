/**
 * Render docs/assets/protocol.d2 to protocol.svg.
 *
 * D2 leaves the canvas transparent and emits no title or ARIA metadata, so this
 * adds a <title>, role="img", an aria-label, width/height, and a light/dark
 * background behind the drawing.
 *
 * Run from the repository root with `node docs/assets/render.mjs`. Needs the D2
 * CLI (https://d2lang.com, known to work with v0.9.0) on PATH, or set D2 to
 * its path.
 */
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const dir = fileURLToPath(new URL('./', import.meta.url))
const source = `${dir}protocol.d2`
const target = `${dir}protocol.svg`

const TITLE = 'EGM Campaign — Campaign Prep Protocol'
const ARIA_LABEL =
  'Campaign prep sequence with five participants: you the game master, the Elephant (deep context), ' +
  'the campaign document (source of truth), fresh-context Goldfish reviewers, and the table. ' +
  'Phase 1 brainstorms the pitch with seven concurrent lenses and saves a prep brief. ' +
  'Phase 2 drafts the campaign one approved section at a time. ' +
  'Phase 3 reviews the arc with Continuity and Table critic, or a session with Substitute GM, ' +
  "Player's eye and Difficulty, then iterates on Blockers and Majors, with an optional second round. " +
  'Phase 4 plays the session. Phase 5 debriefs, updates the document, and loops to the next session.'

const escapeXml = (text) =>
  text.replace(/&/gu, '&amp;').replace(/</gu, '&lt;').replace(/>/gu, '&gt;').replace(/"/gu, '&quot;')

execFileSync(process.env.D2 ?? 'd2', [source, target], { stdio: 'inherit' })

let svg = readFileSync(target, 'utf8')
const open = /<svg\b[^>]*>/u.exec(svg)[0]
const [minX, minY, width, height] = /viewBox="([^"]+)"/u.exec(open)[1].trim().split(/\s+/u).map(Number)

const tag = open.replace(/^<svg/u,
  `<svg role="img" aria-label="${escapeXml(ARIA_LABEL)}" width="${width}" height="${height}"`)
const canvas =
  '<style>.egm-canvas{fill:#FFFFFF}@media (prefers-color-scheme:dark){.egm-canvas{fill:#1E1E2E}}</style>' +
  `<rect class="egm-canvas" x="${minX}" y="${minY}" width="${width}" height="${height}" stroke-width="0" />`

svg = svg.replace(open, `${tag}<title>${escapeXml(TITLE)}</title>${canvas}`)
writeFileSync(target, svg)
console.log(`wrote ${target} (${width}x${height})`)
