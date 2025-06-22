import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Anime Streaming Site',
  description: 'Anime browsing and streaming site powered by Next.js & TypeScript.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: "AniVibha — Anime Vibes Unleashed",
    description: "Sci-fi anime browsing experience built with Next.js 15.",
    url: "https://anivibha.vercel.app",
    siteName: "AniVibha",
    locale: "en_US",
    type: "website",
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
