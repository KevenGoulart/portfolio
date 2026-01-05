import { useTranslations } from 'next-intl'
import BubbleMenu from '../BubbleMenu'

export default function Header() {
  const t = useTranslations('Header')

  const items = [
    {
      label: t('aboutMe'),
      href: '#about',
      ariaLabel: t('aboutMe'),
      rotation: -8,
      hoverStyles: { bgColor: '#3b82f6', textColor: '#ffffff' }
    },
    {
      label: t('projects'),
      href: '#projects',
      ariaLabel: t('projects'),
      rotation: 8,
      hoverStyles: { bgColor: '#f59e0b', textColor: '#ffffff' }
    },
    {
      label: t('experience'),
      href: '#experience',
      ariaLabel: t('experience'),
      rotation: 8,
      hoverStyles: { bgColor: '#10b981', textColor: '#ffffff' }
    },
    {
      label: t('abilities'),
      href: '#abilities',
      ariaLabel: t('abilities'),
      rotation: 8,
      hoverStyles: { bgColor: '#F54927', textColor: '#ffffff' }
    },
    {
      label: t('contact'),
      href: '#contact',
      ariaLabel: t('contact'),
      rotation: -8,
      hoverStyles: { bgColor: '#8b5cf6', textColor: '#ffffff' }
    }
  ]

  return (
    <div className="absolute top-36 right-[15%] w-[600px]">
      <BubbleMenu
        items={items}
        menuBg="#ffffff"
        menuContentColor="#111111"
        useFixedPosition={false}
        animationEase="back.out(1.5)"
        animationDuration={0.8}
        staggerDelay={0.3}
      />
    </div>
  )
}
