import { useTranslations } from 'next-intl'
import {
  SiBitbucket,
  SiCss3,
  SiDocker,
  SiFigma,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiJira,
  SiNestjs,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPostman,
  SiPrisma,
  SiReact,
  SiReactquery,
  SiTailwindcss,
  SiTypescript,
  SiVite,
  SiVitest
} from 'react-icons/si'
import { Panel, Signpost } from '../journey/pixel'

const SKILLS = [
  { name: 'TypeScript', icon: SiTypescript },
  { name: 'Javascript', icon: SiJavascript },
  { name: 'HTML', icon: SiHtml5 },
  { name: 'CSS', icon: SiCss3 },
  { name: 'NodeJS', icon: SiNodedotjs },
  { name: 'React', icon: SiReact },
  { name: 'NestJS', icon: SiNestjs },
  { name: 'NextJS', icon: SiNextdotjs },
  { name: 'PostgreSql', icon: SiPostgresql },
  { name: 'Docker', icon: SiDocker },
  { name: 'Tailwind Css', icon: SiTailwindcss },
  { name: 'Git', icon: SiGit },
  { name: 'Figma', icon: SiFigma },
  { name: 'Postman', icon: SiPostman },
  { name: 'Jira', icon: SiJira },
  { name: 'BitBucket', icon: SiBitbucket },
  { name: 'Vite', icon: SiVite },
  { name: 'Vitest', icon: SiVitest },
  { name: 'React Query', icon: SiReactquery },
  { name: 'Prisma', icon: SiPrisma }
]

export default function Abilities() {
  const t = useTranslations('Abilities')

  return (
    <section
      id="abilities"
      aria-labelledby="abilities-title"
      className="journey-section"
    >
      <Signpost id="abilities-title">{t('title')}</Signpost>
      <Panel className="w-[min(90vw,580px)] shrink-0 !p-4">
        <ul className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {SKILLS.map(({ name, icon: Icon }) => (
            <li
              key={name}
              className="flex flex-col items-center gap-1 bg-[#efe3c8] px-1 py-2 text-center shadow-[inset_0_-3px_0_0_#e0cfae]"
            >
              <Icon className="size-7 md:size-8" aria-hidden="true" />
              <span className="font-pixel text-[11px] leading-tight md:text-xs">
                {name}
              </span>
            </li>
          ))}
        </ul>
      </Panel>
    </section>
  )
}
