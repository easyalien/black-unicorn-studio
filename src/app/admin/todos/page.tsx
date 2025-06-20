'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Todo, User } from '@/types'

export default function TodosPage() {
  const [user, setUser] = useState<User | null>(null)
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [newTodo, setNewTodo] = useState({ title: '', description: '', category: '', isPrivate: false, dueDate: '' })
  const [sortField, setSortField] = useState<'title' | 'category' | 'completed' | 'dueDate' | 'createdAt' | 'completedAt' | 'creator'>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchTodos()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSort = (field: typeof sortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedTodos = [...todos].sort((a, b) => {
    let aValue: any, bValue: any
    
    switch (sortField) {
      case 'title':
        aValue = a.title.toLowerCase()
        bValue = b.title.toLowerCase()
        break
      case 'category':
        aValue = a.category?.toLowerCase() || ''
        bValue = b.category?.toLowerCase() || ''
        break
      case 'completed':
        aValue = a.completed ? 1 : 0
        bValue = b.completed ? 1 : 0
        break
      case 'dueDate':
        aValue = a.dueDate ? new Date(a.dueDate) : new Date('9999-12-31')
        bValue = b.dueDate ? new Date(b.dueDate) : new Date('9999-12-31')
        break
      case 'createdAt':
        aValue = new Date(a.createdAt)
        bValue = new Date(b.createdAt)
        break
      case 'completedAt':
        aValue = a.completedAt ? new Date(a.completedAt) : new Date('9999-12-31')
        bValue = b.completedAt ? new Date(b.completedAt) : new Date('9999-12-31')
        break
      case 'creator':
        aValue = a.user?.firstName ? `${a.user.firstName} ${a.user.lastName}` : a.user?.email || ''
        bValue = b.user?.firstName ? `${b.user.firstName} ${b.user.lastName}` : b.user?.email || ''
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

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos')
      if (response.ok) {
        const data = await response.json()
        setTodos(data.todos)
      }
    } catch (error) {
      console.error('Failed to fetch todos:', error)
    }
  }

  const createTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.title.trim()) return

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo)
      })

      if (response.ok) {
        setNewTodo({ title: '', description: '', category: '', isPrivate: false, dueDate: '' })
        fetchTodos()
      }
    } catch (error) {
      console.error('Failed to create todo:', error)
    }
  }

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        fetchTodos()
      }
    } catch (error) {
      console.error('Failed to update todo:', error)
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchTodos()
      }
    } catch (error) {
      console.error('Failed to delete todo:', error)
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
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
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
            <span className="text-gray-600">Welcome, {user?.email}</span>
            <button
              onClick={logout}
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-black transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="p-6">
        <h1 className="text-3xl font-bold text-black text-center mb-8">ToDo Management</h1>
        
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New ToDo</h2>
          <form onSubmit={createTodo} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="ToDo title..."
                value={newTodo.title}
                onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            <div>
              <textarea
                placeholder="Description (optional)..."
                value={newTodo.description}
                onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                rows={3}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Category (optional)..."
                value={newTodo.category}
                onChange={(e) => setNewTodo({ ...newTodo, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date (optional)
              </label>
              <input
                type="datetime-local"
                id="dueDate"
                value={newTodo.dueDate}
                onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPrivate"
                checked={newTodo.isPrivate}
                onChange={(e) => setNewTodo({ ...newTodo, isPrivate: e.target.checked })}
                className="w-4 h-4 text-black bg-gray-100 border-gray-300 rounded focus:ring-black focus:ring-2"
              />
              <label htmlFor="isPrivate" className="ml-2 text-sm text-gray-600">
                Make this todo private (only visible to me)
              </label>
            </div>
            <button
              type="submit"
              className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-md transition-colors"
            >
              Add Todo
            </button>
          </form>
        </div>

        <div className="w-[90%] mx-auto bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">ToDo List ({todos.length})</h2>
          </div>
          {todos.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No todos yet. Add one above to get started!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('title')}
                    >
                      <div className="flex items-center gap-2">
                        Title
                        {sortField === 'title' && (
                          <span className="text-gray-400">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('category')}
                    >
                      <div className="flex items-center gap-2">
                        Category
                        {sortField === 'category' && (
                          <span className="text-gray-400">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('dueDate')}
                    >
                      <div className="flex items-center gap-2">
                        Due Date
                        {sortField === 'dueDate' && (
                          <span className="text-gray-400">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('creator')}
                    >
                      <div className="flex items-center gap-2">
                        Creator
                        {sortField === 'creator' && (
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
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('completedAt')}
                    >
                      <div className="flex items-center gap-2">
                        Completed
                        {sortField === 'completedAt' && (
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
                  {sortedTodos.map((todo) => (
                    <tr key={todo.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col items-center gap-1">
                          <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={(e) => updateTodo(todo.id, { completed: e.target.checked })}
                            className="w-4 h-4 text-black"
                          />
                          <div className="flex flex-col gap-1">
                            {todo.completed && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                Complete
                              </span>
                            )}
                            {todo.isPrivate && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                Private
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <h3 className={`font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-black'}`}>
                            {todo.title}
                          </h3>
                          {todo.description && (
                            <p className={`text-sm mt-1 ${todo.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                              {todo.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {todo.category || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {todo.dueDate ? (
                          <div className={`${new Date(todo.dueDate) < new Date() && !todo.completed ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                            {new Date(todo.dueDate).toLocaleDateString()}
                            <br />
                            <span className="text-xs text-gray-500">
                              {new Date(todo.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {new Date(todo.dueDate) < new Date() && !todo.completed && (
                              <div className="text-xs text-red-600 font-medium">Overdue</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {todo.user?.firstName ? `${todo.user.firstName} ${todo.user.lastName}` : todo.user?.email || '-'}
                        {todo.userId !== user?.id && (
                          <div className="text-xs text-blue-600 mt-1">Other User</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          {new Date(todo.createdAt).toLocaleDateString()}
                          <br />
                          <span className="text-xs">
                            {new Date(todo.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {todo.completed && todo.completedAt ? (
                          <div className="text-green-600">
                            {new Date(todo.completedAt).toLocaleDateString()}
                            <br />
                            <span className="text-xs">
                              {new Date(todo.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {todo.completedByUser && (
                              <div className="text-xs text-gray-500 mt-1">
                                by {todo.completedByUser.firstName ? `${todo.completedByUser.firstName} ${todo.completedByUser.lastName}` : todo.completedByUser.email}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {todo.userId === user?.id && (
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => updateTodo(todo.id, { isPrivate: !todo.isPrivate })}
                              className="text-blue-600 hover:text-blue-900 text-xs transition-colors"
                            >
                              {todo.isPrivate ? 'Make Public' : 'Make Private'}
                            </button>
                            <button
                              onClick={() => deleteTodo(todo.id)}
                              className="text-red-600 hover:text-red-900 text-xs transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                }
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}