'use client'

import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa'
import GlitchedWriter from 'glitched-writer'
import { useEffect, useRef, useState } from 'react'
import RetroLoadingBar from '../retro-loading-bar'
import { FadeInSection } from '../fade-in'

export default function Presentation() {
  const t = useTranslations('Presentation')

  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const magiRef = useRef<HTMLParagraphElement>(null)
  const [showItems, setShowItems] = useState(false)

  useEffect(() => {
    if (!titleRef.current || !descRef.current || !magiRef.current) return

    const titleWriter = new GlitchedWriter(titleRef.current, {
      interval: [30, 80],
      delay: [500, 1000],
      glyphs: '!<>-_\\/[]{}—=+*^?#________',
      letterize: true
    })

    const descWriter = new GlitchedWriter(descRef.current, {
      interval: [15, 40],
      delay: [0, 0],
      glyphs: '!<>-_\\/[]{}—=+*^?#________',
      letterize: true
    })

    const magiWriter = new GlitchedWriter(magiRef.current, {
      interval: [100, 200],
      delay: [0, 0],
      glyphs: '!<>-_\\/[]{}—=+*^?#________',
      letterize: true
    })

    magiWriter.write('Initializing MAGI...')

    titleWriter.write(`${t('greeting1')}\n${t('greeting2')}`).then(() => {
      descWriter.write(t('description'))
    })

    const timer = setTimeout(() => setShowItems(true), 4000)

    return () => clearTimeout(timer)
  }, [t])
  return (
    <main
      id="presentation"
      className="flex flex-col md:flex-row max-sm:gap-8 items-center justify-evenly md:mt-12 mb-16 md:mb-60"
    >
      <div className="w-[500px] h-[300px] flex flex-col gap-4 max-sm:mt-2">
        <h1
          ref={titleRef}
          className="text-4xl md:text-5xl text-yellow-200 text-center whitespace-pre-line"
        />
        <p
          ref={descRef}
          className="max-sm:mx-12 text-sm md:text-lg text-center text-white/90"
        />
        <div
          className={`flex items-center justify-center gap-4 transition-opacity duration-1000 ${
            showItems ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex items-center justify-center border border-white rounded-full p-2 group cursor-pointer hover:border-white/50 hover:scale-110 transition-transform duration-300">
            <Link
              href="https://www.linkedin.com/in/k%C3%A9ven-goulart-890248215/"
              target="_blank"
            >
              <FaLinkedin className="size-10 group-hover:text-white/50" />
            </Link>
          </div>
          <div className="flex items-center justify-center border border-white rounded-full p-2 group cursor-pointer hover:border-white/50 hover:scale-110 transition-transform duration-300">
            <Link href="https://github.com/KevenGoulart" target="_blank">
              <FaGithub className="size-10 group-hover:text-white/50" />
            </Link>
          </div>
          <div className="flex items-center justify-center border border-white rounded-full p-2 group cursor-pointer hover:border-white/50 hover:scale-110 transition-transform duration-300">
            <Link href="mailto:kevengoulartmm@gmail.com" target="_blank">
              <FaEnvelope className="size-10 group-hover:text-white/50" />
            </Link>
          </div>
        </div>
      </div>
      <FadeInSection>
        <div
          className={`max-sm:mx-4 border-8 opacity-100 relative inline-block transition-opacity duration-1000 ${showItems ? 'border-green-700/30' : 'border-green-950/30'}`}
          style={{
            clipPath:
              'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
          }}
        >
          {!showItems && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/90">
              <h1
                ref={magiRef}
                className="text-green-700 text-2xl font-mono animate-pulse"
              />
              <RetroLoadingBar bars={35} loop={false} />
            </div>
          )}

          <div
            className={`transition-opacity duration-1000 ${
              showItems ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src="/magi.gif"
              alt="Magi"
              width={600}
              height={600}
              className="w-full h-full object-cover"
              unoptimized
              priority
            />
          </div>
        </div>
      </FadeInSection>
    </main>
  )
}
