import type { Metadata } from 'next'
import './globals.css'
import localFont from 'next/font/local'
import { NextIntlClientProvider } from 'next-intl'

const evaFont = localFont({
  src: '../../public/fonts/coolveltica.otf',
  variable: '--font-eva',
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
    <html lang="pt-BR" className="dark scroll-smooth" suppressHydrationWarning>
      <body className={`${evaFont.className}`}>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}
