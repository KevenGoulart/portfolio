import { useTranslations } from 'next-intl'
import BubbleMenu from '../BubbleMenu'

const items = [
  {
    label: 'about',
    href: '#about',
    ariaLabel: 'Sobre',
    rotation: -8,
    hoverStyles: { bgColor: '#3b82f6', textColor: '#ffffff' }
  },
  {
    label: 'projects',
    href: '#projects',
    ariaLabel: 'Projects',
    rotation: 8,
    hoverStyles: { bgColor: '#f59e0b', textColor: '#ffffff' }
  },
  {
    label: 'experience',
    href: '#experience',
    ariaLabel: 'Experiência',
    rotation: 8,
    hoverStyles: { bgColor: '#10b981', textColor: '#ffffff' }
  },
  {
    label: 'abilities',
    href: '#abilities',
    ariaLabel: 'Habilidades',
    rotation: 8,
    hoverStyles: { bgColor: '#F54927', textColor: '#ffffff' }
  },
  {
    label: 'contact',
    href: '#contact',
    ariaLabel: 'Contato',
    rotation: -8,
    hoverStyles: { bgColor: '#8b5cf6', textColor: '#ffffff' }
  }
]

export default function NewHeader() {
  const t = useTranslations('Header')
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
