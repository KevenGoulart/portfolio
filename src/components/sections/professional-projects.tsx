import BounceCards from '@/components/BounceCards'
import { useTranslations } from 'next-intl'

const transformStyles = [
  'rotate(5deg) translate(-250px)',
  'rotate(0deg) translate(-150px)',
  'rotate(-5deg)',
  'rotate(5deg) translate(150px)',
  'rotate(-5deg) translate(250px)'
]

export default function ProfessionalProjects() {
  const t = useTranslations('ProfessionalProjects')

  const cards = [
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
      image: '/maisvit.png',
      title: 'Mais Vit',
      description: t('maisVitDescription'),
      tech: t('maisVitTech'),
      link: 'https://conheca.maisvit.com/'
    },
    {
      image: '/metibala.png',
      title: 'Metibala',
      description: t('metibalaDescription'),
      tech: t('metibalaTech'),
      link: 'https://www.metibala.com/'
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
    <div
      id="projects"
      className="flex items-center justify-center mt-8 md:mt-32"
    >
      <div className="flex flex-col items-center gap-12 w-[400px] md:w-[1200px] mx-2 md:mx-auto mt-12 md:mt-6">
        <h2 className="text-slate-900/85 text-6xl md:text-7xl font-bold self-start tracking-wider mb-28">
          {t('title')}
        </h2>
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
    </div>
  )
}
