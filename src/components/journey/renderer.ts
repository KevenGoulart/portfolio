// Draws the pixel art world behind the journey as parallax layers of canvas
// tiles. The camera moves horizontally (in world pixels) and every layer
// follows it at its own speed; tiles are rendered on demand and dropped when
// they are far away, and small overlays animate smoke, water, the flag and
// Thorfinn.

import { createSurface, hex, type Surface } from '../pixel-landscape/pixels'
import {
  bannerOverlay,
  createAmbientOverlays,
  createClouds,
  drawBirds,
  drawClouds,
  drawSky,
  HERO_FOCUS_END,
  K,
  LAYERS,
  renderTile,
  SKY_TOP_COLOR,
  thorfinnOverlay,
  TILE_WIDTH,
  WORLD_BOTTOM,
  WORLD_HEIGHT,
  WORLD_TOP,
  type BannerText,
  type LayerId,
  type Overlay,
  type SpriteImage
} from '../pixel-landscape/world'

// world pixels that always fit across the screen, so phones still see the
// chalet and Thorfinn instead of a sliver of the scene
const MIN_VISIBLE = 300
const CLOUD_FACTOR = 0.08
// clouds and birds live in the top rows of the world
const CLOUD_ROWS = 200 - WORLD_TOP
const AMBIENT_FPS = 12

interface TileLayer {
  id: LayerId
  factor: number
  el: HTMLDivElement
  tiles: Map<number, HTMLCanvasElement>
  offset: number
}

interface MountedOverlay {
  overlay: Overlay
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  surface: Surface
}

function pixelCanvas(width: number, height: number) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.style.position = 'absolute'
  canvas.style.imageRendering = 'pixelated'
  return canvas
}

function blit(ctx: CanvasRenderingContext2D, s: Surface) {
  ctx.putImageData(new ImageData(s.data, s.width, s.height), 0, 0)
}

export class JourneyRenderer {
  // css pixels per world pixel
  scale = 1
  // camera position (world pixels) at the top of the page
  start = 0
  // world pixels across the screen
  visible = 0

  private readonly stage: HTMLDivElement
  private readonly backdrop: HTMLDivElement
  private readonly sky: HTMLCanvasElement
  private readonly cloudCanvas: HTMLCanvasElement
  private cloudSurface: Surface | undefined
  private clouds = createClouds(600)
  private cloudSpan = 600
  private readonly layers: TileLayer[]
  private readonly ambient = createAmbientOverlays()
  private banner: Overlay | undefined
  private thorfinn: Overlay | undefined
  private readonly mounted = new Map<Overlay, MountedOverlay>()
  private queue: [TileLayer, number][] = []
  private queueTimer = 0
  private ambientFrame = 0
  private lastTick = 0
  private cam = 0
  private time = 3
  private animate: boolean

  constructor(host: HTMLElement, animate: boolean) {
    this.animate = animate
    this.stage = document.createElement('div')
    Object.assign(this.stage.style, {
      position: 'absolute',
      left: '0',
      right: '0',
      bottom: '0',
      top: '0',
      overflow: 'hidden',
      background: hex(SKY_TOP_COLOR)
    })
    // every layer is a box as tall as the world, anchored to the bottom of
    // the screen; the sky and clouds stay still, the others scroll
    const layerBox = () => {
      const el = document.createElement('div')
      Object.assign(el.style, {
        position: 'absolute',
        left: '0',
        bottom: '0',
        width: '0',
        willChange: 'transform'
      })
      this.stage.append(el)
      return el
    }
    this.backdrop = layerBox()
    this.sky = pixelCanvas(1, WORLD_HEIGHT)
    this.cloudCanvas = pixelCanvas(1, CLOUD_ROWS)
    this.backdrop.append(this.sky, this.cloudCanvas)
    this.layers = LAYERS.map(({ id, factor }) => ({
      id,
      factor,
      el: layerBox(),
      tiles: new Map(),
      offset: 0
    }))
    host.append(this.stage)
    if (animate) this.ambientFrame = requestAnimationFrame(this.tick)
  }

  resize(width: number, height: number) {
    this.scale = Math.min(height / WORLD_BOTTOM, width / MIN_VISIBLE)
    this.visible = width / this.scale
    this.start = Math.max(0, HERO_FOCUS_END - this.visible)
    const s = this.scale

    const boxHeight = `${Math.round(WORLD_HEIGHT * s)}px`
    this.backdrop.style.height = boxHeight
    for (const layer of this.layers) layer.el.style.height = boxHeight

    const columns = Math.ceil(this.visible) + 2
    this.sky.width = columns
    const sky = createSurface(columns, WORLD_HEIGHT, 0, WORLD_TOP)
    drawSky(sky)
    blit(this.sky.getContext('2d')!, sky)
    this.place(this.sky, 0, WORLD_TOP, columns, WORLD_HEIGHT)

    this.cloudCanvas.width = columns
    this.cloudSurface = createSurface(columns, CLOUD_ROWS, 0, WORLD_TOP)
    this.place(this.cloudCanvas, 0, WORLD_TOP, columns, CLOUD_ROWS)
    this.cloudSpan = this.visible / K + 160
    this.clouds = createClouds(this.cloudSpan)

    for (const layer of this.layers) {
      layer.tiles.forEach((canvas, index) => {
        this.place(
          canvas,
          index * TILE_WIDTH,
          WORLD_TOP,
          TILE_WIDTH,
          WORLD_HEIGHT
        )
      })
    }
    this.mounted.forEach(({ overlay, canvas }) => {
      this.place(canvas, overlay.x, overlay.y, overlay.width, overlay.height)
    })
    this.setCamera(Math.max(this.cam, this.start))
  }

  // world rect → css box inside a layer (whose top is the top of the world);
  // edges are rounded so neighbouring tiles never leave hairline gaps
  private place(
    canvas: HTMLCanvasElement,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    const s = this.scale
    const left = Math.round(x * s)
    const top = Math.round((y - WORLD_TOP) * s)
    canvas.style.left = `${left}px`
    canvas.style.top = `${top}px`
    canvas.style.width = `${Math.round((x + width) * s) - left}px`
    canvas.style.height = `${Math.round((y - WORLD_TOP + height) * s) - top}px`
  }

  layerOffset(factor: number) {
    return Math.round(this.start + (this.cam - this.start) * factor)
  }

  setCamera(cam: number) {
    this.cam = cam
    for (const layer of this.layers) {
      layer.offset = this.layerOffset(layer.factor)
      layer.el.style.transform = `translate3d(${-layer.offset * this.scale}px,0,0)`
      this.ensureTiles(layer)
    }
    this.syncOverlays()
    this.drawSkyLife()
  }

  setBanner(text: BannerText) {
    if (this.banner) this.unmount(this.banner)
    this.banner = bannerOverlay(text)
    this.syncOverlays()
  }

  setThorfinn(sprite: SpriteImage) {
    if (this.thorfinn) this.unmount(this.thorfinn)
    this.thorfinn = thorfinnOverlay(sprite)
    this.syncOverlays()
  }

  destroy() {
    cancelAnimationFrame(this.ambientFrame)
    clearTimeout(this.queueTimer)
    this.stage.remove()
  }

  private ensureTiles(layer: TileLayer) {
    const { offset } = layer
    const first = Math.floor(offset / TILE_WIDTH)
    const last = Math.floor((offset + this.visible) / TILE_WIDTH)
    for (let i = first; i <= last; i++) {
      if (!layer.tiles.has(i)) this.mountTile(layer, i)
    }
    // prepare the next tiles in the background
    for (const i of [last + 1, last + 2, first - 1]) {
      if (i >= 0 && !layer.tiles.has(i)) this.enqueue(layer, i)
    }
    layer.tiles.forEach((canvas, i) => {
      if (i < first - 3 || i > last + 4) {
        canvas.remove()
        layer.tiles.delete(i)
      }
    })
  }

  private mountTile(layer: TileLayer, index: number) {
    const surface = renderTile(layer.id, index)
    const canvas = pixelCanvas(TILE_WIDTH, WORLD_HEIGHT)
    blit(canvas.getContext('2d')!, surface)
    this.place(canvas, index * TILE_WIDTH, WORLD_TOP, TILE_WIDTH, WORLD_HEIGHT)
    layer.el.append(canvas)
    layer.tiles.set(index, canvas)
    // overlays of a layer stay above its tiles
    this.mounted.forEach(({ overlay, canvas: c }) => {
      if (overlay.layer === layer.id) layer.el.append(c)
    })
  }

  private enqueue(layer: TileLayer, index: number) {
    if (this.queue.some(([l, i]) => l === layer && i === index)) return
    this.queue.push([layer, index])
    if (!this.queueTimer) this.queueTimer = window.setTimeout(this.drain, 40)
  }

  private drain = () => {
    this.queueTimer = 0
    const next = this.queue.shift()
    if (!next) return
    const [layer, index] = next
    const first = Math.floor(layer.offset / TILE_WIDTH)
    const last = Math.floor((layer.offset + this.visible) / TILE_WIDTH)
    if (!layer.tiles.has(index) && index >= first - 2 && index <= last + 3) {
      this.mountTile(layer, index)
    }
    if (this.queue.length) this.queueTimer = window.setTimeout(this.drain, 40)
  }

  private overlays() {
    const list = [...this.ambient]
    if (this.banner) list.push(this.banner)
    if (this.thorfinn) list.push(this.thorfinn)
    return list
  }

  private syncOverlays() {
    for (const overlay of this.overlays()) {
      const layer = this.layers.find((l) => l.id === overlay.layer)!
      const near =
        overlay.x + overlay.width > layer.offset - 64 &&
        overlay.x < layer.offset + this.visible + 64
      const mounted = this.mounted.get(overlay)
      if (near && !mounted) this.mount(overlay, layer)
      else if (!near && mounted) this.unmount(overlay)
    }
  }

  private mount(overlay: Overlay, layer: TileLayer) {
    const canvas = pixelCanvas(overlay.width, overlay.height)
    const ctx = canvas.getContext('2d')!
    const surface = createSurface(
      overlay.width,
      overlay.height,
      overlay.x,
      overlay.y
    )
    this.place(canvas, overlay.x, overlay.y, overlay.width, overlay.height)
    layer.el.append(canvas)
    const entry = { overlay, canvas, ctx, surface }
    this.mounted.set(overlay, entry)
    this.drawOverlay(entry)
  }

  private unmount(overlay: Overlay) {
    this.mounted.get(overlay)?.canvas.remove()
    this.mounted.delete(overlay)
  }

  private drawOverlay({ overlay, ctx, surface }: MountedOverlay) {
    surface.data.fill(0)
    overlay.draw(surface, this.time)
    blit(ctx, surface)
  }

  private drawSkyLife() {
    const s = this.cloudSurface
    if (!s) return
    s.data.fill(0)
    const shift = this.layerOffset(CLOUD_FACTOR) / K
    drawClouds(s, this.clouds, this.cloudSpan, this.time, shift)
    drawBirds(s, this.cloudSpan, this.time, shift)
    blit(this.cloudCanvas.getContext('2d')!, s)
  }

  private tick = (now: number) => {
    this.ambientFrame = requestAnimationFrame(this.tick)
    if (now - this.lastTick < 1000 / AMBIENT_FPS || document.hidden) return
    this.lastTick = now
    this.time = now / 1000
    this.mounted.forEach((entry) => this.drawOverlay(entry))
    this.drawSkyLife()
  }
}
