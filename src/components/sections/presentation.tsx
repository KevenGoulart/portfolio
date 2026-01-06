import Link from 'next/link'
import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa'
import { useTranslations } from 'next-intl'
import BlobComponentShinji from '../Blob-shinji'

export default function Presentation() {
  const t = useTranslations('Presentation')

  return (
    <div
      id="about"
      className="flex flex-col md:flex-row items-center justify-center w-full gap-28 pr-[3%]"
    >
      <div className="max-sm:mx-6 md:w-[40%]">
        <h2 className="text-3xl tracking-wide font-semibold text-slate-900/85 max-sm:text-center">
          {t('description')}
        </h2>
        <div className="flex items-center justify-center gap-8 mt-6">
          <div className="flex items-center justify-center border-2 border-slate-900 rounded-full p-2 group cursor-pointer hover:border-slate-900/50 hover:scale-125 transition-transform duration-300">
            <Link
              href="https://www.linkedin.com/in/k%C3%A9ven-goulart-890248215/"
              target="_blank"
            >
              <FaLinkedin className="size-12 group-hover:text-slate-900/70" />
            </Link>
          </div>

          <div className="flex items-center justify-center border-2 border-slate-900 rounded-full p-2 group cursor-pointer hover:border-slate-900/50 hover:scale-125 transition-transform duration-300">
            <Link href="https://github.com/KevenGoulart" target="_blank">
              <FaGithub className="size-12 group-hover:text-slate-900/70" />
            </Link>
          </div>

          <div className="flex items-center justify-center border-2 border-slate-900 rounded-full p-2 group cursor-pointer hover:border-slate-900/50 hover:scale-125 transition-transform duration-300">
            <Link href="mailto:kevengoulartmm@gmail.com" target="_blank">
              <FaEnvelope className="size-12 group-hover:text-slate-900/70" />
            </Link>
          </div>
        </div>
      </div>

      <div className="relative size-[600px] flex items-center justify-center max-sm:hidden mb-16">
        <BlobComponentShinji />
      </div>
    </div>
  )
}
