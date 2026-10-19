import type { Metadata } from 'next'
import './globals.css'
import localFont from 'next/font/local'
import { Pixelify_Sans, VT323 } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'

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

export const metadata: Metadata = {
  title: "Keven's Portfolio",
  description: 'FullStack Developer',
  icons: '/eva-modified.ico'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`dark scroll-smooth no-scrollbar overflow-auto ${pixelFont.variable} ${terminalFont.variable}`}
      suppressHydrationWarning
    >
      <body className={`${evaFont.className}`}>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}
