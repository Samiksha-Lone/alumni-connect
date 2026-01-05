// import React, { useEffect, useState, useCallback } from 'react';
// import Button from '../components/ui/Button'
// import Card from '../components/ui/Card'
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const API_BASE = import.meta.env.VITE_API_BASE || 'https://alumni-connect-backend-hrsc.onrender.com';

// export default function AlumniPage() {
//   const [alumni, setAlumni] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const fetchAlumni = useCallback(async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${API_BASE}/users/alumni`, {
//         withCredentials: true,
//       });
//       setAlumni(res.data || []);
//       setError('');
//     } catch (err) {
//       console.error('Failed to fetch alumni:', err.message);
//       setError(err.response?.data?.message || 'Failed to load alumni');
//       setAlumni([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchAlumni();
//   }, [fetchAlumni]);

//   const handleMessageClick = (alumniUser) => {
//     navigate('/chat', { state: { partnerId: alumniUser._id } });
//   };

//   return (
//     <section className="px-6 py-12 mx-auto max-w-7xl">
//       <h2 className="mb-8 text-4xl font-bold">Alumni</h2>

//       {loading && (
//         <div className="py-12 text-center">
//           <p className="text-lg muted">Loading alumni...</p>
//         </div>
//       )}

//       {error && (
//         <div className="py-12 text-center">
//           <p style={{ color: 'var(--accent)' }} className="text-lg">{error}</p>
//         </div>
//       )}

//       {!loading && !error && (
//         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//           {alumni.length === 0 ? (
//             <div className="py-12 text-center col-span-full">
//               <p className="text-lg muted">No alumni registered yet</p>
//             </div>
//           ) : (
//             alumni.map((a) => {
//               try {
//                 return (
//                   <Card key={a._id || a.id} className="flex flex-col p-6">
//                     <h3 className="mb-2 text-xl font-semibold">{a.name || 'N/A'}</h3>
//                     <p className="mb-3 text-sm muted">{a.email || 'N/A'}</p>

//                     <div className="flex-grow mb-4 text-sm muted">
//                       {a.graduationYear && (
//                         <p>
//                           Year: <span className="font-medium">{a.graduationYear}</span>
//                           {a.courseStudied && <span> • {a.courseStudied}</span>}
//                         </p>
//                       )}
//                       {a.company && <p className="mt-2">Company: <span className="font-medium">{a.company}</span></p>}
//                     </div>

//                     <Button className="w-full mt-4" onClick={() => handleMessageClick(a)}>
//                       Message
//                     </Button>
//                   </Card>
//                 );
//               } catch (e) {
//                 console.error('Error rendering alumni item:', e);
//                 return null;
//               }
//             })
//           )}
//         </div>
//       )}
//     </section>
//   );
// }




import React, { useEffect, useState, useCallback } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const API_BASE = import.meta.env.VITE_API_BASE || 'https://alumni-connect-backend-hrsc.onrender.com';

export default function AlumniPage() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth(); // Get current user info

  const fetchAlumni = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/users/alumni`, {
        withCredentials: true,
      });
      
      // Filter out the logged-in user so they don't see themselves in the list
      const list = (res.data || []).filter(a => a._id !== user?.id);
      setAlumni(list);
      setError('');
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Please login to view alumni directory');
      } else {
        setError(err.response?.data?.message || 'Failed to load alumni');
      }
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchAlumni();
  }, [fetchAlumni]);

  const handleMessageClick = (alumniUser) => {
    // Navigate to chat and pass the partner details
    navigate('/chat', { 
      state: { 
        partnerId: alumniUser._id,
        partnerName: alumniUser.name 
      } 
    });
  };

  return (
    <section className="min-h-screen px-6 py-12 mx-auto max-w-7xl">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Alumni Directory</h2>
          <p className="mt-2 text-slate-500">Connect with graduates from your branch</p>
        </div>
        <button 
           onClick={fetchAlumni} 
           className="p-2 text-blue-600 transition-colors rounded-full hover:bg-blue-50"
           title="Refresh List"
        >
          🔄
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-500">Finding alumni...</p>
        </div>
      )}

      {error && (
        <div className="p-6 text-center border border-red-200 bg-red-50 rounded-xl">
          <p className="font-medium text-red-600">{error}</p>
          <Button onClick={fetchAlumni} className="mt-4 bg-red-600 hover:bg-red-700">Try Again</Button>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {alumni.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed col-span-full border-slate-200 rounded-2xl">
              <p className="text-xl font-medium text-slate-400">No alumni registered yet</p>
              <p className="text-sm text-slate-400">Be the first to invite someone!</p>
            </div>
          ) : (
            alumni.map((a) => (
              <Card key={a._id} className="flex flex-col h-full overflow-hidden transition-shadow duration-300 hover:shadow-2xl border-slate-200 dark:border-slate-800">
                <div className="w-full h-2 bg-blue-600" /> {/* Top accent bar */}
                <div className="flex flex-col flex-grow p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex items-center justify-center w-12 h-12 mr-4 text-xl font-bold text-blue-700 bg-blue-100 rounded-full">
                      {a.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold leading-tight text-slate-900 dark:text-white">{a.name}</h3>
                      <p className="text-xs text-slate-500">{a.role?.toUpperCase()}</p>
                    </div>
                  </div>

                  <div className="flex-grow space-y-3">
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <span className="mr-2">📧</span> {a.email}
                    </div>
                    
                    {/* Flexible Display for different data versions */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        🎓 {(a.graduationYear || a.yearOfPassing) || 'N/A'} 
                        <span className="mx-2 text-slate-300">|</span> 
                        {(a.courseStudied || a.branch) || 'General'}
                      </p>
                      
                      {a.company && (
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                          💼 <span className="font-semibold">{a.company}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <Button 
                    className="w-full mt-6 bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700" 
                    onClick={() => handleMessageClick(a)}
                  >
                    Send Message
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </section>
  );
}