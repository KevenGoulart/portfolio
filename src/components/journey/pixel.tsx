import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Panel({
  className,
  children
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn('pixel-panel p-5 md:p-6', className)}>{children}</div>
  )
}

// section title on a wooden sign whose posts stand on the town street
export function Signpost({
  id,
  children
}: {
  id?: string
  children: ReactNode
}) {
  return (
    <div className="signpost">
      <h2 id={id} className="sign-board">
        {children}
      </h2>
      <div className="sign-posts" aria-hidden="true">
        <span />
        <span />
      </div>
    </div>
  )
}

export function PixelLink({
  href,
  icon,
  variant,
  children
}: {
  href: string
  icon?: ReactNode
  variant?: 'paper'
  children: ReactNode
}) {
  const external = /^https?:/.test(href)
  return (
    <a
      href={href}
      className="pixel-button"
      data-variant={variant}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      {icon}
      {children}
    </a>
  )
}
