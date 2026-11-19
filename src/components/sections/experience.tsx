import type { ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { FaBriefcase, FaGraduationCap } from 'react-icons/fa'
import { Panel, Signpost } from '../journey/pixel'

interface Entry {
  title: string
  place: string
  period: string
}

function ExperienceGroup({
  label,
  icon,
  color,
  entries
}: {
  label: string
  icon: ReactNode
  color: string
  entries: Entry[]
}) {
  return (
    <div className="flex shrink-0 flex-col gap-3">
      <p
        className="flex w-fit items-center gap-2 border-[3px] border-[#2e222f] px-3 pb-1 pt-1.5 font-pixel text-sm uppercase tracking-widest text-[#fbf5e6]"
        style={{ backgroundColor: color }}
      >
        {icon}
        {label}
      </p>
      <div className="flex gap-[clamp(10px,1.2vw,20px)]">
        {entries.map((entry) => (
          <Panel
            key={entry.title}
            className="w-[min(78vw,290px)] shrink-0"
          >
            <div
              className="-mx-5 -mt-5 mb-4 h-2 md:-mx-6 md:-mt-6"
              style={{ backgroundColor: color }}
              aria-hidden="true"
            />
            <h3 className="font-pixel text-2xl leading-tight">{entry.title}</h3>
            <p className="mt-3 text-base leading-snug">{entry.place}</p>
            <p className="mt-3 inline-block bg-[#2e222f] px-2 pb-0.5 pt-1 font-terminal text-xl leading-none tracking-wide text-[#fbf5e6]">
              {entry.period}
            </p>
          </Panel>
        ))}
      </div>
    </div>
  )
}

export default function Experience() {
  const t = useTranslations('Experience')
  // the labels end with " :" in the messages
  const label = (key: 'workTitle' | 'academicTitle') =>
    t(key).replace(/\s*:\s*$/, '')

  const work: Entry[] = [
    {
      title: t('job1'),
      place: 'Bttis – Governador Valadares',
      period: `2025-04 – ${t('current')}`
    },
    {
      title: t('job2'),
      place: 'X3 Contabilidade – Governador Valadares',
      period: '2023-08 – 2025-04'
    },
    {
      title: t('job3'),
      place: 'Ols Tecnologia – Governador Valadares',
      period: '2023-01 – 2023-03'
    }
  ]

  const academic: Entry[] = [
    {
      title: t('degree'),
      place: 'Universidade Vale do Rio Doce Univale – Governador Valadares',
      period: '2021-04 – 2024-11'
    }
  ]

  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="journey-section"
    >
      <Signpost id="experience-title">{t('title')}</Signpost>
      <ExperienceGroup
        label={label('workTitle')}
        icon={<FaBriefcase className="size-3.5" />}
        color="#b33831"
        entries={work}
      />
      <div
        className="mt-10 h-[60%] max-h-80 w-0 shrink-0 self-center border-l-4 border-dashed border-[#2e222f]/40"
        aria-hidden="true"
      />
      <ExperienceGroup
        label={label('academicTitle')}
        icon={<FaGraduationCap className="size-4" />}
        color="#4d65b4"
        entries={academic}
      />
    </section>
  )
}
