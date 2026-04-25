import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'VerifiedSocial | The Trust-First Social Network',
    template: '%s | VerifiedSocial',
  },
  description: 'A community built on trust. We use real identity verification to ensure a safe, authentic environment for everyone. Browse freely, verify to post.',
  applicationName: 'VerifiedSocial',
  openGraph: {
    title: 'VerifiedSocial | The Trust-First Social Network',
    description: 'A community built on trust. We use real identity verification to ensure a safe, authentic environment for everyone.',
    url: '/',
    siteName: 'VerifiedSocial',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VerifiedSocial | The Trust-First Social Network',
    description: 'A community built on trust. We use real identity verification to ensure a safe, authentic environment for everyone.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Navbar />
        <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
