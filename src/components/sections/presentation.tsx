import {
  FaEnvelope,
  FaFilePdf,
  FaGithub,
  FaIdCard,
  FaLinkedin
} from 'react-icons/fa'
import { useTranslations } from 'next-intl'
import { CONTACT, yearsOfExperience } from '@/lib/site'
import { Panel, PixelLink, Signpost } from '../journey/pixel'

export default function Presentation() {
  const t = useTranslations('Presentation')
  const tHeader = useTranslations('Header')

  const years = yearsOfExperience()
  // what a recruiter looks for first, readable without opening anything
  const facts = [
    t('experienceYears', { years }),
    t('stack'),
    t('english')
  ]

  const links = [
    {
      href: CONTACT.linkedin,
      label: 'LinkedIn',
      icon: <FaLinkedin className="size-4" />
    },
    {
      href: CONTACT.github,
      label: 'GitHub',
      icon: <FaGithub className="size-4" />
    },
    {
      href: `mailto:${CONTACT.email}`,
      label: 'E-mail',
      icon: <FaEnvelope className="size-4" />
    }
  ]

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="journey-section"
    >
      <Signpost id="about-title" className="ml-12">
        {tHeader('aboutMe')}
      </Signpost>
      <Panel className="w-[min(86vw,580px)]">
        <p className="font-pixel text-3xl leading-none">Keven Goulart</p>
        <p className="mt-2 font-pixel text-base uppercase tracking-wider text-[#b33831]">
          {t('greeting')}
        </p>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {facts.map((fact) => (
            <li
              key={fact}
              className="bg-[#2e222f] px-2 pb-0.5 pt-1 font-terminal text-lg leading-none tracking-wide text-[#fbf5e6]"
            >
              {fact}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-base leading-relaxed md:text-lg">
          {t('description', { years })}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <PixelLink href={t('link')} icon={<FaFilePdf className="size-4" />}>
            {t('resume')}
          </PixelLink>
          <PixelLink
            href="/resume"
            variant="paper"
            icon={<FaIdCard className="size-4" />}
          >
            {t('quickView')}
          </PixelLink>
          {links.map((link) => (
            <PixelLink
              key={link.label}
              href={link.href}
              icon={link.icon}
              variant="paper"
            >
              {link.label}
            </PixelLink>
          ))}
        </div>
      </Panel>
    </section>
  )
}
