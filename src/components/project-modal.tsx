'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import * as motion from 'motion/react-client'
import { useTranslations } from 'next-intl'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { PixelLink } from './journey/pixel'

interface ProjectModalProps {
  open: boolean
  onClose: () => void
  title: string
  description: string
  tech: string
  image: string
  href: string
}

export function ProjectModal({
  open,
  onClose,
  title,
  description,
  tech,
  image,
  href
}: ProjectModalProps) {
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
      aria-label={title}
    >
      <div className="absolute inset-0 bg-[#2e222f]/60" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="pixel-panel relative z-[100] flex max-h-[90dvh] w-full max-w-[920px] flex-col gap-6 p-5 md:flex-row md:p-6"
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

        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden border-[3px] border-[#2e222f] md:w-[45%]">
          <Image
            src={image}
            alt={title}
            fill
            sizes="420px"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-3 md:gap-4">
          <h2 className="pr-12 font-pixel text-4xl leading-none">{title}</h2>
          <p className="text-base leading-relaxed md:text-lg">{description}</p>
          <p className="text-base leading-relaxed md:text-lg">{tech}</p>
          <p className="text-sm text-[#625565]">{t('warning')}</p>
          <div className="mt-auto">
            <PixelLink
              href={href}
              icon={<FaExternalLinkAlt className="size-3" />}
            >
              {t('button')}
            </PixelLink>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  )
}
