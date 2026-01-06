'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from './ui/button'
import { useTranslations } from 'next-intl'

export interface ProjectCardItem {
  image: string
  title: string
  description: string
  tech: string
  link: string
}

interface ProjectCardsProps {
  cards: ProjectCardItem[]
}

export function ProjectCards({ cards }: ProjectCardsProps) {
  const t = useTranslations('Modal')

  return (
    <div className="grid grid-cols gap-4 w-full">
      {cards.map((card, index) => (
        <div
          key={index}
          className="
            bg-slate-950 border border-purple-500/40
            rounded-2xl p-6 shadow-2xl
            flex flex-col gap-2
          "
        >
          <Image
            src={card.image}
            alt={card.title}
            width={500}
            height={500}
            className="rounded-xl border border-purple-500/40 w-full"
          />

          <div className="flex flex-col justify-between gap-2">
            <div className="flex flex-col gap-4">
              <h2 className="text-4xl text-white">{card.title}</h2>

              <p className="text-lg text-white/80">{card.description}</p>

              <p className="text-lg text-white/80">{card.tech}</p>
            </div>

            <Button className="bg-purple-700 hover:bg-purple-600 text-white text-xl w-fit px-6 rounded-xl mx-auto">
              <Link href={card.link} target="_blank">
                {t('seeMore')}
              </Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
