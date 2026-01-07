// import React, { useEffect, useState, useCallback } from 'react'
// import axios from 'axios'
// import { useAuth } from '../context/AuthContext'
// import Card from '../components/ui/Card'
// import Button from '../components/ui/Button'

// const API_BASE = import.meta.env.VITE_API_BASE || 'https://alumni-connect-backend-hrsc.onrender.com'

// export default function Opportunities() {
//   const { user, token } = useAuth()
//   const [items, setItems] = useState([])
//   const [title, setTitle] = useState('')
//   const [company, setCompany] = useState('')
//   const [desc, setDesc] = useState('')
//   const [link, setLink] = useState('')
//   const [closingDate, setClosingDate] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')

//   const fetchOpportunities = useCallback(async () => {
//     try {
//       setLoading(true)
//       const res = await axios.get(`${API_BASE}/api/jobs`)
//       setItems(res.data || [])
//       setError('')
//     } catch (err) {
//       console.error('Failed to fetch opportunities:', err.message)
//       setError(err.response?.data?.message || 'Failed to load opportunities')
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   useEffect(() => {
//     fetchOpportunities()
//   }, [fetchOpportunities])

//   async function add() {
//     if (!title || !token) {
//       setError(token ? 'Title is required' : 'You must be logged in')
//       return
//     }
//     try {
//       setLoading(true)
//       await axios.post(`${API_BASE}/api/jobs`, { title, company, description: desc, link: link || '', closingDate: closingDate || null }, { headers: { Authorization: `Bearer ${token}` } })
//       setTitle('')
//       setCompany('')
//       setDesc('')
//       setLink('')
//       setClosingDate('')
//       setError('')
//       await fetchOpportunities()
//     } catch (err) {
//       console.error('Failed to add opportunity:', err.message)
//       setError(err.response?.data?.message || 'Failed to add opportunity')
//       setLoading(false)
//     }
//   }

//   async function deleteOpportunity(id) {
//     if (!window.confirm('Delete this opportunity?')) return
//     try {
//       setLoading(true)
//       await axios.delete(`${API_BASE}/api/jobs/${id}`, { headers: { Authorization: `Bearer ${token}` } })
//       await fetchOpportunities()
//     } catch (err) {
//       console.error('Failed to delete opportunity:', err)
//       setError(err.response?.data?.message || 'Failed to delete opportunity')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const canAdd = user && (user.role === 'alumni' || user.role === 'admin')

//   return (
//     <section className="px-6 py-12 mx-auto max-w-7xl">
//       <h2 className="mb-8 text-4xl font-bold">Opportunities</h2>

//       {canAdd && (
//         <Card className="p-6 mb-8">
//           <h3 className="mb-4 text-lg font-semibold">Post New Opportunity</h3>
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
//             <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title *" className="form-input" />
//             <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company *" className="form-input" />
//             <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description *" className="form-input" />
//             <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="Apply URL" className="form-input" />
//             <input type="date" value={closingDate} onChange={(e) => setClosingDate(e.target.value)} className="form-input" />
//             <Button onClick={add} disabled={loading} className="col-span-1 sm:col-span-2 lg:col-span-1">{loading ? 'Posting...' : 'Post'}</Button>
//           </div>
//         </Card>
//       )}

//       {error && <div className="mb-6 alert-error">{error}</div>}

//       <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//         {loading ? (
//           <div className="py-12 text-center col-span-full">
//             <p className="muted">Loading opportunities...</p>
//           </div>
//         ) : items.length === 0 ? (
//           <div className="py-12 text-center col-span-full">
//             <p className="muted">No opportunities yet</p>
//           </div>
//         ) : (
//           items.map((o) => (
//             <div key={o._id} className="relative flex flex-col h-full p-6 transition-colors duration-150 bg-white border rounded-lg border-slate-200 dark:border-slate-800 dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900">
//               {user?.role === 'admin' && (
//                 <button 
//                   aria-label="Delete opportunity" 
//                   onClick={() => deleteOpportunity(o._id)} 
//                   title="Delete"
//                   className="absolute flex items-center justify-center w-8 h-8 text-red-600 transition-colors duration-150 bg-white border rounded-lg cursor-pointer top-4 right-4 border-slate-200 dark:border-slate-700 dark:bg-slate-950 hover:bg-red-50 dark:hover:bg-red-950 dark:text-red-400"
//                 >
//                   ×
//                 </button>
//               )}
              
//               <div className="flex-grow pr-8">
//                 <h3 className="mb-1 text-lg font-semibold text-slate-900 dark:text-slate-50">{o.title}</h3>
//                 <p className="mb-3 text-sm font-medium text-slate-600 dark:text-slate-400">🏢 {o.company}</p>
//                 <p className="mb-4 text-sm text-slate-600 dark:text-slate-400 line-clamp-3">{o.description}</p>
//               </div>
              
//               <div className="pt-4 mt-auto space-y-3 border-t border-slate-200 dark:border-slate-800">
//                 {o.closingDate && (
//                   <p className="text-xs text-slate-500 dark:text-slate-500">📅 Closes: {new Date(o.closingDate).toLocaleDateString()}</p>
//                 )}
//                 {o.link && (
//                   <a href={o.link} target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 text-sm font-medium text-white transition-colors duration-150 bg-blue-600 rounded-lg dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600">
//                     Apply / More Info →
//                   </a>
//                 )}
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </section>
//   )
// }



import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const API_BASE = import.meta.env.VITE_API_BASE || 'https://alumni-connect-backend-hrsc.onrender.com'

export default function Opportunities() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [desc, setDesc] = useState('')
  const [link, setLink] = useState('')
  const [closingDate, setClosingDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchOpportunities = useCallback(async () => {
    try {
      setLoading(true)
      // Defaults to withCredentials: true from your axios config
      const res = await axios.get(`${API_BASE}/jobs`)
      setItems(res.data || [])
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load opportunities')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOpportunities()
  }, [fetchOpportunities])

  async function add() {
    if (!title || !company) {
      setError('Title and Company are required')
      return
    }
    try {
      setLoading(true)
      await axios.post(`${API_BASE}/jobs`, { 
        title, 
        company, 
        description: desc, 
        link, 
        closingDate: closingDate || null 
      })
      
      // Reset form
      setTitle(''); setCompany(''); setDesc(''); setLink(''); setClosingDate('')
      setError('')
      await fetchOpportunities()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post opportunity')
    } finally {
      setLoading(false)
    }
  }

  async function deleteOpportunity(id) {
    if (!window.confirm('Delete this opportunity?')) return
    try {
      setLoading(true)
      await axios.delete(`${API_BASE}/jobs/${id}`)
      await fetchOpportunities()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete')
    } finally {
      setLoading(false)
    }
  }

  const canAdd = user && (user.role === 'alumni' || user.role === 'admin')

  return (
    <section className="min-h-screen px-6 py-12 mx-auto max-w-7xl">
      <div className="flex flex-col justify-between gap-4 mb-10 md:flex-row md:items-center">
        <div>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Career Opportunities</h2>
          <p className="mt-2 text-slate-500">Exclusive job openings and internships shared by our alumni network.</p>
        </div>
      </div>

      {canAdd && (
        <Card className="p-6 mb-12 border-blue-100 dark:border-blue-900/30 bg-blue-50/30 dark:bg-slate-900/50">
          <h3 className="flex items-center gap-2 mb-4 text-lg font-bold text-blue-700 dark:text-blue-400">
            <span>📢</span> Post a Job or Internship
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Job Title *" className="p-2 border rounded dark:bg-slate-800 dark:border-slate-700" />
            <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company Name *" className="p-2 border rounded dark:bg-slate-800 dark:border-slate-700" />
            <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Short Description *" className="p-2 border rounded dark:bg-slate-800 dark:border-slate-700" />
            <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="Application Link" className="p-2 border rounded dark:bg-slate-800 dark:border-slate-700" />
            <input type="date" value={closingDate} onChange={(e) => setClosingDate(e.target.value)} className="p-2 border rounded dark:bg-slate-800 dark:border-slate-700 text-slate-500" />
            <Button onClick={add} disabled={loading} className="bg-blue-600 lg:col-start-5 hover:bg-blue-700">
              {loading ? 'Posting...' : 'Post Opportunity'}
            </Button>
          </div>
        </Card>
      )}

      {error && <div className="p-4 mb-6 text-red-600 border border-red-200 rounded-lg bg-red-50">{error}</div>}

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {loading && items.length === 0 ? (
          <div className="py-20 text-center col-span-full">
            <div className="w-8 h-8 mx-auto mb-4 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
            <p className="text-slate-400">Fetching careers...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed col-span-full border-slate-200 rounded-2xl">
            <p className="text-xl font-medium text-slate-400">No opportunities posted yet.</p>
          </div>
        ) : (
          items.map((o) => (
            <div key={o._id} className="relative flex flex-col h-full p-6 transition-all duration-300 bg-white border group dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-2xl hover:shadow-xl">
              {user?.role === 'admin' && (
                <button 
                  onClick={() => deleteOpportunity(o._id)} 
                  className="absolute p-2 transition-colors top-4 right-4 text-slate-300 hover:text-red-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
              
              <div className="mb-4">
                <span className="inline-block px-2 py-1 text-[10px] font-bold uppercase tracking-widest bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded mb-3">
                  New Opening
                </span>
                <h3 className="mb-1 text-xl font-bold leading-tight text-slate-900 dark:text-white">{o.title}</h3>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">at {o.company}</p>
              </div>

              <p className="mb-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-4">
                {o.description}
              </p>
              
              <div className="flex items-center justify-between pt-6 mt-auto border-t border-slate-50 dark:border-slate-900">
                {o.closingDate ? (
                  <div className="text-[11px] text-slate-500 font-medium">
                    DEADLINE: {new Date(o.closingDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </div>
                ) : <div />}
                
                {o.link && (
                  <a 
                    href={o.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 group/link"
                  >
                    Apply Now 
                    <span className="transition-transform group-hover/link:translate-x-1">→</span>
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}