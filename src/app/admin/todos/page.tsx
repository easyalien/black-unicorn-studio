'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Todo, User } from '@/types'
import AdminLayout from '@/components/AdminLayout'

export default function TodosPage() {
  const [user, setUser] = useState<User | null>(null)
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState({ title: '', description: '', category: '', isPrivate: false, dueDate: '' })
  const [sortField, setSortField] = useState<'title' | 'category' | 'completed' | 'dueDate' | 'creator'>('title')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null)
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

  return (
    <AdminLayout title="ToDo Management">
      <div className="space-y-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border p-6">
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

        <div className="w-full bg-white rounded-lg shadow-sm border">
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
                            <button
                              onClick={() => setSelectedTodo(todo)}
                              className="text-blue-600 hover:text-blue-800 underline text-left"
                            >
                              {todo.title}
                            </button>
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
      </div>

      {/* Todo Details Modal */}
      {selectedTodo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-black">Todo Details</h2>
                <button
                  onClick={() => setSelectedTodo(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <p className="text-lg text-black">
                    {selectedTodo.title}
                  </p>
                </div>

                {selectedTodo.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <p className={`${selectedTodo.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                      {selectedTodo.description}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <p className="text-gray-900">{selectedTodo.category || 'No category'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedTodo.completed 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedTodo.completed ? 'Completed' : 'Pending'}
                      </span>
                      {selectedTodo.isPrivate && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                          Private
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {selectedTodo.dueDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <p className={`${new Date(selectedTodo.dueDate) < new Date() && !selectedTodo.completed ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                      {new Date(selectedTodo.dueDate).toLocaleDateString()} at {new Date(selectedTodo.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {new Date(selectedTodo.dueDate) < new Date() && !selectedTodo.completed && (
                        <span className="ml-2 text-red-600 font-medium">(Overdue)</span>
                      )}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Created By</label>
                    <p className="text-gray-900">
                      {selectedTodo.user?.firstName ? `${selectedTodo.user.firstName} ${selectedTodo.user.lastName}` : selectedTodo.user?.email || 'Unknown'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Created On</label>
                    <p className="text-gray-900">
                      {new Date(selectedTodo.createdAt).toLocaleDateString()} at {new Date(selectedTodo.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                {selectedTodo.completed && selectedTodo.completedAt && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Completed By</label>
                      <p className="text-gray-900">
                        {selectedTodo.completedByUser ? 
                          (selectedTodo.completedByUser.firstName ? 
                            `${selectedTodo.completedByUser.firstName} ${selectedTodo.completedByUser.lastName}` : 
                            selectedTodo.completedByUser.email
                          ) : 'Unknown'
                        }
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Completed On</label>
                      <p className="text-gray-900">
                        {new Date(selectedTodo.completedAt).toLocaleDateString()} at {new Date(selectedTodo.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedTodo(null)}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-black transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}