'use client'

import Image from 'next/image'
import { Button } from './ui/button'
import Link from 'next/link'
import * as motion from 'motion/react-client'

interface ProjectModalProps {
  open: boolean
  onClose: () => void
  title: string
  description: string
  image: string
  href: string
}

export function ProjectModal({
  open,
  onClose,
  title,
  description,
  image,
  href
}: ProjectModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          scale: { type: 'spring', visualDuration: 0.5, bounce: 0.4 }
        }}
        className="
          relative z-[100] bg-slate-950 border border-purple-500/40
          rounded-2xl p-6 max-w-[1000px] w-full shadow-2xl flex gap-6
        "
      >
        <Button
          className="absolute top-3 right-3 text-white text-3xl hover:text-purple-400 bg-transparent hover:bg-transparent"
          onClick={onClose}
        >
          ✕
        </Button>

        <Image
          src={image}
          alt={title}
          width={500}
          height={500}
          className="rounded-xl mb-4 border border-purple-500/40"
        />

        <div className="flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <h2 className="text-5xl font-normal text-white">{title}</h2>

            <p className="text-2xl text-white/80">{description}</p>
          </div>

          <Button className="bg-purple-700 hover:bg-purple-600 text-white text-2xl w-fit mx-auto mb-4 p-5 rounded-xl">
            <Link href={href} target="_blank">
              Acessar
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
