'use client'
import { motion } from 'motion/react'
import type { ReactNode } from 'react'

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
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: -300 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
      viewport={{ once: false, amount: 0.18 }}
      whileInView={{ opacity: 1, x: 0 }}
    >
      {children}
    </motion.div>
  )
}
