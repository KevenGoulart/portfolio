import type { Metadata } from 'next'
import './globals.css'
import localFont from 'next/font/local'
import { Pixelify_Sans, VT323 } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getTranslations } from 'next-intl/server'
import { SITE_URL } from '@/lib/site'

const evaFont = localFont({
  src: '../../public/fonts/coolveltica.otf',
  variable: '--font-eva',
  display: 'swap'
})

const pixelFont = Pixelify_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-pixel',
  display: 'swap'
})

// pixel font with clear digits, for dates and numbers
const terminalFont = VT323({
  weight: '400',
  subsets: ['latin', 'latin-ext'],
  variable: '--font-terminal',
  display: 'swap'
})

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = await getTranslations('Metadata')
  const title = t('title')
  const description = t('description')
  const image = { url: '/og.png', width: 1200, height: 630, alt: t('ogAlt') }

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    applicationName: 'Keven Goulart',
    authors: [{ name: 'Keven Goulart', url: SITE_URL }],
    creator: 'Keven Goulart',
    keywords: [
      'Keven Goulart',
      'Desenvolvedor FullStack',
      'FullStack Developer',
      'TypeScript',
      'React',
      'Next.js',
      'Node.js',
      'NestJS',
      'Governador Valadares'
    ],
    alternates: { canonical: '/' },
    icons: '/eva-modified.ico',
    openGraph: {
      type: 'profile',
      url: '/',
      siteName: 'Keven Goulart',
      title,
      description,
      locale: locale === 'en' ? 'en_US' : 'pt_BR',
      alternateLocale: locale === 'en' ? 'pt_BR' : 'en_US',
      firstName: 'Keven',
      lastName: 'Goulart',
      images: [image]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image]
    },
    robots: { index: true, follow: true }
  }
}

// structured data that search engines and AI assistants use to identify the
// person behind the site and link it to their profiles
const personJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: 'Keven Goulart',
      alternateName: 'Kéven Goulart',
      url: SITE_URL,
      image: `${SITE_URL}/og.png`,
      email: 'mailto:kevengoulartmm@gmail.com',
      jobTitle: 'Desenvolvedor FullStack',
      worksFor: { '@type': 'Organization', name: 'Bttis' },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Governador Valadares',
        addressRegion: 'MG',
        addressCountry: 'BR'
      },
      alumniOf: {
        '@type': 'CollegeOrUniversity',
        name: 'Universidade Vale do Rio Doce (Univale)'
      },
      knowsLanguage: ['pt-BR', 'en'],
      knowsAbout: [
        'TypeScript',
        'JavaScript',
        'React',
        'Next.js',
        'Node.js',
        'NestJS',
        'Tailwind CSS',
        'PostgreSQL',
        'MongoDB',
        'Prisma',
        'Redis',
        'Docker',
        'WebSocket',
        'Shopify'
      ],
      sameAs: [
        'https://www.linkedin.com/in/keven-goulart-890248215/',
        'https://github.com/KevenGoulart'
      ]
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Keven Goulart',
      inLanguage: ['pt-BR', 'en'],
      author: { '@id': `${SITE_URL}/#person` }
    }
  ]
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()

  return (
    <html
      lang={locale}
      className={`dark scroll-smooth no-scrollbar overflow-auto ${pixelFont.variable} ${terminalFont.variable}`}
      suppressHydrationWarning
    >
      <body className={`${evaFont.className}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}
