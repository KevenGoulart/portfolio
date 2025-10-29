import Abilities from '@/components/classic/abilities'
import Contact from '@/components/classic/contact'
import Experience from '@/components/classic/experience'
import Header from '@/components/classic/header'
import Presentation from '@/components/classic/presentation'
import Projects from '@/components/classic/projects'
import LanguageSelector from '@/components/language-selector'

export default function ClassicPage() {
  return (
    <div>
      <Header />
      <div className="flex justify-end pr-80 mt-2">
        <LanguageSelector />
      </div>
      <Presentation />
      <Projects />
      <Experience />
      <Abilities />
      <Contact />
    </div>
  )
}
