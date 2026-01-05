'use client'

import Iridescence from '@/components/Iridescence'
import LanguageSelector from '@/components/language-selector'
import NewAbilities from '@/components/sections/abilities'
import NewContact from '@/components/sections/contact'
import NewExperience from '@/components/sections/experience'
import NewHeader from '@/components/sections/header'
import NewPresentation from '@/components/sections/presentation'
import NewProjects from '@/components/sections/projects'
import SplashCursor from '@/components/SplashCursor'

export default function NewPage() {
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
        <NewHeader />
        <h1 className="text-6xl pl-[10%] pt-[4%] text-slate-900/85 font-bold tracking-wider">
          Keven Goulart <br /> FullStack Developer
          <LanguageSelector />
        </h1>

        <div className="mt-20">
          <NewPresentation />
        </div>

        <div className="flex items-center justify-center mt-40">
          <NewProjects />
        </div>

        <div className="flex items-center justify-center mt-40">
          <NewExperience />
        </div>

        <div className="flex items-center justify-center mt-28">
          <NewAbilities />
        </div>

        <NewContact />
      </div>
    </div>
  )
}
