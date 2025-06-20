'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, UserRole } from '@/types'
import AdminLayout from '@/components/AdminLayout'

interface UserWithCount extends User {
  _count: {
    createdTodos: number
  }
}

export default function UsersPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<UserWithCount[]>([])
  const [newUser, setNewUser] = useState({ email: '', password: '', firstName: '', lastName: '', title: '', role: UserRole.MEMBER })
  const [editingUser, setEditingUser] = useState<{ id: string; email: string; password: string; firstName: string; lastName: string; title: string; role: UserRole } | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [sortField, setSortField] = useState<'firstName' | 'lastName' | 'email' | 'role' | 'createdAt' | 'todos'>('firstName')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchUsers()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSort = (field: typeof sortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedUsers = [...users].sort((a, b) => {
    let aValue: any, bValue: any
    
    switch (sortField) {
      case 'firstName':
        aValue = a.firstName || ''
        bValue = b.firstName || ''
        break
      case 'lastName':
        aValue = a.lastName || ''
        bValue = b.lastName || ''
        break
      case 'email':
        aValue = a.email
        bValue = b.email
        break
      case 'role':
        aValue = a.role
        bValue = b.role
        break
      case 'createdAt':
        aValue = new Date(a.createdAt)
        bValue = new Date(b.createdAt)
        break
      case 'todos':
        aValue = a._count.createdTodos
        bValue = b._count.createdTodos
        break
      default:
        return 0
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setCurrentUser(data.user)
        
        // Check if user is superuser - redirect if not
        if (data.user && data.user.role !== 'SUPERUSER') {
          router.push('/admin')
          return
        }
      } else {
        router.push('/')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/')
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUser.email.trim() || !newUser.password.trim() || !newUser.firstName.trim() || !newUser.lastName.trim()) return

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      })

      if (response.ok) {
        setNewUser({ email: '', password: '', firstName: '', lastName: '', title: '', role: UserRole.MEMBER })
        fetchUsers()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create user')
      }
    } catch (error) {
      console.error('Failed to create user:', error)
      alert('Failed to create user')
    }
  }

  const updateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser || !editingUser.email.trim() || !editingUser.firstName.trim() || !editingUser.lastName.trim()) return

    try {
      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: editingUser.email,
          password: editingUser.password || undefined,
          firstName: editingUser.firstName,
          lastName: editingUser.lastName,
          title: editingUser.title,
          role: editingUser.role
        })
      })

      if (response.ok) {
        setEditingUser(null)
        fetchUsers()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update user')
      }
    } catch (error) {
      console.error('Failed to update user:', error)
      alert('Failed to update user')
    }
  }

  const deleteUser = async (id: string) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setDeleteConfirm(null)
        fetchUsers()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete user')
      }
    } catch (error) {
      console.error('Failed to delete user:', error)
      alert('Failed to delete user')
    }
  }

  return (
    <AdminLayout title="User Management">
      {currentUser?.role !== 'SUPERUSER' && (
        <div className="text-center text-red-600">Access denied. Superuser role required.</div>
      )}
      {currentUser?.role === 'SUPERUSER' && (
        <>
        
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New User</h2>
          <form onSubmit={createUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="First Name..."
                  value={newUser.firstName}
                  onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Last Name..."
                  value={newUser.lastName}
                  onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email address..."
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password..."
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Title (optional)..."
                  value={newUser.title}
                  onChange={(e) => setNewUser({ ...newUser, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
            <div>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value={UserRole.MEMBER}>Member</option>
                <option value={UserRole.SUPERUSER}>Superuser</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-md transition-colors"
            >
              Add User
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Users ({users.length})</h2>
          </div>
          {users.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No users found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('firstName')}
                    >
                      <div className="flex items-center gap-2">
                        First Name
                        {sortField === 'firstName' && (
                          <span className="text-gray-400">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('lastName')}
                    >
                      <div className="flex items-center gap-2">
                        Last Name
                        {sortField === 'lastName' && (
                          <span className="text-gray-400">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('email')}
                    >
                      <div className="flex items-center gap-2">
                        Email
                        {sortField === 'email' && (
                          <span className="text-gray-400">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('role')}
                    >
                      <div className="flex items-center gap-2">
                        Role
                        {sortField === 'role' && (
                          <span className="text-gray-400">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('todos')}
                    >
                      <div className="flex items-center gap-2">
                        Todos
                        {sortField === 'todos' && (
                          <span className="text-gray-400">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('createdAt')}
                    >
                      <div className="flex items-center gap-2">
                        Created
                        {sortField === 'createdAt' && (
                          <span className="text-gray-400">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedUsers.map((user) => 
                    editingUser?.id === user.id ? (
                      <tr key={user.id} className="bg-gray-50">
                        <td colSpan={8} className="px-6 py-4">
                          <form onSubmit={updateUser} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <input
                                  type="text"
                                  placeholder="First Name"
                                  value={editingUser.firstName}
                                  onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
                                  required
                                />
                              </div>
                              <div>
                                <input
                                  type="text"
                                  placeholder="Last Name"
                                  value={editingUser.lastName}
                                  onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
                                  required
                                />
                              </div>
                              <div>
                                <input
                                  type="text"
                                  placeholder="Title (optional)"
                                  value={editingUser.title}
                                  onChange={(e) => setEditingUser({ ...editingUser, title: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
                                />
                              </div>
                              <div>
                                <input
                                  type="email"
                                  placeholder="Email"
                                  value={editingUser.email}
                                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
                                  required
                                />
                              </div>
                              <div>
                                <input
                                  type="password"
                                  placeholder="New password (optional)"
                                  value={editingUser.password}
                                  onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
                                />
                              </div>
                              <div>
                                <select
                                  value={editingUser.role}
                                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
                                >
                                  <option value={UserRole.MEMBER}>Member</option>
                                  <option value={UserRole.SUPERUSER}>Superuser</option>
                                </select>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingUser(null)}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        </td>
                      </tr>
                    ) : (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.firstName || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.lastName || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.title || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === 'SUPERUSER' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role === 'SUPERUSER' ? 'Superuser' : 'Member'}
                            </span>
                            {user.id === currentUser?.id && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                You
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user._count.createdTodos}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingUser({ 
                                id: user.id, 
                                email: user.email, 
                                firstName: user.firstName || '', 
                                lastName: user.lastName || '', 
                                title: user.title || '', 
                                password: '', 
                                role: user.role as UserRole 
                              })}
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                            >
                              Edit
                            </button>
                            {user.id !== currentUser?.id && (
                              <>
                                {deleteConfirm === user.id ? (
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => deleteUser(user.id)}
                                      className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs transition-colors"
                                    >
                                      Confirm
                                    </button>
                                    <button
                                      onClick={() => setDeleteConfirm(null)}
                                      className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs transition-colors"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setDeleteConfirm(user.id)}
                                    className="text-red-600 hover:text-red-900 transition-colors"
                                  >
                                    Delete
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        </>
      )}
    </AdminLayout>
  )
}