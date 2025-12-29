import Abilities from '@/components/classic/abilities'
import Contact from '@/components/classic/contact'
import Experience from '@/components/classic/experience'
import Header from '@/components/classic/header'
import Presentation from '@/components/classic/presentation'
import Projects from '@/components/classic/projects'
import LanguageSelector from '@/components/language-selector'
import { FadeSideSection } from '@/components/fade-side'
import { FadeInSection } from '@/components/fade-in'

export default function ClassicPage() {
  return (
    <div className="overflow-hidden">
      <FadeInSection>
        <Header />
      </FadeInSection>
      <div className="flex justify-end pr-6 md:pr-60 mt-[120px] md:mt-24">
        <FadeInSection>
          <LanguageSelector />
        </FadeInSection>
      </div>
      <Presentation />
      <FadeSideSection>
        <Projects />
      </FadeSideSection>
      <FadeSideSection>
        <Experience />
      </FadeSideSection>
      <FadeSideSection>
        <Abilities />
      </FadeSideSection>
      <Contact />
    </div>
  )
}

// import CombinedScene from '@/components/foreground'

// export default function Home() {
//   return (
//     <div className="relative w-screen h-screen bg-cover bg-center">
//       <CombinedScene />
//     </div>
//   )
// }
