import { safeNextPath as runtimeSafeNextPath } from './routing.mjs'

export const safeNextPath = runtimeSafeNextPath as (value: unknown) => string | null
