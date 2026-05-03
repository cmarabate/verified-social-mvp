export default function Loading() {
  return (
    <div className="mx-auto max-w-2xl py-12">
      <div className="animate-pulse space-y-4" aria-busy="true" aria-live="polite">
        <div className="h-6 w-40 rounded bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-5/6 rounded bg-gray-200" />
        <div className="h-4 w-2/3 rounded bg-gray-200" />
      </div>
      <span className="sr-only">Loading</span>
    </div>
  )
}
