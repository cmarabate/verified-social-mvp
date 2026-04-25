'use client'

import { useState } from 'react'
import { createPost } from './actions'

export function PostComposer({ isVerified }: { isVerified: boolean }) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isVerified) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 text-center">
        <p className="text-gray-600 mb-2">You must be verified to post.</p>
        <a href="/verify" className="text-blue-600 font-medium hover:underline">Verify Identity</a>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)
    setError('')

    const formData = new FormData()
    formData.append('content', content)

    const res = await createPost(formData)
    
    if (res?.error) {
      setError(res.error)
    } else {
      setContent('')
    }
    
    setLoading(false)
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <form onSubmit={handleSubmit}>
        <label htmlFor="post-content" className="sr-only">What&apos;s on your mind?</label>
        <textarea
          id="post-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
          rows={3}
          maxLength={500}
          disabled={loading}
          aria-describedby={error ? "post-error" : undefined}
        />
        {error && <p id="post-error" className="text-red-600 text-sm mt-2" role="alert">{error}</p>}
        <div className="flex justify-end mt-3">
          <button
            type="submit"
            disabled={!content.trim() || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  )
}
