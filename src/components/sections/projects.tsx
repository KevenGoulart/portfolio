import BounceCards from '@/components/BounceCards'
import { useTranslations } from 'next-intl'
import { ProjectCards } from '../project-cards'

const transformStyles = [
  'rotate(5deg) translate(-250px)',
  'rotate(0deg) translate(-150px)',
  'rotate(-5deg)',
  'rotate(5deg) translate(150px)',
  'rotate(-5deg) translate(250px)'
]

export default function Projects() {
  const t = useTranslations('Projects')

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
    <div id="projects" className="flex items-center justify-center">
      <div className="flex flex-col items-center gap-12 w-[400px] md:w-[1200px] mx-2 md:mx-auto mt-12 md:mt-6">
        <h2 className="text-slate-900/85 text-6xl md:text-7xl font-bold self-start tracking-wider mb-24 max-sm:mb-4 max-sm:pl-[5%]">
          {t('title')}
        </h2>
        <div className="max-sm:hidden">
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
        <div className="md:hidden">
          <ProjectCards cards={cards} />
        </div>
      </div>
    </div>
  )
}
