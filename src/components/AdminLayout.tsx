'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { User } from '@/types'

interface AdminLayoutProps {
  children: React.ReactNode
  title: string
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        router.push('/')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Image
              src="/logo.png"
              alt="Black Unicorn Design Studio"
              width={40}
              height={40}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => router.push('/')}
            />
            <button
              onClick={() => router.push('/admin')}
              className="text-gray-600 hover:text-black transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-gray-600">Welcome, {user?.firstName || user?.email}</span>
            <button
              onClick={logout}
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-black transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-black text-center mb-8">{title}</h1>
        {children}
      </main>
    </div>
  )
}