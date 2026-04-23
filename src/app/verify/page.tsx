'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'

export default function VerifyPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Fetch current verification status
    async function fetchStatus() {
      try {
        const res = await fetch('/api/identity/status')
        if (res.ok) {
          const data = await res.json()
          setStatus(data.status)
        }
      } catch (err) {
        console.error('Failed to fetch status', err)
      }
    }
    fetchStatus()
  }, [])

  const startVerification = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/identity/start', {
        method: 'POST',
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to start verification')
      }

      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      if (!stripe) {
        throw new Error('Stripe failed to load')
      }

      const { error: stripeError } = await stripe.verifyIdentity(data.client_secret)

      if (stripeError) {
        setError(stripeError.message || 'Verification failed')
      } else {
        // Stripe handled it successfully, now we can redirect or show pending
        setStatus('pending')
        router.refresh()
      }
    } catch (err: unknown) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold mb-4">Identity Verification</h1>
        
        {status === 'verified' && (
          <div className="p-4 bg-green-50 text-green-700 rounded-md mb-6">
            Your identity has been verified! You now have full access to the platform.
          </div>
        )}

        {status === 'pending' && (
          <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md mb-6">
            Your verification is currently processing. Please check back later.
          </div>
        )}

        {status === 'requires_input' && (
          <div className="p-4 bg-orange-50 text-orange-700 rounded-md mb-6">
            Additional information is required. Please restart the verification process.
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-md mb-6">
            {error}
          </div>
        )}

        <p className="text-gray-600 mb-8">
          To ensure a safe community, we require all members who wish to post or interact to verify their identity and age.
        </p>

        {status !== 'verified' && status !== 'pending' && (
          <button
            onClick={startVerification}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Starting...' : 'Verify Identity with Stripe'}
          </button>
        )}
      </div>
    </div>
  )
}
