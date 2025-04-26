import type { Metadata } from "next";
import "./globals.css";
import localFont from 'next/font/local'

const evaFont = localFont({
  src: "../../public/fonts/EvaMatisse.ttf",
  variable: '--font-eva',
  display: 'swap'
})

export const metadata: Metadata = {
  title: "Keven's Portfolio",
  description: "Looking for an opportunity",
  icons: '/eva-modified.ico',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${evaFont.className}`}>
        {children}
      </body>
    </html>
  );
}
