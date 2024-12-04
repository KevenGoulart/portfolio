import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Keven's Portfolio",
  description: "Looking for an opportunity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}
