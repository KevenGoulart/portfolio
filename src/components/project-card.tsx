'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ProjectModal } from './project-modal'
import { Button } from './ui/button'

interface ProjectCardProps {
  title: string
  description: string
  image: string
  href: string
}

export function ProjectCard({
  title,
  description,
  image,
  href
}: ProjectCardProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col md:flex-row items-center gap-6 relative group">
        <div className="relative">
          <Image
            src={image}
            alt={title}
            width={600}
            height={300}
            className="
              max-sm:mt-12 rounded-2xl w-[400px] h-[300px]
              border border-purple-500/40
              transition-all duration-300
              group-hover:scale-105 md:group-hover:scale-110 group-hover:brightness-50
            "
          />

          <div
            className="
              absolute inset-0 flex gap-4 items-center justify-center
              opacity-0 group-hover:opacity-100
              transition-opacity duration-300 text-white
            "
          >
            <p className="text-5xl font-semibold drop-shadow-lg mb-3 text-center">
              {title}
            </p>

            <Button
              onClick={() => setOpen(true)}
              className="
                px-3 py-2 text-xl rounded-xl bg-purple-700 hover:bg-purple-600 text-white/90
                transition-colors shadow-lg
              "
            >
              Ver mais
            </Button>
          </div>

          <div
            className="
              absolute bottom-0 left-0 w-full
              bg-black/30 backdrop-blur-sm text-white py-2
              rounded-b-2xl border border-l-purple-500/40 border-r-purple-500/40 border-b-purple-500/40
              transition-opacity duration-300
              group-hover:opacity-0
            "
          >
            <p className="text-3xl text-center font-medium truncate">{title}</p>
          </div>
        </div>
      </div>

      <ProjectModal
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        description={description}
        image={image}
        href={href}
      />
    </>
  )
}
