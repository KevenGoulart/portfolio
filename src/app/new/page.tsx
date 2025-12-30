'use client'

import Iridescence from '@/components/Iridescence'
import NewAbilities from '@/components/new/new-abilities'
import NewContact from '@/components/new/new-contact'
import NewExperience from '@/components/new/new-experience'
import NewHeader from '@/components/new/new-header'
import NewPresentation from '@/components/new/new-presentation'
import NewProjects from '@/components/new/new-projects'

export default function NewPage() {
  return (
    <div className="relative min-h-screen text-slate-900 overflow-hidden">
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
        <h1 className="text-6xl pl-[10%] pt-[6%] text-slate-900/85 font-bold">
          Keven Goulart <br /> FullStack Developer
        </h1>

        <div className="mt-32">
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
