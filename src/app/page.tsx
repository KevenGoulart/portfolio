'use client'

import Iridescence from '@/components/Iridescence'
import LanguageSelector from '@/components/language-selector'
import Abilities from '@/components/sections/abilities'
import NewContact from '@/components/sections/contact'
import Experience from '@/components/sections/experience'
import Header from '@/components/sections/header'
import Presentation from '@/components/sections/presentation'
import Projects from '@/components/sections/projects'
import SplashCursor from '@/components/SplashCursor'
import { useTranslations } from 'next-intl'

export default function NewPage() {
  const t = useTranslations('Presentation')
  return (
    <div className="relative min-h-screen text-slate-900 overflow-hidden">
      <SplashCursor />
      <div className="absolute inset-0 z-0">
        <Iridescence
          color={[1, 1, 1]}
          mouseReact={false}
          amplitude={0.1}
          speed={0.3}
        />
      </div>

      <div className="relative z-10">
        <Header />
        <h1 className="text-6xl pl-[10%] pt-[4%] text-slate-900/85 font-bold tracking-wider">
          Keven Goulart <br /> {t('greeting')}
          <LanguageSelector />
        </h1>

        <Presentation />

        <Projects />

        <Experience />

        <Abilities />

        <NewContact />
      </div>
    </div>
  )
}
