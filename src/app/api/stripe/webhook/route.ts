import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/utils/supabase/admin'
import { requireStripeSecretKey, requireStripeWebhookSecret } from '@/env/server'

export async function POST(req: Request) {
  let stripe: Stripe
  let webhookSecret: string
  try {
    stripe = new Stripe(requireStripeSecretKey(), {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      apiVersion: '2025-02-24.acacia' as any,
    })
    webhookSecret = requireStripeWebhookSecret()
  } catch (e: unknown) {
    console.error('Stripe configuration error:', e instanceof Error ? e.message : 'Unknown error')
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 500 })
  }

  const body = await req.text()
  const sig = req.headers.get('stripe-signature')
  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      webhookSecret
    )
  } catch (err: unknown) {
    const errorMsg = (err as Error).message
    console.error('Webhook signature verification failed:', errorMsg)
    return NextResponse.json({ error: `Webhook Error: ${errorMsg}` }, { status: 400 })
  }

  const supabase = await createAdminClient()

  if (event.type.startsWith('identity.verification_session.')) {
    const session = event.data.object as Stripe.Identity.VerificationSession
    const userId = session.metadata?.user_id

    if (!userId) {
      console.error('Missing user_id in verification session metadata')
      return NextResponse.json({ received: true })
    }

    let isAdult = false
    const verificationStatus = session.status

    if (session.status === 'verified' && session.last_verification_report) {
      try {
        const reportId = typeof session.last_verification_report === 'string' 
          ? session.last_verification_report 
          : session.last_verification_report.id

        const report = await stripe.identity.verificationReports.retrieve(reportId)
        
        if (report.document?.dob) {
          const { year, month, day } = report.document.dob
          if (year && month && day) {
            const birthDate = new Date(year, month - 1, day)
            const age = calculateAge(birthDate)
            isAdult = age >= 18
          }
        }
      } catch (e) {
        console.error('Failed to fetch verification report:', e instanceof Error ? e.message : 'Unknown error')
      }
    }

    // Update identity_verifications
    await supabase
      .from('identity_verifications')
      .update({
        status: verificationStatus,
        is_adult: isAdult,
        last_error: session.last_error?.reason || null,
        verified_at: session.status === 'verified' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_verification_session_id', session.id)

    // If verified and adult requirement is satisfied, update profile
    if (session.status === 'verified') {
      await supabase
        .from('profiles')
        .update({
          is_verified: true,
          is_adult: isAdult,
        })
        .eq('id', userId)
    }
  }

  return NextResponse.json({ received: true })
}

function calculateAge(birthDate: Date) {
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}
