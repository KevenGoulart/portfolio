import type { CSSProperties } from 'react'
import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'

import './BubbleMenu.css'

type MenuItem = {
  label: string
  href: string
  ariaLabel?: string
  rotation?: number
  hoverStyles?: {
    bgColor?: string
    textColor?: string
  }
}

export type BubbleMenuProps = {
  className?: string
  style?: CSSProperties
  menuBg?: string
  menuContentColor?: string
  useFixedPosition?: boolean
  items?: MenuItem[]
  animationEase?: string
  animationDuration?: number
  staggerDelay?: number
}

const DEFAULT_ITEMS: MenuItem[] = [
  {
    label: 'home',
    href: '#',
    ariaLabel: 'Home',
    rotation: -8,
    hoverStyles: { bgColor: '#3b82f6', textColor: '#ffffff' }
  },
  {
    label: 'about',
    href: '#',
    ariaLabel: 'About',
    rotation: 8,
    hoverStyles: { bgColor: '#10b981', textColor: '#ffffff' }
  },
  {
    label: 'projects',
    href: '#',
    ariaLabel: 'Projects',
    rotation: 8,
    hoverStyles: { bgColor: '#f59e0b', textColor: '#ffffff' }
  },
  {
    label: 'blog',
    href: '#',
    ariaLabel: 'Blog',
    rotation: 8,
    hoverStyles: { bgColor: '#ef4444', textColor: '#ffffff' }
  },
  {
    label: 'contact',
    href: '#',
    ariaLabel: 'Contact',
    rotation: -8,
    hoverStyles: { bgColor: '#8b5cf6', textColor: '#ffffff' }
  }
]

export default function BubbleMenu({
  className,
  style,
  menuBg = '#ffffff',
  menuContentColor = '#111111',
  useFixedPosition = false,
  items,
  animationEase = 'back.out(1.5)',
  animationDuration = 0.5,
  staggerDelay = 0.12
}: BubbleMenuProps) {
  const [isMenuOpen] = useState(true)

  const overlayRef = useRef<HTMLDivElement>(null)
  const bubblesRef = useRef<HTMLAnchorElement[]>([])
  const labelRefs = useRef<HTMLSpanElement[]>([])

  const menuItems = items?.length ? items : DEFAULT_ITEMS

  useEffect(() => {
    const overlay = overlayRef.current
    const bubbles = bubblesRef.current.filter(Boolean)
    const labels = labelRefs.current.filter(Boolean)

    if (!overlay || !bubbles.length) return

    gsap.set(overlay, { display: 'flex' })
    gsap.set(bubbles, { scale: 0, transformOrigin: '50% 50%' })
    gsap.set(labels, { y: 24, autoAlpha: 0 })

    bubbles.forEach((bubble, i) => {
      const delay = i * staggerDelay + gsap.utils.random(-0.05, 0.05)
      const tl = gsap.timeline({ delay })

      tl.to(bubble, {
        scale: 1,
        duration: animationDuration,
        ease: animationEase
      })

      if (labels[i]) {
        tl.to(
          labels[i],
          {
            y: 0,
            autoAlpha: 1,
            duration: animationDuration,
            ease: 'power3.out'
          },
          `-=${animationDuration * 0.9}`
        )
      }
    })
  }, [animationEase, animationDuration, staggerDelay])

  useEffect(() => {
    const handleResize = () => {
      if (!isMenuOpen) return

      const bubbles = bubblesRef.current.filter(Boolean)
      const isDesktop = window.innerWidth >= 900

      bubbles.forEach((bubble, i) => {
        const item = menuItems[i]
        if (!item) return

        gsap.set(bubble, {
          rotation: isDesktop ? (item.rotation ?? 0) : 0
        })
      })
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isMenuOpen, menuItems])

  return (
    <div
      ref={overlayRef}
      className={`bubble-menu-items ${
        useFixedPosition ? 'fixed' : 'absolute'
      } ${className ?? ''}`}
      style={style}
      aria-hidden={!isMenuOpen}
    >
      <ul className="pill-list" role="menu" aria-label="Menu links">
        {menuItems.map((item, idx) => (
          <li key={idx} role="none" className="pill-col">
            <a
              role="menuitem"
              href={item.href}
              aria-label={item.ariaLabel || item.label}
              className="pill-link"
              style={
                {
                  '--item-rot': `${item.rotation ?? 0}deg`,
                  '--pill-bg': menuBg,
                  '--pill-color': menuContentColor,
                  '--hover-bg': item.hoverStyles?.bgColor || '#f3f4f6',
                  '--hover-color':
                    item.hoverStyles?.textColor || menuContentColor
                } as CSSProperties
              }
              ref={(el) => {
                if (el) bubblesRef.current[idx] = el
              }}
            >
              <span
                className="pill-label"
                ref={(el) => {
                  if (el) labelRefs.current[idx] = el
                }}
              >
                {item.label}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
