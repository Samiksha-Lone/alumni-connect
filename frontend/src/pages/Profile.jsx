import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const API_BASE = import.meta.env.VITE_API_BASE || 'https://alumni-connect-backend-hrsc.onrender.com'

function AdminPanel({ users, fetchAllUsers }) {
  const [showAddAdmin, setShowAddAdmin] = useState(false)
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  async function handleAddAdmin(e) {
    e.preventDefault()
    setLoading(true)
    try {
      // Role is hardcoded to admin for this specific form
      await axios.post(`${API_BASE}/auth/register`, { ...newAdmin, role: 'admin' })
      setNewAdmin({ name: '', email: '', password: '' })
      setShowAddAdmin(false)
      fetchAllUsers() // Refresh the global list
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create admin")
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    { label: 'alumni', icon: '👥', color: 'bg-blue-100 text-blue-700' },
    { label: 'student', icon: '📚', color: 'bg-green-100 text-green-700' },
    { label: 'admin', icon: '⚙️', color: 'bg-purple-100 text-purple-700' }
  ]

  return (
    <div className="pt-12 mt-12 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold dark:text-white">Management Console</h2>
        <button 
          onClick={() => setShowAddAdmin(!showAddAdmin)} 
          className="px-4 py-2 font-medium text-white transition-opacity rounded-lg bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:opacity-90"
        >
          {showAddAdmin ? 'Close Form' : 'Add New Admin'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3">
        {stats.map(s => (
          <div key={s.label} className="p-6 bg-white border shadow-sm dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl">
            <span className="text-2xl">{s.icon}</span>
            <div className="mt-2 text-3xl font-bold dark:text-white">
              {users.filter(u => u.role === s.label).length}
            </div>
            <p className="text-sm capitalize text-slate-500">{s.label}s Enrolled</p>
          </div>
        ))}
      </div>

      {showAddAdmin && (
        <Card className="p-6 mb-8 animate-in fade-in slide-in-from-top-4">
          <form onSubmit={handleAddAdmin} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <input className="form-input" placeholder="Full Name" value={newAdmin.name} onChange={e => setNewAdmin({...newAdmin, name: e.target.value})} required />
            <input className="form-input" type="email" placeholder="Email" value={newAdmin.email} onChange={e => setNewAdmin({...newAdmin, email: e.target.value})} required />
            <input className="form-input" type="password" placeholder="Password" value={newAdmin.password} onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} required />
            <Button disabled={loading} className="sm:col-span-3">{loading ? 'Creating...' : 'Register Admin Account'}</Button>
          </form>
        </Card>
      )}
    </div>
  )
}

export default function Profile() {
  const { user, users, setUser, logout, fetchUsers, token } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) setForm({ ...user })
  }, [user])

  if (!user) return <div className="p-20 text-center text-slate-500">Authentication required...</div>

  // async function handleSave() {
  //   setLoading(true)
  //   try {
  //     const res = await axios.put(`${API_BASE}/users/${user._id}`, form)
  //     setUser(res.data)
  //     setEditing(false)
  //     alert("Profile updated successfully!")
  //   } catch (error) {
  //     alert(error.response?.data?.message || "Update failed")
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  async function handleSave() {
  setLoading(true)
  try {
    const res = await axios.put(
      `/users/${user._id}`,
      form,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    setUser(res.data)
    setEditing(false)
    alert("Profile updated successfully!")
  } catch (error) {
    alert(error.response?.data?.message || "Update failed")
  } finally {
    setLoading(false)
  }
}

  return (
    <section className="max-w-4xl px-6 py-12 mx-auto">
      <div className="flex flex-col items-start justify-between gap-6 mb-12 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-20 h-20 text-3xl font-bold text-white rounded-full shadow-lg bg-gradient-to-tr from-blue-600 to-indigo-600">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold dark:text-white">{user.name}</h1>
            <p className="capitalize text-slate-500">{user.role} Member</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setEditing(!editing)}>
            {editing ? 'Cancel' : 'Edit Profile'}
          </Button>
          <Button onClick={logout} className="text-white bg-red-500 hover:bg-red-600">Logout</Button>
        </div>
      </div>

      <Card className="overflow-hidden bg-white border-none shadow-xl dark:bg-slate-900">
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <ProfileField label="Full Name" name="name" value={form.name} editing={editing} onChange={setForm} />
            <ProfileField label="Email Address" name="email" value={form.email} editing={editing} onChange={setForm} type="email" />
            
            {user.role === 'student' && (
              <>
                <ProfileField label="Year of Study" name="yearOfStudying" value={form.yearOfStudying} editing={editing} onChange={setForm} type="number" />
                <ProfileField label="Course Name" name="course" value={form.course} editing={editing} onChange={setForm} />
              </>
            )}

            {user.role === 'alumni' && (
              <>
                <ProfileField label="Graduation Year" name="graduationYear" value={form.graduationYear} editing={editing} onChange={setForm} type="number" />
                <ProfileField label="Current Company" name="company" value={form.company} editing={editing} onChange={setForm} />
                <ProfileField label="Course Studied" name="courseStudied" value={form.courseStudied} editing={editing} onChange={setForm} className="md:col-span-2" />
              </>
            )}
          </div>

          {editing && (
            <Button onClick={handleSave} disabled={loading} className="w-full py-4 text-lg">
              {loading ? 'Saving Changes...' : 'Update Profile Information'}
            </Button>
          )}
        </div>
      </Card>

      {user.role === 'admin' && (
        <AdminPanel users={users} fetchAllUsers={fetchUsers} />
      )}
    </section>
  )
}

// Helper component for clean rendering
function ProfileField({ label, name, value, editing, onChange, type = "text", className = "" }) {
  return (
    <div className={className}>
      <label className="block mb-2 text-xs font-bold tracking-wider uppercase text-slate-400">{label}</label>
      {editing ? (
        <input 
          type={type}
          className="w-full p-3 transition-all border outline-none rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500"
          value={value || ''}
          onChange={(e) => onChange(prev => ({ ...prev, [name]: e.target.value }))}
        />
      ) : (
        <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">{value || 'Not provided'}</p>
      )}
    </div>
  )
}