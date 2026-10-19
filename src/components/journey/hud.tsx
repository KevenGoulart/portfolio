'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import LanguageSelector from '../language-selector'

export const NAV_SECTIONS = [
  { id: 'about', key: 'aboutMe' },
  { id: 'projects', key: 'projects' },
  { id: 'experience', key: 'experience' },
  { id: 'abilities', key: 'abilities' },
  { id: 'contact', key: 'contact' }
] as const

interface HudProps {
  active: string | null
  onNavigate: (id: string | null) => void
}

export function Hud({ active, onNavigate }: HudProps) {
  const t = useTranslations('Header')
  const tJourney = useTranslations('Journey')
  const [open, setOpen] = useState(false)

  const go = (id: string | null) => {
    setOpen(false)
    onNavigate(id)
  }

  // the professional projects live next to the personal ones in the menu
  const isActive = (id: string) =>
    active === id || (id === 'projects' && active === 'professional-projects')

  const links = NAV_SECTIONS.map(({ id, key }) => (
    <a
      key={id}
      href={`#${id}`}
      className="pixel-button capitalize"
      data-variant="paper"
      aria-current={isActive(id) ? 'true' : undefined}
      onClick={(event) => {
        event.preventDefault()
        go(id)
      }}
    >
      {t(key)}
    </a>
  ))

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start justify-between gap-2 px-3 pt-3 md:px-6">
      <button
        type="button"
        className="pixel-button pointer-events-auto !text-base"
        onClick={() => go(null)}
        aria-label={tJourney('home')}
      >
        Keven Goulart
      </button>

      <nav
        aria-label="Menu"
        className="pointer-events-auto hidden flex-wrap justify-end gap-1 lg:flex"
      >
        {links}
      </nav>

      <div className="pointer-events-auto flex items-center gap-1">
        <LanguageSelector />
        <button
          type="button"
          className="pixel-button lg:hidden"
          aria-expanded={open}
          aria-controls="journey-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? tJourney('closeMenu') : tJourney('menu')}
        </button>
      </div>

      {open && (
        <nav
          id="journey-menu"
          aria-label="Menu"
          className="pixel-panel pointer-events-auto absolute right-3 top-16 flex flex-col items-stretch gap-1 p-3 lg:hidden"
        >
          {links}
        </nav>
      )}
    </header>
  )
}
