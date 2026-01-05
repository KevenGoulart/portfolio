import BounceCards from '@/components/BounceCards'
import { useTranslations } from 'next-intl'

const transformStyles = [
  'rotate(5deg) translate(-250px)',
  'rotate(0deg) translate(-150px)',
  'rotate(-5deg)',
  'rotate(5deg) translate(150px)',
  'rotate(-5deg) translate(250px)'
]

export default function NewProjects() {
  const t = useTranslations('ProjectsClassic')

  const cards = [
    {
      image: '/type-battle.png',
      title: 'Typing Battle',
      description: t('typeBattleDescription'),
      tech: t('typeBattleTech'),
      link: 'https://typebattle-one.vercel.app/'
    },
    {
      image: '/pokeguesser.png',
      title: 'PokeGuesser',
      description: t('pokeGuesserDescription'),
      tech: t('pokeGuesserTech'),
      link: 'https://pokeguesser-beryl.vercel.app/'
    },
    {
      image: '/whatsgood.png',
      title: 'Whats Good',
      description: t('whatsGoodDescription'),
      tech: t('whatsGoodTech'),
      link: 'https://whats-good-eight.vercel.app/'
    },
    {
      image: '/github.png',
      title: t('otherProjects'),
      description: t('otherProjectsDescription'),
      tech: t('otherProjectsTech'),
      link: 'https://github.com/KevenGoulart?tab=repositories'
    },
    {
      image: '/geeklog.png',
      title: 'GeekLog',
      description: t('geeklogDescription'),
      tech: t('geeklogTech'),
      link: 'https://geeklog.app/'
    }
  ]
  return (
    <div id="projects">
      <h1 className="text-slate-900/85 text-7xl font-bold tracking-wider mb-28">
        Projetos Autorais
      </h1>
      <BounceCards
        className="custom-bounceCards"
        cards={cards}
        containerWidth={1200}
        containerHeight={300}
        animationDelay={1}
        animationStagger={0.8}
        easeType="elastic.out(1, 0.5)"
        transformStyles={transformStyles}
        enableHover={true}
      />
    </div>
  )
}
