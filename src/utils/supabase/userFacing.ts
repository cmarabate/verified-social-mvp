export type SupabaseAvailability = 'unreachable' | 'unavailable'

function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error
  if (error && typeof error === 'object' && 'message' in error && typeof (error as { message?: unknown }).message === 'string') {
    return (error as { message: string }).message
  }
  if (error instanceof Error) return error.message
  return ''
}

export function classifySupabaseAvailability(error: unknown): SupabaseAvailability {
  const msg = getErrorMessage(error)
  if (
    /fetch failed/i.test(msg) ||
    /ECONNREFUSED/i.test(msg) ||
    /ENOTFOUND/i.test(msg) ||
    /ETIMEDOUT/i.test(msg) ||
    /EAI_AGAIN/i.test(msg) ||
    /network/i.test(msg)
  ) {
    return 'unreachable'
  }
  return 'unavailable'
}

export function getSupabaseAvailabilityMessage(kind: SupabaseAvailability, resourceLabel: string) {
  if (kind === 'unreachable') {
    return `We can’t reach the ${resourceLabel} right now. Please try again later.`
  }
  return `The ${resourceLabel} is temporarily unavailable. Please try again later.`
}
