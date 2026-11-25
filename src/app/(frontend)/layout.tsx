import type { Metadata } from 'next'
import { Inter, Cormorant_Garamond } from 'next/font/google'
import type { ReactNode } from 'react'

import './styles.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'ModuKitchen | Kitchens Designed for Living',
    template: '%s | ModuKitchen',
  },
  description:
    'Discover beautifully crafted modular kitchens, premium materials, and personalised kitchen design solutions.',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable}`}
    >
      <body className="min-h-screen">
        <main>{children}</main>
      </body>
    </html>
  )
}
