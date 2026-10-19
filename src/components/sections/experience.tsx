import { useTranslations } from 'next-intl'
import { Panel, Signpost } from '../journey/pixel'

export default function Experience() {
  const t = useTranslations('Experience')
  // the labels end with " :" in the messages
  const label = (key: 'workTitle' | 'academicTitle') =>
    t(key).replace(/\s*:\s*$/, '')

  const entries = [
    {
      kind: label('workTitle'),
      title: t('job1'),
      place: 'Bttis – Governador Valadares',
      period: `2025-04 – ${t('current')}`
    },
    {
      kind: label('workTitle'),
      title: t('job2'),
      place: 'X3 Contabilidade – Governador Valadares',
      period: '2023-08 – 2025-04'
    },
    {
      kind: label('workTitle'),
      title: t('job3'),
      place: 'Ols Tecnologia – Governador Valadares',
      period: '2023-01 – 2023-03'
    },
    {
      kind: label('academicTitle'),
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
      {entries.map((entry) => (
        <Panel key={entry.title} className="w-[min(78vw,290px)] shrink-0">
          <p className="font-pixel text-xs uppercase tracking-widest text-[#b33831]">
            {entry.kind}
          </p>
          <h3 className="mt-2 font-pixel text-2xl leading-tight">
            {entry.title}
          </h3>
          <p className="mt-3 text-base leading-snug">{entry.place}</p>
          <p className="mt-3 inline-block bg-[#2e222f] px-2 py-1 font-pixel text-sm text-[#fbf5e6]">
            {entry.period}
          </p>
        </Panel>
      ))}
    </section>
  )
}
