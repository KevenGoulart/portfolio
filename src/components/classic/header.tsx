import { useTranslations } from 'next-intl'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { FaBars } from 'react-icons/fa'

export default function Header() {
  const t = useTranslations('Header')
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-yellow-300/50 to-purple-900/50 backdrop-blur-lg p-5 flex justify-between items-center mx-auto max-w-[95%] md:max-w-[80%] rounded-[30px] mt-1 md:mt-4 md:px-10">
      <h1 className="text-white tracking-wide text-2xl">
        Keven Goulart / {t('title')}
      </h1>
      <div className="max-md:hidden flex items-center text-2xl gap-4">
        <Link
          href="#presentation"
          className="hover:text-purple-200 hover:scale-105 transition-transform duration-300"
        >
          {t('aboutMe')}
        </Link>
        <Link
          href="#projects"
          className="hover:text-purple-200 hover:scale-105 transition-transform duration-300"
        >
          {t('projects')}
        </Link>
        <Link
          href="#experience"
          className="hover:text-purple-200 hover:scale-105 transition-transform duration-300"
        >
          {t('experience')}
        </Link>
        <Link
          href="#abilities"
          className="hover:text-purple-200 hover:scale-105 transition-transform duration-300"
        >
          {t('abilities')}
        </Link>
        <Link
          href="#contact"
          className="hover:text-purple-200 hover:scale-105 transition-transform duration-300"
        >
          {t('contact')}
        </Link>
      </div>
      <div className="md:hidden pr-2">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <FaBars className="xl:hidden text-center w-full text-3xl text-gray-300 hover:text-white" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex flex-col items-center">
            <DropdownMenuItem asChild>
              <Link
                href="#presentation"
                className="hover:text-purple-400 hover:scale-105 transition-transform duration-300 text-xl"
              >
                {t('aboutMe')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="#projects"
                className="hover:text-purple-400 hover:scale-105 transition-transform duration-300 text-xl"
              >
                {t('projects')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="#experience"
                className="hover:text-purple-400 hover:scale-105 transition-transform duration-300 text-xl"
              >
                {t('experience')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="#abilities"
                className="hover:text-purple-400 hover:scale-105 transition-transform duration-300 text-xl"
              >
                {t('abilities')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="#contact"
                className="hover:text-purple-400 hover:scale-105 transition-transform duration-300 text-xl"
              >
                {t('contact')}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
