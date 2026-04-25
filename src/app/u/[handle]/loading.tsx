export default function ProfileLoading() {
  return (
    <div className="max-w-2xl mx-auto py-8" aria-busy="true" aria-live="polite">
      {/* Profile Header Skeleton */}
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 mb-8 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 w-full">
            <div className="w-20 h-20 bg-gray-200 rounded-full shrink-0"></div>
            <div className="flex-1">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
              <div className="flex items-center space-x-4">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
          <div className="w-24 h-8 bg-gray-200 rounded-full shrink-0"></div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Posts</h2>
      <div className="space-y-6">
        {/* Post Skeletons */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between">
              <div className="w-12 h-6 bg-gray-200 rounded"></div>
              <div className="w-24 h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
