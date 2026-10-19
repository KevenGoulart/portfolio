// Shared pixel art primitives: deterministic noise, the scene palette and
// drawing helpers that write into RGBA surfaces placed in world space.

export interface Surface {
  data: Uint8ClampedArray
  width: number
  height: number
  // world coordinates of the surface's top-left pixel
  ox: number
  oy: number
}

export function createSurface(
  width: number,
  height: number,
  ox = 0,
  oy = 0
): Surface {
  return {
    data: new Uint8ClampedArray(width * height * 4),
    width,
    height,
    ox,
    oy
  }
}

const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5]
]

export function dither(x: number, y: number) {
  return (BAYER[y & 3][x & 3] + 0.5) / 16
}

export function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function hash(x: number, y: number, seed = 0) {
  let h = Math.imul(x, 374761393) + Math.imul(y, 668265263) + seed * 2246822519
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}

export function createNoise(seed: number) {
  const rand = mulberry32(seed)
  const values = Array.from({ length: 512 }, () => rand())
  return (x: number) => {
    const i = Math.floor(x)
    const f = x - i
    const u = f * f * (3 - 2 * f)
    const a = values[((i % 512) + 512) % 512]
    const b = values[(((i + 1) % 512) + 512) % 512]
    return a + (b - a) * u
  }
}

const noiseCache = new Map<number, (x: number) => number>()

export function cachedNoise(seed: number) {
  let n = noiseCache.get(seed)
  if (!n) {
    n = createNoise(seed)
    noiseCache.set(seed, n)
  }
  return n
}

// Resurrect 64 by Kerrie Lake (https://lospec.com/palette-list/resurrect-64).
// Every pixel is snapped to its closest color in OKLab space so the whole
// scene shares one cohesive palette.
const PALETTE = [
  0x2e222f, 0x3e3546, 0x625565, 0x966c6c, 0xab947a, 0x694f62, 0x7f708a,
  0x9babb2, 0xc7dcd0, 0xffffff, 0x6e2727, 0xb33831, 0xea4f36, 0xf57d4a,
  0xae2334, 0xe83b3b, 0xfb6b1d, 0xf79617, 0xf9c22b, 0x7a3045, 0x9e4539,
  0xcd683d, 0xe6904e, 0xfbb954, 0x4c3e24, 0x676633, 0xa2a947, 0xd5e04b,
  0xfbff86, 0x165a4c, 0x239063, 0x1ebc73, 0x91db69, 0xcddf6c, 0x313638,
  0x374e4a, 0x547e64, 0x92a984, 0xb2ba90, 0x0b5e65, 0x0b8a8f, 0x0eaf9b,
  0x30e1b9, 0x8ff8e2, 0x323353, 0x484a77, 0x4d65b4, 0x4d9be6, 0x8fd3ff,
  0x45293f, 0x6b3e75, 0x905ea9, 0xa884f3, 0xeaaded, 0x753c54, 0xa24b6f,
  0xcf657f, 0xed8099, 0x831c5d, 0xc32454, 0xf04f78, 0xf68181, 0xfca790, 0xfdcbb0
]

function toOklab(color: number) {
  const lin = (c: number) => {
    c /= 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  const r = lin((color >> 16) & 255)
  const g = lin((color >> 8) & 255)
  const b = lin(color & 255)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  ]
}

// Hand-picked palette entries where the closest color is not the best choice.
const PALETTE_OVERRIDES = new Map<number, number>([
  // mountains
  [0x8ea8c6, 0x9babb2],
  [0x7590b2, 0x7f708a],
  [0x627d9f, 0x625565],
  [0x9ab9d8, 0x8fd3ff],
  [0x88a9cb, 0x8fd3ff],
  [0xc3d3e8, 0xc7dcd0],
  [0x7397ba, 0x9babb2],
  [0x6488ad, 0x7f708a],
  [0x587ca1, 0x7f708a],
  [0x86a8c6, 0x8fd3ff],
  [0x7a9dbd, 0x8fd3ff],
  [0x5a86ab, 0x4d65b4],
  [0x46719a, 0x484a77],
  [0x3d6890, 0x484a77],
  [0x7ea3c0, 0x4d9be6],
  [0x6f96b6, 0x4d65b4],
  // lawn
  [0x4fae36, 0x1ebc73],
  [0x48a532, 0x1ebc73],
  [0x8fd35a, 0xcddf6c],
  [0x6cc246, 0x91db69],
  [0x79c94f, 0x91db69],
  [0x66be43, 0x91db69],
  [0x3a8a27, 0x239063],
  [0x3b8d29, 0x239063],
  [0x317a22, 0x165a4c],
  [0x327f24, 0x165a4c],
  // valley, near slope, hedge and conifers
  [0x7aa857, 0x92a984],
  [0x86b35e, 0x91db69],
  [0x6c9c4b, 0x547e64],
  [0x93bb63, 0xb2ba90],
  [0x7fa34f, 0xa2a947],
  [0x426f43, 0x374e4a],
  [0x4c7a46, 0x165a4c],
  [0x4f7d40, 0x547e64],
  [0x5d8d45, 0x547e64],
  [0x93b874, 0xb2ba90],
  [0x8fb2a8, 0x92a984],
  [0x88ad8a, 0x92a984],
  [0x3b6640, 0x374e4a],
  [0x4a7a4c, 0x547e64],
  [0x3f7f2c, 0x239063],
  [0x356f26, 0x165a4c],
  [0x5fa040, 0x1ebc73],
  [0x4d9236, 0x239063],
  [0x1d4424, 0x313638],
  [0x2b6131, 0x165a4c],
  [0x2f6a2a, 0x165a4c],
  [0x3f8a35, 0x239063],
  [0x5aa846, 0x1ebc73],
  [0x24552a, 0x165a4c],
  [0x347238, 0x239063],
  [0x204b26, 0x313638],
  [0x2f6a34, 0x165a4c],
  // foliage
  [0x14301a, 0x313638],
  [0x1f4524, 0x165a4c],
  [0x2f6330, 0x239063],
  [0x3f7a38, 0x1ebc73],
  [0x3a2a1e, 0x45293f],
  [0x4f3a28, 0x694f62]
])

const PALETTE_LAB = PALETTE.map(toOklab)
const snapCache = new Map<number, number>()

export function snap(color: number) {
  let snapped = snapCache.get(color) ?? PALETTE_OVERRIDES.get(color)
  if (snapped !== undefined) return snapped
  const [l, a, b] = toOklab(color)
  let best = Infinity
  snapped = PALETTE[0]
  PALETTE_LAB.forEach(([pl, pa, pb], i) => {
    const d = (l - pl) ** 2 + (a - pa) ** 2 + (b - pb) ** 2
    if (d < best) {
      best = d
      snapped = PALETTE[i]
    }
  })
  snapCache.set(color, snapped)
  return snapped
}

export function hex(color: number) {
  return `#${color.toString(16).padStart(6, '0')}`
}

export function setRaw(s: Surface, x: number, y: number, color: number) {
  x = Math.floor(x) - s.ox
  y = Math.floor(y) - s.oy
  if (x < 0 || y < 0 || x >= s.width || y >= s.height) return
  const i = (y * s.width + x) * 4
  s.data[i] = (color >> 16) & 255
  s.data[i + 1] = (color >> 8) & 255
  s.data[i + 2] = color & 255
  s.data[i + 3] = 255
}

export function set(s: Surface, x: number, y: number, color: number) {
  setRaw(s, x, y, snap(color))
}

export function rect(
  s: Surface,
  x: number,
  y: number,
  w: number,
  h: number,
  color: number
) {
  // clip to the surface first, wide shapes are often mostly off-tile
  const x0 = Math.max(x, s.ox)
  const x1 = Math.min(x + w, s.ox + s.width)
  const y0 = Math.max(y, s.oy)
  const y1 = Math.min(y + h, s.oy + s.height)
  for (let j = y0; j < y1; j++) {
    for (let i = x0; i < x1; i++) set(s, i, j, color)
  }
}

export function line(
  s: Surface,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: number
) {
  const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1)
  for (let i = 0; i <= steps; i++) {
    set(
      s,
      Math.round(x0 + ((x1 - x0) * i) / steps),
      Math.round(y0 + ((y1 - y0) * i) / steps),
      color
    )
  }
}

export function disc(
  s: Surface,
  cx: number,
  cy: number,
  r: number,
  color: number
) {
  for (let y = Math.floor(cy - r); y <= cy + r; y++) {
    for (let x = Math.floor(cx - r); x <= cx + r; x++) {
      if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r) set(s, x, y, color)
    }
  }
}

export function quad(s: Surface, pts: [number, number][], color: number) {
  const ys = pts.map((p) => p[1])
  for (let y = Math.floor(Math.min(...ys)); y <= Math.max(...ys); y++) {
    const xs: number[] = []
    for (let i = 0; i < pts.length; i++) {
      const [ax, ay] = pts[i]
      const [bx, by] = pts[(i + 1) % pts.length]
      if (ay === by) continue
      const cy = y + 0.5
      if ((cy >= ay && cy < by) || (cy >= by && cy < ay)) {
        xs.push(ax + ((cy - ay) * (bx - ax)) / (by - ay))
      }
    }
    xs.sort((a, b) => a - b)
    for (let k = 0; k + 1 < xs.length; k += 2) {
      for (let x = Math.round(xs[k]); x < Math.round(xs[k + 1]); x++) {
        set(s, x, y, color)
      }
    }
  }
}

// does a horizontal world range intersect the surface?
export function overlaps(s: Surface, x0: number, x1: number) {
  return x1 >= s.ox && x0 < s.ox + s.width
}
