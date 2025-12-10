import { useTranslations } from 'next-intl'
import { ProjectCard } from '../project-card'

export default function Projects() {
  const t = useTranslations('ProjectsClassic')

  return (
    <section
      id="projects"
      className="flex flex-col gap-8 items-start w-[400px] md:w-[1200px] mx-auto mt-2 md:mt-[400px]"
    >
      <h2 className="text-5xl text-yellow-500">
        {t('title')}
        <hr className="w-[160px] ml-7 border border-purple-700" />
      </h2>

      <div className="grid md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6 md:mt-6 md:gap-16">
        <ProjectCard
          title="GeekLog"
          description={t('geeklogDescription')}
          image="/geeklog.png"
          href="https://geeklog.app/"
        />

        <ProjectCard
          title="DT Money"
          description={t('dtMoneyDescription')}
          image="/dtmoney.png"
          href="https://github.com/KevenGoulart/DT-Money"
        />

        <ProjectCard
          title="TypeBattle"
          description={t('typeBattleDescription')}
          image="/type-battle.png"
          href="https://typebattle-one.vercel.app/"
        />

        <ProjectCard
          title="PokeGuesser"
          description={t('pokeGuesserDescription')}
          image="/pokeguesser.png"
          href="https://pokeguesser-beryl.vercel.app/"
        />

        <ProjectCard
          title={t('otherProjects')}
          description={t('otherProjectsDescription')}
          image="/github.png"
          href="https://github.com/KevenGoulart?tab=repositories"
        />
      </div>
    </section>
  )
}
