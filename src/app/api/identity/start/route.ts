import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/utils/supabase/server'
import { requireStripeSecretKey } from '@/env/server'

export async function POST() {
  try {
    let stripe: Stripe
    try {
      stripe = new Stripe(requireStripeSecretKey(), {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        apiVersion: '2025-02-24.acacia' as any,
      })
    } catch (e: unknown) {
      console.error('Stripe configuration error:', e instanceof Error ? e.message : 'Unknown error')
      return NextResponse.json({ error: 'Stripe is not configured' }, { status: 500 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create a VerificationSession
    const verificationSession = await stripe.identity.verificationSessions.create({
      type: 'document',
      metadata: {
        user_id: user.id,
      },
    })

    // Upsert into identity_verifications
    const { error: upsertError } = await supabase
      .from('identity_verifications')
      .upsert({
        user_id: user.id,
        provider: 'stripe_identity',
        stripe_verification_session_id: verificationSession.id,
        status: 'processing',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })

    if (upsertError) {
      console.error('Supabase upsert error:', upsertError.message)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({
      client_secret: verificationSession.client_secret,
      session_id: verificationSession.id,
    })
  } catch (error: unknown) {
    console.error('Stripe identity start error:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ error: 'Unable to start verification session' }, { status: 500 })
  }
}
