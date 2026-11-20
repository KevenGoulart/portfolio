import { useTranslations } from 'next-intl'
import { SKILL_GROUPS } from '@/lib/skills'
import { Panel, Signpost } from '../journey/pixel'

export default function Abilities() {
  const t = useTranslations('Abilities')

  return (
    <section
      id="abilities"
      aria-labelledby="abilities-title"
      className="journey-section gap-[clamp(10px,1.2vw,20px)]"
    >
      <Signpost id="abilities-title">{t('title')}</Signpost>
      {SKILL_GROUPS.map(({ key, color, skills }) => (
        <Panel key={key} className="w-[min(84vw,330px)] shrink-0 !p-4">
          <div
            className="-mx-4 -mt-4 mb-3 h-2"
            style={{ backgroundColor: color }}
            aria-hidden="true"
          />
          <h3 className="mb-3 font-pixel text-xl leading-none">{t(key)}</h3>
          <ul className="grid grid-cols-4 gap-2">
            {skills.map(({ name, icon: Icon }) => (
              <li
                key={name}
                className="flex flex-col items-center gap-1 bg-[#efe3c8] px-1 py-2 text-center shadow-[inset_0_-3px_0_0_#e0cfae]"
              >
                <Icon className="size-7" aria-hidden="true" />
                <span className="font-pixel text-[11px] leading-tight">
                  {name}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      ))}
    </section>
  )
}
