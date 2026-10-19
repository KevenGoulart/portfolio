// The pixel art world of the portfolio: the Swiss Alps hero scene (a chalet on
// a grassy slope and Thorfinn sitting on a rocky ledge) that continues to the
// right into a valley with lakes and a little Swiss town along a cobbled
// street. It is split into parallax layers that are rendered in vertical
// tiles on demand, so arbitrarily long journeys stay cheap.
// Layout values are designed on a 512×256 grid (u, v) and rendered at K times
// that resolution (x, y in fine pixels).

import {
  cachedNoise,
  createSurface,
  disc,
  dither,
  hash,
  line,
  mulberry32,
  overlaps,
  quad,
  rect,
  set,
  setRaw,
  snap,
  type Surface
} from './pixels'

export const K = 2
export const TILE_WIDTH = 512
// the world extends above the hero's top edge for tall (portrait) screens
export const WORLD_TOP = -256
export const WORLD_BOTTOM = 256 * K
export const WORLD_HEIGHT = WORLD_BOTTOM - WORLD_TOP
export const HERO_WIDTH = 512 * K
// right edge of the hero composition that should be visible on load
export const HERO_FOCUS_END = 612
// street level of the town
export const GROUND_Y = 466
// generated content reaches this far, beyond any realistic journey length
const WORLD_END = 40000

export type LayerId = 'far' | 'hills' | 'valley' | 'fore'

export interface SpriteImage {
  width: number
  height: number
  data: Uint8ClampedArray
}

export interface BannerText {
  title: string
  subtitle: string
}

// ---------------------------------------------------------------- helpers

function pick<T>(rand: () => number, items: T[]) {
  return items[Math.floor(rand() * items.length)]
}

// items sorted by x: visit the ones whose x lies in [x0, x1)
function forRange<T extends { x: number }>(
  items: T[],
  x0: number,
  x1: number,
  visit: (item: T) => void
) {
  let lo = 0
  let hi = items.length
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (items[mid].x < x0) lo = mid + 1
    else hi = mid
  }
  for (let i = lo; i < items.length && items[i].x < x1; i++) visit(items[i])
}

// ---------------------------------------------------------------- sky

const SKY_STOPS = [
  0x2a78d2, 0x3584d8, 0x4592de, 0x58a0e3, 0x6daee8, 0x86bdec, 0xa2ccef,
  0xbcdaf1, 0xd2e6f3
]

// color of the sky above the top of the world
export const SKY_TOP_COLOR = snap(SKY_STOPS[0])

export function drawSky(s: Surface) {
  const horizon = 170 * K
  for (let y = s.oy; y < s.oy + s.height; y++) {
    const clamped = Math.max(0, Math.min(y, horizon))
    const pos = (clamped / horizon) * (SKY_STOPS.length - 1)
    const band = Math.floor(pos)
    const frac = pos - band
    const next = Math.min(band + 1, SKY_STOPS.length - 1)
    for (let x = s.ox; x < s.ox + s.width; x++) {
      set(s, x, y, frac > dither(x, y) ? SKY_STOPS[next] : SKY_STOPS[band])
    }
  }
}

interface Cloud {
  x: number
  y: number
  speed: number
  puffs: [number, number, number][]
}

// clouds wrap around a span (layout units) wider than the screen
export function createClouds(span: number): Cloud[] {
  const rand = mulberry32(7)
  const count = Math.max(4, Math.round(span / 148))
  const rows = [22, 48, 30, 64]
  return Array.from({ length: count }, (_, i) => {
    const puffs: [number, number, number][] = []
    const parts = 3 + Math.floor(rand() * 4)
    for (let p = 0; p < parts; p++) {
      const r = 3 + rand() * 5
      puffs.push([p * 6 + rand() * 4, -r * 0.3 + rand() * 2, r])
    }
    return {
      x: (i * span) / count + rand() * 60,
      y: rows[i % rows.length],
      speed: 1 + rand() * 1.4,
      puffs
    }
  })
}

function wrap(value: number, span: number) {
  return ((value % span) + span) % span
}

// s covers the screen; shift is how far the cloud layer has scrolled (layout)
export function drawClouds(
  s: Surface,
  clouds: Cloud[],
  span: number,
  time: number,
  shift: number
) {
  for (const cloud of clouds) {
    const ox = Math.floor(wrap(cloud.x + time * cloud.speed - shift, span) * K)
    const left = s.ox + ox - 60 * K
    const oy = cloud.y * K
    for (const [px, py, r] of cloud.puffs) {
      disc(s, left + px * K, oy + (py + 1.5) * K, r * K, 0xcfe0ef)
    }
    for (const [px, py, r] of cloud.puffs) {
      disc(s, left + px * K, oy + (py - 0.5) * K, (r - 1) * K, 0xf7fbff)
    }
    for (const [px, py, r] of cloud.puffs) {
      for (let x = -r * K; x <= r * K; x++) {
        set(s, left + px * K + x, oy + (py + r * 0.6 + 1) * K, 0xcfe0ef)
      }
    }
  }
}

export function drawBirds(
  s: Surface,
  span: number,
  time: number,
  shift: number
) {
  const base = wrap(time * 10 - shift, span) - 30
  const flock: [number, number][] = [
    [0, 0],
    [-7, 4],
    [-13, -2],
    [-19, 5]
  ]
  const color = 0x34465a
  flock.forEach(([dx, dy], i) => {
    const x = s.ox + Math.floor((base + dx) * K)
    const y = Math.floor((84 + dy + Math.sin(time * 0.8 + i) * 2) * K)
    const up = Math.floor(time * 6 + i * 2) % 2 === 0
    const wing = up ? -1 : 1
    set(s, x, y, color)
    set(s, x + 1, y, color)
    set(s, x - 1, y + (up ? -1 : 0), color)
    set(s, x - 2, y + wing, color)
    set(s, x - 3, y + wing, color)
    set(s, x + 2, y + (up ? -1 : 0), color)
    set(s, x + 3, y + wing, color)
    set(s, x + 4, y + wing, color)
  })
}

// ---------------------------------------------------------------- mountains

interface Peak {
  x: number
  y: number
  left: number
  right: number
}

interface Range {
  peaks: Peak[]
  seed: number
  rock: number
  rockShade: number
  rockDark: number
  snow?: { lit: number; shade: number; line: number; depth: number }
  haze: number
  hazeShade: number
  hazeStart: number
  hazeLength: number
  base: number
}

// more peaks beyond the hero, far enough not to change its silhouette
function extendPeaks(
  peaks: Peak[],
  seed: number,
  from: number,
  y: [number, number],
  gap: [number, number],
  slope: [number, number]
) {
  const rand = mulberry32(seed)
  const lerp = ([a, b]: [number, number]) => a + rand() * (b - a)
  const out = [...peaks]
  for (let x = from; x < WORLD_END / K + 400; x += lerp(gap)) {
    out.push({ x, y: lerp(y), left: lerp(slope), right: lerp(slope) })
  }
  return out
}

// the big snowy massif in the back (Jungfrau-like)
const MASSIF: Range = {
  peaks: extendPeaks(
    [
      { x: 40, y: 104, left: 0.5, right: 0.45 },
      { x: 178, y: 44, left: 0.85, right: 0.7 },
      { x: 252, y: 66, left: 0.6, right: 0.55 },
      { x: 330, y: 52, left: 0.6, right: 0.75 },
      { x: 400, y: 30, left: 0.8, right: 0.6 },
      { x: 470, y: 50, left: 0.55, right: 0.5 }
    ],
    111,
    640,
    [26, 80],
    [60, 120],
    [0.5, 0.9]
  ),
  seed: 11,
  rock: 0x8ea8c6,
  rockShade: 0x7590b2,
  rockDark: 0x627d9f,
  snow: { lit: 0xf8fbff, shade: 0xc3d3e8, line: 128, depth: 30 },
  haze: 0x9ab9d8,
  hazeShade: 0x88a9cb,
  hazeStart: 112,
  hazeLength: 30,
  base: 190
}

// hazy ridge behind the house
const LEFT_RIDGE: Range = {
  peaks: [
    { x: 0, y: 124, left: 0.4, right: 0.35 },
    { x: 96, y: 132, left: 0.4, right: 0.3 },
    { x: 210, y: 150, left: 0.3, right: 0.3 }
  ],
  seed: 23,
  rock: 0x7397ba,
  rockShade: 0x6488ad,
  rockDark: 0x587ca1,
  haze: 0x86a8c6,
  hazeShade: 0x7a9dbd,
  hazeStart: 150,
  hazeLength: 20,
  base: 200
}

// forested mountains rising from the valley
const VALLEY_MOUNTAINS: Range = {
  peaks: extendPeaks(
    [
      { x: 548, y: 92, left: 0.44, right: 0.4 },
      { x: 452, y: 124, left: 0.5, right: 0.3 }
    ],
    131,
    700,
    [84, 128],
    [110, 190],
    [0.35, 0.55]
  ),
  seed: 31,
  rock: 0x5a86ab,
  rockShade: 0x46719a,
  rockDark: 0x3d6890,
  haze: 0x7ea3c0,
  hazeShade: 0x6f96b6,
  hazeStart: 156,
  hazeLength: 22,
  base: 200
}

function drawRange(s: Surface, range: Range) {
  const x0 = s.ox
  const x1 = s.ox + s.width
  const peaks = range.peaks.filter(
    (p) => p.x * K > x0 - 900 && p.x * K < x1 + 900
  )
  if (!peaks.length) return
  const jag = cachedNoise(range.seed)
  const jag2 = cachedNoise(range.seed + 1)
  const ribs = cachedNoise(range.seed + 2)
  const fine = cachedNoise(range.seed + 3)
  for (let x = x0; x < x1; x++) {
    const u = x / K
    let top = Infinity
    for (const p of peaks) {
      const h = p.y + Math.abs(u - p.x) * (u < p.x ? p.left : p.right)
      if (h < top) top = h
    }
    top +=
      (jag(u * 0.16) - 0.5) * 4 +
      (jag2(u * 0.55) - 0.5) * 1.5 +
      (fine(u * 1.4) - 0.5) * 0.8

    for (let y = Math.max(s.oy, Math.floor(top * K)); y < range.base * K; y++) {
      const v = y / K
      const depth = v - top
      // the face a pixel belongs to wanders a little with depth, so the fold
      // between two peaks reads as a gully instead of a straight vertical line
      const drift = (jag2(v * 0.15 + 90) - 0.5) * 16 * Math.min(1, depth / 18)
      let face = peaks[0]
      let faceTop = Infinity
      for (const p of peaks) {
        const su = u + drift
        const h = p.y + Math.abs(su - p.x) * (su < p.x ? p.left : p.right)
        if (h < faceTop) {
          faceTop = h
          face = p
        }
      }
      const wobble =
        (jag(v * 0.3 + face.x) - 0.5) * 6 * Math.min(1, (v - face.y) / 14)
      const shaded = u < face.x + wobble
      // ribs follow the fall line, diagonal away from the summit
      const dir = u < face.x ? 1 : -1
      const along = u + depth * dir * 0.9
      const rib = ribs(along * 0.22)
      const crack = ribs(along * 0.7 + 37)
      let color = shaded ? range.rockShade : range.rock
      if (rib > 0.7) color = range.rockDark
      else if (crack > 0.8 && depth > 2) {
        color = shaded ? range.rockDark : range.rockShade
      }
      if (range.snow) {
        const { line: snowLine, depth: snowDepth } = range.snow
        const limit = snowDepth * (0.45 + jag2(u * 0.07) * 0.8)
        const isSnow =
          v < snowLine - (1 - jag(u * 0.1)) * 14 &&
          (depth < limit * 0.5 || (rib < 0.62 && depth < limit * 1.6))
        if (isSnow) color = shaded ? range.snow.shade : range.snow.lit
      }
      const hz = v - range.hazeStart
      if (hz > 0 && hz / range.hazeLength > dither(x, y)) {
        color = shaded ? range.hazeShade : range.haze
      }
      set(s, x, y, color)
    }
  }
}

// ---------------------------------------------------------------- valley

const VALLEY_TOP = 166

const FIELD_COLORS = [
  0x7aa857, 0x86b35e, 0x6c9c4b, 0x93bb63, 0x7fa34f, 0x426f43, 0x4c7a46
]

interface Lake {
  cx: number
  cy: number
  rx: number
  ry: number
  seed: number
}

function createLakes(): Lake[] {
  const lakes: Lake[] = [
    { cx: 410, cy: 208, rx: 120, ry: 17, seed: 51 },
    { cx: 300, cy: 179, rx: 36, ry: 4.5, seed: 53 }
  ]
  const rand = mulberry32(61)
  for (let x = 760, i = 0; x < WORLD_END / K; i++) {
    const cy = 180 + rand() * 22
    const ry = (3 + (cy - 176) * 0.5) * (0.7 + rand() * 0.5)
    const rx = 40 + rand() * 90
    lakes.push({ cx: x, cy, rx, ry, seed: 200 + i })
    x += rx * 2 + 140 + rand() * 260
  }
  return lakes
}

const LAKES = createLakes()

// u and v are in layout units (the 512×256 grid)
function inLake(lake: Lake, u: number, v: number) {
  const n = cachedNoise(lake.seed)
  const angle = Math.atan2((v - lake.cy) / lake.ry, (u - lake.cx) / lake.rx)
  const wobble = 1 + (n(angle * 4 + 10) - 0.5) * 0.3
  const d = ((u - lake.cx) / lake.rx) ** 2 + ((v - lake.cy) / lake.ry) ** 2
  return d < wobble * wobble
}

function inAnyLake(u: number, v: number) {
  for (const lake of LAKES) {
    if (Math.abs(u - lake.cx) < lake.rx * 1.3 && inLake(lake, u, v)) return true
  }
  return false
}

export function lakeBounds(lake: Lake) {
  return {
    x0: Math.floor((lake.cx - lake.rx * 1.3) * K),
    x1: Math.ceil((lake.cx + lake.rx * 1.3) * K),
    y0: Math.floor((lake.cy - lake.ry * 1.3) * K),
    y1: Math.ceil((lake.cy + lake.ry * 1.3) * K)
  }
}

interface Dot {
  x: number
  y: number
}

interface VillageDot extends Dot {
  tower: boolean
}

// villages with a church, and woods around the lakes; the hero part keeps
// the exact random sequence and drawing order it was designed with
function createValleyDetails() {
  const heroVillages: VillageDot[] = []
  const villages: VillageDot[] = []
  const heroWoods: Dot[] = []
  const woods: Dot[] = []
  const rand = mulberry32(77)
  const addVillage = (
    target: VillageDot[],
    [vx, vy, count]: [number, number, number],
    r: () => number
  ) => {
    for (let i = 0; i < count; i++) {
      const x = Math.floor((vx + (r() - 0.5) * count * 6) * K)
      const y = Math.floor((vy + (r() - 0.5) * 4) * K)
      if (inAnyLake(x / K, y / K)) continue
      target.push({ x, y, tower: false })
    }
    target.push({ x: vx * K, y: vy * K, tower: true })
  }
  const heroVillageSpots: [number, number, number][] = [
    [318, 190, 6],
    [262, 182, 4],
    [470, 186, 5],
    [342, 177, 3]
  ]
  for (const village of heroVillageSpots) {
    addVillage(heroVillages, village, rand)
  }
  const woodsNoise = cachedNoise(91)
  for (let i = 0; i < 1000; i++) {
    const x = Math.floor((200 + rand() * 312) * K)
    const y = Math.floor((VALLEY_TOP + 4 + rand() * 50) * K)
    if (inAnyLake(x / K, y / K) || woodsNoise((x / K) * 0.05) < 0.55) continue
    heroWoods.push({ x, y })
  }

  const extra = mulberry32(78)
  for (const lake of LAKES.slice(2)) {
    const count = 3 + Math.floor(extra() * 4)
    const vx = lake.cx - lake.rx * (0.4 + extra() * 0.5)
    addVillage(villages, [vx, lake.cy - lake.ry - 4, count], extra)
  }
  for (let u = 512; u < WORLD_END / K; u += 0.32) {
    const x = Math.floor((u + extra() * 0.3) * K)
    const y = Math.floor((VALLEY_TOP + 4 + extra() * 50) * K)
    if (woodsNoise((x / K) * 0.05) < 0.55 || inAnyLake(x / K, y / K)) continue
    woods.push({ x, y })
  }
  return {
    heroVillages,
    villages: villages.sort((a, b) => a.x - b.x || +a.tower - +b.tower),
    heroWoods,
    woods
  }
}

const VALLEY_DETAILS = createValleyDetails()

function drawVillageDot(s: Surface, { x, y, tower }: VillageDot) {
  if (tower) {
    rect(s, x, y - 9, 2, 9, 0xf1ece0)
    set(s, x + 1, y - 9, 0xe2dccb)
    set(s, x, y - 7, 0x5a6a7a)
    rect(s, x, y - 11, 2, 2, 0x6a6f78)
    set(s, x, y - 12, 0x6a6f78)
    return
  }
  rect(s, x, y - 2, 3, 3, 0xf1ece0)
  rect(s, x + 3, y - 2, 1, 3, 0xe2dccb)
  set(s, x + 1, y - 1, 0x5a6a7a)
  rect(s, x - 1, y - 3, 6, 1, 0x9a4a35)
  rect(s, x, y - 4, 4, 1, 0x7c3a2a)
}

function drawValley(s: Surface) {
  const n = cachedNoise(43)
  const horizon = 150
  const x0 = s.ox
  const x1 = s.ox + s.width
  for (let x = x0; x < x1; x++) {
    const u = x / K
    const top = VALLEY_TOP + (n(u * 0.03) - 0.5) * 4
    const topY = Math.round(top * K)
    for (let y = topY; y < WORLD_BOTTOM; y++) {
      const v = y / K
      // perspective patchwork of fields separated by hedgerows
      const dz = v - horizon
      const fx = ((u - 300) / dz) * 6
      const fz = 900 / dz / 1.6
      const fieldPick = hash(Math.floor(fx), Math.floor(fz), 3)
      let color = FIELD_COLORS[Math.floor(fieldPick * FIELD_COLORS.length)]
      const edge = fx - Math.floor(fx) < 4 / dz || fz - Math.floor(fz) < 0.03
      if (edge && dz > 40) color = 0x4f7d40
      if (hash(x, y, 9) < 0.06) color = 0x5d8d45
      if (y === topY) color = 0x93b874
      const haze = 1 - (v - top) / 26
      if (haze > dither(x, y)) color = v - top < 6 ? 0x8fb2a8 : 0x88ad8a
      set(s, x, y, color)
    }
  }

  const lakes = LAKES.filter((lake) => {
    const b = lakeBounds(lake)
    return overlaps(s, b.x0, b.x1)
  })
  for (const lake of lakes) {
    const b = lakeBounds(lake)
    for (let y = b.y0; y <= b.y1; y++) {
      for (let x = Math.max(b.x0, x0); x <= Math.min(b.x1, x1 - 1); x++) {
        const u = x / K
        const v = y / K
        if (!inLake(lake, u, v)) continue
        const t = (v - (lake.cy - lake.ry)) / (lake.ry * 2)
        let color = t < 0.35 ? 0x6ea6d2 : t < 0.7 ? 0x5592c6 : 0x4580b8
        if (t < 0.35 && t > 0.15 && dither(x, y) > 0.5) color = 0x5f98c8
        if (hash(Math.floor(x / 7), y, 21) < 0.05) color = 0x6ea6d2
        // darker reflection right under the far shore
        if (!inLake(lake, u, v - 1.5)) color = 0x3f6f99
        set(s, x, y, color)
      }
    }
  }

  // sandy shore on the near side
  for (const lake of lakes) {
    const b = lakeBounds(lake)
    for (let y = b.y0; y <= b.y1; y++) {
      for (let x = Math.max(b.x0, x0); x <= Math.min(b.x1, x1 - 1); x++) {
        const u = x / K
        const v = y / K
        if (v < lake.cy || inLake(lake, u, v)) continue
        if (inLake(lake, u, v - 1 / K)) set(s, x, y, 0xd1c79a)
        else if (inLake(lake, u, v - 2 / K)) set(s, x, y, 0xb9ae84)
      }
    }
  }

  if (x0 < HERO_WIDTH + 8) {
    for (const dot of VALLEY_DETAILS.heroVillages) drawVillageDot(s, dot)
  }
  forRange(VALLEY_DETAILS.villages, x0 - 8, x1 + 8, (dot) =>
    drawVillageDot(s, dot)
  )
  const tree = ({ x, y }: Dot) => {
    if (x < x0 - 2 || x > x1 + 2) return
    set(s, x - 1, y, 0x3b6640)
    set(s, x, y, 0x3b6640)
    set(s, x + 1, y, 0x4a7a4c)
    set(s, x, y - 1, 0x3b6640)
    set(s, x, y - 2, 0x4a7a4c)
  }
  if (x0 < HERO_WIDTH + 4) VALLEY_DETAILS.heroWoods.forEach(tree)
  forRange(VALLEY_DETAILS.woods, x0 - 2, x1 + 2, tree)
}

// ---------------------------------------------------------------- slopes

const lawnNoise = cachedNoise(41)
const TOWN_START_U = 560
export const TOWN_X = TOWN_START_U * K

// height of the ground in layout units: the grassy slope of the hero drops
// towards the valley, then the terrain climbs back up to the town street
function groundAt(u: number) {
  const bump = (lawnNoise(u * 0.04) - 0.5) * 3
  const base = 168 + u * 0.025 + bump
  const drop = Math.max(0, u - 262)
  const hill = base + drop * drop * 0.028
  const rise = Math.max(0, TOWN_START_U - u)
  const town = GROUND_Y / K + rise * rise * 0.02
  return Math.min(hill, town)
}

function groundY(x: number) {
  return Math.round(groundAt(x / K) * K)
}

// a closer, lower slope covered by woods below the valley; left of the
// ledge it hides behind the hero lawn until the parallax reveals it
function nearSlopeAt(u: number) {
  const noise = (lawnNoise(u * 0.08 + 30) - 0.5) * 6
  if (u < 300) return 200 + Math.max(0, u - 260) * 0.9 + noise
  return 236 - Math.min(u - 300, 220) * 0.06 + noise
}

function createNearSlopeTrees() {
  const trees: { x: number; base: number; h: number }[] = []
  const hidden = mulberry32(18)
  for (let u = 6; u < 300; u += 3 + Math.floor(hidden() * 5)) {
    if (lawnNoise(u * 0.03 + 7) < 0.4) continue
    const h = (10 + Math.floor(hidden() * 8)) * K
    const base = (nearSlopeAt(u) + 4 + Math.floor(hidden() * 4)) * K
    trees.push({ x: u * K, base: Math.round(base), h })
  }
  const rand = mulberry32(17)
  for (let u = 304; u < WORLD_END / K; u += 3 + Math.floor(rand() * 4)) {
    if (lawnNoise(u * 0.03 + 7) < 0.45) continue
    const h = (10 + Math.floor(rand() * 8)) * K
    const base = (nearSlopeAt(u) + 4 + Math.floor(rand() * 4)) * K
    trees.push({ x: u * K, base: Math.round(base), h })
  }
  return trees
}

const NEAR_SLOPE_TREES = createNearSlopeTrees()

function drawNearSlope(s: Surface) {
  for (let x = s.ox; x < s.ox + s.width; x++) {
    const top = Math.round(nearSlopeAt(x / K) * K)
    for (let y = top; y < WORLD_BOTTOM; y++) {
      const depth = y - top
      let color = depth < 3 ? 0x5fa040 : 0x3f7f2c
      if (dither(x, y) < depth / K / 40) color = 0x356f26
      if (hash(x, y, 8) < 0.06) color = 0x4d9236
      set(s, x, y, color)
    }
  }
  forRange(NEAR_SLOPE_TREES, s.ox - 24, s.ox + s.width + 24, (tree) => {
    conifer(s, tree.x, tree.base, tree.h, 0x1d4424, 0x2b6131)
  })
}

function conifer(
  s: Surface,
  x: number,
  baseY: number,
  h: number,
  dark: number,
  light: number
) {
  rect(s, x - 1, baseY - 4, 2, 5, 0x4a3524)
  for (let i = 0; i < h; i++) {
    const y = baseY - h + i - 3
    // tiers of boughs that widen and then step back in
    const half = Math.floor(((i % 8) * 0.8 + i / 2.4) / 2)
    for (let dx = -half; dx <= half; dx++) {
      const lit = dx > 0 || (dx === 0 && i % 4 === 0)
      set(s, x + dx, y, lit ? light : dark)
    }
    if (half > 1 && i % 8 === 7) set(s, x + half, y, dark)
  }
}

function bush(s: Surface, x: number, y: number, r: number) {
  disc(s, x, y, r, 0x2f6a2a)
  disc(s, x + r * 0.3, y - r * 0.3, r * 0.6, 0x3f8a35)
  set(s, x + r * 0.4, y - r * 0.5, 0x5aa846)
  set(s, x + r * 0.5, y - r * 0.4, 0x5aa846)
  set(s, x - r * 0.4, y + r * 0.2, 0x3f8a35)
}

// ---------------------------------------------------------------- hero lawn

function createLawnDetails() {
  const rand = mulberry32(99)
  const tufts: Dot[] = []
  const flowers: { x: number; y: number; color: number; big: boolean }[] = []
  for (let i = 0; i < 2600; i++) {
    const x = Math.floor(rand() * 300 * K)
    const top = groundY(x)
    const y = top + 6 + Math.floor(rand() * (WORLD_BOTTOM - top - 6))
    tufts.push({ x, y })
  }
  const colors = [0xf6f3ea, 0xf3d34c, 0xf6f3ea, 0xe5677b, 0xb18ad8]
  for (let i = 0; i < 1700; i++) {
    const x = Math.floor(rand() * 300 * K)
    const top = groundY(x)
    const y = top + 8 + Math.floor(rand() * (WORLD_BOTTOM - top - 8))
    if (rand() > (y - top) / (60 * K) + 0.1) continue
    const color = colors[Math.floor(rand() * colors.length)]
    flowers.push({ x, y, color, big: y > 220 * K && rand() < 0.5 })
  }
  return { tufts, flowers }
}

const LAWN_DETAILS = createLawnDetails()

function drawLawn(s: Surface) {
  const end = Math.min(s.ox + s.width, TOWN_X)
  for (let x = s.ox; x < end; x++) {
    const u = x / K
    const top = groundY(x)
    for (let y = Math.max(s.oy, top); y < WORLD_BOTTOM; y++) {
      const v = y / K
      const depth = y - top
      let color: number
      if (u < 400) {
        // mown stripes and a darker shade towards the bottom right
        const stripe = Math.floor((u * 0.6 + v * 1.4) / 18) % 2 === 0
        color = stripe ? 0x4fae36 : 0x48a532
        if (depth < 1) color = 0x8fd35a
        else if (depth < 4) color = 0x6cc246
        const shadow = (u - 120) / 260 + (v - 210) / 90
        if (shadow > 0.6 && shadow - 0.6 > dither(x, y) * 0.8) {
          color = 0x3b8d29
        }
        if (shadow > 1.05 && shadow - 1.05 > dither(x, y) * 0.8) {
          color = 0x317a22
        }
      } else {
        // the slope climbing back up to the town
        color = depth < 1 ? 0x8fd35a : depth < 4 ? 0x6cc246 : 0x48a532
      }
      const h = hash(x, y, 5)
      if (h < 0.04) color = 0x66be43
      else if (h < 0.07) color = 0x3a8a27
      set(s, x, y, color)
    }
    // grass blades on the edge of the slope
    if (hash(x, 1, 6) < 0.5) set(s, x, top - 1, 0x79c94f)
    if (hash(x, 2, 6) < 0.15) set(s, x, top - 2, 0x79c94f)
  }

  if (s.ox > 300 * K + 2) return
  for (const { x, y } of LAWN_DETAILS.tufts) {
    set(s, x, y, 0x66be43)
    set(s, x, y - 1, 0x66be43)
    set(s, x + 1, y, 0x3a8a27)
  }
  for (const { x, y, color, big } of LAWN_DETAILS.flowers) {
    set(s, x, y, color)
    if (!big) continue
    set(s, x - 1, y, color)
    set(s, x + 1, y, color)
    set(s, x, y - 1, color)
    set(s, x, y, 0xf3d34c)
    set(s, x, y + 1, 0x3a8a27)
  }
}

function drawGarden(s: Surface) {
  // hedge running down the slope like in the reference photo
  for (let u = 232; u < 254; u += 2.5) {
    bush(s, u * K, groundY(u * K) - 3 * K, 3.2 * K)
  }
  for (let u = 228; u < 252; u += 8) {
    const g = groundY(u * K)
    rect(s, u * K, g - 12, 2, 12, 0x6e5a44)
    set(s, u * K, g - 12, 0x8a7458)
  }
  conifer(s, 110 * K, groundY(110 * K) + 12, 28, 0x24552a, 0x347238)
  conifer(s, 196 * K, groundY(196 * K) + 12, 24, 0x24552a, 0x347238)
  bush(s, 132 * K, groundY(132 * K) + 8, 6)
  bush(s, 214 * K, groundY(214 * K) + 6, 5)
  conifer(s, 300 * K, groundY(300 * K) + 4, 36, 0x204b26, 0x2f6a34)
}

// rocky ledge jutting out where the slope curves down to the valley
const LEDGE_X0 = 254 * K
const LEDGE_X1 = 293 * K
const LEDGE_TOP = groundY(LEDGE_X0)

function drawLedge(s: Surface) {
  for (let x = Math.max(LEDGE_X0, s.ox); x <= LEDGE_X1; x++) {
    const t = (x - LEDGE_X0) / (LEDGE_X1 - LEDGE_X0)
    const bottom = Math.min(
      groundY(x) + 4,
      LEDGE_TOP + Math.round((5 + t * 8) * K)
    )
    for (let y = LEDGE_TOP; y <= bottom; y++) {
      const depth = y - LEDGE_TOP
      let color = depth < 5 ? 0xab947a : 0x966c6c
      if (x > LEDGE_X1 - 5 || y > bottom - 3) color = 0x694f62
      if (hash(x, y, 12) < 0.1) color = 0x694f62
      if ((x + depth * 2) % 17 === 0 && depth > 4) color = 0x45293f
      set(s, x, y, color)
    }
    // grass rim on top of the rock
    if (x < LEDGE_X1 - 8) {
      set(s, x, LEDGE_TOP, hash(x, 0, 13) < 0.5 ? 0x8fd35a : 0x6cc246)
      if (hash(x, 1, 13) < 0.4) set(s, x, LEDGE_TOP - 1, 0x79c94f)
      if (hash(x, 2, 13) < 0.15) set(s, x, LEDGE_TOP - 2, 0x79c94f)
    }
  }
  // contact shadow under Thorfinn's seat
  for (let x = THORFINN_X + 3; x < LEDGE_X1; x++) {
    set(s, x, LEDGE_TOP + 1, 0x694f62)
  }
}

// ---------------------------------------------------------------- hero chalet

const HOUSE_BASE = 175 * K

function drawChalet(s: Surface) {
  const wood = 0x5a3522
  const woodLine = 0x45281a
  const woodLight = 0x6e4430
  const gableWood = 0x4a2c1c
  const gableLine = 0x3a2216
  const plaster = 0xf1eee6
  const plasterShade = 0xd8d3c8
  const roof = 0x7a4a36
  const roofLight = 0x93604a
  const roofDark = 0x56321f
  const fascia = 0x3e2416
  const red = 0xc8352e
  const redDark = 0xa52e28
  const frame = 0xefe9dc
  const glass = 0x2f4458
  const glare = 0x7393b0

  const fx0 = 184
  const fx1 = 400
  const upperTop = 256
  const floorY = 304

  const pane = (x: number, y: number, w: number, h: number) => {
    rect(s, x, y, w, h, glass)
    set(s, x + 1, y + 1, glare)
    set(s, x + 2, y + 1, glare)
    set(s, x + 1, y + 2, glare)
    set(s, x + w - 2, y + h - 2, 0x24364a)
  }

  // gable end on the left, seen at an angle
  quad(
    s,
    [
      [132, 252],
      [184, 260],
      [184, HOUSE_BASE],
      [132, HOUSE_BASE - 8]
    ],
    plasterShade
  )
  quad(
    s,
    [
      [132, 252],
      [184, 260],
      [184, floorY],
      [132, floorY - 8]
    ],
    gableWood
  )
  for (let y = 264; y < floorY; y += 4) line(s, 132, y - 8, 184, y, gableLine)
  quad(
    s,
    [
      [132, 254],
      [184, 262],
      [158, 208]
    ],
    gableWood
  )
  for (let x = 136; x < 184; x += 4) {
    line(s, x, 256, x, 224 + Math.abs(x - 158), gableLine)
  }
  rect(s, 148, 232, 12, 14, frame)
  pane(150, 234, 3, 4)
  pane(155, 234, 3, 4)
  pane(150, 240, 3, 4)
  pane(155, 240, 3, 4)
  rect(s, 144, 316, 12, 16, 0xe9e4d8)
  pane(146, 318, 3, 5)
  pane(151, 318, 3, 5)
  pane(146, 325, 3, 5)
  pane(151, 325, 3, 5)
  for (let y = 300; y < HOUSE_BASE; y++) {
    for (let x = 132; x < 184; x++) {
      if (hash(x, y, 33) < 0.012) set(s, x, y, 0xc4beb2)
    }
  }

  // long front wall: dark wood upstairs, white plaster downstairs
  rect(s, fx0, upperTop, fx1 - fx0, floorY - upperTop, wood)
  for (let y = upperTop + 3; y < floorY; y += 4) {
    line(s, fx0, y, fx1 - 1, y, woodLine)
  }
  for (let y = upperTop; y < floorY; y++) {
    for (let x = fx0; x < fx1; x++) {
      if (hash(x, y, 31) < 0.04) set(s, x, y, woodLine)
    }
  }
  for (let x = fx0; x < fx1; x += 34) {
    line(s, x, upperTop, x, floorY - 1, woodLight)
    line(s, x + 1, upperTop, x + 1, floorY - 1, woodLine)
  }
  rect(s, fx0, floorY, fx1 - fx0, HOUSE_BASE - floorY, plaster)
  for (let y = floorY; y < HOUSE_BASE; y++) {
    for (let x = fx0; x < fx1; x++) {
      if (hash(x, y, 2) < 0.012) set(s, x, y, plasterShade)
    }
  }
  for (let x = fx0; x < fx1; x++) {
    set(s, x, HOUSE_BASE - 1, 0xb8b2a6)
    if (dither(x, HOUSE_BASE - 2) < 0.5) set(s, x, HOUSE_BASE - 2, 0xb8b2a6)
  }
  // beam between the floors
  rect(s, fx0, floorY - 2, fx1 - fx0, 4, gableLine)
  line(s, fx0, floorY - 2, fx1 - 1, floorY - 2, woodLight)

  // upstairs windows with red geranium boxes
  for (let i = 0; i < 5; i++) {
    const wx = 208 + i * 36
    const wy = 266
    rect(s, wx, wy, 20, 22, frame)
    pane(wx + 2, wy + 2, 7, 7)
    pane(wx + 11, wy + 2, 7, 7)
    pane(wx + 2, wy + 11, 7, 9)
    pane(wx + 11, wy + 11, 7, 9)
    rect(s, wx - 2, 290, 24, 5, 0x6b3b22)
    line(s, wx - 2, 290, wx + 21, 290, 0x8a4e2c)
    for (let x = wx - 2; x < wx + 22; x++) {
      for (let y = 284; y < 290; y++) {
        const h = hash(x, y, 40 + i)
        if (y < 287 && h > 0.55) continue
        set(s, x, y, h < 0.28 ? red : h < 0.4 ? 0xe2544a : 0x3f7a3a)
      }
      if (x % 3 === 0) set(s, x, 295, 0x3f7a3a)
      if (x % 5 === 1) set(s, x, 296, 0x3f7a3a)
    }
  }

  // ground floor: red door and windows with red shutters
  rect(s, 254, 312, 26, 38, 0x8e2a24)
  rect(s, 257, 315, 20, 35, red)
  for (const [px, py, ph] of [
    [260, 318, 13],
    [268, 318, 13],
    [260, 334, 13],
    [268, 334, 13]
  ]) {
    rect(s, px, py, 6, ph, redDark)
    rect(s, px + 1, py + 1, 4, ph - 2, red)
  }
  rect(s, 273, 332, 2, 2, 0xe8c25a)
  rect(s, 252, HOUSE_BASE - 2, 30, 2, 0xa9a49a)
  for (const wx of [212, 304, 352]) {
    rect(s, wx - 6, 314, 6, 20, red)
    rect(s, wx + 16, 314, 6, 20, red)
    for (let y = 316; y < 333; y += 3) {
      line(s, wx - 6, y, wx - 1, y, redDark)
      line(s, wx + 16, y, wx + 21, y, redDark)
    }
    rect(s, wx, 314, 16, 20, 0xd9d3c4)
    pane(wx + 2, 316, 5, 7)
    pane(wx + 9, 316, 5, 7)
    pane(wx + 2, 325, 5, 7)
    pane(wx + 9, 325, 5, 7)
    rect(s, wx - 2, 334, 20, 2, 0xb8b2a6)
    for (let x = wx - 1; x < wx + 17; x++) {
      const h = hash(x, 333, wx)
      set(s, x, 333, h < 0.45 ? red : 0x3f7a3a)
      if (h < 0.2) set(s, x, 332, 0xe2544a)
    }
  }
  // bench by the door
  rect(s, 282, 336, 14, 2, 0x7a5232)
  rect(s, 282, 329, 14, 1, 0x7a5232)
  rect(s, 284, 338, 2, 6, 0x5a3a22)
  rect(s, 292, 338, 2, 6, 0x5a3a22)

  // shadow under the eaves
  rect(s, fx0, upperTop, fx1 - fx0, 3, 0x2e1a10)
  for (let x = fx0; x < fx1; x++) {
    if (dither(x, upperTop + 3) < 0.5) set(s, x, upperTop + 3, 0x2e1a10)
  }

  // wide low-pitched roof seen from the long side
  quad(
    s,
    [
      [158, 200],
      [380, 200],
      [420, 260],
      [172, 264]
    ],
    roof
  )
  for (let y = 204; y < 262; y += 4) {
    const t = (y - 200) / 62
    const xl = Math.round(158 + 14 * t) + 1
    const xr = Math.round(380 + 40 * t) - 1
    line(s, xl, y, xr, y, roofDark)
    // staggered shingle joints with a lit edge
    const offset = (y / 4) % 2 ? 5 : 0
    for (let x = xl + offset; x < xr - 1; x += 10) {
      set(s, x, y - 1, roofDark)
      set(s, x + 1, y - 2, roofLight)
      set(s, x + 2, y - 2, roofLight)
    }
  }
  line(s, 158, 200, 380, 200, roofLight)
  line(s, 158, 199, 380, 199, 0x5e3725)
  line(s, 158, 198, 380, 198, 0x5e3725)
  // eave fascia and the verge on the gable
  line(s, 172, 264, 420, 260, fascia)
  line(s, 172, 265, 420, 261, fascia)
  line(s, 172, 266, 420, 262, 0x2a180e)
  for (let t = 0; t < 6; t++) {
    line(s, 158, 200 + t, 120 + t, 254, t < 2 ? roofLight : roofDark)
    line(s, 158, 200 + t, 172, 262, fascia)
  }

  // chimney
  rect(s, 336, 180, 14, 28, 0xb9b3a8)
  rect(s, 336, 180, 3, 28, 0x9f998e)
  for (let y = 183; y < 208; y += 4) line(s, 336, y, 349, y, 0x8f897e)
  for (let y = 180; y < 207; y += 4) {
    for (let x = 336 + ((y / 4) % 2 ? 3 : 0); x < 350; x += 6) {
      set(s, x, y + 1, 0x8f897e)
    }
  }
  rect(s, 334, 176, 18, 4, 0x6a5a4a)
  line(s, 334, 176, 351, 176, 0x8a7a6a)

  // stone foundation
  for (let x = 132; x < fx1; x++) {
    const y =
      x < fx0 ? HOUSE_BASE - 8 + Math.round(((x - 132) * 8) / 52) : HOUSE_BASE
    for (let j = 0; j < 4; j++) {
      const joint = j === 2 || (x + (j > 2 ? 3 : 0)) % 7 === 0
      set(s, x, y + j, joint ? 0x6f6c66 : 0x8f8c84)
    }
  }
}

// ---------------------------------------------------------------- hero tree

function drawFoliage(s: Surface) {
  const rand = mulberry32(13)
  const bark = 0x3a2a1e
  // trunk and branches of the tree on the left edge
  rect(s, 0, WORLD_TOP, 14, 186 * K - WORLD_TOP, bark)
  rect(s, 10, WORLD_TOP, 4, 186 * K - WORLD_TOP, 0x4f3a28)
  // keeps the bark pattern on rows that are multiples of 5
  for (let y = WORLD_TOP + 1; y < 186 * K; y += 5) {
    set(s, 2 + Math.floor(hash(y, 0, 3) * 8), y, 0x2a1e16)
    set(s, 11, y + 2, bark)
  }
  for (const [x1, y1, y0] of [
    [40, 40, 70],
    [70, 12, 40]
  ]) {
    for (let o = 0; o < 4; o++) {
      line(s, 12, y0 * K + o, x1 * K, y1 * K + o, o === 0 ? 0x4f3a28 : bark)
    }
  }

  const clusters: [number, number, number][] = []
  const spine: [number, number][] = [
    [0, 0],
    [40, 4],
    [80, 10],
    [118, 18],
    [140, 30],
    [30, 30],
    [60, 34],
    [20, 60],
    [44, 64],
    [12, 92],
    [30, 104],
    [8, 130]
  ]
  for (const [sx, sy] of spine) {
    for (let i = 0; i < 6; i++) {
      clusters.push([
        sx + (rand() - 0.5) * 30,
        sy + (rand() - 0.5) * 20,
        6 + rand() * 7
      ])
    }
  }
  // branches hanging in the top right corner
  for (let i = 0; i < 14; i++) {
    clusters.push([470 + rand() * 50, rand() * 22, 5 + rand() * 6])
  }
  clusters.push([432, 2, 7], [448, 10, 6])

  // canopy above the hero frame, only seen on tall screens
  const above = mulberry32(14)
  const crown: [number, number, number][] = []
  for (let i = 0; i < 40; i++) {
    crown.push([above() * 150, -30 - above() * 100, 6 + above() * 6])
  }
  for (let i = 0; i < 16; i++) {
    crown.push([440 + above() * 80, -24 - above() * 100, 5 + above() * 6])
  }
  for (let o = 0; o < 4; o++) {
    line(s, 1010 + o, WORLD_TOP, 980 + o, -20, bark)
  }

  const canopy = (list: [number, number, number][], r: () => number) => {
    for (const [cx, cy, cr] of list) disc(s, cx * K, cy * K, cr * K, 0x14301a)
    for (const [cx, cy, cr] of list) {
      disc(s, (cx + 1) * K, (cy - 1) * K, (cr - 2) * K, 0x1f4524)
    }
    for (const [cx, cy, cr] of list) {
      disc(
        s,
        (cx + cr * 0.3) * K,
        (cy - cr * 0.35) * K,
        cr * 0.45 * K,
        0x2f6330
      )
      // leaf speckles, lighter towards the sun
      for (let i = 0; i < cr * 8; i++) {
        const a = r() * Math.PI * 2
        const d = cr * K * (0.3 + r() * 0.8)
        const x = cx * K + Math.cos(a) * d
        const y = cy * K + Math.sin(a) * d
        const lit = Math.cos(a) > 0 && Math.sin(a) < 0
        const color = lit && r() < 0.6 ? 0x3f7a38 : 0x14301a
        set(s, x, y, color)
        if (lit) set(s, x + 1, y, color)
      }
    }
  }
  canopy(clusters, rand)
  // gaps where the sky peeks through the leaves
  for (let i = 0; i < 160; i++) {
    const [cx, cy, r] = clusters[Math.floor(rand() * clusters.length)]
    const x = Math.floor((cx + (rand() - 0.5) * r * 1.6) * K)
    const y = Math.floor((cy + (rand() - 0.5) * r * 1.6) * K)
    if (x <= 20) continue
    set(s, x, y, 0x3584d8)
    if (rand() < 0.4) set(s, x + 1, y, 0x3584d8)
  }
  canopy(crown, above)
}

// ---------------------------------------------------------------- flag

// Pixel font: caps and ascenders are 6 rows tall, the x-height is 4 rows and
// descenders add 2 more rows below the baseline.
const FONT: Record<string, string[]> = {
  A: ['.##.', '#..#', '#..#', '####', '#..#', '#..#'],
  B: ['###.', '#..#', '###.', '#..#', '#..#', '###.'],
  C: ['.###', '#...', '#...', '#...', '#...', '.###'],
  D: ['###.', '#..#', '#..#', '#..#', '#..#', '###.'],
  E: ['####', '#...', '###.', '#...', '#...', '####'],
  F: ['####', '#...', '###.', '#...', '#...', '#...'],
  G: ['.###', '#...', '#...', '#.##', '#..#', '.###'],
  H: ['#..#', '#..#', '####', '#..#', '#..#', '#..#'],
  I: ['###', '.#.', '.#.', '.#.', '.#.', '###'],
  J: ['..##', '...#', '...#', '...#', '#..#', '.##.'],
  K: ['#..#', '#.#.', '##..', '#.#.', '#..#', '#..#'],
  L: ['#...', '#...', '#...', '#...', '#...', '####'],
  M: ['#...#', '##.##', '#.#.#', '#...#', '#...#', '#...#'],
  N: ['#..#', '##.#', '#.##', '#..#', '#..#', '#..#'],
  O: ['.##.', '#..#', '#..#', '#..#', '#..#', '.##.'],
  P: ['###.', '#..#', '#..#', '###.', '#...', '#...'],
  Q: ['.##.', '#..#', '#..#', '#..#', '#.#.', '.#.#'],
  R: ['###.', '#..#', '#..#', '###.', '#.#.', '#..#'],
  S: ['.###', '#...', '.##.', '...#', '...#', '###.'],
  T: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..'],
  U: ['#..#', '#..#', '#..#', '#..#', '#..#', '.##.'],
  V: ['#...#', '#...#', '#...#', '.#.#.', '.#.#.', '..#..'],
  W: ['#...#', '#...#', '#...#', '#.#.#', '##.##', '#...#'],
  X: ['#..#', '#..#', '.##.', '.##.', '#..#', '#..#'],
  Y: ['#...#', '.#.#.', '..#..', '..#..', '..#..', '..#..'],
  Z: ['####', '...#', '..#.', '.#..', '#...', '####'],
  a: ['....', '....', '.###', '#..#', '#..#', '.###'],
  b: ['#...', '#...', '###.', '#..#', '#..#', '###.'],
  c: ['...', '...', '.##', '#..', '#..', '.##'],
  d: ['...#', '...#', '.###', '#..#', '#..#', '.###'],
  e: ['....', '....', '.##.', '####', '#...', '.###'],
  f: ['.##', '#..', '###', '#..', '#..', '#..'],
  g: ['....', '....', '.###', '#..#', '#..#', '.###', '...#', '.##.'],
  h: ['#...', '#...', '###.', '#..#', '#..#', '#..#'],
  i: ['#', '.', '#', '#', '#', '#'],
  j: ['.#', '..', '.#', '.#', '.#', '.#', '.#', '#.'],
  k: ['#...', '#...', '#..#', '###.', '#.#.', '#..#'],
  l: ['#.', '#.', '#.', '#.', '#.', '.#'],
  m: ['.....', '.....', '####.', '#.#.#', '#.#.#', '#.#.#'],
  n: ['....', '....', '###.', '#..#', '#..#', '#..#'],
  o: ['....', '....', '.##.', '#..#', '#..#', '.##.'],
  p: ['....', '....', '###.', '#..#', '#..#', '###.', '#...', '#...'],
  q: ['....', '....', '.###', '#..#', '#..#', '.###', '...#', '...#'],
  r: ['....', '....', '#.##', '##..', '#...', '#...'],
  s: ['....', '....', '.###', '##..', '..##', '###.'],
  t: ['.#.', '.#.', '###', '.#.', '.#.', '..#'],
  u: ['....', '....', '#..#', '#..#', '#..#', '.###'],
  v: ['.....', '.....', '#...#', '#...#', '.#.#.', '..#..'],
  w: ['.....', '.....', '#...#', '#.#.#', '#.#.#', '.#.#.'],
  x: ['....', '....', '#..#', '.##.', '.##.', '#..#'],
  y: ['....', '....', '#..#', '#..#', '#..#', '.###', '...#', '.##.'],
  z: ['....', '....', '####', '..#.', '.#..', '####'],
  '-': ['...', '...', '...', '###', '...', '...'],
  '.': ['.', '.', '.', '.', '.', '#']
}
const SPACE_WIDTH = 2

interface BannerLayout {
  width: number
  height: number
  // 0 cloth, 1 letter, 2 letter shadow
  mask: Uint8Array
}

function textWidth(text: string, scale: number) {
  let width = 0
  for (const ch of text) {
    width += ((FONT[ch]?.[0].length ?? SPACE_WIDTH) + 1) * scale
  }
  return Math.max(0, width - scale)
}

function stampText(
  layout: BannerLayout,
  text: string,
  x: number,
  y: number,
  scale: number
) {
  for (const ch of text) {
    const glyph = FONT[ch]
    glyph?.forEach((row, gy) => {
      for (let gx = 0; gx < row.length; gx++) {
        if (row[gx] !== '#') continue
        for (let sy = 0; sy < scale; sy++) {
          for (let sx = 0; sx < scale; sx++) {
            const px = x + gx * scale + sx
            const py = y + gy * scale + sy
            layout.mask[py * layout.width + px] = 1
          }
        }
      }
    })
    x += ((glyph?.[0].length ?? SPACE_WIDTH) + 1) * scale
  }
}

// the name is printed at twice the size of the subtitle
function layoutBanner({ title, subtitle }: BannerText): BannerLayout {
  const titleWidth = textWidth(title, 2)
  const subtitleWidth = textWidth(subtitle, 1)
  const width = Math.max(titleWidth, subtitleWidth) + 14
  const height = 33
  const layout = { width, height, mask: new Uint8Array(width * height) }
  stampText(layout, title, Math.floor((width - titleWidth) / 2), 6, 2)
  stampText(layout, subtitle, Math.floor((width - subtitleWidth) / 2), 22, 1)
  // drop shadow down and to the right of every letter pixel
  for (let y = 0; y < height - 1; y++) {
    for (let x = 0; x < width - 1; x++) {
      const below = (y + 1) * width + x + 1
      if (layout.mask[y * width + x] === 1 && layout.mask[below] === 0) {
        layout.mask[below] = 2
      }
    }
  }
  return layout
}

const POLE_X = 436
const POLE_TOP = 212

function drawFlagpole(s: Surface) {
  const base = groundY(POLE_X) + 3
  rect(s, POLE_X, POLE_TOP, 2, base - POLE_TOP, 0xd9d9d9)
  rect(s, POLE_X + 1, POLE_TOP, 1, base - POLE_TOP, 0xa9a9a9)
  rect(s, POLE_X - 1, POLE_TOP - 3, 4, 3, 0xe8c25a)
}

function drawBanner(s: Surface, layout: BannerLayout, time: number) {
  const x0 = POLE_X + 2
  const y0 = POLE_TOP + 2
  const { width, height, mask } = layout
  for (let x = 0; x < width; x++) {
    // the wave grows towards the free end of the cloth
    const phase = time * 3 - x * 0.09
    const offset = Math.round(Math.sin(phase) * (0.4 + (1.6 * x) / width))
    const slope = Math.cos(phase)
    // dark green cloth, lighter on the folds facing the sun
    const cloth = slope > 0.55 ? 0x239063 : slope < -0.55 ? 0x374e4a : 0x165a4c
    for (let y = 0; y < height; y++) {
      let color = cloth
      if (y === 0 || y === height - 1 || x === width - 1) color = 0x313638
      const cell = mask[y * width + x]
      if (cell === 1) color = slope < -0.55 ? 0xc7dcd0 : 0xffffff
      else if (cell === 2) color = 0x313638
      set(s, x0 + x, y0 + y + offset, color)
    }
  }
}

// ---------------------------------------------------------------- Thorfinn

// The sprite is adult Thorfinn (Vinland Saga) generated with Sprite Fusion,
// sitting with his legs hanging down. It keeps its own colors instead of
// being snapped to the scene palette.
// row of the sprite that rests on the ledge
const THORFINN_SEAT_ROW = 58
// column behind the knee, placed at the tip of the ledge
const THORFINN_KNEE_COL = 24
const THORFINN_X = LEDGE_X1 - THORFINN_KNEE_COL
// eye pixels and the skin pixel that covers each of them while blinking
const THORFINN_EYES: [number, number, number, number][] = [
  [18, 15, 18, 17],
  [19, 15, 19, 17],
  [20, 15, 20, 17],
  [21, 15, 21, 17],
  [18, 16, 18, 17],
  [19, 16, 19, 17],
  [20, 16, 20, 17],
  [21, 16, 21, 17],
  [26, 16, 26, 15],
  [27, 16, 26, 15]
]

function drawThorfinn(s: Surface, sprite: SpriteImage, time: number) {
  const ox = THORFINN_X
  const oy = LEDGE_TOP - THORFINN_SEAT_ROW
  const pixel = (x: number, y: number) => {
    const i = (y * sprite.width + x) * 4
    return (
      (sprite.data[i] << 16) | (sprite.data[i + 1] << 8) | sprite.data[i + 2]
    )
  }
  for (let y = 0; y < sprite.height; y++) {
    for (let x = 0; x < sprite.width; x++) {
      if (sprite.data[(y * sprite.width + x) * 4 + 3] < 128) continue
      setRaw(s, ox + x, oy + y, pixel(x, y))
    }
  }
  if (time % 4.2 > 4.05) {
    for (const [x, y, sx, sy] of THORFINN_EYES) {
      setRaw(s, ox + x, oy + y, pixel(sx, sy))
    }
  }
}

// ---------------------------------------------------------------- town

type TownKind =
  | 'chalet'
  | 'shop'
  | 'church'
  | 'fountain'
  | 'tree'
  | 'conifer'
  | 'lamp'
  | 'bench'
  | 'fence'
  | 'flowers'

interface TownItem {
  kind: TownKind
  x: number
  w: number
  seed: number
  // drawing pass: 0 behind the buildings, 1 buildings, 2 in front
  depth: number
}

interface ChaletPlan {
  floors: number
  wallTop: number
  roofH: number
  plaster: number
  timberUpper: boolean
  shutter: number
  shutterDark: number
  roof: number
  balcony: boolean
  chimney?: { x: number; top: number }
}

const SHUTTERS: [number, number][] = [
  [0xc8352e, 0xa52e28],
  [0x3f7a4a, 0x2f5a38],
  [0x4d65b4, 0x484a77],
  [0x7a4a36, 0x5a3522]
]

function planChalet(x: number, w: number, seed: number): ChaletPlan {
  const rand = mulberry32(seed)
  const floors = rand() < 0.75 ? 2 : 1
  const wallTop = GROUND_Y - floors * 34
  const roofH = Math.round(w * 0.42)
  const [shutter, shutterDark] = pick(rand, SHUTTERS)
  const plan: ChaletPlan = {
    floors,
    wallTop,
    roofH,
    plaster: pick(rand, [0xf1eee6, 0xf4e3c3, 0xeadfcf, 0xf6d9b5]),
    timberUpper: floors === 2 && rand() < 0.55,
    shutter,
    shutterDark,
    roof: pick(rand, [0x5a3522, 0x4b3326, 0x9e4539]),
    balcony: floors === 2 && rand() < 0.45
  }
  if (rand() < 0.6) {
    const cx = Math.round(x + w * 0.74)
    // the chimney sits on the right slope of the roof
    const slopeY =
      plan.wallTop - roofH + ((cx - (x + w / 2)) * roofH) / (w / 2 + 8)
    plan.chimney = { x: cx, top: Math.round(slopeY) - 16 }
  }
  return plan
}

function createTown(): TownItem[] {
  const rand = mulberry32(2026)
  const items: TownItem[] = []
  let x = TOWN_X + 30
  for (let lot = 0; x < WORLD_END; lot++) {
    const seed = Math.floor(rand() * 1e9)
    let w: number
    if (lot % 9 === 4) {
      w = 150
      items.push({ kind: 'church', x, w, seed, depth: 1 })
    } else if (lot % 9 === 7) {
      w = 70
      items.push({ kind: 'fountain', x, w, seed, depth: 2 })
      items.push({ kind: 'bench', x: x - 26, w: 20, seed, depth: 2 })
      items.push({ kind: 'bench', x: x + w + 6, w: 20, seed, depth: 2 })
    } else if (rand() < 0.68) {
      w = 110 + Math.floor(rand() * 50)
      items.push({ kind: 'chalet', x, w, seed, depth: 1 })
      if (rand() < 0.5) {
        const kind = rand() < 0.5 ? 'fence' : 'flowers'
        items.push({ kind, x: x - 4, w: w + 8, seed, depth: 2 })
      }
    } else {
      w = 90 + Math.floor(rand() * 30)
      items.push({ kind: 'shop', x, w, seed, depth: 1 })
    }
    x += w
    const gap = 26 + Math.floor(rand() * 44)
    const mid = x + Math.floor(gap / 2)
    const r = rand()
    if (r < 0.4) items.push({ kind: 'tree', x: mid, w: 0, seed, depth: 0 })
    else if (r < 0.75) {
      items.push({ kind: 'conifer', x: mid, w: 0, seed, depth: 0 })
    }
    if (lot % 2 === 0) {
      items.push({
        kind: 'lamp',
        x: mid + (r < 0.75 ? 10 : 0),
        w: 0,
        seed,
        depth: 2
      })
    }
    x += gap
  }
  return items.sort((a, b) => a.depth - b.depth || a.x - b.x)
}

const TOWN = createTown()

function drawStreet(s: Surface) {
  for (let x = Math.max(s.ox, TOWN_X); x < s.ox + s.width; x++) {
    // grass verge with a few blades
    for (let y = GROUND_Y; y < GROUND_Y + 4; y++) {
      set(s, x, y, hash(x, y, 70) < 0.3 ? 0x66be43 : 0x48a532)
    }
    if (hash(x, 0, 71) < 0.45) set(s, x, GROUND_Y - 1, 0x79c94f)
    if (hash(x, 1, 71) < 0.12) set(s, x, GROUND_Y - 2, 0x79c94f)
    // curb stones
    for (let y = GROUND_Y + 4; y < GROUND_Y + 8; y++) {
      let color = y === GROUND_Y + 4 ? 0xffffff : 0xc7dcd0
      if (x % 14 === 0 || y === GROUND_Y + 7) color = 0x9babb2
      set(s, x, y, color)
    }
    // cobblestones in staggered rows
    for (let y = GROUND_Y + 8; y < WORLD_BOTTOM; y++) {
      const row = Math.floor((y - GROUND_Y - 8) / 6)
      const ry = (y - GROUND_Y - 8) % 6
      const sx = x + (row % 2) * 5
      const cx = sx % 10
      let color: number
      const corner = (cx === 0 || cx === 8) && (ry === 0 || ry === 4)
      if (ry === 5 || cx === 9 || corner) color = 0x625565
      else if (ry === 0) color = 0xc7dcd0
      else if (ry === 4) color = 0x7f708a
      else {
        const tone = hash(Math.floor(sx / 10), row, 72)
        color = tone < 0.4 ? 0xab947a : tone < 0.8 ? 0x9babb2 : 0x966c6c
      }
      set(s, x, y, color)
    }
  }
}

function townWindow(
  s: Surface,
  cx: number,
  y: number,
  plan: ChaletPlan,
  box: boolean,
  seed: number
) {
  const x = cx - 6
  rect(s, x - 4, y, 4, 15, plan.shutter)
  rect(s, x + 12, y, 4, 15, plan.shutter)
  for (let j = y + 1; j < y + 15; j += 2) {
    line(s, x - 4, j, x - 1, j, plan.shutterDark)
    line(s, x + 12, j, x + 15, j, plan.shutterDark)
  }
  rect(s, x, y, 12, 15, 0xefe9dc)
  for (const [px, py] of [
    [x + 1, y + 1],
    [x + 7, y + 1],
    [x + 1, y + 8],
    [x + 7, y + 8]
  ]) {
    rect(s, px, py, 4, 6, 0x2f4458)
    set(s, px, py, 0x7393b0)
    set(s, px + 1, py, 0x7393b0)
  }
  if (!box) return
  rect(s, x - 2, y + 15, 16, 3, 0x6b3b22)
  for (let fx = x - 2; fx < x + 14; fx++) {
    const h = hash(fx, y, seed)
    set(s, fx, y + 14, h < 0.45 ? 0xd9433b : h < 0.6 ? 0xf6f3ea : 0x3f7a3a)
    if (h < 0.3) set(s, fx, y + 13, 0xe2544a)
    if (fx % 3 === 0) set(s, fx, y + 18, 0x3f7a3a)
  }
}

function drawTownChalet(s: Surface, x: number, w: number, seed: number) {
  const plan = planChalet(x, w, seed)
  const { wallTop, roofH, floors } = plan
  const wood = 0x5a3522
  // walls
  rect(s, x, wallTop, w, GROUND_Y - wallTop, plan.plaster)
  for (let y = wallTop; y < GROUND_Y; y++) {
    for (let px = x; px < x + w; px++) {
      if (hash(px, y, seed) < 0.015) set(s, px, y, 0xd8d3c8)
    }
  }
  if (plan.timberUpper) {
    rect(s, x, wallTop, w, 34, wood)
    for (let y = wallTop + 3; y < wallTop + 34; y += 4) {
      line(s, x, y, x + w - 1, y, 0x45281a)
    }
  }
  if (floors === 2) {
    rect(s, x, wallTop + 32, w, 3, 0x45281a)
    line(s, x, wallTop + 32, x + w - 1, wallTop + 32, 0x5a3522)
  }
  rect(s, x, wallTop, 2, GROUND_Y - wallTop, 0xd8d3c8)
  // foundation
  for (let px = x; px < x + w; px++) {
    for (let j = 1; j <= 4; j++) {
      const joint = j === 3 || (px + (j > 3 ? 3 : 0)) % 7 === 0
      set(s, px, GROUND_Y - j, joint ? 0x6f6c66 : 0x8f8c84)
    }
  }

  // windows and the door
  const count = Math.max(1, Math.floor((w - 12) / 34))
  const spacing = w / count
  const doorAt = Math.floor(count / 2)
  for (let f = 0; f < floors; f++) {
    const y = GROUND_Y - (f + 1) * 34 + 8
    for (let i = 0; i < count; i++) {
      const cx = Math.round(x + spacing * (i + 0.5))
      if (f === 0 && i === doorAt) continue
      townWindow(s, cx, y, plan, f === 1 || count === 1, seed + i)
    }
  }
  const dx = Math.round(x + spacing * (doorAt + 0.5)) - 8
  rect(s, dx - 2, GROUND_Y - 30, 20, 26, 0x45281a)
  rect(
    s,
    dx,
    GROUND_Y - 28,
    16,
    24,
    plan.shutter === 0xc8352e ? 0x8e2a24 : 0x5a3522
  )
  line(s, dx + 8, GROUND_Y - 28, dx + 8, GROUND_Y - 5, 0x45281a)
  rect(s, dx + 2, GROUND_Y - 25, 4, 8, 0x2f4458)
  rect(s, dx + 10, GROUND_Y - 25, 4, 8, 0x2f4458)
  rect(s, dx + 12, GROUND_Y - 16, 2, 2, 0xe8c25a)
  rect(s, dx - 3, GROUND_Y - 4, 22, 2, 0xa9a49a)

  // balcony across the upper floor
  if (plan.balcony) {
    const by = wallTop + 31
    rect(s, x - 4, by - 10, w + 8, 2, 0xd9c9a5)
    rect(s, x - 4, by, w + 8, 2, 0x6b3b22)
    for (let px = x - 4; px < x + w + 4; px += 3) {
      line(s, px, by - 8, px, by - 1, 0xd9c9a5)
    }
    for (let px = x - 4; px < x + w + 4; px++) {
      const h = hash(px, by, seed)
      if (h < 0.5) set(s, px, by - 11, h < 0.3 ? 0xd9433b : 0x3f7a3a)
    }
  }

  // gable and roof
  const apexX = x + w / 2
  const apexY = wallTop - roofH
  const over = 8
  quad(
    s,
    [
      [x + 1, wallTop],
      [x + w - 1, wallTop],
      [apexX, apexY + 6]
    ],
    wood
  )
  for (let px = Math.ceil(x + 3); px < x + w - 2; px += 4) {
    const top = apexY + 6 + (Math.abs(px - apexX) * (roofH - 6)) / (w / 2)
    line(s, px, wallTop - 1, px, Math.ceil(top) + 1, 0x45281a)
  }
  const gw = Math.max(8, Math.round(w * 0.1))
  const gy = Math.round(wallTop - roofH * 0.45)
  rect(s, Math.round(apexX - gw / 2) - 1, gy - 1, gw + 2, 12, 0xefe9dc)
  rect(s, Math.round(apexX - gw / 2), gy, gw, 10, 0x2f4458)
  line(s, Math.round(apexX), gy, Math.round(apexX), gy + 9, 0xefe9dc)
  set(s, Math.round(apexX - gw / 2) + 1, gy + 1, 0x7393b0)
  const roofLight = plan.roof === 0x9e4539 ? 0xcd683d : 0x7a4a36
  quad(
    s,
    [
      [apexX, apexY],
      [x - over, wallTop + 3],
      [x - over, wallTop + 10],
      [apexX, apexY + 8]
    ],
    plan.roof
  )
  quad(
    s,
    [
      [apexX, apexY],
      [apexX, apexY + 8],
      [x + w + over, wallTop + 10],
      [x + w + over, wallTop + 3]
    ],
    plan.roof
  )
  line(s, apexX, apexY, x - over, wallTop + 3, roofLight)
  line(s, apexX, apexY, x + w + over, wallTop + 3, roofLight)
  line(s, apexX, apexY + 8, x - over, wallTop + 10, 0x2a180e)
  line(s, apexX, apexY + 8, x + w + over, wallTop + 10, 0x2a180e)
  for (let t = 2; t < 7; t += 2) {
    line(
      s,
      apexX,
      apexY + t,
      x - over,
      wallTop + 3 + t,
      plan.roof === 0x9e4539 ? 0x7a3045 : 0x45281a
    )
  }
  rect(s, Math.round(apexX) - 2, apexY - 2, 4, 3, roofLight)
  // eave shadow on the wall
  for (let px = x; px < x + w; px++) {
    set(s, px, wallTop, 0x2e1a10)
    if (dither(px, wallTop + 1) < 0.5) set(s, px, wallTop + 1, 0x2e1a10)
  }

  if (plan.chimney) {
    const { x: cx, top } = plan.chimney
    rect(s, cx, top, 8, 20, 0xb9b3a8)
    rect(s, cx, top, 2, 20, 0x9f998e)
    for (let y = top + 3; y < top + 20; y += 4)
      line(s, cx, y, cx + 7, y, 0x8f897e)
    rect(s, cx - 1, top - 2, 10, 3, 0x6a5a4a)
  }
}

const AWNINGS = [0xc8352e, 0x3f7a4a, 0x4d65b4, 0xe6904e]

function drawShop(s: Surface, x: number, w: number, seed: number) {
  const rand = mulberry32(seed)
  const wallTop = GROUND_Y - 50
  const wall = pick(rand, [0xf4e3c3, 0xeadfcf, 0xf1eee6, 0xe9d5c0])
  const awning = pick(rand, AWNINGS)
  rect(s, x, wallTop, w, GROUND_Y - wallTop, wall)
  rect(s, x, wallTop, 2, GROUND_Y - wallTop, 0xd8d3c8)
  // roof with a wooden cornice
  rect(s, x - 6, wallTop - 12, w + 12, 8, 0x5a3522)
  line(s, x - 6, wallTop - 12, x + w + 5, wallTop - 12, 0x7a4a36)
  rect(s, x - 3, wallTop - 4, w + 6, 4, 0x5a3522)
  line(s, x - 3, wallTop - 1, x + w + 2, wallTop - 1, 0x45281a)
  // sign board with a little pictogram
  const sw = Math.round(w * 0.5)
  const sx = Math.round(x + (w - sw) / 2)
  rect(s, sx, wallTop + 3, sw, 10, 0x45281a)
  rect(s, sx + 1, wallTop + 4, sw - 2, 8, 0x8a5c36)
  const icon = Math.floor(rand() * 3)
  const ix = sx + Math.floor(sw / 2)
  const iy = wallTop + 5
  if (icon === 0) {
    // bread loaf
    rect(s, ix - 4, iy + 2, 8, 3, 0xfbb954)
    rect(s, ix - 3, iy + 1, 6, 1, 0xfbb954)
    set(s, ix - 1, iy + 2, 0xcd683d)
    set(s, ix + 2, iy + 2, 0xcd683d)
  } else if (icon === 1) {
    // coffee cup
    rect(s, ix - 3, iy + 1, 5, 4, 0xffffff)
    set(s, ix + 2, iy + 2, 0xffffff)
    rect(s, ix - 2, iy + 1, 3, 1, 0x5a3522)
  } else {
    // flower
    set(s, ix, iy, 0xe83b3b)
    set(s, ix - 1, iy + 1, 0xe83b3b)
    set(s, ix + 1, iy + 1, 0xe83b3b)
    set(s, ix, iy + 1, 0xf9c22b)
    set(s, ix, iy + 2, 0xe83b3b)
    line(s, ix, iy + 3, ix, iy + 5, 0x239063)
  }
  // striped awning with a scalloped edge
  const ay = wallTop + 16
  for (let px = x - 3; px < x + w + 3; px++) {
    const stripe = Math.floor((px - x) / 6) % 2 === 0 ? awning : 0xf6f3ea
    for (let y = ay; y < ay + 8; y++) set(s, px, y, stripe)
    if (((px - x) % 6) - 2.5 < 2 && ((px - x) % 6) - 2.5 > -2) {
      set(s, px, ay + 8, stripe)
    }
    set(s, px, ay, 0x2e222f)
  }
  // display window with goods
  const ww = Math.round(w * 0.55)
  rect(s, x + 6, ay + 12, ww, GROUND_Y - ay - 20, 0xefe9dc)
  rect(s, x + 8, ay + 14, ww - 4, GROUND_Y - ay - 24, 0x2f4458)
  for (let px = x + 10; px < x + ww + 2; px += 5) {
    const h = hash(px, ay, seed)
    const color = h < 0.33 ? 0xfbb954 : h < 0.66 ? 0xe83b3b : 0x91db69
    rect(s, px, GROUND_Y - 14, 3, 3, color)
  }
  set(s, x + 9, ay + 15, 0x7393b0)
  set(s, x + 10, ay + 15, 0x7393b0)
  // door on the right
  const dx = x + w - 22
  rect(s, dx - 1, ay + 11, 17, GROUND_Y - ay - 11, 0x45281a)
  rect(s, dx + 1, ay + 13, 13, GROUND_Y - ay - 13, 0x5a3522)
  rect(s, dx + 3, ay + 15, 9, 8, 0x2f4458)
  rect(s, dx + 11, GROUND_Y - 14, 2, 2, 0xe8c25a)
  for (let px = x; px < x + w; px++) set(s, px, GROUND_Y - 1, 0x8f8c84)
}

function drawChurch(s: Surface, x: number) {
  const tw = 30
  const towerTop = GROUND_Y - 196
  const white = 0xf1eee6
  // nave
  const nx = x + tw - 2
  const nw = 120
  const navTop = GROUND_Y - 74
  const roofH = 52
  rect(s, nx, navTop, nw, GROUND_Y - navTop, white)
  quad(
    s,
    [
      [nx - 6, navTop + 2],
      [nx + nw + 6, navTop + 2],
      [nx + nw / 2, navTop - roofH]
    ],
    0x3e3546
  )
  quad(
    s,
    [
      [nx + 4, navTop + 1],
      [nx + nw - 4, navTop + 1],
      [nx + nw / 2, navTop - roofH + 10]
    ],
    white
  )
  line(s, nx - 6, navTop + 2, nx + nw / 2, navTop - roofH, 0x625565)
  line(s, nx + nw + 6, navTop + 2, nx + nw / 2, navTop - roofH, 0x625565)
  // rose window
  const rx = nx + nw / 2
  const ry = navTop - roofH * 0.38
  disc(s, rx, ry, 7, 0x2e222f)
  disc(s, rx, ry, 6, 0x4d65b4)
  for (let a = 0; a < 8; a++) {
    const ang = (a / 8) * Math.PI * 2
    set(
      s,
      rx + Math.cos(ang) * 4,
      ry + Math.sin(ang) * 4,
      a % 2 ? 0xe83b3b : 0xf9c22b
    )
  }
  set(s, rx, ry, 0xffffff)
  // tall arched windows and the door
  for (const wx of [nx + 16, nx + nw - 26]) {
    rect(s, wx, navTop + 18, 10, 30, 0x2e222f)
    rect(s, wx + 1, navTop + 19, 8, 29, 0x4d65b4)
    disc(s, wx + 5, navTop + 19, 4, 0x4d65b4)
    line(s, wx + 5, navTop + 16, wx + 5, navTop + 47, 0x2e222f)
    set(s, wx + 2, navTop + 22, 0x8fd3ff)
  }
  const dx = nx + nw / 2 - 11
  rect(s, dx, GROUND_Y - 34, 22, 34, 0x2e222f)
  disc(s, dx + 11, GROUND_Y - 34, 11, 0x2e222f)
  rect(s, dx + 2, GROUND_Y - 33, 18, 33, 0x5a3522)
  disc(s, dx + 11, GROUND_Y - 33, 9, 0x5a3522)
  line(s, dx + 11, GROUND_Y - 42, dx + 11, GROUND_Y - 1, 0x45281a)
  for (let y = GROUND_Y - 30; y < GROUND_Y; y += 6) {
    set(s, dx + 5, y, 0xab947a)
    set(s, dx + 17, y, 0xab947a)
  }
  // bell tower with a clock and a patina spire
  rect(s, x, towerTop, tw, GROUND_Y - towerTop, white)
  rect(s, x, towerTop, 3, GROUND_Y - towerTop, 0xd8d3c8)
  for (const y of [towerTop + 70, towerTop + 120]) {
    rect(s, x - 2, y, tw + 4, 3, 0xc7dcd0)
  }
  rect(s, x - 3, towerTop - 2, tw + 6, 4, 0xc7dcd0)
  for (const bx of [x + 6, x + 17]) {
    rect(s, bx, towerTop + 12, 7, 16, 0x2e222f)
    disc(s, bx + 3.5, towerTop + 12, 3.5, 0x2e222f)
  }
  const cy = towerTop + 46
  disc(s, x + tw / 2, cy, 9, 0x2e222f)
  disc(s, x + tw / 2, cy, 8, 0xffffff)
  line(s, x + tw / 2, cy, x + tw / 2, cy - 6, 0x2e222f)
  line(s, x + tw / 2, cy, x + tw / 2 + 4, cy + 1, 0x2e222f)
  const spireTop = towerTop - 62
  quad(
    s,
    [
      [x - 3, towerTop - 2],
      [x + tw / 2, towerTop - 2],
      [x + tw / 2, spireTop]
    ],
    0x547e64
  )
  quad(
    s,
    [
      [x + tw / 2, towerTop - 2],
      [x + tw + 3, towerTop - 2],
      [x + tw / 2, spireTop]
    ],
    0x92a984
  )
  for (let y = towerTop - 8; y > spireTop + 4; y -= 6) {
    const half = ((y - spireTop) / (towerTop - spireTop)) * (tw / 2 + 3)
    line(s, x + tw / 2 - half, y, x + tw / 2 + half, y, 0x374e4a)
  }
  line(s, x + tw / 2, spireTop - 10, x + tw / 2, spireTop, 0xf9c22b)
  line(s, x + tw / 2 - 3, spireTop - 7, x + tw / 2 + 3, spireTop - 7, 0xf9c22b)
  for (let px = x; px < nx + nw; px++) {
    set(s, px, GROUND_Y - 1, 0x8f8c84)
    set(s, px, GROUND_Y - 2, 0xab947a)
  }
}

function drawFountain(s: Surface, x: number) {
  const stone = 0xab947a
  rect(s, x + 4, GROUND_Y - 14, 62, 14, stone)
  rect(s, x + 4, GROUND_Y - 14, 62, 2, 0xc7dcd0)
  rect(s, x + 7, GROUND_Y - 12, 56, 3, 0x4d9be6)
  line(s, x + 8, GROUND_Y - 12, x + 20, GROUND_Y - 12, 0x8fd3ff)
  for (let px = x + 4; px < x + 66; px += 8) {
    line(s, px, GROUND_Y - 8, px, GROUND_Y - 1, 0x966c6c)
  }
  rect(s, x + 33, GROUND_Y - 34, 4, 22, stone)
  rect(s, x + 24, GROUND_Y - 36, 22, 3, stone)
  rect(s, x + 24, GROUND_Y - 36, 22, 1, 0xc7dcd0)
  rect(s, x + 34, GROUND_Y - 42, 2, 6, stone)
  disc(s, x + 35, GROUND_Y - 43, 2, 0xc7dcd0)
  // water falling from the bowl into the basin
  for (let i = 0; i < 10; i++) {
    const t = i / 9
    set(s, x + 23 - t * 8, GROUND_Y - 35 + t * t * 22, 0x8fd3ff)
    set(s, x + 47 + t * 8, GROUND_Y - 35 + t * t * 22, 0x8fd3ff)
  }
}

function drawTree(s: Surface, x: number, seed: number) {
  const rand = mulberry32(seed)
  const h = 30 + Math.floor(rand() * 16)
  rect(s, x - 2, GROUND_Y - h, 5, h, 0x5a3522)
  rect(s, x - 2, GROUND_Y - h, 2, h, 0x4c3e24)
  const cy = GROUND_Y - h - 6
  const blobs: [number, number, number][] = []
  for (let i = 0; i < 6; i++) {
    blobs.push([
      x + (rand() - 0.5) * 28,
      cy + (rand() - 0.5) * 18,
      9 + rand() * 7
    ])
  }
  for (const [bx, by, r] of blobs) disc(s, bx, by, r, 0x14301a)
  for (const [bx, by, r] of blobs) disc(s, bx + 1, by - 1, r - 2, 0x1f4524)
  for (const [bx, by, r] of blobs) {
    disc(s, bx + r * 0.3, by - r * 0.35, r * 0.45, 0x2f6330)
    for (let i = 0; i < r * 3; i++) {
      const a = rand() * Math.PI * 2
      const d = r * (0.3 + rand() * 0.7)
      const lit = Math.cos(a) > 0 && Math.sin(a) < 0
      set(
        s,
        bx + Math.cos(a) * d,
        by + Math.sin(a) * d,
        lit ? 0x3f7a38 : 0x14301a
      )
    }
  }
}

function drawLamp(s: Surface, x: number) {
  const dark = 0x2e222f
  rect(s, x, GROUND_Y - 50, 2, 50, 0x3e3546)
  set(s, x + 1, GROUND_Y - 50, 0x625565)
  rect(s, x - 2, GROUND_Y - 4, 6, 4, dark)
  rect(s, x - 3, GROUND_Y - 61, 8, 11, dark)
  rect(s, x - 2, GROUND_Y - 59, 6, 7, 0xf9c22b)
  rect(s, x - 1, GROUND_Y - 58, 4, 4, 0xfbff86)
  line(s, x - 4, GROUND_Y - 62, x + 5, GROUND_Y - 62, dark)
  rect(s, x - 1, GROUND_Y - 64, 4, 2, dark)
  set(s, x, GROUND_Y - 65, dark)
}

function drawBench(s: Surface, x: number) {
  const wood = 0x8a5c36
  rect(s, x, GROUND_Y - 9, 20, 2, wood)
  rect(s, x, GROUND_Y - 15, 20, 2, wood)
  line(s, x, GROUND_Y - 9, x + 19, GROUND_Y - 9, 0xab7a4a)
  rect(s, x + 1, GROUND_Y - 13, 2, 13, 0x3e3546)
  rect(s, x + 17, GROUND_Y - 13, 2, 13, 0x3e3546)
}

function drawFence(s: Surface, x: number, w: number) {
  for (let px = x; px < x + w; px += 7) {
    rect(s, px, GROUND_Y - 11, 2, 11, 0xffffff)
    set(s, px, GROUND_Y - 12, 0xffffff)
    set(s, px + 1, GROUND_Y - 11, 0xc7dcd0)
  }
  rect(s, x, GROUND_Y - 8, w, 1, 0xc7dcd0)
  rect(s, x, GROUND_Y - 4, w, 1, 0xc7dcd0)
}

function drawFlowerBed(s: Surface, x: number, w: number, seed: number) {
  const colors = [0xd9433b, 0xf3d34c, 0xf6f3ea, 0xe5677b, 0xb18ad8]
  for (let px = x; px < x + w; px++) {
    set(s, px, GROUND_Y - 1, 0x2f6a2a)
    set(s, px, GROUND_Y - 2, 0x3f8a35)
    if (hash(px, 3, seed) < 0.6) set(s, px, GROUND_Y - 3, 0x3f8a35)
    const h = hash(px, 4, seed)
    if (h < 0.5) {
      set(s, px, GROUND_Y - 4, colors[Math.floor(h * 10) % colors.length])
    }
  }
}

function drawTown(s: Surface) {
  if (s.ox + s.width < TOWN_X - 200) return
  // the ramp ends against the first curb stone of the street
  rect(s, TOWN_X - 2, GROUND_Y + 2, 3, 6, 0x9babb2)
  for (const item of TOWN) {
    if (!overlaps(s, item.x - 40, item.x + item.w + 40)) continue
    switch (item.kind) {
      case 'chalet':
        drawTownChalet(s, item.x, item.w, item.seed)
        break
      case 'shop':
        drawShop(s, item.x, item.w, item.seed)
        break
      case 'church':
        drawChurch(s, item.x)
        break
      case 'fountain':
        drawFountain(s, item.x)
        break
      case 'tree':
        drawTree(s, item.x, item.seed)
        break
      case 'conifer':
        conifer(
          s,
          item.x,
          GROUND_Y + 2,
          54 + (item.seed % 30),
          0x24552a,
          0x347238
        )
        break
      case 'lamp':
        drawLamp(s, item.x)
        break
      case 'bench':
        drawBench(s, item.x)
        break
      case 'fence':
        drawFence(s, item.x, item.w)
        break
      case 'flowers':
        drawFlowerBed(s, item.x, item.w, item.seed)
        break
    }
  }
  drawStreet(s)
}

// ---------------------------------------------------------------- layers

export const LAYERS: { id: LayerId; factor: number }[] = [
  { id: 'far', factor: 0.15 },
  { id: 'hills', factor: 0.3 },
  { id: 'valley', factor: 0.55 },
  { id: 'fore', factor: 1 }
]

// renders one tile of a layer; tiles are TILE_WIDTH wide and span the whole
// world height
export function renderTile(layer: LayerId, index: number): Surface {
  const s = createSurface(
    TILE_WIDTH,
    WORLD_HEIGHT,
    index * TILE_WIDTH,
    WORLD_TOP
  )
  const hero = s.ox < HERO_WIDTH + 64
  switch (layer) {
    case 'far':
      drawRange(s, MASSIF)
      break
    case 'hills':
      if (hero) drawRange(s, LEFT_RIDGE)
      drawRange(s, VALLEY_MOUNTAINS)
      break
    case 'valley':
      drawValley(s)
      drawNearSlope(s)
      break
    case 'fore':
      drawLawn(s)
      if (hero) {
        drawGarden(s)
        drawLedge(s)
        drawChalet(s)
        drawFoliage(s)
        drawFlagpole(s)
      }
      drawTown(s)
      break
  }
  return s
}

// ---------------------------------------------------------------- overlays

// small animated parts of the world, each drawn into its own surface
export interface Overlay {
  layer: LayerId
  x: number
  y: number
  width: number
  height: number
  draw(s: Surface, time: number): void
}

function smokeOverlay(ox: number, oy: number, phase: number): Overlay {
  return {
    layer: 'fore',
    x: ox - 12,
    y: oy - 106,
    width: 92,
    height: 120,
    draw(s, time) {
      for (let i = 0; i < 16; i++) {
        const life = (time * 0.3 + i / 16 + phase) % 1
        const x = ox + life * 60 + Math.sin(time * 1.5 + i) * 4 * life
        const y = oy - life * 92
        const r = (1 + life * 4) * K
        const fade = 1 - life
        for (let dy = -r; dy <= r; dy++) {
          for (let dx = -r; dx <= r; dx++) {
            if (dx * dx + dy * dy > r * r) continue
            const px = Math.floor(x + dx)
            const py = Math.floor(y + dy)
            if (fade * 0.85 > dither(px, py)) {
              set(s, px, py, dy > r * 0.3 ? 0xc9d0d6 : 0xeef1f3)
            }
          }
        }
      }
    }
  }
}

function lakeOverlay(lake: Lake, withBoat: boolean): Overlay {
  const b = lakeBounds(lake)
  const width = b.x1 - b.x0 + 1
  const height = b.y1 - b.y0 + 1
  // water pixels that are not hidden behind the near slope, computed the
  // first time the lake comes into view
  let water: Uint8Array | undefined
  const waterMask = () => {
    if (water) return water
    water = new Uint8Array(width * height)
    for (let y = b.y0; y <= b.y1; y++) {
      for (let x = b.x0; x <= b.x1; x++) {
        const u = x / K
        const hidden = u >= 300 && y >= Math.round(nearSlopeAt(u) * K)
        if (!hidden && inLake(lake, u, y / K)) {
          water[(y - b.y0) * width + (x - b.x0)] = 1
        }
      }
    }
    return water
  }
  const isWater = (x: number, y: number) =>
    x >= b.x0 &&
    x <= b.x1 &&
    y >= b.y0 &&
    y <= b.y1 &&
    waterMask()[(y - b.y0) * width + (x - b.x0)] === 1
  return {
    layer: 'valley',
    x: b.x0,
    y: b.y0 - 18,
    width,
    height: height + 18,
    draw(s, time) {
      // glints drifting on the water
      const frame = Math.floor(time * 3)
      for (let y = b.y0; y <= b.y1; y++) {
        for (let x = b.x0; x <= b.x1; x++) {
          if (!isWater(x, y)) continue
          if (hash(Math.floor(x / 5), y, frame) < 0.03) {
            set(s, x, y, 0xcfe6f7)
            set(s, x + 1, y, 0xa8d0ee)
            set(s, x + 2, y, 0xa8d0ee)
          }
        }
      }
      if (!withBoat) return
      // a little sailboat crossing the lake
      const bx = Math.floor((330 + ((time * 2.5) % 160)) * K)
      const by = 206 * K
      if (!isWater(bx, by) || !isWater(bx + 12, by)) return
      rect(s, bx, by, 12, 2, 0x6b4a32)
      rect(s, bx + 1, by + 2, 10, 1, 0x4a3324)
      rect(s, bx + 2, by + 3, 8, 1, 0x3f6f99)
      line(s, bx + 5, by - 15, bx + 5, by - 1, 0x6b4a32)
      for (let i = 0; i < 13; i++) {
        const y = by - 2 - i
        line(s, bx + 6, y, bx + 6 + Math.floor((13 - i) / 2), y, 0xfafafa)
        set(s, bx + 6, y, 0xd8dde2)
      }
      for (let i = 0; i < 8; i++) {
        const y = by - 2 - i
        line(s, bx + 4 - Math.floor((8 - i) / 3), y, bx + 4, y, 0xeef1f3)
      }
    }
  }
}

export function bannerOverlay(text: BannerText): Overlay {
  const layout = layoutBanner(text)
  return {
    layer: 'fore',
    x: POLE_X + 2,
    y: POLE_TOP - 2,
    width: layout.width,
    height: layout.height + 8,
    draw(s, time) {
      drawBanner(s, layout, time)
    }
  }
}

export function thorfinnOverlay(sprite: SpriteImage): Overlay {
  return {
    layer: 'fore',
    x: THORFINN_X,
    y: LEDGE_TOP - THORFINN_SEAT_ROW,
    width: sprite.width,
    height: sprite.height,
    draw(s, time) {
      drawThorfinn(s, sprite, time)
    }
  }
}

// every animated part of the scenery except the flag and Thorfinn, sorted by x
export function createAmbientOverlays(): Overlay[] {
  const overlays: Overlay[] = [smokeOverlay(342, 172, 0)]
  LAKES.forEach((lake, i) => overlays.push(lakeOverlay(lake, i === 0)))
  for (const item of TOWN) {
    if (item.kind !== 'chalet') continue
    const { chimney } = planChalet(item.x, item.w, item.seed)
    if (chimney) {
      overlays.push(
        smokeOverlay(chimney.x + 4, chimney.top - 3, (item.seed % 97) / 97)
      )
    }
  }
  return overlays.sort((a, b) => a.x - b.x)
}
