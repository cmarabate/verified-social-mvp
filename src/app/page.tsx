import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home | VerifiedSocial',
  description: 'Welcome to VerifiedSocial, a community built on trust. We use real identity verification to ensure a safe, authentic environment for everyone.',
  openGraph: {
    title: 'Home | VerifiedSocial',
    description: 'Welcome to VerifiedSocial, a community built on trust. We use real identity verification to ensure a safe, authentic environment for everyone.',
    url: '/',
  },
}

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'VerifiedSocial',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    description: 'A community built on trust. We use real identity verification to ensure a safe, authentic environment for everyone.',
  }

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Welcome to VerifiedSocial
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              A community built on trust. We use real identity verification to ensure
              a safe, authentic environment for everyone. Browse freely, verify to post.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/explore"
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Explore Feed
              </Link>
              <Link href="/auth/signup" className="text-sm font-semibold leading-6 text-gray-900">
                Sign up <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
