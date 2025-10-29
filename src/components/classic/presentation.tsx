import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { FaGithub, FaLinkedin } from 'react-icons/fa'

export default function Presentation() {
  const t = useTranslations('Presentation')
  return (
    <main id="presentation" className="flex items-center justify-evenly mt-20">
      <div className="max-w-[500px] flex flex-col gap-4">
        <h1 className="text-5xl text-yellow-500 text-center">
          {t('greeting1')} <br /> {t('greeting2')}
        </h1>
        <p className="text-lg text-center">{t('description')}</p>
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center justify-center border border-white rounded-full p-2 group cursor-pointer hover:border-white/50  hover:scale-105 transition-transform duration-300">
            <Link
              href="https://www.linkedin.com/in/k%C3%A9ven-goulart-890248215/"
              target="_blank"
            >
              <FaLinkedin className="size-10 group-hover:text-white/50" />
            </Link>
          </div>
          <div className="flex items-center justify-center border border-white rounded-full p-2 group cursor-pointer hover:border-white/50  hover:scale-105 transition-transform duration-300">
            <Link href="https://github.com/KevenGoulart" target="_blank">
              <FaGithub className="size-10 group-hover:text-white/50" />
            </Link>
          </div>
        </div>
      </div>
      <div
        className="border-8 border-green-300 overflow-hidden inline-block"
        style={{
          clipPath:
            'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
        }}
      >
        <Image
          src="/magi.gif"
          alt="Magi"
          width={600}
          height={600}
          className="w-full h-full object-cover"
        />
      </div>
    </main>
  )
}
