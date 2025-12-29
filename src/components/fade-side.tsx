'use client'
import { motion } from 'motion/react'
import { useEffect, useState, type ReactNode } from 'react'

interface FadeSideSectionProps {
  children: ReactNode
  delay?: number
  className?: string
}

export function FadeSideSection({
  children,
  delay = 0,
  className
}: FadeSideSectionProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])
  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        x: isMobile ? 0 : -300
      }}
      whileInView={{
        opacity: 1,
        x: 0
      }}
      transition={{
        duration: 0.5,
        ease: 'easeOut',
        delay
      }}
      viewport={{
        once: false,
        amount: isMobile ? 0.05 : 0.18
      }}
    >
      {children}
    </motion.div>
  )
}
