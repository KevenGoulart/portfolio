import { useTranslations } from 'next-intl'
import Link from 'next/link'

export default function Header() {
  const t = useTranslations('Header')
  return (
    <header className="bg-gradient-to-r from-yellow-400 to-purple-800  p-5 flex justify-between items-center mx-72 rounded-[200px] mt-4 px-20">
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
      </div>
    </header>
  )
}
