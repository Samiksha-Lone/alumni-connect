import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

function AdminPanel({ users, onAddAdmin }) {
  const [showAddAdmin, setShowAddAdmin] = useState(false)
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' })

  function handleAddAdmin(e) {
    e.preventDefault()
    onAddAdmin(newAdmin)
    setNewAdmin({ name: '', email: '', password: '' })
    setShowAddAdmin(false)
  }

  return (
    <div className="pt-12 mt-12 border-t border-slate-200 dark:border-slate-700">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Admin Dashboard</h2>
          <button onClick={() => setShowAddAdmin(true)} className="btn-primary">
            Add Admin
          </button>
        </div>

        <div className="space-y-6">
          <div className="p-6 card-base">
            <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Member Statistics</h3>
            <ul className="space-y-3">
              {['alumni', 'student', 'admin'].map(role => {
                const roleUsers = users.filter(u => u.role === role)
                return (
                  <li key={role} className="flex items-start gap-4 pb-3 border-b border-slate-200 dark:border-slate-700 last:border-b-0 last:pb-0">
                    <span className="text-2xl">👥</span>
                    <div>
                      <div className="font-medium text-slate-900 dark:text-slate-100">{roleUsers.length} {role}s registered</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">Total members</div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          {showAddAdmin && (
            <div className="p-6 card-base">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Add New Admin</h3>
                <button
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                  onClick={() => setShowAddAdmin(false)}
                >
                  Cancel
                </button>
              </div>
              <form onSubmit={handleAddAdmin} className="space-y-4">
                <input
                  className="w-full px-4 py-2 border rounded-lg bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Full name"
                  value={newAdmin.name}
                  onChange={e => setNewAdmin(a => ({ ...a, name: e.target.value }))}
                  required
                />
                <input
                  className="w-full px-4 py-2 border rounded-lg bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
                  type="email"
                  placeholder="Email address"
                  value={newAdmin.email}
                  onChange={e => setNewAdmin(a => ({ ...a, email: e.target.value }))}
                  required
                />
                <input
                  className="w-full px-4 py-2 border rounded-lg bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
                  type="password"
                  placeholder="Password"
                  value={newAdmin.password}
                  onChange={e => setNewAdmin(a => ({ ...a, password: e.target.value }))}
                  required
                />
                <button type="submit" className="w-full btn-primary">
                  Create Admin Account
                </button>
              </form>
            </div>
          )}

          <div className="p-6 card-base">
            <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">All Admins</h3>
            <div className="space-y-3">
              {users.filter(u => u.role === 'admin').map(admin => (
                <div key={admin.id} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <div className="font-medium text-slate-900 dark:text-slate-100">{admin.name}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{admin.email}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Profile() {
  const { user, users, setUsers, setUser, logout, token } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(() => (user ? { ...user } : {}))

  useEffect(() => {
    setForm(user ? { ...user } : {})
  }, [user])

  if (!user) return <div className="p-6 text-center text-slate-600 dark:text-slate-400">Please login to see profile.</div>

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  async function save() {
    try {
      const updateData = {
        name: form.name,
        email: form.email
      }
      
      if (user.role === 'student') {
        updateData.yearOfStudying = form.yearOfStudying
        updateData.course = form.course
      } else if (user.role === 'alumni') {
        updateData.graduationYear = form.graduationYear
        updateData.courseStudied = form.courseStudied
        updateData.company = form.company
      }
      
      const res = await axios.put(`/users/${user._id}`, updateData, { headers: { Authorization: `Bearer ${token}` } })
      
      if (res.status === 200 && res.data) {
        setUser(res.data)
        setEditing(false)
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Failed to save profile: ' + (error.response?.data?.message || error.message))
    }
  }

  function handleLogout() {
    logout()
  }

  function handleAddAdmin(newAdmin) {
    const adminUser = {
      ...newAdmin,
      id: Date.now().toString(),
      role: 'admin',
    }
    setUsers(prev => [...prev, adminUser])
  }

  return (
    <section className="max-w-4xl px-6 py-12 mx-auto">
      <div className="flex items-start justify-between gap-6 mb-8">
        <h2 className="text-4xl font-bold">Profile</h2>
        <div className="flex gap-3">
          {user.role !== 'admin' && (
            <button onClick={() => setEditing((v) => !v)} className="btn-secondary">
              {editing ? 'Cancel' : 'Edit'}
            </button>
          )}
          <Button onClick={handleLogout} className="" style={{background:'#ef4444', color:'#fff'}}>
            Logout
          </Button>
        </div>
      </div>

      {!editing ? (
        <Card className="p-8">
          <div className="space-y-6">
            <div className="pb-6 border-b border-slate-200 dark:border-slate-700">
              <p className="mb-1 text-sm text-slate-500 dark:text-slate-400">Name</p>
              <p className="text-lg font-medium text-slate-900 dark:text-slate-100">{user.name}</p>
            </div>
            <div className="pb-6 border-b border-slate-200 dark:border-slate-700">
              <p className="mb-1 text-sm text-slate-500 dark:text-slate-400">Email</p>
              <p className="text-lg font-medium text-slate-900 dark:text-slate-100">{user.email}</p>
            </div>
            <div className="pb-6 border-b border-slate-200 dark:border-slate-700">
              <p className="mb-1 text-sm text-slate-500 dark:text-slate-400">Role</p>
              <p className="text-lg font-medium capitalize text-slate-900 dark:text-slate-100">{user.role}</p>
            </div>
            {user.role === 'student' && (
              <>
                <div className="pb-6 border-b border-slate-200 dark:border-slate-700">
                  <p className="mb-1 text-sm text-slate-500 dark:text-slate-400">Year of Study</p>
                  <p className="text-lg font-medium text-slate-900 dark:text-slate-100">{user.yearOfStudying}</p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-slate-500 dark:text-slate-400">Course</p>
                  <p className="text-lg font-medium text-slate-900 dark:text-slate-100">{user.course}</p>
                </div>
              </>
            )}
            {user.role === 'alumni' && (
              <>
                <div className="pb-6 border-b border-slate-200 dark:border-slate-700">
                  <p className="mb-1 text-sm text-slate-500 dark:text-slate-400">Graduation Year</p>
                  <p className="text-lg font-medium text-slate-900 dark:text-slate-100">{user.graduationYear}</p>
                </div>
                <div className="pb-6 border-b border-slate-200 dark:border-slate-700">
                  <p className="mb-1 text-sm text-slate-500 dark:text-slate-400">Course Studied</p>
                  <p className="text-lg font-medium text-slate-900 dark:text-slate-100">{user.courseStudied}</p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-slate-500 dark:text-slate-400">Company</p>
                  <p className="text-lg font-medium text-slate-900 dark:text-slate-100">{user.company}</p>
                </div>
              </>
            )}
          </div>
        </Card>
      ) : (
        <Card className="p-8">
          <div className="space-y-4">
            <input 
              name="name" 
              placeholder="Full name" 
              value={form.name || ''} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border rounded-lg bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary" 
            />
            <input 
              name="email" 
              type="email"
              placeholder="Email" 
              value={form.email || ''} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border rounded-lg bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary" 
            />
            {user.role === 'student' && (
              <>
                <input 
                  name="yearOfStudying" 
                  placeholder="Year of studying" 
                  type="number" 
                  value={form.yearOfStudying || ''} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border rounded-lg bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary" 
                />
                <input 
                  name="course" 
                  placeholder="Course" 
                  value={form.course || ''} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border rounded-lg bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary" 
                />
              </>
            )}
            {user.role === 'alumni' && (
              <>
                <input 
                  name="graduationYear" 
                  placeholder="Graduation Year" 
                  type="number" 
                  value={form.graduationYear || ''} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border rounded-lg bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary" 
                />
                <input 
                  name="courseStudied" 
                  placeholder="Course Studied" 
                  value={form.courseStudied || ''} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border rounded-lg bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary" 
                />
                <input 
                  name="company" 
                  placeholder="Company" 
                  value={form.company || ''} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border rounded-lg bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary" 
                />
              </>
            )}
            <div className="flex gap-3 pt-4">
              <Button onClick={save} className="flex-1">Save Changes</Button>
              <Button variant="secondary" onClick={() => setEditing(false)} className="flex-1">Cancel</Button>
            </div>
          </div>
        </Card>
      )}

      {user.role === 'admin' && (
        <AdminPanel users={users} onAddAdmin={handleAddAdmin} />
      )}
    </section>
  )
}
