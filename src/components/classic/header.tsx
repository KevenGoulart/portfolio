import { useTranslations } from 'next-intl'
import Link from 'next/link'

export default function Header() {
  const t = useTranslations('Header')
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-yellow-500/80 to-purple-800/80 backdrop-blur-md p-5 flex justify-between items-center mx-auto max-w-[70%] rounded-[200px] mt-4 px-20">
      <h1 className="text-white tracking-widest text-2xl">
        Keven Goulart / {t('title')}
      </h1>
      <div className="flex items-center text-2xl gap-6">
        <Link
          href="#presentation"
          className="hover:text-purple-400 hover:scale-105 transition-transform duration-300"
        >
          {t('aboutMe')}
        </Link>
        <Link
          href="#projects"
          className="hover:text-purple-400 hover:scale-105 transition-transform duration-300"
        >
          {t('projects')}
        </Link>
        <Link
          href="#experience"
          className="hover:text-purple-400 hover:scale-105 transition-transform duration-300"
        >
          {t('experience')}
        </Link>
        <Link
          href="#abilities"
          className="hover:text-purple-400 hover:scale-105 transition-transform duration-300"
        >
          {t('abilities')}
        </Link>
        <Link
          href="#contact"
          className="hover:text-purple-400 hover:scale-105 transition-transform duration-300"
        >
          {t('contact')}
        </Link>
      </div>
    </header>
  )
}
