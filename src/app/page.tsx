import Link from 'next/link'
import { Metadata } from 'next'
import { ShieldCheck, Users, MessageSquareText, Activity, UserCheck, Shield } from 'lucide-react'

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
      
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8 overflow-hidden bg-gradient-to-b from-blue-50/50 to-white">
        <div className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] bg-white shadow-xl shadow-blue-600/10 ring-1 ring-blue-50 sm:-mr-80 lg:-mr-96" aria-hidden="true" />
        <div className="mx-auto max-w-2xl py-24 sm:py-32 lg:py-40 animate-fade-in-up">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="rounded-full bg-blue-100 p-3 ring-1 ring-blue-200">
                <ShieldCheck className="h-10 w-10 text-blue-600" aria-hidden="true" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl text-balance">
              The Trust-First Social Network
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 text-balance max-w-xl mx-auto">
              A community built on real identity. We use secure verification to ensure a safe, authentic environment. Say goodbye to bots and anonymous abuse.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 flex-wrap gap-y-4">
              <Link
                href="/explore"
                className="rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
              >
                Browse the Feed
              </Link>
              <Link 
                href="/auth/signup" 
                className="rounded-md bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
              >
                Verify & Join
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Layer / Features Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">How Verification Works</h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            We believe you have the right to know you&apos;re talking to real people. Our platform enforces strict identity checks before allowing interaction.
          </p>
        </div>
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-blue-100 ring-1 ring-blue-200">
                <Users className="h-8 w-8 text-blue-600" aria-hidden="true" />
              </div>
              <dt className="text-xl font-semibold leading-7 text-gray-900">Browse Freely</dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">Anyone can read and explore content on VerifiedSocial. Transparency and open access are core to our mission.</p>
              </dd>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-blue-100 ring-1 ring-blue-200">
                <UserCheck className="h-8 w-8 text-blue-600" aria-hidden="true" />
              </div>
              <dt className="text-xl font-semibold leading-7 text-gray-900">Verify to Post</dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">To create posts, like, or follow others, you must verify your identity using our secure Stripe integration.</p>
              </dd>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-blue-100 ring-1 ring-blue-200">
                <Shield className="h-8 w-8 text-blue-600" aria-hidden="true" />
              </div>
              <dt className="text-xl font-semibold leading-7 text-gray-900">Community Safety</dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">Because every interaction is tied to a verified account, community standards are naturally enforced.</p>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Value Prop Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">A Better Experience</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Social media without the noise
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <Activity className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Real Engagement
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">Every like, follow, and comment comes from a verified human. Quality over quantity.</dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <MessageSquareText className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Meaningful Discourse
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">Knowing who you are talking to fosters more respectful and productive conversations.</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
