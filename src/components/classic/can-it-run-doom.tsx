'use client'

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
    <div className="flex flex-col items-center my-16">
      <Script src="/script.js" strategy="beforeInteractive" />
      <h2>But can this portfolio run Doom? Yes, yes it can</h2>
      <div className="flex gap-3">
        <div
          id="dosbox"
          className="w-fit h-fit mx-auto mt-4 bg-black"
          onClick={handleShowGuide}
        />
        {showGuide && (
          <div>
            <h3 className="font-bold mb-2 text-lg text-yellow-400 mt-4">
              DOOM Controls
            </h3>
            <ul className="space-y-1">
              <li>
                <b>Arrow Keys</b> – Move
              </li>
              <li>
                <b>Ctrl</b> – Fire
              </li>
              <li>
                <b>Space</b> – Open door / Interact
              </li>
              <li>
                <b>Alt</b> – Strafe
              </li>
              <li>
                <b>Shift</b> – Run
              </li>
              <li>
                <b>Esc</b> – Menu
              </li>
              <li>
                <b>Enter</b> – Select
              </li>
            </ul>
          </div>
        )}
      </div>
      <button
        className="wrapper mt-2 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
        onClick={handleFullscreen}
      >
        <span>FULLSCREEN</span>
      </button>
    </div>
  )
}
