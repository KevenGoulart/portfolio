import { useTranslations } from 'next-intl'
import { ProjectCard, type ProjectCardItem } from '../project-cards'
import { Signpost } from '../journey/pixel'

export default function Projects() {
  const t = useTranslations('Projects')

  const cards: ProjectCardItem[] = [
    {
      image: '/cloth-showcase.png',
      title: 'Cloth Showcase',
      description: t('clothShowcaseDescription'),
      tech: t('clothShowcaseTech'),
      link: 'https://cloth-showcase.vercel.app/'
    },
    {
      image: '/nft.png',
      title: 'Nft Marketplace',
      description: t('nftMarketplaceDescription'),
      tech: t('nftMarketplaceTech'),
      link: 'https://nft-marketplace-theta-bay-72.vercel.app/?sort=recent&page=1'
    },
    {
      image: '/geeklog.png',
      title: 'GeekLog',
      description: t('geeklogDescription'),
      tech: t('geeklogTech'),
      link: 'https://geeklog.app/'
    },
    {
      image: '/raio-x-publico.png',
      title: 'Raio-X Público',
      description: t('raioXDescription'),
      tech: t('raioXTech'),
      link: 'https://github.com/KevenGoulart/Government-Tracking'
    },
    {
      image: '/github.png',
      title: t('otherProjects'),
      description: t('otherProjectsDescription'),
      tech: t('otherProjectsTech'),
      link: 'https://github.com/KevenGoulart?tab=repositories'
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
