import { useTranslations } from 'next-intl'
import { ALL_PROJECTS_URL, PERSONAL_PROJECTS } from '@/lib/projects'
import { ProjectCard, type ProjectCardItem } from '../project-cards'
import { Signpost } from '../journey/pixel'

export default function Projects() {
  const t = useTranslations('Projects')

  const cards: ProjectCardItem[] = [
    ...PERSONAL_PROJECTS.map(({ key, caseStudy, ...project }) => ({
      ...project,
      summary: t(`${key}.summary`),
      ...(caseStudy
        ? {
            problem: t(`${key}.problem`),
            highlights: t.raw(`${key}.highlights`) as string[]
          }
        : {})
    })),
    {
      image: '/github.webp',
      title: t('otherProjects'),
      summary: t('otherProjectsDescription'),
      tech: [],
      code: ALL_PROJECTS_URL
    }
  ]

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="journey-section gap-[clamp(10px,1.2vw,20px)]"
    >
      <Signpost id="projects-title">{t('title')}</Signpost>
      {cards.map((card) => (
        <ProjectCard key={card.title} card={card} />
      ))}
    </section>
  )
}
