import { FaEnvelope, FaFilePdf, FaGithub, FaLinkedin } from 'react-icons/fa'
import { useTranslations } from 'next-intl'
import { Panel, PixelLink, Signpost } from '../journey/pixel'

export default function Presentation() {
  const t = useTranslations('Presentation')
  const tHeader = useTranslations('Header')

  const links = [
    {
      href: 'https://www.linkedin.com/in/keven-goulart-890248215/',
      label: 'LinkedIn',
      icon: <FaLinkedin className="size-4" />
    },
    {
      href: 'https://github.com/KevenGoulart',
      label: 'GitHub',
      icon: <FaGithub className="size-4" />
    },
    {
      href: 'mailto:kevengoulartmm@gmail.com',
      label: 'E-mail',
      icon: <FaEnvelope className="size-4" />
    },
    {
      href: t('link'),
      label: t('resume'),
      icon: <FaFilePdf className="size-4" />
    }
  ]

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="journey-section"
    >
      <Signpost id="about-title" className="ml-12">{tHeader('aboutMe')}</Signpost>
      <Panel className="w-[min(86vw,560px)]">
        <p className="font-pixel text-3xl leading-none">Keven Goulart</p>
        <p className="mt-2 font-pixel text-base uppercase tracking-wider text-[#b33831]">
          {t('greeting')}
        </p>
        <p className="mt-4 text-base leading-relaxed md:text-lg">
          {t('description')}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {links.map((link) => (
            <PixelLink key={link.label} href={link.href} icon={link.icon}>
              {link.label}
            </PixelLink>
          ))}
        </div>
      </Panel>
    </section>
  )
}
