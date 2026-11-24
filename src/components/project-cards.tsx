'use client'

import { useState, type ReactNode } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { FaExternalLinkAlt, FaGithub, FaGooglePlay } from 'react-icons/fa'
import { ProjectModal } from './project-modal'
import { Panel, PixelLink } from './journey/pixel'

export interface ProjectCardItem {
  image: string
  title: string
  summary: string
  tech: string[]
  demo?: string
  code?: string
  playStore?: string
  site?: string
  offline?: boolean
  freeHosting?: boolean
  problem?: string
  highlights?: string[]
}

const VISIBLE_TAGS = 4

export function TechTags({ tech, limit }: { tech: string[]; limit?: number }) {
  const shown = limit ? tech.slice(0, limit) : tech
  const hidden = tech.length - shown.length
  return (
    <ul className="flex flex-wrap gap-1.5">
      {shown.map((name) => (
        <li
          key={name}
          className="bg-[#efe3c8] px-1.5 pb-0.5 pt-1 font-pixel text-[11px] leading-none shadow-[inset_0_-2px_0_0_#e0cfae]"
        >
          {name}
        </li>
      ))}
      {hidden > 0 && (
        <li className="px-1 pb-0.5 pt-1 font-pixel text-[11px] leading-none text-[#625565]">
          +{hidden}
        </li>
      )}
    </ul>
  )
}

// demo, site, Play Store and code links, or the offline badge when the site is down
export function ProjectLinks({
  card,
  primaryOnly
}: {
  card: ProjectCardItem
  primaryOnly?: boolean
}) {
  const t = useTranslations('Modal')
  const links: ReactNode[] = []

  if (card.offline) {
    links.push(
      <span key="offline" className="pixel-button" aria-disabled="true">
        {t('offline')}
      </span>
    )
  } else if (card.demo || card.site) {
    links.push(
      <PixelLink
        key="demo"
        href={(card.demo ?? card.site) as string}
        icon={<FaExternalLinkAlt className="size-3" />}
      >
        {card.demo ? t('demo') : t('site')}
      </PixelLink>
    )
  }
  if (card.playStore) {
    links.push(
      <PixelLink
        key="playStore"
        href={card.playStore}
        variant={links.length ? 'paper' : undefined}
        icon={<FaGooglePlay className="size-3" />}
      >
        {t('playStore')}
      </PixelLink>
    )
  }
  if (card.code && !(primaryOnly && links.length)) {
    links.push(
      <PixelLink
        key="code"
        href={card.code}
        variant={links.length ? 'paper' : undefined}
        icon={<FaGithub className="size-3.5" />}
      >
        {t('code')}
      </PixelLink>
    )
  }
  return <>{links}</>
}

export function ProjectCard({ card }: { card: ProjectCardItem }) {
  const t = useTranslations('Modal')
  const [open, setOpen] = useState(false)

  return (
    <Panel className="flex w-[min(84vw,380px)] shrink-0 flex-col gap-3 !p-4">
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden border-[3px] border-[#2e222f] bg-[#2e222f]">
        <Image
          src={card.image}
          alt={card.title}
          fill
          sizes="380px"
          className="object-cover"
        />
      </div>
      <h3 className="font-pixel text-2xl leading-none">{card.title}</h3>
      <p className="line-clamp-3 text-sm leading-relaxed">{card.summary}</p>
      {card.tech.length > 0 && (
        <TechTags tech={card.tech} limit={VISIBLE_TAGS} />
      )}
      <div className="mt-auto flex flex-wrap gap-2">
        <button
          type="button"
          className="pixel-button"
          data-variant="paper"
          onClick={() => setOpen(true)}
        >
          {t('seeMore')}
        </button>
        <ProjectLinks card={card} primaryOnly />
      </div>
      <ProjectModal open={open} onClose={() => setOpen(false)} card={card} />
    </Panel>
  )
}
