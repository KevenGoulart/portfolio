import { useTranslations } from 'next-intl'
import {
  SiBitbucket,
  SiCss3,
  SiDocker,
  SiFigma,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiJira,
  SiNestjs,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPostman,
  SiReact,
  SiTailwindcss,
  SiTypescript
} from 'react-icons/si'

export default function Abilities() {
  const t = useTranslations('AbilitiesClassic')
  return (
    <section
      id="abilities"
      className="flex flex-col items-center gap-12 w-[400px] md:w-[1200px] mx-auto mt-8 md:mt-28 mb-20"
    >
      <h2 className="text-5xl text-yellow-200 self-start ml-8">
        {t('title')} <hr className="w-[220px] ml-7 border border-purple-700" />
      </h2>

      <ul className="grid grid-cols-3 md:grid-cols-4 gap-2 text-lg">
        <li className="border-b-2 border-purple-400 flex flex-col items-center justify-center gap-2 mt-4 mx-16 cursor-pointer hover:scale-125 transition-transform duration-300">
          <p className="font-semibold tracking-widest text-gray-100">
            TypeScript
          </p>
          <SiTypescript className="size-16 mb-3" />
        </li>

        <li className="border-b-2 border-purple-400 flex flex-col items-center justify-center gap-2 mt-4 mx-16 cursor-pointer hover:scale-125 transition-transform duration-300">
          <p className="font-semibold tracking-widest text-gray-100">
            Javascript
          </p>
          <SiJavascript className="size-16 mb-3" />
        </li>

        <li className="border-b-2 border-purple-400 flex flex-col items-center justify-center gap-2 mt-4 mx-16 cursor-pointer hover:scale-125 transition-transform duration-300">
          <p className="font-semibold tracking-widest text-gray-100">HTML</p>
          <SiHtml5 className="size-16 mb-3" />
        </li>

        <li className="border-b-2 border-purple-400 flex flex-col items-center justify-center gap-2 mt-4 mx-16 cursor-pointer hover:scale-125 transition-transform duration-300">
          <p className="font-semibold tracking-widest text-gray-100">CSS</p>
          <SiCss3 className="size-16 mb-3" />
        </li>

        <li className="border-b-2 border-purple-400 flex flex-col items-center justify-center gap-2 mt-4 mx-16 cursor-pointer hover:scale-125 transition-transform duration-300">
          <p className="font-semibold tracking-widest text-gray-100">NodeJS</p>
          <SiNodedotjs className="size-16 mb-3" />
        </li>

        <li className="border-b-2 border-purple-400 flex flex-col items-center justify-center gap-2 mt-4 mx-16 cursor-pointer hover:scale-125 transition-transform duration-300">
          <p className="font-semibold tracking-widest text-gray-100">React</p>
          <SiReact className="size-16 mb-3" />
        </li>

        <li className="border-b-2 border-purple-400 flex flex-col items-center justify-center gap-2 mt-4 mx-16 cursor-pointer hover:scale-125 transition-transform duration-300">
          <p className="font-semibold tracking-widest text-gray-100">NestJS</p>
          <SiNestjs className="size-16 mb-3" />
        </li>

        <li className="border-b-2 border-purple-400 flex flex-col items-center justify-center gap-2 mt-4 mx-16 cursor-pointer hover:scale-125 transition-transform duration-300">
          <p className="font-semibold tracking-widest text-gray-100">NextJS</p>
          <SiNextdotjs className="size-16 mb-3" />
        </li>

        <li className="border-b-2 border-purple-400 flex flex-col items-center justify-center gap-2 mt-4 mx-16 cursor-pointer hover:scale-125 transition-transform duration-300">
          <p className="font-semibold tracking-widest text-gray-100">
            PostgreSQL
          </p>
          <SiPostgresql className="size-16 mb-3" />
        </li>

        <li className="border-b-2 border-purple-400 flex flex-col items-center justify-center gap-2 mt-4 mx-16 cursor-pointer hover:scale-125 transition-transform duration-300">
          <p className="font-semibold tracking-widest text-gray-100">Docker</p>
          <SiDocker className="size-16 mb-3" />
        </li>

        <li className="border-b-2 border-purple-400 flex flex-col items-center justify-center gap-2 mt-4 mx-16 cursor-pointer hover:scale-125 transition-transform duration-300">
          <p className="font-semibold tracking-widest text-gray-100">
            Tailwind Css
          </p>
          <SiTailwindcss className="size-16 mb-3" />
        </li>

        <li className="border-b-2 border-purple-400 flex flex-col items-center justify-center gap-2 mt-4 mx-16 cursor-pointer hover:scale-125 transition-transform duration-300">
          <p className="font-semibold tracking-widest text-gray-100">Git</p>
          <SiGit className="size-16 mb-3" />
        </li>

        <li className="border-b-2 border-purple-400 flex flex-col items-center justify-center gap-2 mt-4 mx-16 cursor-pointer hover:scale-125 transition-transform duration-300">
          <p className="font-semibold tracking-widest text-gray-100">Figma</p>
          <SiFigma className="size-16 mb-3" />
        </li>

        <li className="border-b-2 border-purple-400 flex flex-col items-center justify-center gap-2 mt-4 mx-16 cursor-pointer hover:scale-125 transition-transform duration-300">
          <p className="font-semibold tracking-widest text-gray-100">Postman</p>
          <SiPostman className="size-16 mb-3" />
        </li>

        <li className="border-b-2 border-purple-400 flex flex-col items-center justify-center gap-2 mt-4 mx-16 cursor-pointer hover:scale-125 transition-transform duration-300">
          <p className="font-semibold tracking-widest text-gray-100">Jira</p>
          <SiJira className="size-16 mb-3" />
        </li>

        <li className="border-b-2 border-purple-400 flex flex-col items-center justify-center gap-2 mt-4 mx-16 cursor-pointer hover:scale-125 transition-transform duration-300">
          <p className="font-semibold tracking-widest text-gray-100">
            BitBucket
          </p>
          <SiBitbucket className="size-16 mb-3" />
        </li>
      </ul>
    </section>
  )
}
