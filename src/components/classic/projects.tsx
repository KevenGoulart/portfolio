import { useTranslations } from 'next-intl'
import { ProjectCard } from '../project-card'
import { NeonGradientCard } from '../ui/neon-gradient-card'

export default function Projects() {
  const t = useTranslations('ProjectsClassic')

  return (
    <section
      id="projects"
      className="flex flex-col items-center gap-8 w-[360px] md:w-[1200px] mx-2 md:mx-auto mt-12 md:mt-28 mb-12"
    >
      <h2 className="text-5xl text-yellow-200 self-start ml-4">
        {t('title')}
        <hr className="w-[160px] ml-7 border border-purple-700" />
      </h2>

      <p className="self-start ml-8 text-white/85">{t('description')}</p>

      <div className="grid md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6 md:mt-6 md:gap-10">
        <NeonGradientCard>
          <ProjectCard
            title="GeekLog"
            description={t('geeklogDescription')}
            tech={t('geeklogTech')}
            image="/geeklog.png"
            href="https://geeklog.app/"
          />
        </NeonGradientCard>

        <NeonGradientCard>
          <ProjectCard
            title="Typing Battle"
            description={t('typeBattleDescription')}
            tech={t('typeBattleTech')}
            image="/type-battle.png"
            href="https://typebattle-one.vercel.app/"
          />
        </NeonGradientCard>

        <NeonGradientCard>
          <ProjectCard
            title="PokeGuesser"
            description={t('pokeGuesserDescription')}
            tech={t('pokeGuesserTech')}
            image="/pokeguesser.png"
            href="https://pokeguesser-beryl.vercel.app/"
          />
        </NeonGradientCard>

        <NeonGradientCard>
          <ProjectCard
            title="CI/CD Pulumi Aws Api"
            description={t('pulumiDescription')}
            tech={t('pulumiTech')}
            image="/pulumi.jpeg"
            href="https://github.com/KevenGoulart/test-api-cdcd-pulumi-aws"
          />
        </NeonGradientCard>

        <NeonGradientCard>
          <ProjectCard
            title="Whats Good"
            description={t('whatsGoodDescription')}
            tech={t('whatsGoodTech')}
            image="/whatsgood.png"
            href="https://whats-good-eight.vercel.app/"
          />
        </NeonGradientCard>

        <NeonGradientCard>
          <ProjectCard
            title="DT Money"
            description={t('dtMoneyDescription')}
            tech={t('dtMoneyTech')}
            image="/dtmoney.png"
            href="https://github.com/KevenGoulart/DT-Money"
          />
        </NeonGradientCard>

        <NeonGradientCard>
          <ProjectCard
            title={t('otherProjects')}
            description={t('otherProjectsDescription')}
            tech={t('otherProjectsTech')}
            image="/github.png"
            href="https://github.com/KevenGoulart?tab=repositories"
          />
        </NeonGradientCard>
      </div>
    </section>
  )
}
