'use client'

import { useState } from 'react'
import { toggleFollow } from '@/app/actions/interactions'

export function FollowButton({ targetUserId, initialFollowing, disabled }: { targetUserId: string, initialFollowing: boolean, disabled?: boolean }) {
  const [following, setFollowing] = useState(initialFollowing)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFollow = async () => {
    if (disabled) return
    setLoading(true)
    setError(null)
    
    setFollowing(!following)
    
    const res = await toggleFollow(targetUserId, following)
    if (res.error) {
      setFollowing(following)
      setError(res.error)
    }
    setLoading(false)
  }

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button 
        onClick={handleFollow} 
        disabled={loading || disabled}
        aria-pressed={following}
        aria-disabled={loading || disabled}
        title={disabled ? "You must be verified to follow users" : undefined}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
          following 
            ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
            : 'bg-blue-600 text-white hover:bg-blue-700'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {following ? 'Following' : 'Follow'}
      </button>
      {error && (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
