'use client'

import { useState } from 'react'
import { updateProfile } from './actions'

export function ProfileForm({ initialHandle, initialName }: { initialHandle: string; initialName: string }) {
  const [handle, setHandle] = useState(initialHandle)
  const [name, setName] = useState(initialName)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const formData = new FormData()
    formData.append('handle', handle)
    formData.append('display_name', name)

    const res = await updateProfile(formData)
    if (res?.error) {
      setMessage(`Error: ${res.error}`)
    } else {
      setMessage('Profile updated successfully!')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="profile-handle" className="block text-sm font-medium text-gray-700">Handle (used for /u/[handle])</label>
        <input
          id="profile-handle"
          type="text"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
          aria-describedby={message && message.startsWith('Error') ? "profile-message" : undefined}
        />
      </div>
      <div>
        <label htmlFor="profile-name" className="block text-sm font-medium text-gray-700">Display Name</label>
        <input
          id="profile-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
          aria-describedby={message && message.startsWith('Error') ? "profile-message" : undefined}
        />
      </div>
      {message && <p id="profile-message" className={`text-sm ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`} role={message.startsWith('Error') ? 'alert' : 'status'}>{message}</p>}
      <button
        type="submit"
        disabled={loading}
        className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 py-2 px-4 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  )
}
