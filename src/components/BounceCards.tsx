import { useEffect, useState } from 'react'
import { gsap } from 'gsap'
import './BounceCards.css'
import Image from 'next/image'
import { Button } from './ui/button'
import { ProjectModal } from './project-modal'

interface BounceCardItem {
  image: string
  title: string
  description: string
  tech: string
  link: string
}

interface BounceCardsProps {
  className?: string
  cards?: BounceCardItem[]
  containerWidth?: number
  containerHeight?: number
  animationDelay?: number
  animationStagger?: number
  easeType?: string
  transformStyles?: string[]
  enableHover?: boolean
}

export default function BounceCards({
  className = '',
  cards = [],
  containerWidth = 400,
  containerHeight = 400,
  animationDelay = 0.5,
  animationStagger = 0.06,
  easeType = 'elastic.out(1, 0.8)',
  transformStyles = [
    'rotate(10deg) translate(-170px)',
    'rotate(5deg) translate(-85px)',
    'rotate(-3deg)',
    'rotate(-10deg) translate(85px)',
    'rotate(2deg) translate(170px)'
  ],
  enableHover = false
}: BounceCardsProps) {
  const [selected, setSelected] = useState<BounceCardItem | null>(null)

  useEffect(() => {
    gsap.fromTo(
      '.card',
      { scale: 0 },
      {
        scale: 1,
        stagger: animationStagger,
        ease: easeType,
        delay: animationDelay
      }
    )
  }, [animationStagger, easeType, animationDelay])

  const getNoRotationTransform = (transformStr: string): string => {
    const hasRotate = /rotate\([\s\S]*?\)/.test(transformStr)
    if (hasRotate) {
      return transformStr.replace(/rotate\([\s\S]*?\)/, 'rotate(0deg)')
    } else if (transformStr === 'none') {
      return 'rotate(0deg)'
    } else {
      return `${transformStr} rotate(0deg)`
    }
  }

  const getPushedTransform = (
    baseTransform: string,
    offsetX: number
  ): string => {
    const translateRegex = /translate\(([-0-9.]+)px\)/
    const match = baseTransform.match(translateRegex)
    if (match) {
      const currentX = parseFloat(match[1])
      const newX = currentX + offsetX
      return baseTransform.replace(translateRegex, `translate(${newX}px)`)
    } else {
      return baseTransform === 'none'
        ? `translate(${offsetX}px)`
        : `${baseTransform} translate(${offsetX}px)`
    }
  }

  const pushSiblings = (hoveredIdx: number) => {
    if (!enableHover) return

    cards.forEach((_, i) => {
      gsap.killTweensOf(`.card-${i}`)

      const baseTransform = transformStyles[i] || 'none'

      if (i === hoveredIdx) {
        const noRotation = getNoRotationTransform(baseTransform)
        gsap.to(`.card-${i}`, {
          transform: noRotation,
          duration: 0.4,
          ease: 'back.out(1.4)',
          overwrite: 'auto'
        })
      } else {
        const offsetX = i < hoveredIdx ? -300 : 300
        const pushedTransform = getPushedTransform(baseTransform, offsetX)

        const distance = Math.abs(hoveredIdx - i)
        const delay = distance * 0.05

        gsap.to(`.card-${i}`, {
          transform: pushedTransform,
          duration: 0.4,
          ease: 'back.out(1.4)',
          delay,
          overwrite: 'auto'
        })
      }
    })
  }

  const resetSiblings = () => {
    if (!enableHover) return

    cards.forEach((_, i) => {
      gsap.killTweensOf(`.card-${i}`)
      const baseTransform = transformStyles[i] || 'none'
      gsap.to(`.card-${i}`, {
        transform: baseTransform,
        duration: 0.4,
        ease: 'back.out(1.4)',
        overwrite: 'auto'
      })
    })
  }

  return (
    <>
      <div
        className={`bounceCardsContainer ${className}`}
        style={{ width: containerWidth, height: containerHeight }}
      >
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`card card-${idx} group`}
            style={{ transform: transformStyles[idx] ?? 'none' }}
            onMouseEnter={() => pushSiblings(idx)}
            onMouseLeave={resetSiblings}
          >
            <Image
              src={card.image}
              alt={card.title}
              width={400}
              height={300}
              className="
                rounded-2xl w-full h-full object-cover
                transition-all duration-300
                group-hover:brightness-50 group-hover:scale-105
              "
            />

            <div
              className="
                absolute inset-0 flex flex-col items-center justify-center gap-4
                opacity-0 group-hover:opacity-100
                transition-opacity duration-300 text-white
              "
            >
              <p className="text-3xl font-semibold drop-shadow-lg text-center">
                {card.title}
              </p>

              <Button
                onClick={() => setSelected(card)}
                className="
                  px-4 py-2 text-lg rounded-xl
                  bg-purple-700 hover:bg-purple-600
                  transition-colors text-white                "
              >
                Ver mais
              </Button>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <ProjectModal
          open={!!selected}
          onClose={() => setSelected(null)}
          title={selected.title}
          description={selected.description}
          tech={selected.tech}
          image={selected.image}
          href={selected.link}
        />
      )}
    </>
  )
}
