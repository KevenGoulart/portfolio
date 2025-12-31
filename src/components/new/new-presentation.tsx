import Link from 'next/link'
import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa'

export default function NewPresentation() {
  return (
    <div className="flex items-center justify-start pl-[10%] w-full">
      <div className="w-[40%]">
        <h2 className="text-3xl tracking-wide font-semibold text-slate-900/85">
          Olá! Meu nome é Keven Goulart, trabalho como desenvolvedor
          especializado em TypeScript, Node.js, React, Next.js e Nest. Tenho
          experiência na construção de aplicações full-stack, atuando tanto no
          front-end quanto no back-end, com foco em soluções escaláveis e bem
          estruturadas.
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
    </div>
  )
}
