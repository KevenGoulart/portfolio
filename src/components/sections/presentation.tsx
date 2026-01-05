import Image from 'next/image'
import Link from 'next/link'
import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa'
import ShapeBlur from '../ShapeBlur'
import { useTranslations } from 'next-intl'

export default function Presentation() {
  const t = useTranslations('Presentation')

  return (
    <div className="flex items-center justify-center w-full gap-36 pr-[5%] mt-12">
      <div className="w-[40%]">
        <h2 className="text-3xl tracking-wide font-semibold text-slate-900/85">
          {t('description')}
        </h2>
        <div className="flex items-center justify-center gap-4 mt-4">
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
      <div className="relative size-[530px] flex items-center justify-center">
        <div className="absolute inset-0 scale-110 pointer-events-none z-0">
          <ShapeBlur
            variation={0}
            pixelRatioProp={
              typeof window !== 'undefined' ? window.devicePixelRatio : 1
            }
            shapeSize={1.48}
            roundness={1.5}
            borderSize={0.1}
            circleSize={0.4}
            circleEdge={3}
          />
        </div>

        <div className="relative size-[400px] overflow-hidden z-10 rounded-full">
          <Image
            src="/shinji.gif"
            alt="shinji"
            fill
            className="object-cover rounded-full"
          />
        </div>
      </div>
    </div>
  )
}
