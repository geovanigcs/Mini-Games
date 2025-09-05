import type { Metadata } from 'next'
import { Inter, Cinzel } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const cinzel = Cinzel({ 
  subsets: ['latin'],
  variable: '--font-cinzel',
})

export const metadata: Metadata = {
  title: '🏔️ Middle Earth Chronicles - Epic RPG Adventure',
  description: '⚔️ Embark on an epic journey through Middle Earth. Forge your destiny in this dark fantasy RPG inspired by the greatest tales of adventure.',
  keywords: ['RPG', 'Middle Earth', 'Adventure', 'Fantasy', 'Dark Souls', 'Medieval'],
  authors: [{ name: 'Middle Earth Chronicles Team' }],
  openGraph: {
    title: '🏔️ Middle Earth Chronicles',
    description: '⚔️ Forge your destiny in the darkest corners of Middle Earth',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚔️</text></svg>" />
      </head>
      <body className={`${inter.variable} ${cinzel.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
