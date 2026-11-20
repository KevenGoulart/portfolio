'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import * as motion from 'motion/react-client'
import { useTranslations } from 'next-intl'
import { ProjectLinks, TechTags, type ProjectCardItem } from './project-cards'

interface ProjectModalProps {
  open: boolean
  onClose: () => void
  card: ProjectCardItem
}

export function ProjectModal({ open, onClose, card }: ProjectModalProps) {
  const t = useTranslations('Modal')

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  // rendered on the body: the journey track is transformed, which would
  // otherwise trap a fixed overlay inside it
  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={card.title}
    >
      <div className="absolute inset-0 bg-[#2e222f]/60" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="pixel-panel relative z-[100] flex max-h-[90dvh] w-full max-w-[960px] flex-col gap-6 p-5 md:flex-row md:p-6"
      >
        <button
          type="button"
          className="pixel-button absolute right-3 top-3 z-10"
          data-variant="paper"
          onClick={onClose}
          aria-label={t('close')}
        >
          ✕
        </button>

        <div className="flex w-full shrink-0 flex-col gap-4 md:w-[42%] md:self-start">
          <div className="relative aspect-[16/10] w-full overflow-hidden border-[3px] border-[#2e222f]">
            <Image
              src={card.image}
              alt={card.title}
              fill
              sizes="420px"
              className="object-cover"
            />
          </div>
          {card.tech.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="font-pixel text-sm uppercase tracking-widest text-[#b33831]">
                {t('stack')}
              </h3>
              <TechTags tech={card.tech} />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 md:gap-4">
          <h2 className="pr-12 font-pixel text-4xl leading-none">
            {card.title}
          </h2>
          <p className="text-base leading-relaxed md:text-lg">{card.summary}</p>

          {card.problem && (
            <section className="flex flex-col gap-1.5">
              <h3 className="font-pixel text-sm uppercase tracking-widest text-[#b33831]">
                {t('problem')}
              </h3>
              <p className="text-base leading-relaxed">{card.problem}</p>
            </section>
          )}

          {card.highlights && card.highlights.length > 0 && (
            <section className="flex flex-col gap-1.5">
              <h3 className="font-pixel text-sm uppercase tracking-widest text-[#b33831]">
                {t('highlights')}
              </h3>
              <ul className="flex flex-col gap-2">
                {card.highlights.map((item) => (
                  <li key={item} className="flex gap-2 text-base leading-snug">
                    <span
                      className="mt-2 size-2 shrink-0 bg-[#2e222f]"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {card.freeHosting && !card.offline && (
            <p className="text-sm text-[#625565]">{t('warning')}</p>
          )}
          <div className="mt-auto flex flex-wrap gap-2 pt-1">
            <ProjectLinks card={card} />
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  )
}
