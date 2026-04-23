'use client'

import { useState } from 'react'
import { toggleFollow } from '@/app/actions/interactions'

export function FollowButton({ targetUserId, initialFollowing, disabled }: { targetUserId: string, initialFollowing: boolean, disabled?: boolean }) {
  const [following, setFollowing] = useState(initialFollowing)
  const [loading, setLoading] = useState(false)

  const handleFollow = async () => {
    if (disabled) return
    setLoading(true)
    
    setFollowing(!following)
    
    const res = await toggleFollow(targetUserId, following)
    if (res.error) {
      setFollowing(following)
      alert(res.error)
    }
    setLoading(false)
  }

  return (
    <button 
      onClick={handleFollow} 
      disabled={loading || disabled}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
        following 
          ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
          : 'bg-blue-600 text-white hover:bg-blue-700'
      } disabled:opacity-50`}
    >
      {following ? 'Following' : 'Follow'}
    </button>
  )
}
