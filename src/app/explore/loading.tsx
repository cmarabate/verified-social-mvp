export default function ExploreLoading() {
  return (
    <div className="max-w-2xl mx-auto py-8" aria-busy="true" aria-live="polite">
      <h1 className="text-3xl font-bold mb-8">Explore</h1>
      
      {/* Composer Skeleton */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 animate-pulse">
        <div className="w-full h-24 bg-gray-200 rounded-md mb-3"></div>
        <div className="flex justify-end">
          <div className="w-20 h-10 bg-gray-200 rounded-md"></div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Post Skeletons */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/6"></div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between">
              <div className="w-12 h-6 bg-gray-200 rounded"></div>
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
