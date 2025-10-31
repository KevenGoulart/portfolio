import Abilities from '@/components/classic/abilities'
import CanItRunDoom from '@/components/classic/can-it-run-doom'
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
    <div>
      <FadeInSection>
        <Header />
      </FadeInSection>
      <div className="flex justify-end pr-80 mt-28">
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
      <FadeSideSection>
        <CanItRunDoom />
      </FadeSideSection>
      <Contact />
    </div>
  )
}
