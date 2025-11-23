import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

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
    <div className="admin-panel">
      <div className="admin-panel-header">
        <h2 className="admin-panel-title">Admin Dashboard</h2>
        <button onClick={() => setShowAddAdmin(true)}>Add Admin</button>
      </div>

      <div className="admin-panel-content">
        <div className="admin-section">
          <div className="admin-section-header">
            <h3 className="admin-section-title">Recent Activity</h3>
          </div>
          <ul className="activity-log">
            {['alumni', 'student', 'admin'].map(role => {
              const roleUsers = users.filter(u => u.role === role)
              return (
                <li key={role} className="activity-item">
                  <span className="activity-icon">👥</span>
                  <div className="activity-content">
                    <div>{roleUsers.length} {role}s registered</div>
                    <div className="activity-time">Total members</div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        {showAddAdmin && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h3 className="admin-section-title">Add New Admin</h3>
              <button className="text-button" onClick={() => setShowAddAdmin(false)}>Cancel</button>
            </div>
            <form onSubmit={handleAddAdmin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input
                className="form-input"
                placeholder="Full name"
                value={newAdmin.name}
                onChange={e => setNewAdmin(a => ({ ...a, name: e.target.value }))}
                required
              />
              <input
                className="form-input"
                type="email"
                placeholder="Email address"
                value={newAdmin.email}
                onChange={e => setNewAdmin(a => ({ ...a, email: e.target.value }))}
                required
              />
              <input
                className="form-input"
                type="password"
                placeholder="Password"
                value={newAdmin.password}
                onChange={e => setNewAdmin(a => ({ ...a, password: e.target.value }))}
                required
              />
              <button type="submit">Create Admin Account</button>
            </form>
          </div>
        )}

        <div className="admin-section">
          <div className="admin-section-header">
            <h3 className="admin-section-title">All Admins</h3>
          </div>
          <div className="admin-list">
            {users.filter(u => u.role === 'admin').map(admin => (
              <div key={admin.id} className="admin-list-item">
                <div>
                  <div>{admin.name}</div>
                  <div className="small">{admin.email}</div>
                </div>
              </div>
            ))}
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

  if (!user) return <div>Please login to see profile.</div>

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
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2>Profile</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          {user.role !== 'admin' && (
            <button onClick={() => setEditing((v) => !v)} className="btn-edit">
              {editing ? 'Cancel' : 'Edit'}
            </button>
          )}
          <button onClick={handleLogout} className="btn-danger">
            Logout
          </button>
        </div>
      </div>

      {!editing ? (
        <div style={{ display: 'grid', gap: 10 }}>
          <div>
            <strong>Name:</strong> {user.name}
          </div>
          <div>
            <strong>Email:</strong> {user.email}
          </div>
          <div>
            <strong>Role:</strong> {user.role}
          </div>
          {user.role === 'student' && (
            <>
              <div>
                <strong>Year of studying:</strong> {user.yearOfStudying}
              </div>
              <div>
                <strong>Course:</strong> {user.course}
              </div>
            </>
          )}
          {user.role === 'alumni' && (
            <>
              <div>
                <strong>Graduation Year:</strong> {user.graduationYear}
              </div>
              <div>
                <strong>Course Studied:</strong> {user.courseStudied}
              </div>
              <div>
                <strong>Company:</strong> {user.company}
              </div>
            </>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input className="form-input" name="name" placeholder="Full name" value={form.name || ''} onChange={handleChange} />
          <input className="form-input" name="email" placeholder="Email" value={form.email || ''} onChange={handleChange} />
          {user.role === 'student' && (
            <>
              <input className="form-input" name="yearOfStudying" placeholder="Year of studying" type="number" value={form.yearOfStudying || ''} onChange={handleChange} />
              <input className="form-input" name="course" placeholder="Course" value={form.course || ''} onChange={handleChange} />
            </>
          )}
          {user.role === 'alumni' && (
            <>
              <input className="form-input" name="graduationYear" placeholder="Graduation Year" type="number" value={form.graduationYear || ''} onChange={handleChange} />
              <input className="form-input" name="courseStudied" placeholder="Course Studied" value={form.courseStudied || ''} onChange={handleChange} />
              <input className="form-input" name="company" placeholder="Company" value={form.company || ''} onChange={handleChange} />
            </>
          )}
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={save}>Save</button>
            <button onClick={() => setEditing(false)} className="text-button">Cancel</button>
          </div>
        </div>
      )}

      {user.role === 'admin' && (
        <AdminPanel users={users} onAddAdmin={handleAddAdmin} />
      )}
    </section>
  )
}
