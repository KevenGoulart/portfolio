'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { ProjectModal } from './project-modal'
import { Panel, PixelLink } from './journey/pixel'

export interface ProjectCardItem {
  image: string
  title: string
  description: string
  tech: string
  link: string
}

export function ProjectCard({ card }: { card: ProjectCardItem }) {
  const t = useTranslations('Modal')
  const [open, setOpen] = useState(false)

  return (
    <Panel className="flex w-[min(78vw,300px)] shrink-0 flex-col gap-3 !p-4">
      <div className="relative aspect-[16/10] w-full overflow-hidden border-[3px] border-[#2e222f] bg-[#2e222f]">
        <Image
          src={card.image}
          alt={card.title}
          fill
          sizes="300px"
          className="object-cover"
        />
      </div>
      <h3 className="font-pixel text-2xl leading-none">{card.title}</h3>
      <p className="line-clamp-3 text-sm leading-relaxed">{card.description}</p>
      <div className="mt-auto flex flex-wrap gap-2">
        <button
          type="button"
          className="pixel-button"
          data-variant="paper"
          onClick={() => setOpen(true)}
        >
          {t('seeMore')}
        </button>
        <PixelLink
          href={card.link}
          icon={<FaExternalLinkAlt className="size-3" />}
        >
          {t('button')}
        </PixelLink>
      </div>
      <ProjectModal
        open={open}
        onClose={() => setOpen(false)}
        title={card.title}
        description={card.description}
        tech={card.tech}
        image={card.image}
        href={card.link}
      />
    </Panel>
  )
}
