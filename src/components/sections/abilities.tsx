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
  const t = useTranslations('Abilities')

  return (
    <div id="abilities" className="flex items-center justify-center mt-12">
      <div className="flex flex-col items-center gap-12 w-[400px] md:w-[1200px] mx-auto mt-8 md:mt-28 mb-20">
        <h2 className="text-6xl font-bold text-slate-900/85 self-start tracking-wider md:ml-8">
          {t('title')}
        </h2>

        <ul className="grid grid-cols-3 md:grid-cols-4 gap-2 text-2xl">
          <li className="border-b-4 border-purple-700 flex flex-col items-center justify-center gap-2 mt-4 mx-16 cursor-pointer hover:scale-125 transition-transform duration-300">
            <p className="font-semibold tracking-widest text-gray-900/85">
              TypeScript
            </p>
            <SiTypescript className="size-16 mb-3" />
          </li>

          <li className="border-b-4 border-purple-700 flex flex-col items-center justify-center gap-2 mt-4 mx-16 cursor-pointer hover:scale-125 transition-transform duration-300">
            <p className="font-semibold tracking-widest text-gray-900/85">
              Javascript
            </p>
            <SiJavascript className="size-16 mb-3" />
          </li>

          <li className="border-b-4 border-purple-700 flex flex-col items-center justify-center gap-2 mt-4 mx-16 cursor-pointer hover:scale-125 transition-transform duration-300">
            <p className="font-semibold tracking-widest text-gray-900/85">
              HTML
            </p>
            <SiHtml5 className="size-16 mb-3" />
          </li>

          <li className="border-b-4 border-purple-700 flex flex-col items-center justify-center gap-2 mt-4 mx-16 cursor-pointer hover:scale-125 transition-transform duration-300">
            <p className="font-semibold tracking-widest text-gray-900/85">
              CSS
            </p>
            <SiCss3 className="size-16 mb-3" />
          </li>

          <li className="border-b-4 border-purple-700 flex flex-col items-center justify-center gap-2 mt-4 mx-16 cursor-pointer hover:scale-125 transition-transform duration-300">
            <p className="font-semibold tracking-widest text-gray-900/85">
              NodeJS
            </p>
            <SiNodedotjs className="size-16 mb-3" />
          </li>

          <li className="border-b-4 border-purple-700 flex flex-col items-center justify-center gap-2 mt-4 mx-16 cursor-pointer hover:scale-125 transition-transform duration-300">
            <p className="font-semibold tracking-widest text-gray-900/85">
              React
            </p>
            <SiReact className="size-16 mb-3" />
          </li>

          <li className="border-b-4 border-purple-700 flex flex-col items-center justify-center gap-2 mt-4 mx-16 cursor-pointer hover:scale-125 transition-transform duration-300">
            <p className="font-semibold tracking-widest text-gray-900/85">
              NestJS
            </p>
            <SiNestjs className="size-16 mb-3" />
          </li>

          <li className="border-b-4 border-purple-700 flex flex-col items-center justify-center gap-2 mt-4 mx-16 cursor-pointer hover:scale-125 transition-transform duration-300">
            <p className="font-semibold tracking-widest text-gray-900/85">
              NextJS
            </p>
            <SiNextdotjs className="size-16 mb-3" />
          </li>

          <li className="border-b-4 border-purple-700 flex flex-col items-center justify-center gap-2 mt-4 mx-16 cursor-pointer hover:scale-125 transition-transform duration-300">
            <p className="font-semibold tracking-widest text-gray-900/85">
              PostgreSQL
            </p>
            <SiPostgresql className="size-16 mb-3" />
          </li>

          <li className="border-b-4 border-purple-700 flex flex-col items-center justify-center gap-2 mt-4 mx-16 cursor-pointer hover:scale-125 transition-transform duration-300">
            <p className="font-semibold tracking-widest text-gray-900/85">
              Docker
            </p>
            <SiDocker className="size-16 mb-3" />
          </li>

          <li className="border-b-4 border-purple-700 flex flex-col items-center justify-center gap-2 mt-4 mx-16 cursor-pointer hover:scale-125 transition-transform duration-300">
            <p className="font-semibold tracking-widest text-gray-900/85">
              Tailwind Css
            </p>
            <SiTailwindcss className="size-16 mb-3" />
          </li>

          <li className="border-b-4 border-purple-700 flex flex-col items-center justify-center gap-2 mt-4 mx-16 cursor-pointer hover:scale-125 transition-transform duration-300">
            <p className="font-semibold tracking-widest text-gray-900/85">
              Git
            </p>
            <SiGit className="size-16 mb-3" />
          </li>

          <li className="border-b-4 border-purple-700 flex flex-col items-center justify-center gap-2 mt-4 mx-16 cursor-pointer hover:scale-125 transition-transform duration-300">
            <p className="font-semibold tracking-widest text-gray-900/85">
              Figma
            </p>
            <SiFigma className="size-16 mb-3" />
          </li>

          <li className="border-b-4 border-purple-700 flex flex-col items-center justify-center gap-2 mt-4 mx-16 cursor-pointer hover:scale-125 transition-transform duration-300">
            <p className="font-semibold tracking-widest text-gray-900/85">
              Postman
            </p>
            <SiPostman className="size-16 mb-3" />
          </li>

          <li className="border-b-4 border-purple-700 flex flex-col items-center justify-center gap-2 mt-4 mx-16 cursor-pointer hover:scale-125 transition-transform duration-300">
            <p className="font-semibold tracking-widest text-gray-900/85">
              Jira
            </p>
            <SiJira className="size-16 mb-3" />
          </li>

          <li className="border-b-4 border-purple-700 flex flex-col items-center justify-center gap-2 mt-4 mx-16 cursor-pointer hover:scale-125 transition-transform duration-300">
            <p className="font-semibold tracking-widest text-gray-900/85">
              BitBucket
            </p>
            <SiBitbucket className="size-16 mb-3" />
          </li>
        </ul>
      </div>
    </div>
  )
}
