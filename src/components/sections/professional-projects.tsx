import { useTranslations } from 'next-intl'
import { PROFESSIONAL_PROJECTS } from '@/lib/projects'
import { ProjectCard, type ProjectCardItem } from '../project-cards'
import { Signpost } from '../journey/pixel'

export default function ProfessionalProjects() {
  const t = useTranslations('ProfessionalProjects')

  const cards: ProjectCardItem[] = PROFESSIONAL_PROJECTS.map(
    ({ key, ...project }) => ({ ...project, summary: t(`${key}.summary`) })
  )

  return (
    <section
      id="professional-projects"
      aria-labelledby="professional-projects-title"
      className="journey-section gap-[clamp(10px,1.2vw,20px)]"
    >
      <Signpost id="professional-projects-title">{t('title')}</Signpost>
      {cards.map((card) => (
        <ProjectCard key={card.title} card={card} />
      ))}
    </section>
  )
}
