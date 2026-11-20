import { FaEnvelope, FaPhoneAlt } from 'react-icons/fa'
import { SiGithub, SiLinkedin } from 'react-icons/si'
import { useTranslations } from 'next-intl'
import { CONTACT } from '@/lib/site'
import { Panel, Signpost } from '../journey/pixel'

export default function Contact() {
  const t = useTranslations('Contact')

  const items = [
    {
      icon: FaEnvelope,
      label: t('email'),
      value: CONTACT.email,
      href: `mailto:${CONTACT.email}`
    },
    {
      icon: FaPhoneAlt,
      label: t('phone'),
      value: CONTACT.phone,
      href: CONTACT.phoneHref
    },
    {
      icon: SiLinkedin,
      label: 'LinkedIn',
      value: '@kevengoulart',
      href: CONTACT.linkedin
    },
    {
      icon: SiGithub,
      label: 'GitHub',
      value: '@KevenGoulart',
      href: CONTACT.github
    }
  ]

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="journey-section"
    >
      <Signpost id="contact-title">{t('title')}</Signpost>
      <Panel className="w-[min(86vw,440px)] shrink-0">
        <ul className="flex flex-col gap-3">
          {items.map(({ icon: Icon, label, value, href }) => (
            <li key={label}>
              <a
                href={href}
                {...(href.startsWith('http')
                  ? { target: '_blank', rel: 'noreferrer' }
                  : {})}
                className="group flex items-center gap-3 bg-[#efe3c8] p-3 shadow-[inset_0_-3px_0_0_#e0cfae] transition-colors hover:bg-[#f9c22b] focus-visible:outline-dashed focus-visible:outline-[3px] focus-visible:outline-[#4d65b4]"
              >
                <Icon className="size-6 shrink-0" aria-hidden="true" />
                <span className="flex flex-col">
                  <span className="font-pixel text-xs uppercase tracking-widest text-[#b33831] group-hover:text-[#2e222f]">
                    {label}
                  </span>
                  <span className="break-all text-base">{value}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Panel>
    </section>
  )
}
