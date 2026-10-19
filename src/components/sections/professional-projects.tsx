import { useTranslations } from 'next-intl'
import { ProjectCard, type ProjectCardItem } from '../project-cards'
import { Signpost } from '../journey/pixel'

export default function ProfessionalProjects() {
  const t = useTranslations('ProfessionalProjects')

  const cards: ProjectCardItem[] = [
    {
      image: '/dravictoria.png',
      title: 'Dra. Victoria',
      description: t('draVictoriaDescription'),
      tech: t('draVictoriaTech'),
      link: 'https://dravictoriabarbalho.com/'
    },
    {
      image: '/goldciclo.png',
      title: 'Gold Ciclo',
      description: t('goldCicloDescription'),
      tech: t('goldCicloTech'),
      link: 'https://goldciclo.com/'
    },
    {
      image: '/maisvit-shopify.png',
      title: 'Mais Vit',
      description: t('maisVitDescription'),
      tech: t('maisVitTech'),
      link: 'https://conheca.maisvit.com/'
    },
    {
      image: '/libid365.png',
      title: 'Libid365',
      description: t('metibalaDescription'),
      tech: t('metibalaTech'),
      link: 'https://www.libid365.com/'
    },
    {
      image: '/upslim.png',
      title: 'UPSlim',
      description: t('upslimDescription'),
      tech: t('upslimTech'),
      link: 'https://upslim.com.br/'
    }
  ]

  return (
    <section
      id="professional-projects"
      aria-labelledby="professional-projects-title"
      className="journey-section"
    >
      <Signpost id="professional-projects-title">{t('title')}</Signpost>
      {cards.map((card) => (
        <ProjectCard key={card.title} card={card} />
      ))}
    </section>
  )
}
