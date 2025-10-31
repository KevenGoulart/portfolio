'use client'
import { motion } from 'motion/react'
import type { ReactNode } from 'react'

interface FadeInSectionProps {
  children: ReactNode
  delay?: number
  className?: string
}

export function FadeInSection({
  children,
  delay = 0,
  className
}: FadeInSectionProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      transition={{ duration: 3, ease: 'easeOut', delay }}
      viewport={{ once: true, amount: 0.3 }}
      whileInView={{ opacity: 1 }}
    >
      {children}
    </motion.div>
  )
}
