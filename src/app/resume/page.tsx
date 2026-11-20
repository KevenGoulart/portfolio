import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
import {
  FaArrowLeft,
  FaEnvelope,
  FaFilePdf,
  FaGithub,
  FaGlobe,
  FaLinkedin,
  FaPhoneAlt
} from 'react-icons/fa'
import Link from 'next/link'
import LanguageSelector from '@/components/language-selector'
import { EDUCATION, JOBS } from '@/lib/experience'
import {
  PERSONAL_PROJECTS,
  PROFESSIONAL_PROJECTS,
  type Project
} from '@/lib/projects'
import { SKILL_GROUPS } from '@/lib/skills'
import { CONTACT, SITE_URL, yearsOfExperience } from '@/lib/site'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Resume')
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: { canonical: '/resume' }
  }
}

// 2025-04 → 04/2025
function month(value: string) {
  const [year, m] = value.split('-')
  return `${m}/${year}`
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="break-inside-avoid-page">
      <h2 className="mb-3 border-b-[3px] border-[#2e222f] pb-1 font-pixel text-lg uppercase tracking-widest text-[#b33831]">
        {title}
      </h2>
      {children}
    </section>
  )
}

function ProjectLinks({
  project,
  labels
}: {
  project: Project
  labels: Record<'demo' | 'code' | 'site', string>
}) {
  const links = [
    !project.offline &&
      project.demo && { href: project.demo, label: labels.demo },
    !project.offline &&
      project.site && { href: project.site, label: labels.site },
    project.code && { href: project.code, label: labels.code }
  ].filter(Boolean) as { href: string; label: string }[]

  if (!links.length) return null
  return (
    <span className="text-sm">
      {links.map((link, index) => (
        <span key={link.href}>
          {index > 0 && ' · '}
          <a
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="text-[#4d65b4] underline underline-offset-2 print:text-[#2e222f]"
          >
            {link.label}
          </a>
        </span>
      ))}
    </span>
  )
}

export default async function ResumePage() {
  const t = await getTranslations('Resume')
  const tPresentation = await getTranslations('Presentation')
  const tExperience = await getTranslations('Experience')
  const tProjects = await getTranslations('Projects')
  const tProfessional = await getTranslations('ProfessionalProjects')
  const tAbilities = await getTranslations('Abilities')

  const labels = { demo: t('demo'), code: t('code'), site: t('site') }
  const contacts = [
    { icon: FaEnvelope, label: CONTACT.email, href: `mailto:${CONTACT.email}` },
    { icon: FaPhoneAlt, label: CONTACT.phone, href: CONTACT.phoneHref },
    { icon: FaLinkedin, label: 'LinkedIn', href: CONTACT.linkedin },
    { icon: FaGithub, label: 'GitHub', href: CONTACT.github },
    { icon: FaGlobe, label: SITE_URL.replace('https://', ''), href: SITE_URL }
  ]

  return (
    <div className="min-h-dvh bg-[#fbf5e6] font-sans text-[#2e222f] print:bg-white">
      <nav className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-2 px-4 pt-4 print:hidden">
        <Link href="/" className="pixel-button" data-variant="paper">
          <FaArrowLeft className="size-3" aria-hidden="true" />
          {t('back')}
        </Link>
        <div className="flex items-center gap-1">
          <a
            href={tPresentation('link')}
            target="_blank"
            rel="noreferrer"
            className="pixel-button"
          >
            <FaFilePdf className="size-4" aria-hidden="true" />
            {t('download')}
          </a>
          <LanguageSelector />
        </div>
      </nav>

      <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-8 print:py-0">
        <header className="flex flex-col gap-2">
          <h1 className="font-pixel text-4xl leading-none">Keven Goulart</h1>
          <p className="font-pixel text-lg uppercase tracking-wider text-[#b33831]">
            {tPresentation('greeting')}
          </p>
          <p className="text-sm text-[#625565]">
            {t('location')} ·{' '}
            {tPresentation('experienceYears', { years: yearsOfExperience() })}
          </p>
          <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {contacts.map(({ icon: Icon, label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  {...(href.startsWith('http')
                    ? { target: '_blank', rel: 'noreferrer' }
                    : {})}
                  className="inline-flex items-center gap-1.5 underline-offset-2 hover:underline"
                >
                  <Icon className="size-3.5 shrink-0" aria-hidden="true" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </header>

        <Section title={t('summary')}>
          <p className="leading-relaxed">{t('summaryText')}</p>
        </Section>

        <Section title={t('experience')}>
          <ol className="flex flex-col gap-5">
            {JOBS.map((job) => (
              <li key={job.key} className="break-inside-avoid">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <h3 className="font-semibold">
                    {tExperience(job.key)} · {job.company}
                  </h3>
                  <span className="font-terminal text-lg leading-none">
                    {month(job.start)} –{' '}
                    {job.end ? month(job.end) : tExperience('current')}
                  </span>
                </div>
                <p className="text-sm text-[#625565]">{job.city}</p>
                <p className="mt-1.5 text-[15px] leading-relaxed">
                  {tExperience(`${job.key}Description`)}
                </p>
              </li>
            ))}
          </ol>
        </Section>

        <Section title={t('projects')}>
          <ul className="flex flex-col gap-5">
            {PERSONAL_PROJECTS.map((project) => (
              <li key={project.key} className="break-inside-avoid">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <h3 className="font-semibold">{project.title}</h3>
                  <ProjectLinks project={project} labels={labels} />
                </div>
                <p className="mt-1 text-[15px] leading-relaxed">
                  {tProjects(`${project.key}.summary`)}
                </p>
                <p className="mt-1 text-sm text-[#625565]">
                  {project.tech.join(' · ')}
                </p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title={t('professionalProjects')}>
          <ul className="flex flex-col gap-4">
            {PROFESSIONAL_PROJECTS.map((project) => (
              <li key={project.key} className="break-inside-avoid">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <h3 className="font-semibold">{project.title}</h3>
                  <ProjectLinks project={project} labels={labels} />
                </div>
                <p className="mt-1 text-[15px] leading-relaxed">
                  {tProfessional(`${project.key}.summary`)}
                </p>
                <p className="mt-1 text-sm text-[#625565]">
                  {project.tech.join(' · ')}
                </p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title={t('skills')}>
          <dl className="grid gap-2 sm:grid-cols-[max-content_1fr] sm:gap-x-4">
            {SKILL_GROUPS.map(({ key, skills }) => (
              <div key={key} className="contents">
                <dt className="font-semibold">{tAbilities(key)}</dt>
                <dd className="mb-1 sm:mb-0">
                  {skills.map((skill) => skill.name).join(', ')}
                </dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section title={t('education')}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
            <h3 className="font-semibold">{tExperience('degree')}</h3>
            <span className="font-terminal text-lg leading-none">
              {month(EDUCATION.start)} – {month(EDUCATION.end)}
            </span>
          </div>
          <p className="text-sm text-[#625565]">
            {EDUCATION.institution} · {EDUCATION.city}
          </p>
        </Section>

        <Section title={t('languages')}>
          <p>{t('languagesValue')}</p>
        </Section>
      </main>
    </div>
  )
}
