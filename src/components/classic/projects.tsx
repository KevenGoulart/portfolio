import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'

export default function Projects() {
  const t = useTranslations('ProjectsClassic')
  return (
    <section
      id="projects"
      className="flex flex-col gap-8 items-start mx-80 mt-28"
    >
      <h2 className="text-5xl text-yellow-500">
        {t('title')} <hr className="w-[160px] ml-7 border border-purple-700" />
      </h2>
      <div className="flex">
        <div className="flex flex-col gap-9">
          <div className="flex items-center gap-6 relative">
            <Link href="https://geeklog.app/" target="_blank">
              <Image
                src="/geeklog.png"
                alt="Geeklog"
                width={600}
                height={300}
                className="rounded-2xl max-w-[400px] border border-purple-500/40 hover:scale-125 transition-transform duration-300"
              />
            </Link>
            <div className="flex flex-col">
              <p className="text-3xl hover:text-white/70 absolute z-[-10] top-2">
                GeekLog
              </p>
              <p className="text-2xl text-white/80">
                {t('geeklogDescription')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6 relative">
            <Link
              href="https://github.com/KevenGoulart/DT-Money"
              target="_blank"
            >
              <Image
                src="/dtmoney.png"
                alt="dtmoney"
                width={600}
                height={300}
                className="rounded-2xl max-w-[400px] border border-purple-500/40 hover:scale-125 transition-transform duration-300"
              />
            </Link>
            <div className="flex flex-col">
              <p className="text-3xl hover:text-white/70 absolute z-[-10] top-2">
                DT Money
              </p>
              <p className="text-2xl text-white/80">
                {t('dtMoneyDescription')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6 relative">
            <Link
              href="https://github.com/KevenGoulart?tab=repositories"
              target="_blank"
            >
              <Image
                src="/github.png"
                alt="GitHub"
                width={600}
                height={300}
                className="rounded-2xl max-w-[400px] border border-purple-500/40 hover:scale-125 transition-transform duration-300"
              />
            </Link>
            <div className="flex flex-col">
              <p className="text-3xl hover:text-white/70 absolute z-[-10] top-2">
                {t('otherProjects')}
              </p>
              <p className="text-2xl text-white/80">
                {t('otherProjectsDescription')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
