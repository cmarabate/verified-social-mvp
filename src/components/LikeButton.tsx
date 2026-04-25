'use client'

import { useState } from 'react'
import { toggleLike } from '@/app/actions/interactions'
import { Heart } from 'lucide-react'

export function LikeButton({ postId, initialLiked, initialCount, disabled }: { postId: string, initialLiked: boolean, initialCount: number, disabled?: boolean }) {
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)

  const handleLike = async () => {
    if (disabled) return
    setLoading(true)
    
    // Optimistic update
    setLiked(!liked)
    setCount(c => liked ? c - 1 : c + 1)
    
    const res = await toggleLike(postId, liked)
    if (res.error) {
      // Revert on error
      setLiked(liked)
      setCount(count)
      alert(res.error)
    }
    setLoading(false)
  }

  return (
    <button 
      onClick={handleLike} 
      disabled={loading || disabled}
      aria-label={liked ? `Unlike post (${count} likes)` : `Like post (${count} likes)`}
      aria-pressed={liked}
      aria-disabled={loading || disabled}
      title={disabled ? "You must be verified to like posts" : ""}
      className={`flex items-center gap-1 text-sm rounded-md px-2 py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 ${liked ? 'text-red-500' : 'text-gray-500 hover:text-gray-700'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <Heart aria-hidden="true" className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
      <span>{count}</span>
      <span className="sr-only">likes</span>
    </button>
  )
}
