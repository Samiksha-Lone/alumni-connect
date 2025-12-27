import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export default function AlumniPage() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchAlumni = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/users/alumni`, {
        withCredentials: true,
      });
      setAlumni(res.data || []);
      setError('');
    } catch (err) {
      console.error('Failed to fetch alumni:', err.message);
      setError(err.response?.data?.message || 'Failed to load alumni');
      setAlumni([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlumni();
  }, [fetchAlumni]);

  const handleMessageClick = (alumniUser) => {
    navigate('/chat', { state: { partnerId: alumniUser._id } });
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-4xl font-bold mb-8 text-slate-900 dark:text-slate-100">Alumni</h2>

      {loading && (
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400 text-lg">Loading alumni...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400 text-lg">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {alumni.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-600 dark:text-slate-400 text-lg">No alumni registered yet</p>
            </div>
          ) : (
            alumni.map((a) => {
              try {
                return (
                  <div
                    key={a._id || a.id}
                    className="card-base p-6 hover:shadow-xl transition-all duration-300 flex flex-col"
                  >
                    <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
                      {a.name || 'N/A'}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      {a.email || 'N/A'}
                    </p>

                    <div className="text-sm text-slate-700 dark:text-slate-300 mb-4 flex-grow">
                      {a.graduationYear && (
                        <p>
                          Year: <span className="font-medium">{a.graduationYear}</span>
                          {a.courseStudied && <span> • {a.courseStudied}</span>}
                        </p>
                      )}
                      {a.company && <p className="mt-2">Company: <span className="font-medium">{a.company}</span></p>}
                    </div>

                    {/* Message Button */}
                    <button
                      type="button"
                      onClick={() => handleMessageClick(a)}
                      className="btn-primary w-full mt-4"
                    >
                      Message
                    </button>
                  </div>
                );
              } catch (e) {
                console.error('Error rendering alumni item:', e);
                return null;
              }
            })
          )}
        </div>
      )}
    </section>
  );
}
