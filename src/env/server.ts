import 'server-only'

import {
  requireStripeSecretKey as runtimeRequireStripeSecretKey,
  requireStripeWebhookSecret as runtimeRequireStripeWebhookSecret,
  requireSupabaseServiceRoleKey as runtimeRequireSupabaseServiceRoleKey,
} from './server.mjs'

export const requireStripeSecretKey = runtimeRequireStripeSecretKey as () => string
export const requireStripeWebhookSecret = runtimeRequireStripeWebhookSecret as () => string
export const requireSupabaseServiceRoleKey = runtimeRequireSupabaseServiceRoleKey as () => string
