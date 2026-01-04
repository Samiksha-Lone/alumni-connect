import React, { useEffect, useState, useCallback } from 'react';
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://alumni-connect-backend-hrsc.onrender.com';

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
    <section className="px-6 py-12 mx-auto max-w-7xl">
      <h2 className="mb-8 text-4xl font-bold">Alumni</h2>

      {loading && (
        <div className="py-12 text-center">
          <p className="text-lg muted">Loading alumni...</p>
        </div>
      )}

      {error && (
        <div className="py-12 text-center">
          <p style={{ color: 'var(--accent)' }} className="text-lg">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {alumni.length === 0 ? (
            <div className="py-12 text-center col-span-full">
              <p className="text-lg muted">No alumni registered yet</p>
            </div>
          ) : (
            alumni.map((a) => {
              try {
                return (
                  <Card key={a._id || a.id} className="flex flex-col p-6">
                    <h3 className="mb-2 text-xl font-semibold">{a.name || 'N/A'}</h3>
                    <p className="mb-3 text-sm muted">{a.email || 'N/A'}</p>

                    <div className="flex-grow mb-4 text-sm muted">
                      {a.graduationYear && (
                        <p>
                          Year: <span className="font-medium">{a.graduationYear}</span>
                          {a.courseStudied && <span> • {a.courseStudied}</span>}
                        </p>
                      )}
                      {a.company && <p className="mt-2">Company: <span className="font-medium">{a.company}</span></p>}
                    </div>

                    <Button className="w-full mt-4" onClick={() => handleMessageClick(a)}>
                      Message
                    </Button>
                  </Card>
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
