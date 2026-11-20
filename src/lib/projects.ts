// project data shared by the journey cards and the /resume page; the texts
// live in messages/*.json under Projects.<key> and ProfessionalProjects.<key>

export interface Project {
  /** key of the project's texts in the messages */
  key: string
  title: string
  image: string
  tech: string[]
  demo?: string
  code?: string
  /** client website (professional projects) */
  site?: string
  offline?: boolean
  /** hosted on a free tier that sleeps: the first load can be slow */
  freeHosting?: boolean
  /** has problem + highlights texts */
  caseStudy?: boolean
}

export const PERSONAL_PROJECTS: Project[] = [
  {
    key: 'raioX',
    title: 'Raio-X Público',
    image: '/raio-x-publico.webp',
    tech: [
      'Next.js',
      'NestJS',
      'TypeScript',
      'BullMQ',
      'PostgreSQL',
      'Redis',
      'Prisma',
      'Zod',
      'TanStack Query',
      'Turborepo',
      'Vitest',
      'Playwright',
      'Docker'
    ],
    code: 'https://github.com/KevenGoulart/Government-Tracking',
    caseStudy: true
  },
  {
    key: 'geeklog',
    title: 'GeekLog',
    image: '/geeklog.webp',
    tech: [
      'Next.js',
      'NestJS',
      'React Native',
      'TypeScript',
      'MongoDB',
      'Prisma',
      'Redis',
      'Socket.IO',
      'AWS S3',
      'Stripe',
      'Docker',
      'Turborepo'
    ],
    demo: 'https://geeklog.app/',
    caseStudy: true
  },
  {
    key: 'clothShowcase',
    title: 'Cloth Showcase',
    image: '/cloth-showcase.webp',
    tech: [
      'Three.js',
      'React Three Fiber',
      'Next.js',
      'TypeScript',
      'Drei',
      'Blender (Python)',
      'Tailwind CSS'
    ],
    demo: 'https://cloth-showcase.vercel.app/',
    code: 'https://github.com/KevenGoulart/conversor-3d',
    caseStudy: true
  },
  {
    key: 'nftMarketplace',
    title: 'NFT Marketplace',
    image: '/nft.webp',
    tech: [
      'React',
      'TypeScript',
      'Vite',
      'TanStack Router',
      'TanStack Query',
      'MSW',
      'Socket.IO',
      'React Hook Form',
      'Zod',
      'Tailwind CSS',
      'Playwright'
    ],
    demo: 'https://nft-marketplace-theta-bay-72.vercel.app/',
    code: 'https://github.com/KevenGoulart/nft-marketplace',
    caseStudy: true
  }
]

export const ALL_PROJECTS_URL =
  'https://github.com/KevenGoulart?tab=repositories'

export const PROFESSIONAL_PROJECTS: Project[] = [
  {
    key: 'draVictoria',
    title: 'Dra. Victoria',
    image: '/dravictoria.webp',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Docker'],
    site: 'https://dravictoriabarbalho.com/'
  },
  {
    key: 'goldCiclo',
    title: 'Gold Ciclo',
    image: '/goldciclo.webp',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Docker'],
    site: 'https://goldciclo.com/',
    offline: true
  },
  {
    key: 'maisVit',
    title: 'Mais Vit',
    image: '/maisvit-shopify.webp',
    tech: ['Shopify', 'Liquid'],
    site: 'https://conheca.maisvit.com/'
  },
  {
    key: 'libid365',
    title: 'Libid365',
    image: '/libid365.webp',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Docker'],
    site: 'https://www.libid365.com/'
  },
  {
    key: 'upslim',
    title: 'UPSlim',
    image: '/upslim.webp',
    tech: [
      'Next.js',
      'NestJS',
      'TypeScript',
      'PostgreSQL',
      'Prisma',
      'Redis',
      'Tailwind CSS',
      'Docker'
    ],
    site: 'https://upslim.com.br/',
    offline: true
  }
]
