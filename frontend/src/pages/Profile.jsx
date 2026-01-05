// import React, { useState, useEffect } from 'react'
// import axios from 'axios'
// import { useAuth } from '../context/AuthContext'
// import Card from '../components/ui/Card'
// import Button from '../components/ui/Button'

// function AdminPanel({ users, onAddAdmin }) {
//   const [showAddAdmin, setShowAddAdmin] = useState(false)
//   const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' })

//   function handleAddAdmin(e) {
//     e.preventDefault()
//     onAddAdmin(newAdmin)
//     setNewAdmin({ name: '', email: '', password: '' })
//     setShowAddAdmin(false)
//   }

//   return (
//     <div className="pt-12 mt-12 border-t border-slate-200 dark:border-slate-700">
//       <div className="mb-8">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Admin Dashboard</h2>
//           <button onClick={() => setShowAddAdmin(true)} className="btn-primary">
//             Add Admin
//           </button>
//         </div>

//         <div className="space-y-6">
//           <div className="p-6 bg-white border rounded-lg border-slate-200 dark:border-slate-800 dark:bg-slate-950">
//             <h3 className="mb-6 text-lg font-semibold text-slate-900 dark:text-slate-50">Member Statistics</h3>
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//               {['alumni', 'student', 'admin'].map(role => {
//                 const roleUsers = users.filter(u => u.role === role)
//                 const icons = { alumni: '👥', student: '📚', admin: '⚙️' }
//                 return (
//                   <div key={role} className="p-5 transition-colors duration-150 border rounded-lg border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800">
//                     <div className="mb-3 text-3xl">{icons[role]}</div>
//                     <div className="mb-1 text-2xl font-semibold text-slate-900 dark:text-slate-50">{roleUsers.length}</div>
//                     <div className="text-sm capitalize text-slate-600 dark:text-slate-400">{role}s registered</div>
//                   </div>
//                 )
//               })}
//             </div>
//           </div>

//           {showAddAdmin && (
//             <div className="p-6 card-base">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Add New Admin</h3>
//                 <button
//                   className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
//                   onClick={() => setShowAddAdmin(false)}
//                 >
//                   Cancel
//                 </button>
//               </div>
//               <form onSubmit={handleAddAdmin} className="space-y-4">
//                 <input
//                   className="w-full px-4 py-2 border rounded-lg bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
//                   placeholder="Full name"
//                   value={newAdmin.name}
//                   onChange={e => setNewAdmin(a => ({ ...a, name: e.target.value }))}
//                   required
//                 />
//                 <input
//                   className="w-full px-4 py-2 border rounded-lg bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
//                   type="email"
//                   placeholder="Email address"
//                   value={newAdmin.email}
//                   onChange={e => setNewAdmin(a => ({ ...a, email: e.target.value }))}
//                   required
//                 />
//                 <input
//                   className="w-full px-4 py-2 border rounded-lg bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
//                   type="password"
//                   placeholder="Password"
//                   value={newAdmin.password}
//                   onChange={e => setNewAdmin(a => ({ ...a, password: e.target.value }))}
//                   required
//                 />
//                 <button type="submit" className="w-full btn-primary">
//                   Create Admin Account
//                 </button>
//               </form>
//             </div>
//           )}

//           <div className="p-6 card-base">
//             <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">All Admins</h3>
//             <div className="space-y-3">
//               {users.filter(u => u.role === 'admin').map(admin => (
//                 <div key={admin.id} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
//                   <div className="font-medium text-slate-900 dark:text-slate-100">{admin.name}</div>
//                   <div className="text-sm text-slate-500 dark:text-slate-400">{admin.email}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default function Profile() {
//   const { user, users, setUsers, setUser, logout, token } = useAuth()
//   const [editing, setEditing] = useState(false)
//   const [form, setForm] = useState(() => (user ? { ...user } : {}))

//   useEffect(() => {
//     setForm(user ? { ...user } : {})
//   }, [user])

//   if (!user) return <div className="p-6 text-center text-slate-600 dark:text-slate-400">Please login to see profile.</div>

//   function handleChange(e) {
//     const { name, value } = e.target
//     setForm((f) => ({ ...f, [name]: value }))
//   }

//   async function save() {
//     try {
//       const updateData = {
//         name: form.name,
//         email: form.email
//       }
      
//       if (user.role === 'student') {
//         updateData.yearOfStudying = form.yearOfStudying
//         updateData.course = form.course
//       } else if (user.role === 'alumni') {
//         updateData.graduationYear = form.graduationYear
//         updateData.courseStudied = form.courseStudied
//         updateData.company = form.company
//       }
      
//       const res = await axios.put(`/users/${user._id}`, updateData, { headers: { Authorization: `Bearer ${token}` } })
      
//       if (res.status === 200 && res.data) {
//         setUser(res.data)
//         setEditing(false)
//       }
//     } catch (error) {
//       console.error('Error saving profile:', error)
//       alert('Failed to save profile: ' + (error.response?.data?.message || error.message))
//     }
//   }

//   function handleLogout() {
//     logout()
//   }

//   function handleAddAdmin(newAdmin) {
//     const adminUser = {
//       ...newAdmin,
//       id: Date.now().toString(),
//       role: 'admin',
//     }
//     setUsers(prev => [...prev, adminUser])
//   }

//   return (
//     <section className="max-w-4xl px-6 py-12 mx-auto">
//       <div className="flex items-start justify-between gap-6 mb-8">
//         <h2 className="text-4xl font-bold">Profile</h2>
//         <div className="flex gap-3">
//           {user.role !== 'admin' && (
//             <button onClick={() => setEditing((v) => !v)} className="btn-secondary">
//               {editing ? 'Cancel' : 'Edit'}
//             </button>
//           )}
//           <Button onClick={handleLogout} className="" style={{background:'#ef4444', color:'#fff'}}>
//             Logout
//           </Button>
//         </div>
//       </div>

//       {!editing ? (
//         <Card className="p-8">
//           <div className="space-y-6">
//             <div className="pb-6 border-b border-slate-200 dark:border-slate-700">
//               <p className="mb-1 text-sm text-slate-500 dark:text-slate-400">Name</p>
//               <p className="text-lg font-medium text-slate-900 dark:text-slate-100">{user.name}</p>
//             </div>
//             <div className="pb-6 border-b border-slate-200 dark:border-slate-700">
//               <p className="mb-1 text-sm text-slate-500 dark:text-slate-400">Email</p>
//               <p className="text-lg font-medium text-slate-900 dark:text-slate-100">{user.email}</p>
//             </div>
//             <div className="pb-6 border-b border-slate-200 dark:border-slate-700">
//               <p className="mb-1 text-sm text-slate-500 dark:text-slate-400">Role</p>
//               <p className="text-lg font-medium capitalize text-slate-900 dark:text-slate-100">{user.role}</p>
//             </div>
//             {user.role === 'student' && (
//               <>
//                 <div className="pb-6 border-b border-slate-200 dark:border-slate-700">
//                   <p className="mb-1 text-sm text-slate-500 dark:text-slate-400">Year of Study</p>
//                   <p className="text-lg font-medium text-slate-900 dark:text-slate-100">{user.yearOfStudying}</p>
//                 </div>
//                 <div>
//                   <p className="mb-1 text-sm text-slate-500 dark:text-slate-400">Course</p>
//                   <p className="text-lg font-medium text-slate-900 dark:text-slate-100">{user.course}</p>
//                 </div>
//               </>
//             )}
//             {user.role === 'alumni' && (
//               <>
//                 <div className="pb-6 border-b border-slate-200 dark:border-slate-700">
//                   <p className="mb-1 text-sm text-slate-500 dark:text-slate-400">Graduation Year</p>
//                   <p className="text-lg font-medium text-slate-900 dark:text-slate-100">{user.graduationYear}</p>
//                 </div>
//                 <div className="pb-6 border-b border-slate-200 dark:border-slate-700">
//                   <p className="mb-1 text-sm text-slate-500 dark:text-slate-400">Course Studied</p>
//                   <p className="text-lg font-medium text-slate-900 dark:text-slate-100">{user.courseStudied}</p>
//                 </div>
//                 <div>
//                   <p className="mb-1 text-sm text-slate-500 dark:text-slate-400">Company</p>
//                   <p className="text-lg font-medium text-slate-900 dark:text-slate-100">{user.company}</p>
//                 </div>
//               </>
//             )}
//           </div>
//         </Card>
//       ) : (
//         <Card className="p-8">
//           <div className="space-y-4">
//             <input 
//               name="name" 
//               placeholder="Full name" 
//               value={form.name || ''} 
//               onChange={handleChange} 
//               className="w-full px-4 py-2 border rounded-lg bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary" 
//             />
//             <input 
//               name="email" 
//               type="email"
//               placeholder="Email" 
//               value={form.email || ''} 
//               onChange={handleChange} 
//               className="w-full px-4 py-2 border rounded-lg bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary" 
//             />
//             {user.role === 'student' && (
//               <>
//                 <input 
//                   name="yearOfStudying" 
//                   placeholder="Year of studying" 
//                   type="number" 
//                   value={form.yearOfStudying || ''} 
//                   onChange={handleChange} 
//                   className="w-full px-4 py-2 border rounded-lg bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary" 
//                 />
//                 <input 
//                   name="course" 
//                   placeholder="Course" 
//                   value={form.course || ''} 
//                   onChange={handleChange} 
//                   className="w-full px-4 py-2 border rounded-lg bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary" 
//                 />
//               </>
//             )}
//             {user.role === 'alumni' && (
//               <>
//                 <input 
//                   name="graduationYear" 
//                   placeholder="Graduation Year" 
//                   type="number" 
//                   value={form.graduationYear || ''} 
//                   onChange={handleChange} 
//                   className="w-full px-4 py-2 border rounded-lg bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary" 
//                 />
//                 <input 
//                   name="courseStudied" 
//                   placeholder="Course Studied" 
//                   value={form.courseStudied || ''} 
//                   onChange={handleChange} 
//                   className="w-full px-4 py-2 border rounded-lg bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary" 
//                 />
//                 <input 
//                   name="company" 
//                   placeholder="Company" 
//                   value={form.company || ''} 
//                   onChange={handleChange} 
//                   className="w-full px-4 py-2 border rounded-lg bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary" 
//                 />
//               </>
//             )}
//             <div className="flex gap-3 pt-4">
//               <Button onClick={save} className="flex-1">Save Changes</Button>
//               <Button variant="secondary" onClick={() => setEditing(false)} className="flex-1">Cancel</Button>
//             </div>
//           </div>
//         </Card>
//       )}

//       {user.role === 'admin' && (
//         <AdminPanel users={users} onAddAdmin={handleAddAdmin} />
//       )}
//     </section>
//   )
// }



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
      await axios.post(`${API_BASE}/api/auth/register`, { ...newAdmin, role: 'admin' })
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
  const { user, users, setUser, logout, fetchUsers } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) setForm({ ...user })
  }, [user])

  if (!user) return <div className="p-20 text-center text-slate-500">Authentication required...</div>

  async function handleSave() {
    setLoading(true)
    try {
      const res = await axios.put(`${API_BASE}/api/users/${user._id}`, form)
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