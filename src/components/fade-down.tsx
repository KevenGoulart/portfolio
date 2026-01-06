'use client'
import { motion } from 'motion/react'
import type { ReactNode } from 'react'

interface FadeDownSectionProps {
  children: ReactNode
  delay?: number
  className?: string
  yEnd?: number
}

export function FadeDownSection({
  children,
  delay = 0,
  className,
  yEnd = 130
}: FadeDownSectionProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: -100 }}
      transition={{ duration: 2, ease: 'easeOut', delay }}
      viewport={{ once: false, amount: 0.3 }}
      whileInView={{ opacity: 1, y: yEnd }}
    >
      {children}
    </motion.div>
  )
}
