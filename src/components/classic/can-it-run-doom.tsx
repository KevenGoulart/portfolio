'use client'

import { useTranslations } from 'next-intl'
import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    Dosbox: any
  }
}

export default function CanItRunDoom() {
  const dosboxRef = useRef<any>(null)
  const [showGuide, setShowGuide] = useState(false)
  const t = useTranslations('Doom')

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Dosbox) {
      const dosbox = new window.Dosbox({
        id: 'dosbox',
        onload: (db: any) => {
          db.run('/roms/ultimate-doom.zip', './UltDoom/DOOM.EXE')
        },
        onrun: (_db: any, app: string) => {
          console.log(`App '${app}' is running`)
        }
      })

      dosboxRef.current = dosbox
    }
  }, [])

  const handleFullscreen = () => {
    dosboxRef.current?.requestFullScreen?.()
  }

  const handleShowGuide = () => {
    setShowGuide(true)
  }

  return (
    <div className="flex flex-col items-center mt-20 mb-8">
      <Script src="/script.js" strategy="beforeInteractive" />
      <h2>{t('title')}</h2>
      <div className="flex gap-3">
        <div
          id="dosbox"
          className="w-[fit] h-[fit] mx-auto"
          onClick={handleShowGuide}
        />
        {showGuide && (
          <div>
            <h3 className="flex flex-col font-semibold tracking-wide mb-1 text-lg text-yellow-500">
              {t('guide')}{' '}
              <span className="text-sm text-white/70 font-normal">
                {t('subtitle')}
              </span>
            </h3>
            <ul>
              <li>
                <b className="tracking-wide">{t('controls.arrow')}</b> –{' '}
                {t('controls.move')}
              </li>
              <li>
                <b className="tracking-wide">{t('controls.ctrl')}</b> –{' '}
                {t('controls.fire')}
              </li>
              <li>
                <b className="tracking-wide">{t('controls.space')}</b> –{' '}
                {t('controls.interact')}
              </li>
              <li>
                <b className="tracking-wide">{t('controls.alt')}</b> –{' '}
                {t('controls.strafe')}
              </li>
              <li>
                <b className="tracking-wide">{t('controls.shift')}</b> –{' '}
                {t('controls.run')}
              </li>
              <li>
                <b className="tracking-wide">{t('controls.esc')}</b> –{' '}
                {t('controls.menu')}
              </li>
              <li>
                <b className="tracking-wide">{t('controls.enter')}</b> –{' '}
                {t('controls.select')}
              </li>
            </ul>
            <button
              className="mt-1 px-2 py-1 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition"
              onClick={handleFullscreen}
            >
              <span>FullScreen</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
