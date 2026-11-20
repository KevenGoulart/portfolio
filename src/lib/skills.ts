import type { IconType } from 'react-icons'
import { FaLayerGroup, FaTheaterMasks } from 'react-icons/fa'
import {
  SiAmazonwebservices,
  SiBitbucket,
  SiCss3,
  SiDocker,
  SiFigma,
  SiGit,
  SiGithubactions,
  SiHtml5,
  SiJavascript,
  SiMongodb,
  SiNestjs,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPostman,
  SiPrisma,
  SiReact,
  SiReactquery,
  SiRedis,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
  SiVite,
  SiVitest
} from 'react-icons/si'

export interface Skill {
  name: string
  icon: IconType
}

export interface SkillGroup {
  /** key of the group title in Abilities.<key> */
  key: 'frontend' | 'backend' | 'infra' | 'tools'
  color: string
  skills: Skill[]
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    key: 'frontend',
    color: '#4d65b4',
    skills: [
      { name: 'TypeScript', icon: SiTypescript },
      { name: 'JavaScript', icon: SiJavascript },
      { name: 'React', icon: SiReact },
      { name: 'Next.js', icon: SiNextdotjs },
      { name: 'Tailwind CSS', icon: SiTailwindcss },
      { name: 'React Query', icon: SiReactquery },
      { name: 'Three.js', icon: SiThreedotjs },
      { name: 'Vite', icon: SiVite },
      { name: 'HTML', icon: SiHtml5 },
      { name: 'CSS', icon: SiCss3 }
    ]
  },
  {
    key: 'backend',
    color: '#b33831',
    skills: [
      { name: 'Node.js', icon: SiNodedotjs },
      { name: 'NestJS', icon: SiNestjs },
      { name: 'PostgreSQL', icon: SiPostgresql },
      { name: 'MongoDB', icon: SiMongodb },
      { name: 'Redis', icon: SiRedis },
      { name: 'Prisma', icon: SiPrisma },
      { name: 'BullMQ', icon: FaLayerGroup }
    ]
  },
  {
    key: 'infra',
    color: '#239063',
    skills: [
      { name: 'Docker', icon: SiDocker },
      { name: 'AWS', icon: SiAmazonwebservices },
      { name: 'GitHub Actions', icon: SiGithubactions },
      { name: 'Vitest', icon: SiVitest },
      { name: 'Playwright', icon: FaTheaterMasks }
    ]
  },
  {
    key: 'tools',
    color: '#9e6a43',
    skills: [
      { name: 'Git', icon: SiGit },
      { name: 'Bitbucket', icon: SiBitbucket },
      { name: 'Figma', icon: SiFigma },
      { name: 'Postman', icon: SiPostman }
    ]
  }
]
