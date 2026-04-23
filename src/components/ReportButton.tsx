'use client'

import { useState } from 'react'
import { submitReport } from '@/app/actions/admin'
import { Flag } from 'lucide-react'

export function ReportButton({ targetId, postId, disabled }: { targetId: string, postId?: string, disabled?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (disabled || !reason.trim()) return
    setLoading(true)
    setMessage('')
    
    const formData = new FormData()
    formData.append('target_id', targetId)
    if (postId) formData.append('post_id', postId)
    formData.append('reason', reason)

    const res = await submitReport(formData)
    if (res.error) {
      setMessage(res.error)
    } else {
      setIsOpen(false)
      alert('Report submitted successfully.')
    }
    setLoading(false)
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        disabled={disabled}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 disabled:opacity-50 transition-colors"
        title="Report"
      >
        <Flag className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">Report Content</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for report</label>
                <textarea
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please describe why you are reporting this content..."
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 resize-none"
                  rows={4}
                />
              </div>
              {message && <p className="text-red-600 text-sm mb-4">{message}</p>}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !reason.trim()}
                  className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
