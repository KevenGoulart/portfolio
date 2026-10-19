'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import Abilities from '../sections/abilities'
import Contact from '../sections/contact'
import Experience from '../sections/experience'
import Presentation from '../sections/presentation'
import ProfessionalProjects from '../sections/professional-projects'
import Projects from '../sections/projects'
import {
  GROUND_Y,
  WORLD_BOTTOM,
  type SpriteImage
} from '../pixel-landscape/world'
import { Hud } from './hud'
import { Signpost } from './pixel'
import { JourneyRenderer } from './renderer'

// generated with Sprite Fusion (https://www.spritefusion.com)
const THORFINN_SPRITE = '/pixel-art/thorfinn.png'
const BANNER_NAME = 'Keven Goulart'
const SECTION_IDS = [
  'about',
  'projects',
  'professional-projects',
  'experience',
  'abilities',
  'contact'
]
// panels float above the rooftops of the town
const PANEL_FLOOR_Y = 350

async function loadSprite(src: string): Promise<SpriteImage> {
  const img = new Image()
  img.src = src
  await img.decode()
  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('2d context unavailable')
  ctx.drawImage(img, 0, 0)
  return ctx.getImageData(0, 0, canvas.width, canvas.height)
}

// left edge of an element inside the track
function trackLeft(element: HTMLElement, track: HTMLElement) {
  let left = 0
  let node: HTMLElement | null = element
  while (node && node !== track) {
    left += node.offsetLeft
    node = node.offsetParent as HTMLElement | null
  }
  return left
}

export default function Journey() {
  const t = useTranslations('Journey')
  const tLandscape = useTranslations('Landscape')
  const tPresentation = useTranslations('Presentation')
  const subtitle = tPresentation('greeting')

  const outerRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<JourneyRenderer | null>(null)
  // scroll distance (css px) and how it maps onto the world camera
  const metrics = useRef({ start: 0, scale: 1, distance: 0, width: 0 })
  const [active, setActive] = useState<string | null>(null)
  const [atStart, setAtStart] = useState(true)

  // page scroll needed to show a section (or the start for null)
  const scrollTarget = useCallback((id: string | null) => {
    const outer = outerRef.current
    const track = trackRef.current
    if (!outer || !track) return 0
    const { start, scale, distance, width } = metrics.current
    if (!id) return outer.offsetTop
    const element = document.getElementById(id)
    if (!element) return outer.offsetTop
    const cam = (trackLeft(element, track) - width * 0.06) / scale
    const progress = Math.min(Math.max((cam - start) * scale, 0), distance)
    return outer.offsetTop + progress
  }, [])

  const navigate = useCallback(
    (id: string | null) => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
      window.scrollTo({
        top: scrollTarget(id),
        behavior: reduce.matches ? 'auto' : 'smooth'
      })
      if (id) history.replaceState(null, '', `#${id}`)
      else history.replaceState(null, '', window.location.pathname)
    },
    [scrollTarget]
  )

  useEffect(() => {
    const outer = outerRef.current
    const viewport = viewportRef.current
    const scene = sceneRef.current
    const track = trackRef.current
    if (!outer || !viewport || !scene || !track) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const renderer = new JourneyRenderer(scene, !reduce.matches)
    rendererRef.current = renderer
    let frame = 0
    let disposed = false

    const update = () => {
      frame = 0
      const { start, scale, distance, width } = metrics.current
      const progress = Math.min(
        Math.max(window.scrollY - outer.offsetTop, 0),
        distance
      )
      const cam = start + progress / scale
      renderer.setCamera(cam)
      // the track moves with the street, snapped to whole world pixels
      track.style.transform = `translate3d(${-Math.round(cam) * scale}px,0,0)`
      setAtStart(progress < 24)
      const probe = Math.round(cam) * scale + width / 3
      let current: string | null = null
      for (const id of SECTION_IDS) {
        const element = document.getElementById(id)
        if (element && element.offsetLeft <= probe) current = id
      }
      setActive(current)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    const measure = () => {
      const width = viewport.clientWidth
      const height = viewport.clientHeight
      renderer.resize(width, height)
      const scale = renderer.scale
      const style = viewport.style
      style.setProperty('--s', String(scale))
      style.setProperty(
        '--ground',
        `${Math.round((WORLD_BOTTOM - GROUND_Y) * scale)}px`
      )
      style.setProperty(
        '--panel-bottom',
        `${Math.round((WORLD_BOTTOM - PANEL_FLOOR_Y) * scale)}px`
      )
      const startPx = Math.round(renderer.start * scale)
      style.setProperty('--track-start', `${startPx + width}px`)
      const distance = Math.max(0, track.scrollWidth - width - startPx)
      metrics.current = { start: renderer.start, scale, distance, width }
      outer.style.height = `${height + distance}px`
      update()
    }

    // a link to a section (#projects…) opens the journey at that section;
    // it runs after the router's own hash scrolling, which knows nothing
    // about the horizontal track
    const hash = window.location.hash.slice(1)
    const jumpToHash = () => {
      const unchanged = window.location.hash.slice(1) === hash
      if (!disposed && unchanged && SECTION_IDS.includes(hash)) {
        window.scrollTo({ top: scrollTarget(hash), behavior: 'auto' })
      }
    }
    measure()
    const hashFrame = requestAnimationFrame(jumpToHash)
    // fonts change the width of the panels
    document.fonts?.ready.then(() => {
      if (disposed) return
      measure()
      jumpToHash()
    })

    const onHashChange = () => {
      const id = window.location.hash.slice(1)
      if (SECTION_IDS.includes(id)) {
        window.scrollTo({ top: scrollTarget(id), behavior: 'auto' })
      }
    }
    window.addEventListener('hashchange', onHashChange)

    const resizeObserver = new ResizeObserver(() => measure())
    resizeObserver.observe(viewport)
    window.addEventListener('scroll', schedule, { passive: true })

    // sideways trackpad gestures travel along the journey too
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return
      event.preventDefault()
      window.scrollBy({ top: event.deltaX, behavior: 'auto' })
    }
    viewport.addEventListener('wheel', onWheel, { passive: false })

    // keyboard focus on a panel outside the screen brings it into view
    const onFocus = (event: FocusEvent) => {
      const target = event.target as HTMLElement
      if (!track.contains(target)) return
      const { scale, width } = metrics.current
      const left = trackLeft(target, track)
      const shown = left - Math.round(renderer.layerOffset(1)) * scale
      if (shown < 0 || shown + target.offsetWidth > width) {
        const cam = (left - width * 0.3) / scale
        const progress = Math.min(
          Math.max((cam - metrics.current.start) * scale, 0),
          metrics.current.distance
        )
        window.scrollTo({ top: outer.offsetTop + progress, behavior: 'auto' })
      }
    }
    viewport.addEventListener('focusin', onFocus)

    loadSprite(THORFINN_SPRITE)
      .then((sprite) => {
        if (!disposed) renderer.setThorfinn(sprite)
      })
      .catch(() => {})

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      cancelAnimationFrame(hashFrame)
      resizeObserver.disconnect()
      window.removeEventListener('hashchange', onHashChange)
      window.removeEventListener('scroll', schedule)
      viewport.removeEventListener('wheel', onWheel)
      viewport.removeEventListener('focusin', onFocus)
      renderer.destroy()
      rendererRef.current = null
    }
  }, [scrollTarget])

  // the flag follows the selected language
  useEffect(() => {
    rendererRef.current?.setBanner({ title: BANNER_NAME, subtitle })
  }, [subtitle])

  return (
    <div ref={outerRef} className="relative h-[100dvh]">
      <h1 className="sr-only">
        {BANNER_NAME} – {subtitle}
      </h1>
      <Hud active={active} onNavigate={navigate} />

      <div
        ref={viewportRef}
        className="sticky top-0 h-[100dvh] w-full overflow-hidden [overflow:clip]"
      >
        <div
          ref={sceneRef}
          role="img"
          aria-label={tLandscape('description')}
          className="absolute inset-0"
        />

        <div
          aria-hidden={!atStart}
          className="pointer-events-none absolute inset-x-0 flex justify-center transition-opacity duration-500"
          style={{
            bottom: 'calc(var(--ground, 80px) + 24px)',
            opacity: atStart ? 1 : 0
          }}
        >
          <p className="pixel-button !text-sm">
            {t('scrollHint')}
            <span className="journey-hint-arrow" aria-hidden="true">
              ▼
            </span>
          </p>
        </div>

        <div
          ref={trackRef}
          className="absolute inset-y-0 left-0 flex will-change-transform"
          style={{ paddingLeft: 'var(--track-start, 100vw)' }}
        >
          <Presentation />
          <Projects />
          <ProfessionalProjects />
          <Experience />
          <Abilities />
          <Contact />
          <section
            aria-labelledby="journey-end"
            className="journey-section !mr-[8vw]"
          >
            <Signpost id="journey-end">{t('end')}</Signpost>
            <button
              type="button"
              className="pixel-button self-end"
              style={{
                marginBottom: 'calc(var(--ground) - var(--panel-bottom) + 24px)'
              }}
              onClick={() => navigate(null)}
            >
              ◀ {t('backToStart')}
            </button>
          </section>
        </div>
      </div>
    </div>
  )
}
