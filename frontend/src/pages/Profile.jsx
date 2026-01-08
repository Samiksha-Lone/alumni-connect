import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/useToast'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const API_BASE = import.meta.env.VITE_API_BASE || 'https://alumni-connect-backend-hrsc.onrender.com'

export default function Profile() {
  const { user, logout, users, fetchAllUsers } = useAuth()  // ✅ Added missing users, fetchAllUsers
  const { success, error } = useToast()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
  const [updating, setUpdating] = useState(false)
  const [resumeFile, setResumeFile] = useState(null)
  const [resumeUploading, setResumeUploading] = useState(false)

  useEffect(() => {
    if (user) setForm({ ...user })
  }, [user])

  if (!user) return <div className="p-20 text-center text-slate-500">Authentication required...</div>

  const handleSave = async () => {
    if (!user?._id) {
      error('Please refresh and login again.')
      return
    }

    setUpdating(true)
    try {
      const res = await axios.put(`${API_BASE}/users/${user._id}`, form, {
        withCredentials: true
      })
      
      setForm(res.data)
      success('Profile updated successfully! ✅')
      setEditing(false)
    } catch (err) {
      console.error('Update error:', err)
      if (err.response?.status === 401) {
        error('Session expired. Please refresh and login.')
        logout()
      } else {
        error(err.response?.data?.message || 'Update failed')
      }
    } finally {
      setUpdating(false)
    }
  }

  const handleResumeUpload = async () => {
    if (!resumeFile) {
      error('Please select a resume file')
      return
    }

    const formData = new FormData()
    formData.append('resume', resumeFile)

    setResumeUploading(true)
    try {
      await axios.post(`${API_BASE}/users/${user._id}/upload-resume`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      })
      
      success('Resume uploaded successfully! 📄')
      setResumeFile(null)
      fetchAllUsers()  // Refresh to update resumeUrl
    } catch (err) {
      error(err.response?.data?.message || 'Upload failed')
    } finally {
      setResumeUploading(false)
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
                <ProfileSelectField
                  label="Year of Study"
                  name="yearOfStudying"
                  value={form.yearOfStudying}
                  editing={editing}
                  onChange={setForm}
                  options={[
                    { value: '', label: 'Select Year' },
                    { value: '1', label: '1st Year' },
                    { value: '2', label: '2nd Year' },
                    { value: '3', label: '3rd Year' },
                    { value: '4', label: '4th Year' }
                  ]}
                />
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

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold dark:text-white">Resume / CV</h3>
            <div className="flex flex-col gap-4 md:flex-row">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResumeFile(e.target.files[0])}
                className="flex-1 p-3 border rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800"
              />
              <Button 
                onClick={handleResumeUpload} 
                disabled={!resumeFile || resumeUploading}
                className="px-8 whitespace-nowrap"
              >
                {resumeUploading ? 'Uploading...' : 'Upload Resume'}
              </Button>
            </div>
            {user.resumeUrl && (
              <a 
                href={user.resumeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block mt-2 text-sm text-blue-600 hover:underline"
              >
                📄 View Current Resume
              </a>
            )}
          </Card>

          {editing && (
            <Button onClick={handleSave} disabled={updating} className="w-full py-4 text-lg">
              {updating ? 'Saving Changes...' : 'Update Profile Information'}
            </Button>
          )}
        </div>
      </Card>

      {user.role === 'admin' && (
        <AdminPanel users={users} fetchAllUsers={fetchAllUsers} />  // ✅ Fixed props + function name
      )}
    </section>
  )
}

function AdminPanel({ fetchAllUsers }) {
  const { success, error } = useToast()
  const [showAddAdmin, setShowAddAdmin] = useState(false)
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  async function handleAddAdmin(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post(`${API_BASE}/auth/register`, { ...newAdmin, role: 'admin' }, {
        withCredentials: true
      })
      
      success('✅ New admin created successfully!')
      setNewAdmin({ name: '', email: '', password: '' })
      setShowAddAdmin(false)
      fetchAllUsers()
    } catch (err) {
      error(err.response?.data?.message || 'Failed to create admin')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mt-8 overflow-hidden bg-white border-none shadow-xl dark:bg-slate-900">
      <div className="p-8">
        <h2 className="mb-6 text-2xl font-bold dark:text-white">Admin Controls</h2>
        <Button 
          onClick={() => setShowAddAdmin(!showAddAdmin)} 
          className="px-6 mb-6"
          variant="secondary"
        >
          {showAddAdmin ? 'Cancel' : 'Add New Admin'}
        </Button>
        
        {showAddAdmin && (
          <form onSubmit={handleAddAdmin} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <input
                type="text"
                placeholder="Full Name"
                value={newAdmin.name}
                onChange={(e) => setNewAdmin(prev => ({ ...prev, name: e.target.value }))}
                className="p-3 border rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin(prev => ({ ...prev, email: e.target.value }))}
                className="p-3 border rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={newAdmin.password}
                onChange={(e) => setNewAdmin(prev => ({ ...prev, password: e.target.value }))}
                className="p-3 border rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Creating...' : 'Create Admin'}
            </Button>
          </form>
        )}
      </div>
    </Card>
  )
}

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

function ProfileSelectField({ label, name, value, editing, onChange, options, className = "" }) {
  return (
    <div className={className}>
      <label className="block mb-2 text-xs font-bold tracking-wider uppercase text-slate-400">{label}</label>
      {editing ? (
        <select 
          className="w-full p-3 transition-all border outline-none rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500"
          value={value || ''}
          onChange={(e) => onChange(prev => ({ ...prev, [name]: e.target.value }))}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
          {options.find(o => o.value === value)?.label || 'Not provided'}
        </p>
      )}
    </div>
  )
}
