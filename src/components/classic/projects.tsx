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
        {t('title')} <hr className="w-[200px] ml-7 border border-purple-700" />
      </h2>
      <div className="flex">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-6 relative">
            <Link href="https://geeklog.app/" target="_blank">
              <Image
                src="/geeklog.png"
                alt="Geeklog"
                width={600}
                height={300}
                className="rounded-2xl border border-purple-500/40 hover:scale-105 transition-transform duration-300"
              />
            </Link>
            <div className="flex flex-col">
              <Link
                href="https://geeklog.app/"
                target="_blank"
                className="text-3xl hover:text-white/70 absolute top-2"
              >
                GeekLog
              </Link>
              <p className="text-2xl text-white/80">
                {t('geeklogDescription')}
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
                width={380}
                height={300}
                className="rounded-2xl border border-purple-500/40 hover:scale-105 transition-transform duration-300"
              />
            </Link>
            <div className="flex flex-col">
              <Link
                href="https://github.com/KevenGoulart?tab=repositories"
                target="_blank"
                className="text-3xl hover:text-white/70 absolute top-2"
              >
                {t('otherProjects')}
              </Link>
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
